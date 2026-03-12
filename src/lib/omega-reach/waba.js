/* eslint-disable @typescript-eslint/no-require-imports */
const axios = require('axios');
const crypto = require('crypto');

const GRAPH_API_VERSION = 'v23.0';

async function graphRequest(path, accessToken, method = 'GET', data = undefined) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${path}`;
  const res = await axios({
    url,
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data,
    timeout: 30000
  });
  return res.data;
}

async function sendTextMessage({ phoneNumberId, accessToken, to, text }) {
  return graphRequest(`${phoneNumberId}/messages`, accessToken, 'POST', {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: text
    }
  });
}

async function sendTemplateMessage({ phoneNumberId, accessToken, to, name, languageCode = 'en', components = [] }) {
  return graphRequest(`${phoneNumberId}/messages`, accessToken, 'POST', {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name,
      language: { code: languageCode },
      components
    }
  });
}

function verifySignature(req, appSecret) {
  if (!appSecret) return true;
  const signature = req.headers['x-hub-signature-256'];
  if (!signature || typeof signature !== 'string' || !signature.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', appSecret).update(req.rawBody || '').digest('hex');
  const provided = signature.slice(7);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}

function normalizeInboundText(message) {
  if (!message || !message.type) return '';
  if (message.type === 'text') return message.text?.body || '';
  if (message.type === 'button') return message.button?.text || '';
  if (message.type === 'interactive') {
    const interactive = message.interactive || {};
    return interactive?.button_reply?.title || interactive?.list_reply?.title || '';
  }
  return `[${message.type}]`;
}

module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  verifySignature,
  normalizeInboundText
};
