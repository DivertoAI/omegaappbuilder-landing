/* eslint-disable @typescript-eslint/no-require-imports */
const { buildTierRampPlan } = require('./tier-plan');

function extractPhone(prompt) {
  const m = String(prompt || '').match(/(\+?\d[\d\s-]{8,18}\d)/);
  if (!m) return null;
  const normalized = m[1].replace(/[^\d]/g, '');
  return normalized.length >= 10 && normalized.length <= 15 ? normalized : null;
}

function extractPayloadAfterColon(prompt) {
  const raw = String(prompt || '');
  const idx = raw.indexOf(':');
  if (idx === -1) return '';
  return raw.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
}

function extractTemplateName(prompt) {
  const raw = String(prompt || '');
  const m1 = raw.match(/template\s+([a-zA-Z0-9_]+)/i);
  if (m1) return m1[1];
  const m2 = raw.match(/\b([a-zA-Z0-9_]{3,})\s+template\b/i);
  if (m2) return m2[1];
  return null;
}

function extractLifecycle(prompt) {
  if (/\bactive\b/i.test(prompt)) return 'ACTIVE';
  if (/\bpaused?\b/i.test(prompt)) return 'PAUSED';
  if (/\bdisconnected?\b/i.test(prompt)) return 'DISCONNECTED';
  if (/\bdegraded?\b/i.test(prompt)) return 'DEGRADED';
  return null;
}

function extractTier(prompt) {
  if (/tier\s*1|tier_?1/i.test(prompt)) return 'TIER_1';
  if (/tier\s*2|tier_?2/i.test(prompt)) return 'TIER_2';
  if (/tier\s*3|tier_?3/i.test(prompt)) return 'TIER_3';
  if (/tier\s*4|tier_?4/i.test(prompt)) return 'TIER_4';
  return null;
}

function extractQuality(prompt) {
  if (/\bhigh\b/i.test(prompt)) return 'HIGH';
  if (/\bmedium\b/i.test(prompt)) return 'MEDIUM';
  if (/\blow\b/i.test(prompt)) return 'LOW';
  if (/\bflagged\b/i.test(prompt)) return 'FLAGGED';
  return null;
}

function extractLaunchPhase(prompt) {
  if (/stage|test\s*number/i.test(prompt)) return 'STAGE_TEST_NUMBER';
  if (/activate|production/i.test(prompt)) return 'ACTIVATE_PRODUCTION';
  if (/soft\s*launch/i.test(prompt)) return 'SOFT_LAUNCH';
  if (/scale|ramp/i.test(prompt)) return 'SCALE';
  return null;
}

function detectSendMode(prompt) {
  if (/campaign|bulk|broadcast|marketing|outreach|blast/i.test(prompt)) return 'CAMPAIGN';
  return 'SERVICE';
}

function isGreeting(lower) {
  return /^(hi|hello|hey|yo|good morning|good afternoon|good evening)\b/.test(lower) ||
    /\bhow are you\b/.test(lower);
}

function wantsHelp(lower) {
  return /\b(help|what can you do|capabilities|commands|options)\b/.test(lower);
}

function detectBooleanIntent(lower) {
  const positive = /\b(on|true|yes|done|complete|completed|checked|enabled|approved|confirmed|verified|passed|mark done|turn on)\b/.test(lower);
  const negative = /\b(off|false|no|pending|incomplete|disabled|uncheck|unchecked|not done|turn off|disable)\b/.test(lower);
  if (positive && !negative) return true;
  if (negative && !positive) return false;
  return null;
}

function getChecklistKeys(lower) {
  const keys = new Set();

  if (/\ball\b.*\b(gate|gates|checklist)\b/.test(lower)) {
    return ['otpReachable', 'bmRole2faReady', 'webhookVerified', 'templateApproved', 'smokeInboundOutboundPassed'];
  }
  if (/\botp\b|\breachability\b/.test(lower)) keys.add('otpReachable');
  if (/\bbm\b|\bbusiness manager\b|\b2fa\b|\btwo factor\b|\brole\b/.test(lower)) keys.add('bmRole2faReady');
  if (/\bwebhook\b/.test(lower)) keys.add('webhookVerified');
  if (/\btemplate\b/.test(lower)) keys.add('templateApproved');
  if (/\bsmoke\b|\binbound\/outbound\b|\bsmoke test\b/.test(lower)) keys.add('smokeInboundOutboundPassed');

  return Array.from(keys);
}

