/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import * as storeModule from '@/lib/omega-reach/store.js';
import * as wabaModule from '@/lib/omega-reach/waba.js';
import * as irisModule from '@/lib/omega-reach/iris.js';
import * as tierPlanModule from '@/lib/omega-reach/tier-plan.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const store: any = (storeModule as any).default || storeModule;
const waba: any = (wabaModule as any).default || wabaModule;
const irisApi: any = (irisModule as any).default || irisModule;
const tierPlanApi: any = (tierPlanModule as any).default || tierPlanModule;

const { sendTextMessage, sendTemplateMessage, verifySignature, normalizeInboundText } = waba;
const { handleIrisCommand } = irisApi;
const { buildTierRampPlan } = tierPlanApi;

const SERVICE_WINDOW_HOURS = Number(process.env.WABA_SERVICE_WINDOW_HOURS || 24);
const MAX_TEXT_CHARS = Number(process.env.WABA_MAX_TEXT_CHARS || 1500);
const MAX_ATTACHMENTS = Number(process.env.WABA_MAX_ATTACHMENTS || 5);
const MAX_ATTACHMENT_BYTES = Number(process.env.WABA_MAX_ATTACHMENT_BYTES || (10 * 1024 * 1024));
const META_GRAPH_VERSION = process.env.OMEGA_META_GRAPH_VERSION || 'v23.0';
const META_APP_ID = String(process.env.OMEGA_META_APP_ID || '').trim();
const META_APP_SECRET = String(process.env.OMEGA_META_APP_SECRET || '').trim();
const META_CONFIG_ID = String(process.env.OMEGA_META_EMBEDDED_SIGNUP_CONFIG_ID || '').trim();
const META_REDIRECT_PATH = String(process.env.OMEGA_META_REDIRECT_PATH || '/omega-reach/whatsapp/meta-callback.html').trim();
const META_STATE_SECRET = String(process.env.OMEGA_META_STATE_SECRET || META_APP_SECRET || 'omega-meta-state').trim();
const META_STATE_TTL_MS = Math.max(60_000, Number(process.env.OMEGA_META_STATE_TTL_MS || 15 * 60 * 1000));

function envFlag(name: string, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(raw).trim().toLowerCase());
}

const STRICT_MODE = envFlag('WABA_STRICT_MODE', true);
const STRICT_BLOCK_US_MARKETING = envFlag('WABA_STRICT_BLOCK_US_MARKETING', true);
const STRICT_REQUIRE_EXPLICIT_OPT_IN_FOR_CAMPAIGN = envFlag('WABA_STRICT_REQUIRE_EXPLICIT_OPT_IN_FOR_CAMPAIGN', true);
const STRICT_TEMPLATE_ONLY_FOR_CAMPAIGN = envFlag('WABA_STRICT_TEMPLATE_ONLY_FOR_CAMPAIGN', true);
const STRICT_NO_GO_REQUIRES_READY = envFlag('WABA_STRICT_NO_GO_REQUIRES_READY', true);

const MAX_OUTBOUND_PER_CHAT_PER_MIN = Number(process.env.WABA_MAX_OUTBOUND_PER_CHAT_PER_MIN || 5);
const MAX_OUTBOUND_PER_CHAT_PER_HOUR = Number(process.env.WABA_MAX_OUTBOUND_PER_CHAT_PER_HOUR || 25);
const MAX_OUTBOUND_PER_TENANT_PER_MIN = Number(process.env.WABA_MAX_OUTBOUND_PER_TENANT_PER_MIN || 120);

const OPT_OUT_KEYWORDS = new Set(
  String(process.env.WABA_OPT_OUT_KEYWORDS || 'stop,unsubscribe,cancel,end,quit,optout,no')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
);

const OPT_IN_KEYWORDS = new Set(
  String(process.env.WABA_OPT_IN_KEYWORDS || 'start,yes,unstop,subscribe,optin')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
);

class GuardrailError extends Error {
  code: string;
  meta: Record<string, unknown>;

  constructor(code: string, message: string, meta: Record<string, unknown> = {}) {
    super(message);
    this.name = 'GuardrailError';
    this.code = code;
    this.meta = meta;
  }
}

function getSegments(params?: { path?: string[] }) {
  return Array.isArray(params?.path) ? params.path.filter(Boolean) : [];
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function nowIso() {
  return new Date().toISOString();
}

function buildBaseUrl(req: NextRequest) {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

function isMetaEmbeddedConfigured() {
  return Boolean(META_APP_ID && META_APP_SECRET);
}

function buildMetaRedirectUri(req: NextRequest) {
  const base = buildBaseUrl(req).replace(/\/+$/, '');
  const path = META_REDIRECT_PATH.startsWith('/') ? META_REDIRECT_PATH : `/${META_REDIRECT_PATH}`;
  return `${base}${path}`;
}

function toBase64Url(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function fromBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function createMetaStateToken(tenantId: string) {
  const payload = {
    tenantId,
    ts: Date.now(),
    nonce: randomBytes(8).toString('hex')
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = createHmac('sha256', META_STATE_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyMetaStateToken(stateToken: string, expectedTenantId: string) {
  const parts = String(stateToken || '').split('.');
  if (parts.length !== 2) {
    return { ok: false, reason: 'invalid_state' };
  }

  const [encodedPayload, providedSig] = parts;
  const expectedSig = createHmac('sha256', META_STATE_SECRET).update(encodedPayload).digest('base64url');
  try {
    if (!timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig))) {
      return { ok: false, reason: 'invalid_signature' };
    }
  } catch {
    return { ok: false, reason: 'invalid_signature' };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const tokenTenantId = String(payload?.tenantId || '');
    const tokenTs = Number(payload?.ts || 0);
    if (!tokenTenantId || tokenTenantId !== expectedTenantId) {
      return { ok: false, reason: 'tenant_mismatch' };
    }
    if (!tokenTs || Date.now() - tokenTs > META_STATE_TTL_MS) {
      return { ok: false, reason: 'state_expired' };
    }
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: 'invalid_payload' };
  }
}

async function graphRequest(pathname: string, accessToken: string, method = 'GET', body?: unknown) {
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const url = new URL(`https://graph.facebook.com/${META_GRAPH_VERSION}/${cleanPath}`);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  };
  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body),
    cache: 'no-store'
  });
  const parsed = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = parsed?.error?.message || `Graph API request failed (${response.status})`;
    throw new Error(message);
  }
  return parsed;
}

