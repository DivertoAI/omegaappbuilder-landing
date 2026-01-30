/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const crypto = require('crypto');

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const {
  PORT = 4000,
  PUBLIC_BASE_URL = 'http://localhost:4000',
  CORS_ORIGIN = 'http://localhost:3000',
  OPENAI_API_KEY,
  OPENAI_REALTIME_MODEL = 'gpt-realtime',
  OPENAI_REALTIME_VOICE = 'marin',
  CLINIC_NAME = 'Bright Smile Dental',
  AVAILABLE_SLOTS = 'Tuesday 10:00 AM, Tuesday 2:00 PM, Thursday 9:00 AM',
  TWILIO_SID,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = process.env;

if (!OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY. Realtime calls will fail until it is set.');
}

const twilioAccountSid = TWILIO_SID || TWILIO_ACCOUNT_SID;
const twilioClient =
  twilioAccountSid && TWILIO_AUTH_TOKEN
    ? twilio(twilioAccountSid, TWILIO_AUTH_TOKEN)
    : null;

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dataDir = path.join(__dirname, 'data');
const contactsPath = path.join(dataDir, 'contacts.json');
const appointmentsPath = path.join(dataDir, 'appointments.json');

const availableSlots = AVAILABLE_SLOTS.split(',')
  .map((slot) => slot.trim())
  .filter(Boolean);

async function ensureDataFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, '[]', 'utf8');
      return;
    }
    throw error;
  }
}

async function readJson(filePath) {
  await ensureDataFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');
  if (!raw) return [];
  return JSON.parse(raw);
}

async function writeJson(filePath, payload) {
  await ensureDataFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, clinicName } = req.body || {};

  if (!name || !email || !phone || !clinicName) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields.',
    });
  }

  const entry = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    clinicName,
    createdAt: new Date().toISOString(),
  };

  const contacts = await readJson(contactsPath);
  contacts.push(entry);
  await writeJson(contactsPath, contacts);

  return res.json({ ok: true });
});

