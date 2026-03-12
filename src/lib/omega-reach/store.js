/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const PREFERRED_DB_PATH = process.env.OMEGA_REACH_DB_PATH || path.join(process.cwd(), 'data', 'omega-reach-db.json');
const FALLBACK_DB_PATH = '/tmp/omega-reach-db.json';
let ACTIVE_DB_PATH = PREFERRED_DB_PATH;
let useInMemoryDb = false;
let inMemoryDb = null;

const DEFAULT_DB = {
  tenants: [],
  conversations: [],
  messages: [],
  irisEvents: [],
  incidents: []
};

const DEFAULT_STATS = {
  inboundCount: 0,
  outboundCount: 0,
  uniqueConversations: 0,
  lastInboundAt: null,
  lastOutboundAt: null
};

const DEFAULT_LAUNCH = {
  ownershipModel: 'CLIENT_OWNED',
  transport: 'META_DIRECT',
  voiceProvider: 'ELEVENLABS_OPTIONAL',
  phase: 'STAGE_TEST_NUMBER',
  outboundPaused: false,
  noGoCampaign: true,
  checklist: {
    otpReachable: false,
    bmRole2faReady: false,
    webhookVerified: false,
    templateApproved: false,
    smokeInboundOutboundPassed: false
  },
  compliance: {
    consentFirst: true,
    blockOptOutRecipients: true,
    enforce24hServiceWindow: true,
    templateRequiredOutsideWindow: true,
    businessScopeOnly: true,
    humanEscalationEnabled: true,
    autoPauseCampaignOnPolicyWarning: true
  },
  monitoring: {
    policyWarnings: 0,
    incidents: 0,
    lastPolicyWarningAt: null,
    lastIncidentAt: null
  }
};

function ensureDbFile() {
  if (useInMemoryDb) return;

  const tryPath = (targetPath) => {
    try {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      }
      fs.accessSync(targetPath, fs.constants.R_OK | fs.constants.W_OK);
      ACTIVE_DB_PATH = targetPath;
      return true;
    } catch {
      return false;
    }
  };

  if (tryPath(ACTIVE_DB_PATH)) return;
  if (tryPath(FALLBACK_DB_PATH)) return;

  useInMemoryDb = true;
  if (!inMemoryDb) {
    inMemoryDb = structuredClone(DEFAULT_DB);
  }
}