async function exchangeMetaCodeForAccessToken(code: string, redirectUri: string) {
  const url = new URL(`https://graph.facebook.com/${META_GRAPH_VERSION}/oauth/access_token`);
  url.searchParams.set('client_id', META_APP_ID);
  url.searchParams.set('client_secret', META_APP_SECRET);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('code', code);

  const response = await fetch(url.toString(), { method: 'GET', cache: 'no-store' });
  const parsed = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = parsed?.error?.message || 'Failed to exchange Meta authorization code.';
    throw new Error(message);
  }
  return parsed;
}

function extractFromWabaRecord(waba: any) {
  const phoneNode = Array.isArray(waba?.phone_numbers?.data)
    ? waba.phone_numbers.data[0]
    : Array.isArray(waba?.phone_numbers)
      ? waba.phone_numbers[0]
      : null;
  return {
    wabaId: waba?.id ? String(waba.id) : '',
    phoneNumberId: phoneNode?.id ? String(phoneNode.id) : '',
    businessPhone: phoneNode?.display_phone_number ? String(phoneNode.display_phone_number) : ''
  };
}

async function discoverMetaWhatsAppAssets(accessToken: string) {
  const output: Record<string, string | null> = {
    userId: null,
    businessId: null,
    businessName: null,
    wabaId: '',
    phoneNumberId: '',
    businessPhone: ''
  };

  const me = await graphRequest('me?fields=id,name', accessToken);
  output.userId = me?.id ? String(me.id) : null;

  const businesses = await graphRequest('me/businesses?fields=id,name', accessToken);
  const list = Array.isArray(businesses?.data) ? businesses.data : [];
  for (const business of list) {
    const businessId = String(business?.id || '');
    if (!businessId) continue;
    output.businessId = businessId;
    output.businessName = business?.name ? String(business.name) : null;

    const candidates = [
      `${businessId}/owned_whatsapp_business_accounts?fields=id,name,phone_numbers{id,display_phone_number,verified_name}`,
      `${businessId}/client_whatsapp_business_accounts?fields=id,name,phone_numbers{id,display_phone_number,verified_name}`
    ];

    for (const candidate of candidates) {
      try {
        const result = await graphRequest(candidate, accessToken);
        const waba = Array.isArray(result?.data) ? result.data[0] : null;
        if (waba?.id) {
          const extracted = extractFromWabaRecord(waba);
          output.wabaId = extracted.wabaId;
          output.phoneNumberId = extracted.phoneNumberId;
          output.businessPhone = extracted.businessPhone;
          return output;
        }
      } catch {
        // Try next candidate path.
      }
    }
  }

  return output;
}

function resolveTenantById(tenantId: string | null | undefined) {
  if (!tenantId) return null;
  return store.getTenant(tenantId);
}

function bootstrapDefaultTenant() {
  const existing = store.getTenants();
  if (existing.length > 0) return;
  const name = process.env.DEFAULT_TENANT_NAME || 'My Indian WABA';
  store.upsertTenant({
    name,
    lifecycle: 'ONBOARDING',
    tier: 'TIER_1',
    qualityRating: 'UNKNOWN',
    launch: {
      ownershipModel: 'CLIENT_OWNED',
      transport: 'META_DIRECT',
      voiceProvider: 'ELEVENLABS_OPTIONAL',
      phase: 'STAGE_TEST_NUMBER',
      noGoCampaign: true
    },
    waba: {
      wabaId: process.env.DEFAULT_WABA_ID || '',
      phoneNumberId: process.env.DEFAULT_PHONE_NUMBER_ID || '',
      accessToken: process.env.DEFAULT_ACCESS_TOKEN || '',
      businessPhone: ''
    }
  });
}

function textIntentToken(text: string) {
  return String(text || '').trim().toLowerCase();
}

function detectOptIntent(text: string) {
  const token = textIntentToken(text);
  if (!token) return null;
  if (OPT_OUT_KEYWORDS.has(token)) return 'OPT_OUT';
  if (OPT_IN_KEYWORDS.has(token)) return 'OPT_IN';
  return null;
}

function normalizeWaId(input: string) {
  return String(input || '').replace(/[^\d]/g, '');
}

function isValidWaId(waId: string) {
  return /^\d{10,15}$/.test(String(waId || ''));
}

function isUSNumber(waId: string) {
  return /^1\d{10}$/.test(String(waId || ''));
}