function extractSendBody(prompt) {
  const afterColon = extractPayloadAfterColon(prompt);
  if (afterColon) return afterColon;

  const raw = String(prompt || '').trim();
  const m = raw.match(/\b(?:saying|say|message|text)\b\s+(.+)$/i);
  if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  return '';
}

function maskToken(token) {
  const t = String(token || '');
  if (!t) return '(not set)';
  if (t.length <= 8) return `${t.slice(0, 2)}...`;
  return `${t.slice(0, 4)}...${t.slice(-4)}`;
}

function extractWabaUpdates(prompt) {
  const raw = String(prompt || '');
  const updates = {};

  const wabaId = raw.match(/\bwaba(?:\s*id)?\b\s*(?:is|=|to)?\s*([a-zA-Z0-9_:-]{3,})/i)?.[1];
  const phoneNumberId = raw.match(/\bphone\s*number\s*id\b\s*(?:is|=|to)?\s*([a-zA-Z0-9_:-]{3,})/i)?.[1];
  const accessToken = raw.match(/\baccess\s*token\b\s*(?:is|=|to)?\s*([^\s]+)/i)?.[1];
  const businessPhone = raw.match(/\bbusiness\s*phone\b\s*(?:is|=|to)?\s*(\+?\d[\d\s-]{8,}\d)/i)?.[1];

  if (wabaId) updates.wabaId = wabaId.trim();
  if (phoneNumberId) updates.phoneNumberId = phoneNumberId.trim();
  if (accessToken) updates.accessToken = accessToken.trim();
  if (businessPhone) updates.businessPhone = businessPhone.replace(/[^\d+]/g, '');
  return updates;
}

function renderHelp() {
  return [
    'I can fully operate this Omega Reach tenant for you.',
    'Try natural requests like:',
    '- “show full status”',
    '- “mark otp, webhook and template done”',
    '- “set launch phase soft launch”',
    '- “pause outbound” or “resume outbound”',
    '- “send template welcome_01 to +91XXXXXXXXXX”',
    '- “send to +91XXXXXXXXXX: <message>”',
    '- “set consent opt-in for +91XXXXXXXXXX”',
    '- “show incidents” / “show unread” / “show tier plan”',
    '- “set waba id ... phone number id ... access token ...”'
  ].join('\n');
}

