# Dental AI Receptionist

Full stack codebase for a Dental AI Receptionist service.

## What is included

- **Landing page (Next.js)** at `src/app/dental-ai/page.tsx`
- **Express backend** with:
  - `POST /api/contact` to capture form leads
  - Twilio voice webhook and WebSocket bridge for OpenAI Realtime
- **JSON storage** in `server/data/contacts.json` and `server/data/appointments.json`

## Project structure

- `src/app/` - Next.js App Router pages
- `server/` - Express backend + Twilio/OpenAI bridge
- `public/` - static assets

## Install dependencies

```bash
npm install
```

## Environment variables

Copy `.env.example` and fill in real values.

```bash
cp .env.example .env
cp .env.example .env.local
```

- `.env.local` is used by Next.js for the browser-safe `NEXT_PUBLIC_*` values.
- `.env` is used by the Express server for Twilio and OpenAI.

Required keys:

- `TWILIO_SID`
- `TWILIO_AUTH_TOKEN`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

## Run the app

Run both frontend and backend in separate terminals:

```bash
npm run dev
```

```bash
npm run dev:server
```

Open the landing page at:

```
http://localhost:3000/dental-ai
```

## Twilio setup

1. Expose the Express server on a public URL (example: `https://your-domain.com`).
2. Set `PUBLIC_BASE_URL` to that public URL.
3. In Twilio Console, set your Voice webhook to:

```
POST https://your-domain.com/api/twilio/voice
```

Twilio will connect to the WebSocket stream at:

```
wss://your-domain.com/api/twilio/stream
```

## Notes

- The OpenAI Realtime bridge uses G.711 mu-law audio to match Twilio Media Streams.
- Appointment requests are stored in `server/data/appointments.json` when the AI confirms a time.