function mergeLaunchState(existing: Record<string, any> = {}, incoming: Record<string, any> = {}) {
  const defaults = store.DEFAULT_LAUNCH || {};
  return {
    ...defaults,
    ...existing,
    ...incoming,
    checklist: {
      ...(defaults.checklist || {}),
      ...(existing.checklist || {}),
      ...(incoming.checklist || {})
    },
    compliance: {
      ...(defaults.compliance || {}),
      ...(existing.compliance || {}),
      ...(incoming.compliance || {})
    },
    monitoring: {
      ...(defaults.monitoring || {}),
      ...(existing.monitoring || {}),
      ...(incoming.monitoring || {})
    }
  };
}

function getStrictLaunchViolation(tenant: Record<string, any>, incoming: Record<string, any> = {}) {
  if (!STRICT_MODE) return null;

  const incomingCompliance = incoming.compliance || {};
  if (incomingCompliance.blockOptOutRecipients === false ||
    incomingCompliance.enforce24hServiceWindow === false ||
    incomingCompliance.templateRequiredOutsideWindow === false ||
    incomingCompliance.businessScopeOnly === false) {
    return 'Strict mode: mandatory compliance controls cannot be disabled.';
  }

  if (STRICT_NO_GO_REQUIRES_READY &&
    Object.prototype.hasOwnProperty.call(incoming, 'noGoCampaign') &&
    incoming.noGoCampaign === false) {
    const stagedTenant = {
      ...tenant,
      launch: mergeLaunchState(tenant.launch || {}, incoming)
    };
    const stagedReadiness = store.evaluateLaunchReadiness(stagedTenant);
    if (!stagedReadiness.ready) {
      return `Strict mode: cannot disable campaign no-go until launch is READY. Missing: ${stagedReadiness.missing.join('; ')}`;
    }
  }

  return null;
}

function recordGuardrailBlock({
  tenantId,
  waId,
  code,
  reason,
  meta = {}
}: {
  tenantId: string;
  waId?: string | null;
  code: string;
  reason: string;
  meta?: Record<string, unknown>;
}) {
  const suggestedFixMap: Record<string, string> = {
    INVALID_RECIPIENT: 'Use a valid E.164-style WhatsApp number (digits only, country code included).',
    OUTBOUND_PAUSED: 'Disable outbound kill switch only after checks are complete.',
    OPTED_OUT: 'Wait for explicit START/YES opt-in before messaging again.',
    CAMPAIGN_LOCKED: 'Keep campaign no-go ON until launch checklist is complete.',
    CAMPAIGN_NOT_READY: 'Complete all launch checklist gates before campaign traffic.',
    CAMPAIGN_TEMPLATE_REQUIRED: 'Campaign sends must use approved templates.',
    CAMPAIGN_OPTIN_REQUIRED: 'Capture explicit campaign opt-in before sending.',
    CAMPAIGN_US_BLOCKED: 'Do not send campaign marketing to +1 numbers.',
    SERVICE_WINDOW_EXPIRED: 'Use an approved template outside the customer service window.',
    RATE_LIMIT_CHAT_MIN: 'Reduce outbound frequency to this chat.',
    RATE_LIMIT_CHAT_HOUR: 'Reduce outbound bursts and spread outreach over time.',
    RATE_LIMIT_TENANT_MIN: 'Throttle tenant-wide outbound traffic.',
    TEXT_TOO_LONG: 'Shorten the message body.',
    ATTACHMENT_LIMIT: 'Reduce attachment count to allowed maximum.',
    ATTACHMENT_TOO_LARGE: 'Reduce attachment file size.',
    STRICT_LAUNCH_LOCK: 'Complete launch readiness gates before changing campaign lock settings.'
  };

  store.addIncident({
    tenantId,
    severity: 'WARN',
    type: 'GUARDRAIL_BLOCK',
    reason,
    suggestedFix: suggestedFixMap[code] || 'Review outbound message policy and retry with compliant payload.',
    meta: { code, waId, ...meta }
  });

  if (waId) {
    store.appendMessage({
      tenantId,
      waId,
      direction: 'SYSTEM',
      kind: 'incident',
      body: `Guardrail blocked outbound (${code}): ${reason}`,
      status: 'BLOCKED',
      meta: { code, ...meta }
    });
  }
}