async function handleIrisCommand({
  prompt,
  tenant,
  conversations,
  sendText,
  sendTemplate,
  getLaunchReadiness,
  updateTenantState,
  updateTenantLaunch,
  updateConversationConsent,
  updateTenantWaba,
  listIncidents,
  listConversations,
  addIrisEvent
}) {
  const text = String(prompt || '').trim();
  const lower = text.toLowerCase();

  if (!text) {
    return { reply: 'Iris is ready. I can run this tenant end-to-end: sends, launch gates, consent, incidents, WABA config, and tier controls.' };
  }

  if (isGreeting(lower) && !/send|launch|pause|resume|tier|template|consent|incident|stats|waba|set|update|mark/.test(lower)) {
    const reply = 'I’m doing great. I’m in full control of this Omega Reach tenant and ready to operate it for you. Say “show full status” or tell me any action directly.';
    addIrisEvent({ tenantId: tenant.id, type: 'GREETING', prompt: text, result: reply });
    return { reply };
  }

  if (wantsHelp(lower)) {
    const reply = renderHelp();
    addIrisEvent({ tenantId: tenant.id, type: 'HELP', prompt: text, result: reply });
    return { reply };
  }

  if (/\b(full status|system status|health check|tenant status|overview)\b/.test(lower)) {
    const launch = getLaunchReadiness ? getLaunchReadiness() : null;
    const convs = listConversations ? listConversations() : conversations;
    const unreadCount = convs.filter((c) => (c.unreadCount || 0) > 0).length;
    const incidents = listIncidents ? listIncidents() : [];
    const lastIncident = incidents[0];
    const reply = [
      `Tenant: ${tenant.name}`,
      `Lifecycle: ${tenant.lifecycle} | Tier: ${tenant.tier} | Quality: ${tenant.qualityRating}`,
      launch
        ? (launch.ready
          ? `Launch: READY (${launch.phase}) | no-go=${launch.noGoCampaign ? 'ON' : 'OFF'} | outbound pause=${launch.outboundPaused ? 'ON' : 'OFF'}`
          : `Launch: NOT READY (${launch.phase}) | Missing: ${launch.missing.join(', ')}`)
        : 'Launch: unavailable',
      `Conversations: ${convs.length} total, ${unreadCount} unread`,
      `Incidents: ${incidents.length}${lastIncident ? ` | latest: ${lastIncident.type} (${lastIncident.severity})` : ''}`
    ].join('\n');
    addIrisEvent({ tenantId: tenant.id, type: 'FULL_STATUS', prompt: text, result: reply });
    return { reply };
  }

  if (/\b(mark|set|update|check|uncheck|enable|disable|turn)\b/.test(lower) &&
    /\b(otp|reachability|bm|business manager|2fa|webhook|template|smoke|gate|checklist)\b/.test(lower)) {
    if (!updateTenantLaunch) return { reply: 'Launch controls are unavailable in this runtime.' };
    const keys = getChecklistKeys(lower);
    if (!keys.length) return { reply: 'Please specify which launch gates to update.' };
    let target = detectBooleanIntent(lower);
    if (target === null && /\b(confirmed|verified|approved|passed)\b/.test(lower)) target = true;
    if (target === null) {
      return { reply: 'Tell me whether to mark these gates ON or OFF (example: “mark webhook and template done”).' };
    }
    const checklist = {};
    keys.forEach((k) => { checklist[k] = target; });
    const updated = updateTenantLaunch({ checklist });
    const ready = getLaunchReadiness ? getLaunchReadiness() : null;
    const reply = `Updated ${keys.length} gate(s) to ${target ? 'ON' : 'OFF'}. Launch is now ${ready?.ready ? 'READY' : 'NOT READY'}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_CHECKLIST', prompt: text, result: reply, meta: { checklist } });
    return { reply, action: { type: 'SET_CHECKLIST', data: updated?.launch?.checklist || checklist } };
  }

  if (lower.includes('launch') && (lower.includes('status') || lower.includes('readiness') || lower.includes('gates'))) {
    if (!getLaunchReadiness) return { reply: 'Launch readiness is unavailable in this runtime.' };
    const launch = getLaunchReadiness();
    const reply = launch.ready
      ? `Launch readiness: READY. Phase=${launch.phase}, noGoCampaign=${launch.noGoCampaign}, outboundPaused=${launch.outboundPaused}.`
      : `Launch readiness: NOT READY. Missing gates: ${launch.missing.join(', ')}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'LAUNCH_STATUS', prompt: text, result: reply });
    return { reply, action: { type: 'LAUNCH_STATUS', data: launch } };
  }

  if (lower.includes('pause outbound') || lower.includes('kill switch on')) {
    if (!updateTenantLaunch) return { reply: 'Launch controls are unavailable in this runtime.' };
    const updated = updateTenantLaunch({ outboundPaused: true });
    const reply = `Outbound paused. Kill switch is ON for ${updated.name}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'PAUSE_OUTBOUND', prompt: text, result: reply });
    return { reply, action: { type: 'PAUSE_OUTBOUND' } };
  }

  if (lower.includes('resume outbound') || lower.includes('kill switch off')) {
    if (!updateTenantLaunch) return { reply: 'Launch controls are unavailable in this runtime.' };
    const updated = updateTenantLaunch({ outboundPaused: false });
    const reply = `Outbound resumed. Kill switch is OFF for ${updated.name}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'RESUME_OUTBOUND', prompt: text, result: reply });
    return { reply, action: { type: 'RESUME_OUTBOUND' } };
  }

  if (lower.includes('set no-go')) {
    if (!updateTenantLaunch) return { reply: 'Launch controls are unavailable in this runtime.' };
    const flag = /off|disable|false/i.test(lower) ? false : true;
    const updated = updateTenantLaunch({ noGoCampaign: flag });
    const reply = `Campaign no-go is now ${updated.launch?.noGoCampaign ? 'ON' : 'OFF'}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_NO_GO', prompt: text, result: reply });
    return { reply, action: { type: 'SET_NO_GO', data: updated.launch?.noGoCampaign } };
  }

  if (lower.includes('set launch phase')) {
    if (!updateTenantLaunch) return { reply: 'Launch controls are unavailable in this runtime.' };
    const phase = extractLaunchPhase(text);
    if (!phase) return { reply: 'Use: set launch phase stage|activate|soft launch|scale' };
    const updated = updateTenantLaunch({ phase });
    const reply = `Launch phase set to ${updated.launch?.phase || phase}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_LAUNCH_PHASE', prompt: text, result: reply });
    return { reply, action: { type: 'SET_LAUNCH_PHASE', data: updated.launch?.phase || phase } };
  }

  if (/\bshow\b.*\bincidents?\b|\bincidents?\b|\balerts?\b|\berrors?\b/.test(lower)) {
    if (!listIncidents) return { reply: 'Incident feed is unavailable in this runtime.' };
    const incidents = listIncidents();
    const reply = incidents.length
      ? incidents.slice(0, 8).map((i, idx) => `${idx + 1}. ${i.type} (${i.severity}) - ${i.reason}`).join('\n')
      : 'No incidents logged for this tenant.';
    addIrisEvent({ tenantId: tenant.id, type: 'LIST_INCIDENTS', prompt: text, result: reply });
    return { reply, action: { type: 'LIST_INCIDENTS', data: incidents } };
  }

  if (/\b(show|list)\b.*\bwaba\b|\bwaba config\b/.test(lower)) {
    const w = tenant.waba || {};
    const reply = [
      `WABA ID: ${w.wabaId || '(not set)'}`,
      `Phone Number ID: ${w.phoneNumberId || '(not set)'}`,
      `Business Phone: ${w.businessPhone || '(not set)'}`,
      `Access Token: ${maskToken(w.accessToken)}`
    ].join('\n');
    addIrisEvent({ tenantId: tenant.id, type: 'SHOW_WABA', prompt: text, result: reply });
    return { reply };
  }

  if ((/\bset\b.*\bwaba\b|\bset\b.*\bphone number id\b|\bset\b.*\baccess token\b|\bset\b.*\bbusiness phone\b|\bupdate\b.*\bwaba\b/.test(lower)) && updateTenantWaba) {
    const updates = extractWabaUpdates(text);
    if (!Object.keys(updates).length) {
      return { reply: 'Please provide fields to update, e.g. “set waba id ... phone number id ... access token ...”.' };
    }
    const updated = updateTenantWaba(updates);
    const reply = `WABA config updated: ${Object.keys(updates).join(', ')}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_WABA', prompt: text, result: reply, meta: { fields: Object.keys(updates) } });
    return { reply, action: { type: 'SET_WABA', data: updated?.waba || updates } };
  }

  if (/\b(consent|opt[- ]?in|opt[- ]?out)\b/.test(lower) && updateConversationConsent) {
    const to = extractPhone(text);
    if (!to) return { reply: 'Please include the contact number. Example: “set consent opt-in for +91XXXXXXXXXX”.' };
    let explicitOptIn = null;
    if (/\b(opt[- ]?in|grant|allow|enable)\b/.test(lower)) explicitOptIn = true;
    if (/\b(opt[- ]?out|revoke|withdraw|disable)\b/.test(lower)) explicitOptIn = false;
    if (explicitOptIn === null) return { reply: 'Please specify opt-in or opt-out.' };
    const updated = updateConversationConsent({ waId: to, explicitOptIn });
    if (!updated) return { reply: 'Conversation not found for that number yet. Ask them to message first, then retry.' };
    const reply = explicitOptIn
      ? `Consent set to OPT-IN for ${to}.`
      : `Consent set to OPT-OUT for ${to}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_CONSENT', prompt: text, result: reply, meta: { to, explicitOptIn } });
    return { reply, action: { type: 'SET_CONSENT', data: updated } };
  }

  if (lower.includes('unread') || lower.includes('pending')) {
    const unread = conversations.filter((c) => (c.unreadCount || 0) > 0);
    const list = unread.slice(0, 10).map((c) => `${c.profileName || c.waId} (${c.unreadCount})`).join(', ');
    const reply = unread.length
      ? `Unread conversations: ${list}`
      : 'No unread conversations right now.';
    addIrisEvent({ tenantId: tenant.id, type: 'LIST_UNREAD', prompt: text, result: reply });
    return { reply, action: { type: 'LIST_UNREAD', data: unread } };
  }

  if (lower.includes('stats') || lower.includes('dashboard')) {
    const reply = `Stats: inbound=${tenant.stats?.inboundCount || 0}, outbound=${tenant.stats?.outboundCount || 0}, uniqueConversations=${tenant.stats?.uniqueConversations || 0}, lifecycle=${tenant.lifecycle}, tier=${tenant.tier}, quality=${tenant.qualityRating}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'STATS', prompt: text, result: reply });
    return { reply };
  }

  if (lower.includes('set lifecycle')) {
    const lifecycle = extractLifecycle(text);
    if (!lifecycle) return { reply: 'Use: set lifecycle active|paused|degraded|disconnected' };
    const updated = updateTenantState({ lifecycle });
    const reply = `Lifecycle updated to ${updated.lifecycle}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_LIFECYCLE', prompt: text, result: reply });
    return { reply, action: { type: 'SET_LIFECYCLE', data: updated } };
  }

  if (lower.includes('set tier')) {
    const tier = extractTier(text);
    if (!tier) return { reply: 'Use: set tier 1|2|3|4' };
    const updated = updateTenantState({ tier });
    const reply = `Tier updated to ${updated.tier}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_TIER', prompt: text, result: reply });
    return { reply, action: { type: 'SET_TIER', data: updated } };
  }

  if (lower.includes('set quality')) {
    const qualityRating = extractQuality(text);
    if (!qualityRating) return { reply: 'Use: set quality high|medium|low|flagged' };
    const updated = updateTenantState({ qualityRating });
    const reply = `Quality rating updated to ${updated.qualityRating}.`;
    addIrisEvent({ tenantId: tenant.id, type: 'SET_QUALITY', prompt: text, result: reply });
    return { reply, action: { type: 'SET_QUALITY', data: updated } };
  }

  if (lower.includes('send template')) {
    const to = extractPhone(text);
    const templateName = extractTemplateName(text);
    const mode = detectSendMode(text);
    if (!to || !templateName) return { reply: 'Use: send template <template_name> to +91XXXXXXXXXX' };
    await sendTemplate({ to, templateName, mode });
    const reply = `Template ${templateName} sent to ${to} (${mode}).`;
    addIrisEvent({ tenantId: tenant.id, type: 'SEND_TEMPLATE', prompt: text, result: reply, meta: { to, templateName, mode } });
    return { reply, action: { type: 'SEND_TEMPLATE', data: { to, templateName, mode } } };
  }

  if (lower.includes('tier') || lower.includes('ramp')) {
    const plan = buildTierRampPlan({
      tier: tenant.tier,
      qualityRating: tenant.qualityRating,
      uniqueConversations: tenant.stats?.uniqueConversations || 0
    });
    const reply = `Current ${plan.currentTier} (limit: ${plan.currentLimit}). Next target: ${plan.nextTargetTier} (${plan.nextTargetLimit}). Warmup suggestions: ${plan.projectedDailyWarmup.join(', ')} conversations/day.`;
    addIrisEvent({ tenantId: tenant.id, type: 'TIER_PLAN', prompt: text, result: reply });
    return { reply, action: { type: 'TIER_PLAN', data: plan } };
  }

  if (lower.startsWith('send') || lower.includes('send message') || lower.includes('text ')) {
    const to = extractPhone(text);
    const body = extractSendBody(text);
    const mode = detectSendMode(text);

    if (!to || !body) {
      return {
        reply: 'Use: Send to +91XXXXXXXXXX: your message text'
      };
    }

    await sendText({ to, text: body, mode });
    const reply = `Sent to ${to} (${mode}): ${body}`;
    addIrisEvent({ tenantId: tenant.id, type: 'SEND_TEXT', prompt: text, result: reply, meta: { to, mode } });
    return { reply, action: { type: 'SEND_TEXT', data: { to, body, mode } } };
  }

  if (lower.includes('help')) {
    return { reply: renderHelp() };
  }

  const fallback = 'I can handle that. Try plain language like: “show full status”, “mark webhook and template done”, “set consent opt-in for +91...”, or “send to +91...: ...”.';
  addIrisEvent({ tenantId: tenant.id, type: 'NO_MATCH', prompt: text, result: fallback });
  return { reply: fallback };
}

module.exports = { handleIrisCommand };