function loadDb() {
  ensureDbFile();
  if (useInMemoryDb) {
    return structuredClone(inMemoryDb || DEFAULT_DB);
  }
  try {
    const raw = fs.readFileSync(ACTIVE_DB_PATH, 'utf8');
    return { ...DEFAULT_DB, ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

function saveDb(db) {
  if (useInMemoryDb) {
    inMemoryDb = structuredClone(db);
    return;
  }
  try {
    fs.writeFileSync(ACTIVE_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    useInMemoryDb = true;
    inMemoryDb = structuredClone(db);
  }
}

function sanitizePhone(input) {
  return String(input || '').replace(/[^\d+]/g, '');
}

function mergeLaunchConfig(existing = {}, incoming = {}) {
  return {
    ...DEFAULT_LAUNCH,
    ...existing,
    ...incoming,
    checklist: {
      ...DEFAULT_LAUNCH.checklist,
      ...(existing.checklist || {}),
      ...(incoming.checklist || {})
    },
    compliance: {
      ...DEFAULT_LAUNCH.compliance,
      ...(existing.compliance || {}),
      ...(incoming.compliance || {})
    },
    monitoring: {
      ...DEFAULT_LAUNCH.monitoring,
      ...(existing.monitoring || {}),
      ...(incoming.monitoring || {})
    }
  };
}

function normalizeTenant(payload, existing = null) {
  const now = new Date().toISOString();
  const id = payload.id || existing?.id || `tenant_${randomUUID().slice(0, 12)}`;

  const incomingLaunch = payload.launch || {};

  return {
    id,
    name: payload.name || existing?.name || 'Untitled Tenant',
    timezone: payload.timezone || existing?.timezone || 'Asia/Kolkata',
    lifecycle: payload.lifecycle || existing?.lifecycle || 'ONBOARDING',
    tier: payload.tier || existing?.tier || 'TIER_1',
    qualityRating: payload.qualityRating || existing?.qualityRating || 'UNKNOWN',
    launch: mergeLaunchConfig(existing?.launch || {}, incomingLaunch),
    waba: {
      wabaId: payload.waba?.wabaId || payload.wabaId || existing?.waba?.wabaId || '',
      phoneNumberId: payload.waba?.phoneNumberId || payload.phoneNumberId || existing?.waba?.phoneNumberId || '',
      businessPhone: sanitizePhone(payload.waba?.businessPhone || payload.businessPhone || existing?.waba?.businessPhone || ''),
      accessToken: payload.waba?.accessToken || payload.accessToken || existing?.waba?.accessToken || '',
      webhookSecret: payload.waba?.webhookSecret || payload.webhookSecret || existing?.waba?.webhookSecret || ''
    },
    stats: {
      ...DEFAULT_STATS,
      ...(existing?.stats || {}),
      ...(payload.stats || {})
    },
    createdAt: existing?.createdAt || payload.createdAt || now,
    updatedAt: now
  };
}

function upsertTenant(payload) {
  const db = loadDb();
  const id = payload.id || `tenant_${randomUUID().slice(0, 12)}`;
  const idx = db.tenants.findIndex((t) => t.id === id);
  const existing = idx >= 0 ? db.tenants[idx] : null;

  const normalized = normalizeTenant({ ...payload, id }, existing);

  if (idx >= 0) {
    db.tenants[idx] = normalized;
  } else {
    db.tenants.push(normalized);
  }

  saveDb(db);
  return db.tenants.find((t) => t.id === id);
}

function getTenants() {
  const db = loadDb();
  return db.tenants;
}

function getTenant(tenantId) {
  return getTenants().find((t) => t.id === tenantId) || null;
}

function findTenantByPhoneNumberId(phoneNumberId) {
  const id = String(phoneNumberId || '');
  return getTenants().find((t) => t.waba.phoneNumberId === id) || null;
}

function ensureConversation(tenantId, waId, profileName = '') {
  const db = loadDb();
  const key = `${tenantId}:${waId}`;
  let conv = db.conversations.find((c) => c.id === key);
  const now = new Date().toISOString();

  if (!conv) {
    conv = {
      id: key,
      tenantId,
      waId,
      profileName,
      status: 'OPEN',
      unreadCount: 0,
      lastMessagePreview: '',
      lastMessageAt: null,
      lastInboundAt: null,
      lastOutboundAt: null,
      optedOut: false,
      optedOutAt: null,
      optOutReason: null,
      explicitOptIn: false,
      explicitOptInAt: null,
      explicitOptInSource: null,
      createdAt: now,
      updatedAt: now
    };
    db.conversations.push(conv);
  } else {
    conv.profileName = profileName || conv.profileName;
    conv.updatedAt = now;
    if (typeof conv.optedOut !== 'boolean') conv.optedOut = false;
    if (!('optedOutAt' in conv)) conv.optedOutAt = null;
    if (!('optOutReason' in conv)) conv.optOutReason = null;
    if (!('explicitOptIn' in conv)) conv.explicitOptIn = false;
    if (!('explicitOptInAt' in conv)) conv.explicitOptInAt = null;
    if (!('explicitOptInSource' in conv)) conv.explicitOptInSource = null;
    if (!('lastInboundAt' in conv)) conv.lastInboundAt = null;
    if (!('lastOutboundAt' in conv)) conv.lastOutboundAt = null;
  }

  saveDb(db);
  return conv;
}

function getConversation(tenantId, waId) {
  const db = loadDb();
  return db.conversations.find((c) => c.id === `${tenantId}:${waId}`) || null;
}

function setConversationOptOut(tenantId, waId, optedOut, reason = null) {
  const db = loadDb();
  const conv = db.conversations.find((c) => c.id === `${tenantId}:${waId}`);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.optedOut = Boolean(optedOut);
  conv.optedOutAt = optedOut ? now : null;
  conv.optOutReason = optedOut ? (reason || 'USER_REQUEST') : null;
  if (optedOut) {
    conv.explicitOptIn = false;
    conv.explicitOptInAt = null;
    conv.explicitOptInSource = null;
  } else if (reason === 'START_KEYWORD' || reason === 'MANUAL_OPT_IN') {
    conv.explicitOptIn = true;
    conv.explicitOptInAt = now;
    conv.explicitOptInSource = reason;
  }
  conv.updatedAt = now;

  saveDb(db);
  return conv;
}

function setConversationConsent(tenantId, waId, explicitOptIn, source = 'MANUAL_OPT_IN') {
  const db = loadDb();
  const conv = db.conversations.find((c) => c.id === `${tenantId}:${waId}`);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.explicitOptIn = Boolean(explicitOptIn);
  conv.explicitOptInAt = explicitOptIn ? now : null;
  conv.explicitOptInSource = explicitOptIn ? source : null;
  if (explicitOptIn) {
    conv.optedOut = false;
    conv.optedOutAt = null;
    conv.optOutReason = null;
  }
  conv.updatedAt = now;

  saveDb(db);
  return conv;
}

function isConversationWithinServiceWindow(tenantId, waId, windowHours = 24) {
  const conv = getConversation(tenantId, waId);
  if (!conv || !conv.lastInboundAt) return false;
  const now = Date.now();
  const lastInbound = new Date(conv.lastInboundAt).getTime();
  if (Number.isNaN(lastInbound)) return false;
  const limitMs = Number(windowHours || 24) * 60 * 60 * 1000;
  return (now - lastInbound) <= limitMs;
}

function appendMessage({ tenantId, waId, direction, kind = 'text', body = '', status = 'SENT', meta = {} }) {
  const db = loadDb();
  const now = new Date().toISOString();
  const msg = {
    id: `msg_${randomUUID().slice(0, 12)}`,
    tenantId,
    waId,
    direction,
    kind,
    body,
    status,
    meta,
    timestamp: now
  };
  db.messages.push(msg);

  const key = `${tenantId}:${waId}`;
  let conv = db.conversations.find((c) => c.id === key);
  if (!conv) {
    conv = {
      id: key,
      tenantId,
      waId,
      profileName: meta.profileName || '',
      status: 'OPEN',
      unreadCount: 0,
      lastMessagePreview: '',
      lastMessageAt: null,
      lastInboundAt: null,
      lastOutboundAt: null,
      optedOut: false,
      optedOutAt: null,
      optOutReason: null,
      explicitOptIn: false,
      explicitOptInAt: null,
      explicitOptInSource: null,
      createdAt: now,
      updatedAt: now
    };
    db.conversations.push(conv);
  }

  conv.lastMessagePreview = body.slice(0, 160);
  conv.lastMessageAt = now;
  conv.updatedAt = now;
  conv.unreadCount = direction === 'INBOUND' ? (conv.unreadCount || 0) + 1 : conv.unreadCount || 0;

  if (direction === 'INBOUND') conv.lastInboundAt = now;
  if (direction === 'OUTBOUND') conv.lastOutboundAt = now;

  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (tenant) {
    if (!tenant.launch) tenant.launch = mergeLaunchConfig({}, {});

    if (direction === 'INBOUND') {
      tenant.stats.inboundCount = (tenant.stats.inboundCount || 0) + 1;
      tenant.stats.lastInboundAt = now;
    } else if (direction === 'OUTBOUND') {
      tenant.stats.outboundCount = (tenant.stats.outboundCount || 0) + 1;
      tenant.stats.lastOutboundAt = now;
    }

    tenant.stats.uniqueConversations = new Set(
      db.conversations
        .filter((c) => c.tenantId === tenantId)
        .map((c) => c.waId)
    ).size;

    tenant.updatedAt = now;
    if (tenant.lifecycle === 'ONBOARDING') tenant.lifecycle = 'ACTIVE';
  }

  saveDb(db);
  return msg;
}

function countRecentOutboundMessages(tenantId, waId, windowMs = 60 * 1000) {
  const db = loadDb();
  const now = Date.now();
  return db.messages.filter((m) => {
    if (m.tenantId !== tenantId || m.waId !== waId || m.direction !== 'OUTBOUND') return false;
    const ts = new Date(m.timestamp).getTime();
    return !Number.isNaN(ts) && (now - ts) <= windowMs;
  }).length;
}

function countRecentTenantOutboundMessages(tenantId, windowMs = 60 * 1000) {
  const db = loadDb();
  const now = Date.now();
  return db.messages.filter((m) => {
    if (m.tenantId !== tenantId || m.direction !== 'OUTBOUND') return false;
    const ts = new Date(m.timestamp).getTime();
    return !Number.isNaN(ts) && (now - ts) <= windowMs;
  }).length;
}

function listConversations(tenantId) {
  const db = loadDb();
  return db.conversations
    .filter((c) => c.tenantId === tenantId)
    .sort((a, b) => {
      if (!a.lastMessageAt || !b.lastMessageAt) return 0;
      return b.lastMessageAt.localeCompare(a.lastMessageAt);
    });
}

function listMessages(tenantId, waId) {
  const db = loadDb();
  return db.messages
    .filter((m) => m.tenantId === tenantId && m.waId === waId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function markConversationRead(tenantId, waId) {
  const db = loadDb();
  const conv = db.conversations.find((c) => c.id === `${tenantId}:${waId}`);
  if (conv) {
    conv.unreadCount = 0;
    conv.updatedAt = new Date().toISOString();
    saveDb(db);
  }
}

function addIrisEvent(event) {
  const db = loadDb();
  db.irisEvents.push({
    id: `iris_${randomUUID().slice(0, 12)}`,
    ...event,
    createdAt: new Date().toISOString()
  });
  saveDb(db);
}

function getIrisEvents(tenantId, limit = 50) {
  const db = loadDb();
  return db.irisEvents.filter((e) => e.tenantId === tenantId).slice(-limit);
}

function addIncident({ tenantId, severity = 'WARN', type, reason, suggestedFix = '', meta = {} }) {
  const db = loadDb();
  const now = new Date().toISOString();

  const incident = {
    id: `inc_${randomUUID().slice(0, 12)}`,
    tenantId,
    severity,
    type,
    reason,
    suggestedFix,
    meta,
    createdAt: now
  };

  db.incidents.push(incident);

  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (tenant) {
    tenant.launch = mergeLaunchConfig(tenant.launch || {}, {});
    tenant.launch.monitoring.incidents = (tenant.launch.monitoring.incidents || 0) + 1;
    tenant.launch.monitoring.lastIncidentAt = now;
    tenant.updatedAt = now;
  }

  saveDb(db);
  return incident;
}

function listIncidents(tenantId, limit = 50) {
  const db = loadDb();
  return db.incidents
    .filter((i) => i.tenantId === tenantId)
    .slice(-limit)
    .reverse();
}

function recordPolicyWarning(tenantId, details = {}) {
  const db = loadDb();
  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (!tenant) return null;

  const now = new Date().toISOString();
  tenant.launch = mergeLaunchConfig(tenant.launch || {}, {});
  tenant.launch.monitoring.policyWarnings = (tenant.launch.monitoring.policyWarnings || 0) + 1;
  tenant.launch.monitoring.lastPolicyWarningAt = now;

  if (tenant.launch.compliance.autoPauseCampaignOnPolicyWarning) {
    tenant.launch.noGoCampaign = true;
    if (tenant.lifecycle === 'ACTIVE') tenant.lifecycle = 'DEGRADED';
  }

  tenant.updatedAt = now;
  saveDb(db);

  return addIncident({
    tenantId,
    severity: 'WARN',
    type: 'POLICY_WARNING',
    reason: 'WhatsApp policy/quality warning received from delivery status webhook.',
    suggestedFix: 'Pause campaigns, run template/content audit, and resume after quality recovers.',
    meta: details
  });
}

function updateTenantState(tenantId, updates = {}) {
  const db = loadDb();
  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (!tenant) return null;

  if (updates.lifecycle) tenant.lifecycle = updates.lifecycle;
  if (updates.tier) tenant.tier = updates.tier;
  if (updates.qualityRating) tenant.qualityRating = updates.qualityRating;
  tenant.updatedAt = new Date().toISOString();

  saveDb(db);
  return tenant;
}

function updateTenantLaunch(tenantId, updates = {}) {
  const db = loadDb();
  const tenant = db.tenants.find((t) => t.id === tenantId);
  if (!tenant) return null;

  const incoming = updates.launch || updates;
  tenant.launch = mergeLaunchConfig(tenant.launch || {}, incoming);
  tenant.updatedAt = new Date().toISOString();

  saveDb(db);
  return tenant;
}

function evaluateLaunchReadiness(tenant) {
  const launch = mergeLaunchConfig(tenant?.launch || {}, {});
  const checklist = launch.checklist;

  const required = [
    ['otpReachable', 'OTP reachability not confirmed'],
    ['bmRole2faReady', 'Business Manager role/2FA gate incomplete'],
    ['webhookVerified', 'Webhook verification gate incomplete'],
    ['templateApproved', 'Template approval gate incomplete'],
    ['smokeInboundOutboundPassed', 'Inbound/outbound smoke test gate incomplete']
  ];

  const missing = required
    .filter(([key]) => !checklist[key])
    .map(([, label]) => label);

  if (!tenant?.waba?.phoneNumberId) missing.push('Phone Number ID missing');
  if (!tenant?.waba?.accessToken) missing.push('Access token missing');

  const ready = missing.length === 0;

  return {
    ready,
    missing,
    phase: launch.phase,
    noGoCampaign: launch.noGoCampaign,
    outboundPaused: launch.outboundPaused,
    checklist,
    compliance: launch.compliance,
    ownershipModel: launch.ownershipModel,
    transport: launch.transport,
    voiceProvider: launch.voiceProvider,
    monitoring: launch.monitoring
  };
}

module.exports = {
  DEFAULT_LAUNCH,
  sanitizePhone,
  upsertTenant,
  getTenants,
  getTenant,
  findTenantByPhoneNumberId,
  ensureConversation,
  getConversation,
  setConversationOptOut,
  setConversationConsent,
  isConversationWithinServiceWindow,
  countRecentOutboundMessages,
  countRecentTenantOutboundMessages,
  appendMessage,
  listConversations,
  listMessages,
  markConversationRead,
  addIrisEvent,
  getIrisEvents,
  addIncident,
  listIncidents,
  recordPolicyWarning,
  updateTenantState,
  updateTenantLaunch,
  evaluateLaunchReadiness
};