function enforceOutboundGuards({
  tenant,
  to,
  isTemplate,
  mode = 'SERVICE'
}: {
  tenant: Record<string, any>;
  to: string;
  isTemplate: boolean;
  mode?: string;
}) {
  const launch = store.evaluateLaunchReadiness(tenant);
  const normalizedMode = String(mode || 'SERVICE').toUpperCase();
  const waId = normalizeWaId(to);

  if (!isValidWaId(waId)) {
    throw new GuardrailError('INVALID_RECIPIENT', 'Invalid recipient number. Use a valid WhatsApp number with country code.', { to });
  }

  if (launch.outboundPaused) {
    throw new GuardrailError('OUTBOUND_PAUSED', 'Outbound is paused by safety kill switch. Resume from Launch Safety settings.');
  }

  const conv = store.getConversation(tenant.id, waId);
  if (launch.compliance.blockOptOutRecipients && conv?.optedOut) {
    throw new GuardrailError('OPTED_OUT', 'Recipient has opted out. Do not send outbound unless they opt in again (START/YES).');
  }

  const recentPerChatMinute = store.countRecentOutboundMessages(tenant.id, waId, 60 * 1000);
  if (recentPerChatMinute >= MAX_OUTBOUND_PER_CHAT_PER_MIN) {
    throw new GuardrailError('RATE_LIMIT_CHAT_MIN', `Rate limit hit for this chat (${MAX_OUTBOUND_PER_CHAT_PER_MIN}/min).`, { recentPerChatMinute });
  }

  const recentPerChatHour = store.countRecentOutboundMessages(tenant.id, waId, 60 * 60 * 1000);
  if (recentPerChatHour >= MAX_OUTBOUND_PER_CHAT_PER_HOUR) {
    throw new GuardrailError('RATE_LIMIT_CHAT_HOUR', `Rate limit hit for this chat (${MAX_OUTBOUND_PER_CHAT_PER_HOUR}/hour).`, { recentPerChatHour });
  }

  const recentTenantMinute = store.countRecentTenantOutboundMessages(tenant.id, 60 * 1000);
  if (recentTenantMinute >= MAX_OUTBOUND_PER_TENANT_PER_MIN) {
    throw new GuardrailError('RATE_LIMIT_TENANT_MIN', `Tenant rate limit hit (${MAX_OUTBOUND_PER_TENANT_PER_MIN}/min).`, { recentTenantMinute });
  }

  if (normalizedMode === 'CAMPAIGN') {
    if (STRICT_TEMPLATE_ONLY_FOR_CAMPAIGN && !isTemplate) {
      throw new GuardrailError('CAMPAIGN_TEMPLATE_REQUIRED', 'Campaign sends must use approved WhatsApp templates.');
    }
    if (STRICT_BLOCK_US_MARKETING && isUSNumber(waId)) {
      throw new GuardrailError('CAMPAIGN_US_BLOCKED', 'Campaign blocked for +1 numbers due marketing restrictions.');
    }
    if (STRICT_REQUIRE_EXPLICIT_OPT_IN_FOR_CAMPAIGN && !conv?.explicitOptIn) {
      throw new GuardrailError('CAMPAIGN_OPTIN_REQUIRED', 'Campaign blocked: recipient has no explicit campaign opt-in.');
    }
    if (launch.noGoCampaign) {
      throw new GuardrailError('CAMPAIGN_LOCKED', 'Campaign no-go lock is enabled. Disable only after all launch gates pass.');
    }
    if (!launch.ready) {
      throw new GuardrailError('CAMPAIGN_NOT_READY', `Campaign blocked until launch gates pass: ${launch.missing.join('; ')}`);
    }
  }

  if (!isTemplate && launch.compliance.enforce24hServiceWindow && launch.compliance.templateRequiredOutsideWindow) {
    const withinWindow = store.isConversationWithinServiceWindow(tenant.id, waId, SERVICE_WINDOW_HOURS);
    if (!withinWindow) {
      throw new GuardrailError('SERVICE_WINDOW_EXPIRED', `Outside ${SERVICE_WINDOW_HOURS}h customer service window. Use approved template messaging.`);
    }
  }

  return { launch, waId, conv };
}

function isPolicyWarning(statusObj: Record<string, any> = {}) {
  const errors = Array.isArray(statusObj.errors) ? statusObj.errors : [];
  const hay = [
    statusObj.status,
    ...errors.map((e: any) => e.title || e.message || e.error_data?.details || ''),
    ...errors.map((e: any) => e.code || ''),
    statusObj.conversation?.origin?.type
  ].join(' ').toLowerCase();

  if (hay.includes('policy') || hay.includes('quality') || hay.includes('spam') || hay.includes('blocked')) {
    return true;
  }

  if (hay.includes('131048') || hay.includes('131026') || hay.includes('470')) {
    return true;
  }

  return false;
}

bootstrapDefaultTenant();