app.post('/api/twilio/voice', (req, res) => {
  // Respond to Twilio with TwiML that connects the call to our WebSocket.
  const response = new twilio.twiml.VoiceResponse();

  response.say(
    {
      voice: 'alice',
    },
    `Thanks for calling ${CLINIC_NAME}. Connecting you to our AI receptionist now.`
  );

  const connect = response.connect();
  const wsBase = toWebSocketUrl(PUBLIC_BASE_URL);
  const streamUrl = `${wsBase}/api/twilio/stream`;

  connect.stream({
    url: streamUrl,
  });

  res.type('text/xml');
  res.send(response.toString());
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === '/api/twilio/stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (twilioSocket) => {
  // Each incoming call gets its own OpenAI Realtime session.
  // Twilio Media Streams sends JSON events (start/media/stop) over this socket.
  const callState = {
    streamSid: null,
    callSid: null,
    assistantText: '',
    lastAudioAt: 0,
  };

  // OpenAI Realtime is another WebSocket. We pipe Twilio audio in and get audio out.
  const openaiSocket = new WebSocket(
    `wss://api.openai.com/v1/realtime?model=${OPENAI_REALTIME_MODEL}`,
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
      },
    }
  );

  openaiSocket.on('open', () => {
    // Configure the session for Twilio audio (G.711 mu-law) and dental reception flow.
    openaiSocket.send(
      JSON.stringify({
        type: 'session.update',
        session: {
          instructions: buildSystemPrompt({ clinicName: CLINIC_NAME, slots: availableSlots }),
          output_modalities: ['audio', 'text'],
          audio: {
            input: {
              format: { type: 'audio/pcmu' },
              turn_detection: { type: 'semantic_vad' },
            },
            output: {
              format: { type: 'audio/pcmu' },
              voice: OPENAI_REALTIME_VOICE,
            },
          },
        },
      })
    );

    // Trigger a greeting so the caller hears the AI immediately.
    openaiSocket.send(
      JSON.stringify({
        type: 'response.create',
        response: {
          instructions:
            'Greet the caller warmly and ask how you can help with scheduling or questions today.',
        },
      })
    );
  });

  openaiSocket.on('message', async (data) => {
    let event;
    try {
      event = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (event.type === 'response.output_audio.delta' || event.type === 'response.audio.delta') {
      // Forward OpenAI audio back to Twilio so the caller hears the response.
      // Twilio expects base64 G.711 mu-law frames in "media.payload".
      if (callState.streamSid && event.delta) {
        callState.lastAudioAt = Date.now();
        twilioSocket.send(
          JSON.stringify({
            event: 'media',
            streamSid: callState.streamSid,
            media: {
              payload: event.delta,
            },
          })
        );
      }
    }

    if (
      event.type === 'response.output_text.delta' ||
      event.type === 'response.text.delta'
    ) {
      // Capture the text channel so we can extract BOOKING_JSON for scheduling.
      callState.assistantText += event.delta || '';
    }

    if (
      event.type === 'response.output_text.done' ||
      event.type === 'response.text.done'
    ) {
      const fullText = event.text || '';
      callState.assistantText += fullText;

      // Fallback: if audio is not enabled on the model, speak the text via Twilio.
      if (twilioClient && callState.callSid && callState.lastAudioAt === 0) {
        const spokenText = stripBookingJson(fullText);
        if (spokenText) {
          const voiceResponse = new twilio.twiml.VoiceResponse();
          voiceResponse.say({ voice: 'alice' }, spokenText);
          twilioClient.calls(callState.callSid).update({ twiml: voiceResponse.toString() }).catch(() => {});
        }
      }

      const booking = extractBookingSummary(callState.assistantText);
      if (booking) {
        await saveAppointment({
          ...booking,
          callSid: callState.callSid,
          createdAt: new Date().toISOString(),
        });
        callState.assistantText = '';
      }
    }
  });

  twilioSocket.on('message', (message) => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch {
      return;
    }

    if (payload.event === 'start') {
      // "start" gives us identifiers to tag audio we send back to Twilio.
      callState.streamSid = payload.start.streamSid;
      callState.callSid = payload.start.callSid;
      return;
    }

    if (payload.event === 'media') {
      // Send caller audio to OpenAI as base64 audio chunks.
      // OpenAI uses server-side VAD to decide when to respond.
      if (openaiSocket.readyState === WebSocket.OPEN) {
        openaiSocket.send(
          JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: payload.media.payload,
          })
        );
      }
      return;
    }

    if (payload.event === 'stop') {
      if (openaiSocket.readyState === WebSocket.OPEN) {
        openaiSocket.close();
      }
    }
  });

  const shutdown = () => {
    if (openaiSocket.readyState === WebSocket.OPEN) {
      openaiSocket.close();
    }
  };

  twilioSocket.on('close', shutdown);
  twilioSocket.on('error', shutdown);
});

server.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

function toWebSocketUrl(baseUrl) {
  const url = new URL(baseUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString().replace(/\/$/, '');
}

function buildSystemPrompt({ clinicName, slots }) {
  const slotList = slots.length
    ? slots.map((slot) => `- ${slot}`).join('\n')
    : '- Ask the clinic to provide availability later.';

  return [
    `You are the AI receptionist for ${clinicName}.`,
    'Your job is to help callers schedule dental appointments and answer common questions.',
    'Collect these details before booking: patient name, phone number, email, reason for visit.',
    'Offer only the available appointment times listed below.',
    'Once a caller confirms a time, summarize it and confirm spelling.',
    'After confirmation, include a line in the TEXT response (not spoken) in this format:',
    'BOOKING_JSON: {"name":"...","phone":"...","email":"...","reason":"...","time":"..."}',
    'Do not speak the BOOKING_JSON line.',
    '',
    'Available appointment times:',
    slotList,
  ].join('\n');
}

function extractBookingSummary(text) {
  const marker = 'BOOKING_JSON:';
  const index = text.lastIndexOf(marker);
  if (index === -1) return null;

  const jsonText = text.slice(index + marker.length).trim();
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function stripBookingJson(text) {
  if (!text) return '';
  return text.replace(/BOOKING_JSON:[\s\S]*/g, '').trim();
}

async function saveAppointment(appointment) {
  const appointments = await readJson(appointmentsPath);
  appointments.push({
    id: crypto.randomUUID(),
    ...appointment,
  });
  await writeJson(appointmentsPath, appointments);
}