async function handleGet(req: NextRequest, segments: string[]) {
  if (segments.length === 0 || segments[0] === '') {
    return json({ ok: true, service: 'omega-reach-api', at: nowIso() });
  }

  if (segments[0] === 'health') {
    return json({ ok: true, service: 'omega-reach', at: nowIso() });
  }

  if (segments[0] === 'config') {
    const baseUrl = buildBaseUrl(req);
    return json({
      baseUrl,
      webhookUrl: `${baseUrl}/api/omega-reach/webhooks/whatsapp`,
      verifyToken: process.env.WABA_VERIFY_TOKEN || '',
      serviceWindowHours: SERVICE_WINDOW_HOURS,
      metaEmbeddedSignup: {
        enabled: isMetaEmbeddedConfigured(),
        hasConfigId: Boolean(META_CONFIG_ID),
        graphVersion: META_GRAPH_VERSION,
        redirectUri: buildMetaRedirectUri(req)
      },
      strictMode: STRICT_MODE,
      strictGuardrails: {
        blockUSMarketing: STRICT_BLOCK_US_MARKETING,
        requireExplicitOptInForCampaign: STRICT_REQUIRE_EXPLICIT_OPT_IN_FOR_CAMPAIGN,
        templateOnlyCampaign: STRICT_TEMPLATE_ONLY_FOR_CAMPAIGN,
        noGoRequiresReady: STRICT_NO_GO_REQUIRES_READY
      }
    });
  }

  if (segments[0] === 'tenants' && segments.length === 1) {
    return json({ tenants: store.getTenants() });
  }

  if (segments[0] === 'tenants' && segments.length >= 2) {
    const tenantId = segments[1];
    const tenant = resolveTenantById(tenantId);
    if (!tenant) return json({ error: 'Tenant not found' }, 404);

    if (segments.length === 3 && segments[2] === 'launch') {
      return json({ tenantId: tenant.id, launch: store.evaluateLaunchReadiness(tenant) });
    }

    if (segments.length === 3 && segments[2] === 'incidents') {
      return json({ incidents: store.listIncidents(tenant.id) });
    }

    if (segments.length === 3 && segments[2] === 'conversations') {
      return json({ conversations: store.listConversations(tenant.id) });
    }

    if (segments.length === 5 && segments[2] === 'conversations' && segments[4] === 'messages') {
      const waId = normalizeWaId(segments[3]);
      const messages = store.listMessages(tenant.id, waId);
      store.markConversationRead(tenant.id, waId);
      return json({ messages });
    }

    if (segments.length === 3 && segments[2] === 'tier-plan') {
      const plan = buildTierRampPlan({
        tier: tenant.tier,
        qualityRating: tenant.qualityRating,
        uniqueConversations: tenant.stats?.uniqueConversations || 0
      });
      return json({
        plan,
        note: 'Tier upgrades depend on Meta quality/compliance rules and account review; this module gives operating guidance.'
      });
    }

    if (segments.length === 4 && segments[2] === 'iris' && segments[3] === 'events') {
      return json({ events: store.getIrisEvents(tenant.id) });
    }
  }

  if (segments[0] === 'webhooks' && segments[1] === 'whatsapp') {
    const mode = req.nextUrl.searchParams.get('hub.mode');
    const token = req.nextUrl.searchParams.get('hub.verify_token');
    const challenge = req.nextUrl.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token && token === process.env.WABA_VERIFY_TOKEN) {
      return new NextResponse(challenge || '', { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }

  return json({ error: 'Not found' }, 404);
}

async function handlePost(req: NextRequest, segments: string[]) {
  if (segments[0] === 'tenants' && segments.length === 1) {
    const body = await req.json().catch(() => ({}));
    const tenant = store.upsertTenant(body || {});
    return json({ tenant }, 201);
  }

  if (segments[0] === 'tenants' && segments.length >= 2) {
    const tenantId = segments[1];
    const tenant = resolveTenantById(tenantId);
    if (!tenant) return json({ error: 'Tenant not found' }, 404);

    if (segments.length === 5 && segments[2] === 'meta' && segments[3] === 'embedded-signup' && segments[4] === 'start') {
      if (!isMetaEmbeddedConfigured()) {
        return json({
          error: 'Meta Embedded Signup is not configured. Set OMEGA_META_APP_ID and OMEGA_META_APP_SECRET.'
        }, 400);
      }

      const redirectUri = buildMetaRedirectUri(req);
      const stateToken = createMetaStateToken(tenant.id);
      const authUrl = new URL(`https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth`);
      authUrl.searchParams.set('client_id', META_APP_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('state', stateToken);
      authUrl.searchParams.set('scope', 'business_management,whatsapp_business_management,whatsapp_business_messaging');
      if (META_CONFIG_ID) {
        authUrl.searchParams.set('config_id', META_CONFIG_ID);
        authUrl.searchParams.set('override_default_response_type', 'true');
      }

      return json({
        ok: true,
        authUrl: authUrl.toString(),
        redirectUri
      });
    }

    if (segments.length === 5 && segments[2] === 'meta' && segments[3] === 'embedded-signup' && segments[4] === 'complete') {
      if (!isMetaEmbeddedConfigured()) {
        return json({
          error: 'Meta Embedded Signup is not configured. Set OMEGA_META_APP_ID and OMEGA_META_APP_SECRET.'
        }, 400);
      }

      const payload = await req.json().catch(() => ({}));
      const code = String(payload?.code || '').trim();
      const stateToken = String(payload?.state || '').trim();
      const fallbackWabaId = String(payload?.wabaId || '').trim();
      const fallbackPhoneNumberId = String(payload?.phoneNumberId || '').trim();
      const fallbackBusinessPhone = String(payload?.businessPhone || '').trim();

      if (!code || !stateToken) {
        return json({ error: 'Missing Meta authorization code/state.' }, 400);
      }

      const verify = verifyMetaStateToken(stateToken, tenant.id);
      if (!verify.ok) {
        return json({ error: `Invalid Meta state token (${verify.reason}). Please restart onboarding.` }, 400);
      }

      try {
        const redirectUri = buildMetaRedirectUri(req);
        const tokenResult = await exchangeMetaCodeForAccessToken(code, redirectUri);
        const accessToken = String(tokenResult?.access_token || '').trim();
        if (!accessToken) {
          return json({ error: 'Meta did not return an access token.' }, 400);
        }

        const discovered = await discoverMetaWhatsAppAssets(accessToken);
        const wabaId = discovered.wabaId || fallbackWabaId;
        const phoneNumberId = discovered.phoneNumberId || fallbackPhoneNumberId;
        const businessPhone = discovered.businessPhone || fallbackBusinessPhone;

        const updated = store.upsertTenant({
          ...tenant,
          id: tenant.id,
          waba: {
            ...tenant.waba,
            accessToken,
            ...(wabaId ? { wabaId } : {}),
            ...(phoneNumberId ? { phoneNumberId } : {}),
            ...(businessPhone ? { businessPhone } : {})
          }
        });

        return json({
          ok: true,
          tenant: updated,
          launch: store.evaluateLaunchReadiness(updated),
          meta: {
            graphVersion: META_GRAPH_VERSION,
            discovered
          }
        });
      } catch (error: any) {
        return json({
          error: 'Failed to complete Meta embedded signup.',
          detail: error?.message || 'unknown_error'
        }, 500);
      }
    }

    if (segments.length === 4 && segments[2] === 'messages' && segments[3] === 'send') {
      const requestBody = await req.json().catch(() => ({}));
      try {
        const {
          to,
          text,
          templateName,
          templateLanguageCode,
          mode = 'SERVICE',
          attachments = []
        } = requestBody || {};

        const normalizedTo = normalizeWaId(to);
        const normalizedText = String(text || '').trim();

        const normalizedAttachments = Array.isArray(attachments)
          ? attachments
            .filter((a: any) => a && a.name)
            .slice(0, MAX_ATTACHMENTS)
            .map((a: any) => ({
              name: String(a.name).slice(0, 120),
              size: Math.max(0, Number(a.size || 0)),
              type: String(a.type || 'application/octet-stream').slice(0, 100)
            }))
          : [];

        if (!to) return json({ error: 'Missing "to"' }, 400);
        if (!isValidWaId(normalizedTo)) return json({ error: 'Invalid "to" number format.' }, 400);

        if (normalizedText.length > MAX_TEXT_CHARS) {
          throw new GuardrailError('TEXT_TOO_LONG', `Message text too long. Max ${MAX_TEXT_CHARS} characters.`);
        }

        if (normalizedAttachments.length > MAX_ATTACHMENTS) {
          throw new GuardrailError('ATTACHMENT_LIMIT', `Too many attachments. Max ${MAX_ATTACHMENTS} files.`);
        }

        const oversized = normalizedAttachments.find((a: any) => a.size > MAX_ATTACHMENT_BYTES);
        if (oversized) {
          throw new GuardrailError('ATTACHMENT_TOO_LARGE', `Attachment "${oversized.name}" exceeds size limit (${MAX_ATTACHMENT_BYTES} bytes).`);
        }

        if (!tenant.waba?.phoneNumberId || !tenant.waba?.accessToken) {
          return json({ error: 'WABA credentials missing. Save phoneNumberId + accessToken first.' }, 400);
        }

        const isTemplate = Boolean(templateName);
        const { launch, waId } = enforceOutboundGuards({ tenant, to: normalizedTo, isTemplate, mode });

        let waResponse;

        if (isTemplate) {
          waResponse = await sendTemplateMessage({
            phoneNumberId: tenant.waba.phoneNumberId,
            accessToken: tenant.waba.accessToken,
            to: waId,
            name: templateName,
            languageCode: templateLanguageCode || 'en'
          });

          store.appendMessage({
            tenantId: tenant.id,
            waId,
            direction: 'OUTBOUND',
            kind: 'template',
            body: `[template:${templateName}]`,
            status: 'QUEUED',
            meta: { waResponse, mode: String(mode || 'SERVICE').toUpperCase() }
          });
        } else {
          if (!normalizedText && normalizedAttachments.length === 0) {
            return json({ error: 'Missing "text" or "attachments" for non-template send.' }, 400);
          }

          const attachmentLines = normalizedAttachments.map((a: any) => `- ${a.name}`);
          const textBody = normalizedText;
          const fallbackBody = normalizedAttachments.length === 1
            ? `Attachment: ${normalizedAttachments[0].name}`
            : `Attachments (${normalizedAttachments.length})`;

          const outboundBody = normalizedAttachments.length
            ? `${textBody || fallbackBody}\n\nAttachments:\n${attachmentLines.join('\n')}`.trim()
            : textBody;

          waResponse = await sendTextMessage({
            phoneNumberId: tenant.waba.phoneNumberId,
            accessToken: tenant.waba.accessToken,
            to: waId,
            text: outboundBody
          });

          const localBody = textBody || `[attachments] ${normalizedAttachments.map((a: any) => a.name).join(', ')}`;
          store.appendMessage({
            tenantId: tenant.id,
            waId,
            direction: 'OUTBOUND',
            kind: 'text',
            body: localBody,
            status: 'QUEUED',
            meta: {
              waResponse,
              mode: String(mode || 'SERVICE').toUpperCase(),
              attachments: normalizedAttachments
            }
          });
        }

        return json({ ok: true, waResponse, launch, attachments: normalizedAttachments });
      } catch (error: any) {
        const message = error?.message || 'Failed to send message via WABA';

        if (error instanceof GuardrailError) {
          const waId = normalizeWaId(requestBody?.to || '');
          recordGuardrailBlock({
            tenantId: tenant.id,
            waId: isValidWaId(waId) ? waId : null,
            code: error.code,
            reason: error.message,
            meta: error.meta || {}
          });
          return json({ error: message, code: error.code }, 400);
        }

        return json({
          error: 'Failed to send message via WABA',
          detail: error?.response?.data || message
        }, 500);
      }
    }

    if (segments.length === 3 && segments[2] === 'iris') {
      const payload = await req.json().catch(() => ({}));
      try {
        const prompt = String(payload?.prompt || '');
        const conversations = store.listConversations(tenant.id);

        const result = await handleIrisCommand({
          prompt,
          tenant,
          conversations,
          sendText: async ({ to, text, mode = 'SERVICE' }: any) => {
            if (!tenant.waba?.phoneNumberId || !tenant.waba?.accessToken) {
              throw new Error('WABA credentials missing for this tenant.');
            }
            const normalizedTo = normalizeWaId(to);
            const body = String(text || '').trim();
            if (body.length > MAX_TEXT_CHARS) {
              throw new GuardrailError('TEXT_TOO_LONG', `Message text too long. Max ${MAX_TEXT_CHARS} characters.`);
            }

            const latestTenant = store.getTenant(tenant.id);
            const { waId } = enforceOutboundGuards({ tenant: latestTenant, to: normalizedTo, isTemplate: false, mode });

            const waResponse = await sendTextMessage({
              phoneNumberId: tenant.waba.phoneNumberId,
              accessToken: tenant.waba.accessToken,
              to: waId,
              text: body
            });

            store.appendMessage({
              tenantId: tenant.id,
              waId,
              direction: 'OUTBOUND',
              kind: 'text',
              body,
              status: 'QUEUED',
              meta: { waResponse, via: 'IRIS', mode: String(mode || 'SERVICE').toUpperCase() }
            });
          },
          sendTemplate: async ({ to, templateName, mode = 'SERVICE' }: any) => {
            if (!tenant.waba?.phoneNumberId || !tenant.waba?.accessToken) {
              throw new Error('WABA credentials missing for this tenant.');
            }
            const normalizedTo = normalizeWaId(to);
            const latestTenant = store.getTenant(tenant.id);
            const { waId } = enforceOutboundGuards({ tenant: latestTenant, to: normalizedTo, isTemplate: true, mode });

            const waResponse = await sendTemplateMessage({
              phoneNumberId: tenant.waba.phoneNumberId,
              accessToken: tenant.waba.accessToken,
              to: waId,
              name: templateName
            });

            store.appendMessage({
              tenantId: tenant.id,
              waId,
              direction: 'OUTBOUND',
              kind: 'template',
              body: `[template:${templateName}]`,
              status: 'QUEUED',
              meta: { waResponse, via: 'IRIS', mode: String(mode || 'SERVICE').toUpperCase() }
            });
          },
          getLaunchReadiness: () => store.evaluateLaunchReadiness(store.getTenant(tenant.id)),
          updateTenantState: (updates: any) => store.updateTenantState(tenant.id, updates),
          updateTenantLaunch: (updates: any) => {
            const currentTenant = store.getTenant(tenant.id);
            const violation = getStrictLaunchViolation(currentTenant, updates || {});
            if (violation) throw new GuardrailError('STRICT_LAUNCH_LOCK', violation);
            return store.updateTenantLaunch(tenant.id, updates);
          },
          updateConversationConsent: ({ waId, explicitOptIn }: any) => {
            const normalizedWaId = normalizeWaId(waId);
            const updated = store.setConversationConsent(tenant.id, normalizedWaId, Boolean(explicitOptIn), 'IRIS_MANUAL');
            if (!updated) return null;
            store.appendMessage({
              tenantId: tenant.id,
              waId: normalizedWaId,
              direction: 'SYSTEM',
              kind: 'compliance',
              body: explicitOptIn
                ? 'Consent updated by Iris: explicit campaign opt-in is ON for this chat.'
                : 'Consent updated by Iris: explicit campaign opt-in is OFF for this chat.',
              status: 'INFO',
              meta: { compliance: explicitOptIn ? 'IRIS_OPT_IN' : 'IRIS_OPT_OUT' }
            });
            return updated;
          },
          updateTenantWaba: (updates: any) => {
            const currentTenant = store.getTenant(tenant.id);
            return store.upsertTenant({
              ...currentTenant,
              id: currentTenant.id,
              waba: {
                ...currentTenant.waba,
                ...updates
              }
            });
          },
          listIncidents: () => store.listIncidents(tenant.id, 20),
          listConversations: () => store.listConversations(tenant.id),
          addIrisEvent: store.addIrisEvent
        });

        const events = store.getIrisEvents(tenant.id);
        return json({ result, events });
      } catch (error: any) {
        if (error instanceof GuardrailError) {
          const waId = normalizeWaId(String(payload?.prompt || '').match(/(\+?\d{10,15})/)?.[1] || '');
          recordGuardrailBlock({
            tenantId: tenant.id,
            waId: isValidWaId(waId) ? waId : null,
            code: error.code,
            reason: error.message,
            meta: error.meta || { via: 'IRIS' }
          });
          return json({ error: 'Iris command blocked by guardrails', detail: error.message, code: error.code }, 400);
        }

        return json({ error: 'Iris command failed', detail: error.message }, 500);
      }
    }
  }

  if (segments[0] === 'webhooks' && segments[1] === 'whatsapp') {
    try {
      const rawBody = await req.text();
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      const signature = req.headers.get('x-hub-signature-256');
      const isValid = verifySignature(
        { headers: { 'x-hub-signature-256': signature }, rawBody },
        process.env.WABA_APP_SECRET || ''
      );
      if (!isValid) return json({ error: 'Invalid webhook signature' }, 401);

      const entries = Array.isArray(parsed.entry) ? parsed.entry : [];

      for (const entry of entries) {
        const changes = Array.isArray(entry.changes) ? entry.changes : [];
        for (const change of changes) {
          const value = change.value || {};
          const metadata = value.metadata || {};
          const phoneNumberId = metadata.phone_number_id;

          const tenant = store.findTenantByPhoneNumberId(phoneNumberId) || store.getTenants()[0] || null;
          if (!tenant) continue;

          const contacts = Array.isArray(value.contacts) ? value.contacts : [];
          const messages = Array.isArray(value.messages) ? value.messages : [];
          const statuses = Array.isArray(value.statuses) ? value.statuses : [];

          for (const m of messages) {
            const waId = normalizeWaId(m.from);
            if (!isValidWaId(waId)) continue;
            const profile = contacts.find((c: any) => normalizeWaId(c.wa_id) === waId)?.profile?.name || '';
            const normalizedText = normalizeInboundText(m);

            store.ensureConversation(tenant.id, waId, profile);

            const optIntent = detectOptIntent(normalizedText);
            if (optIntent === 'OPT_OUT') {
              store.setConversationOptOut(tenant.id, waId, true, 'STOP_KEYWORD');
            }
            if (optIntent === 'OPT_IN') {
              store.setConversationOptOut(tenant.id, waId, false, 'START_KEYWORD');
            }

            store.appendMessage({
              tenantId: tenant.id,
              waId,
              direction: 'INBOUND',
              kind: m.type || 'text',
              body: normalizedText,
              status: 'RECEIVED',
              meta: { messageId: m.id, profileName: profile, rawType: m.type }
            });

            if (optIntent === 'OPT_OUT') {
              store.appendMessage({
                tenantId: tenant.id,
                waId,
                direction: 'SYSTEM',
                kind: 'compliance',
                body: 'Contact opted out. Outbound is blocked for this chat until START/YES is received.',
                status: 'INFO',
                meta: { compliance: 'OPT_OUT' }
              });
            }

            if (optIntent === 'OPT_IN') {
              store.appendMessage({
                tenantId: tenant.id,
                waId,
                direction: 'SYSTEM',
                kind: 'compliance',
                body: 'Contact opted back in. Service replies can resume and campaign consent is now explicitly enabled.',
                status: 'INFO',
                meta: { compliance: 'OPT_IN' }
              });
            }
          }

          for (const s of statuses) {
            const recipient = normalizeWaId(s.recipient_id);
            if (!recipient || !isValidWaId(recipient)) continue;

            store.appendMessage({
              tenantId: tenant.id,
              waId: recipient,
              direction: 'SYSTEM',
              kind: 'status',
              body: `Delivery status: ${s.status || 'unknown'}`,
              status: s.status || 'unknown',
              meta: {
                pricing: s.pricing || null,
                conversation: s.conversation || null,
                messageId: s.id || null,
                errors: s.errors || null
              }
            });

            if (isPolicyWarning(s)) {
              store.recordPolicyWarning(tenant.id, {
                status: s.status || 'unknown',
                recipient,
                errors: s.errors || []
              });

              store.appendMessage({
                tenantId: tenant.id,
                waId: recipient,
                direction: 'SYSTEM',
                kind: 'incident',
                body: 'Policy/quality warning detected. Campaign traffic remains locked until review.',
                status: 'WARN',
                meta: { incidentType: 'POLICY_WARNING' }
              });
            }
          }
        }
      }

      return new NextResponse(null, { status: 200 });
    } catch (error: any) {
      return json({ error: 'Webhook processing failed', detail: error.message }, 500);
    }
  }

  return json({ error: 'Not found' }, 404);
}

async function handlePut(req: NextRequest, segments: string[]) {
  if (segments[0] === 'tenants' && segments.length >= 2) {
    const tenantId = segments[1];
    const current = resolveTenantById(tenantId);
    if (!current) return json({ error: 'Tenant not found' }, 404);

    if (segments.length === 3 && segments[2] === 'waba') {
      const body = await req.json().catch(() => ({}));
      const tenant = store.upsertTenant({
        ...current,
        ...body,
        id: current.id,
        waba: { ...current.waba, ...(body.waba || body) }
      });
      return json({ tenant, launch: store.evaluateLaunchReadiness(tenant) });
    }

    if (segments.length === 3 && segments[2] === 'launch') {
      const body = await req.json().catch(() => ({}));
      const incoming = body?.launch || body || {};
      const violation = getStrictLaunchViolation(current, incoming);
      if (violation) return json({ error: violation }, 400);

      const updated = store.updateTenantLaunch(current.id, body || {});
      return json({ tenant: updated, launch: store.evaluateLaunchReadiness(updated) });
    }

    if (segments.length === 5 && segments[2] === 'conversations' && segments[4] === 'consent') {
      const waId = normalizeWaId(segments[3]);
      if (!isValidWaId(waId)) return json({ error: 'Invalid conversation number.' }, 400);

      const body = await req.json().catch(() => ({}));
      const explicitOptIn = Boolean(body?.explicitOptIn);
      const source = explicitOptIn ? 'MANUAL_OPT_IN' : 'MANUAL_OPT_OUT';
      const updated = store.setConversationConsent(current.id, waId, explicitOptIn, source);
      if (!updated) return json({ error: 'Conversation not found for consent update.' }, 404);

      store.appendMessage({
        tenantId: current.id,
        waId,
        direction: 'SYSTEM',
        kind: 'compliance',
        body: explicitOptIn
          ? 'Consent updated: explicit campaign opt-in is ON for this chat.'
          : 'Consent updated: explicit campaign opt-in is OFF for this chat.',
        status: 'INFO',
        meta: { compliance: explicitOptIn ? 'MANUAL_OPT_IN' : 'MANUAL_OPT_OUT' }
      });

      return json({ conversation: updated });
    }
  }

  return json({ error: 'Not found' }, 404);
}

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  return handleGet(req, getSegments(params));
}

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  return handlePost(req, getSegments(params));
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  return handlePut(req, getSegments(params));
}
