const state = {
  tenantId: null,
  activeWaId: null,
  tenants: [],
  conversations: [],
  launch: null,
  config: null,
  metaPendingTenantId: null,
  pendingAttachments: [],
  isSending: false
};

const MAX_ATTACHMENTS = 5;
const MAX_TEXTAREA_HEIGHT = 140;

const el = {
  tenantSelect: document.getElementById('tenantSelect'),
  tenantName: document.getElementById('tenantName'),
  businessPhone: document.getElementById('businessPhone'),
  wabaId: document.getElementById('wabaId'),
  phoneNumberId: document.getElementById('phoneNumberId'),
  accessToken: document.getElementById('accessToken'),
  createTenantBtn: document.getElementById('createTenantBtn'),
  saveWabaBtn: document.getElementById('saveWabaBtn'),
  connectMetaBtn: document.getElementById('connectMetaBtn'),
  metaStatus: document.getElementById('metaStatus'),

  gateOtp: document.getElementById('gateOtp'),
  gateBm2fa: document.getElementById('gateBm2fa'),
  gateWebhook: document.getElementById('gateWebhook'),
  gateTemplate: document.getElementById('gateTemplate'),
  gateSmoke: document.getElementById('gateSmoke'),
  launchPhase: document.getElementById('launchPhase'),
  noGoCampaign: document.getElementById('noGoCampaign'),
  outboundPaused: document.getElementById('outboundPaused'),
  saveLaunchBtn: document.getElementById('saveLaunchBtn'),
  refreshLaunchBtn: document.getElementById('refreshLaunchBtn'),
  launchStatus: document.getElementById('launchStatus'),

  chatSearch: document.getElementById('chatSearch'),
  conversations: document.getElementById('conversations'),
  messages: document.getElementById('messages'),
  sendTo: document.getElementById('sendTo'),
  sendText: document.getElementById('sendText'),
  sendMode: document.getElementById('sendMode'),
  sendBtn: document.getElementById('sendBtn'),
  composer: document.querySelector('.wa-composer'),
  attachBtn: document.getElementById('attachBtn'),
  attachInput: document.getElementById('attachInput'),
  attachmentTray: document.getElementById('attachmentTray'),
  chatTitle: document.getElementById('chatTitle'),
  chatSubtitle: document.getElementById('chatSubtitle'),
  chatAvatar: document.getElementById('chatAvatar'),

  irisInput: document.getElementById('irisInput'),
  irisSend: document.getElementById('irisSend'),
  irisMessages: document.getElementById('irisMessages'),
  tierBtn: document.getElementById('tierBtn'),
  tierOut: document.getElementById('tierOut'),

  incidentList: document.getElementById('incidentList'),
  webhookHint: document.getElementById('webhookHint'),
  configInfo: document.getElementById('configInfo')
};

const API_BASE = '/api/omega-reach';

async function api(path, options = {}) {
  const normalizedPath = String(path || '').trim();
  const endpoint = normalizedPath.startsWith('/api/')
    ? normalizedPath.replace(/^\/api/, API_BASE)
    : `${API_BASE}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.detail || `Request failed: ${res.status}`);
  return json;
}

function setMetaStatus(text, tone = 'info') {
  if (!el.metaStatus) return;
  el.metaStatus.textContent = text || '';
  el.metaStatus.classList.remove('danger', 'success');
  if (tone === 'danger') el.metaStatus.classList.add('danger');
  if (tone === 'success') el.metaStatus.classList.add('success');
}

function initials(input) {
  const source = (input || '').trim();
  if (!source) return 'WA';
  const chunks = source.split(/\s+/).slice(0, 2);
  return chunks.map((c) => c.charAt(0).toUpperCase()).join('');
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}

function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function autoResizeTextarea(node) {
  if (!node) return;
  node.style.height = '44px';
  const next = Math.max(44, Math.min(node.scrollHeight, MAX_TEXTAREA_HEIGHT));
  node.style.height = `${next}px`;
  node.style.overflowY = node.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
}

function normalizeAttachment(file) {
  return {
    id: `${file.name}:${file.size}:${file.lastModified}`,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified
  };
}

function renderAttachmentTray() {
  if (!el.attachmentTray) return;

  if (!state.pendingAttachments.length) {
    el.attachmentTray.innerHTML = '';
    el.attachmentTray.style.display = 'none';
    return;
  }

  el.attachmentTray.style.display = 'flex';
  el.attachmentTray.innerHTML = '';

  state.pendingAttachments.forEach((a) => {
    const chip = document.createElement('div');
    chip.className = 'attachment-chip';
    chip.innerHTML = `
      <span class="attachment-name">${a.name}</span>
      <span class="attachment-size">${formatBytes(a.size)}</span>
      <button type="button" class="attachment-remove" aria-label="Remove attachment">×</button>
    `;

    chip.querySelector('.attachment-remove')?.addEventListener('click', () => {
      state.pendingAttachments = state.pendingAttachments.filter((x) => x.id !== a.id);
      renderAttachmentTray();
    });

    el.attachmentTray.appendChild(chip);
  });
}

function addSelectedFiles(fileList) {
  const next = Array.from(fileList || []);
  if (!next.length) return;

  const existing = new Map(state.pendingAttachments.map((a) => [a.id, a]));
  for (const file of next) {
    const att = normalizeAttachment(file);
    if (!existing.has(att.id)) existing.set(att.id, att);
  }

  state.pendingAttachments = Array.from(existing.values()).slice(0, MAX_ATTACHMENTS);
  if (existing.size > MAX_ATTACHMENTS) {
    alert(`Only ${MAX_ATTACHMENTS} attachments are allowed per message.`);
  }
  renderAttachmentTray();
}

function setSendBusy(isBusy) {
  state.isSending = Boolean(isBusy);
  if (el.sendBtn) {
    el.sendBtn.disabled = state.isSending;
    el.sendBtn.textContent = state.isSending ? 'Sending…' : 'Send';
  }
}

function renderTenantSelect() {
  el.tenantSelect.innerHTML = '';
  for (const t of state.tenants) {
    const option = document.createElement('option');
    option.value = t.id;
    option.textContent = `${t.name} (${t.lifecycle})`;
    el.tenantSelect.appendChild(option);
  }
  if (!state.tenantId && state.tenants[0]) state.tenantId = state.tenants[0].id;
  if (state.tenantId) el.tenantSelect.value = state.tenantId;
}

function fillTenantForm(tenant) {
  if (!tenant) return;
  el.tenantName.value = tenant.name || '';
  el.businessPhone.value = tenant.waba?.businessPhone || '';
  el.wabaId.value = tenant.waba?.wabaId || '';
  el.phoneNumberId.value = tenant.waba?.phoneNumberId || '';
  el.accessToken.value = tenant.waba?.accessToken || '';
}

function fillLaunchForm(launch) {
  if (!launch) return;
  const checklist = launch.checklist || {};

  el.gateOtp.checked = Boolean(checklist.otpReachable);
  el.gateBm2fa.checked = Boolean(checklist.bmRole2faReady);
  el.gateWebhook.checked = Boolean(checklist.webhookVerified);
  el.gateTemplate.checked = Boolean(checklist.templateApproved);
  el.gateSmoke.checked = Boolean(checklist.smokeInboundOutboundPassed);

  el.launchPhase.value = launch.phase || 'STAGE_TEST_NUMBER';
  el.noGoCampaign.checked = Boolean(launch.noGoCampaign);
  el.outboundPaused.checked = Boolean(launch.outboundPaused);

  const missing = Array.isArray(launch.missing) ? launch.missing : [];
  if (launch.ready) {
    el.launchStatus.textContent = `Launch readiness: READY | Phase: ${launch.phase} | Campaign lock: ${launch.noGoCampaign ? 'ON' : 'OFF'} | Outbound pause: ${launch.outboundPaused ? 'ON' : 'OFF'}`;
    el.launchStatus.classList.remove('danger');
  } else {
    el.launchStatus.textContent = `Launch readiness: NOT READY | Missing: ${missing.join(' | ') || 'Unknown gates'}`;
    el.launchStatus.classList.add('danger');
  }
}

function setActiveChatMeta(conv) {
  if (!conv) {
    el.chatTitle.textContent = 'Select a chat';
    el.chatSubtitle.textContent = 'Messages are synced from WhatsApp webhooks';
    el.chatAvatar.textContent = 'IR';
    return;
  }
  const title = conv.profileName || conv.waId;
  const tags = [];
  if (conv.optedOut) tags.push('OPTED OUT');
  if (conv.explicitOptIn) tags.push('CAMPAIGN OPT-IN');
  const suffix = tags.length ? ` • ${tags.join(' • ')}` : '';
  el.chatTitle.textContent = title;
  el.chatSubtitle.textContent = `${conv.waId}${conv.lastMessageAt ? ` • Last: ${formatTime(conv.lastMessageAt)}` : ''}${suffix}`;
  el.chatAvatar.textContent = initials(title);
}

function conversationItem(conv) {
  const div = document.createElement('div');
  div.className = `list-item ${state.activeWaId === conv.waId ? 'active' : ''}`;

  const unreadBadge = conv.unreadCount > 0
    ? `<span class="chat-badge">${conv.unreadCount}</span>`
    : '';

  const optOutBadge = conv.optedOut
    ? '<span class="chat-optout">opted out</span>'
    : '';
  const optInBadge = conv.explicitOptIn
    ? '<span class="chat-optin">opted-in</span>'
    : '';

  div.innerHTML = `
    <div class="chat-avatar">${initials(conv.profileName || conv.waId)}</div>
    <div class="chat-row-main">
      <strong>${conv.profileName || conv.waId}</strong>
      <small>${conv.lastMessagePreview || 'No messages yet'}</small>
    </div>
    <div class="chat-row-meta">
      <span class="chat-time">${formatTime(conv.lastMessageAt)}</span>
      ${optOutBadge}
      ${optInBadge}
      ${unreadBadge}
    </div>
  `;

  div.onclick = async () => {
    state.activeWaId = conv.waId;
    el.sendTo.value = conv.waId;
    setActiveChatMeta(conv);
    renderConversationList();
    await refreshMessages();
  };

  return div;
}

function renderConversationList() {
  const q = (el.chatSearch?.value || '').toLowerCase().trim();
  const filtered = state.conversations.filter((conv) => {
    const hay = `${conv.profileName || ''} ${conv.waId || ''} ${conv.lastMessagePreview || ''}`.toLowerCase();
    return !q || hay.includes(q);
  });

  el.conversations.innerHTML = '';
  filtered.forEach((c) => el.conversations.appendChild(conversationItem(c)));
}

function messageRow(m) {
  const div = document.createElement('div');
  div.className = `msg ${m.direction === 'INBOUND' ? 'in' : m.direction === 'OUTBOUND' ? 'out' : 'sys'}`;

  const body = document.createElement('div');
  body.textContent = m.body;
  div.appendChild(body);

  const attachments = Array.isArray(m.meta?.attachments) ? m.meta.attachments : [];
  if (attachments.length) {
    const list = document.createElement('div');
    list.className = 'msg-attachments';
    list.innerHTML = attachments
      .map((a) => `<span class="msg-attachment-item">📎 ${a.name}</span>`)
      .join('');
    div.appendChild(list);
  }

  const time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = formatTime(m.timestamp);

  div.appendChild(time);
  return div;
}

function renderIncidents(incidents = []) {
  el.incidentList.innerHTML = '';
  if (!incidents.length) {
    el.incidentList.textContent = 'No incidents logged.';
    return;
  }

  incidents.slice(0, 12).forEach((inc) => {
    const row = document.createElement('div');
    row.className = 'incident-row';
    row.innerHTML = `
      <strong>${inc.type || 'INCIDENT'} (${inc.severity || 'WARN'})</strong>
      <small>${inc.reason || '-'}</small>
      <small>${formatDateTime(inc.createdAt)}</small>
    `;
    el.incidentList.appendChild(row);
  });
}

function irisRow(text, cls) {
  const div = document.createElement('div');
  div.className = `iris-row ${cls}`;
  div.textContent = text;
  el.irisMessages.appendChild(div);
  el.irisMessages.scrollTop = el.irisMessages.scrollHeight;
}

async function refreshTenants() {
  const { tenants } = await api('/api/tenants');
  state.tenants = tenants;
  renderTenantSelect();

  const current = tenants.find((t) => t.id === state.tenantId) || tenants[0];
  if (current) {
    state.tenantId = current.id;
    fillTenantForm(current);
  }
}

async function refreshLaunchSafety() {
  if (!state.tenantId) return;
  const data = await api(`/api/tenants/${state.tenantId}/launch`);
  state.launch = data.launch;
  fillLaunchForm(data.launch);
}

async function refreshIncidents() {
  if (!state.tenantId) return;
  const { incidents } = await api(`/api/tenants/${state.tenantId}/incidents`);
  renderIncidents(incidents || []);
}

async function refreshConversations() {
  if (!state.tenantId) return;
  const { conversations } = await api(`/api/tenants/${state.tenantId}/conversations`);
  state.conversations = conversations;

  if (state.activeWaId && !conversations.some((c) => c.waId === state.activeWaId)) {
    state.activeWaId = null;
    el.messages.innerHTML = '';
  }

  const activeConv = conversations.find((c) => c.waId === state.activeWaId) || null;
  setActiveChatMeta(activeConv);
  renderConversationList();
}

async function refreshMessages() {
  if (!state.tenantId || !state.activeWaId) return;
  const { messages } = await api(`/api/tenants/${state.tenantId}/conversations/${encodeURIComponent(state.activeWaId)}/messages`);
  el.messages.innerHTML = '';
  messages.forEach((m) => el.messages.appendChild(messageRow(m)));
  el.messages.scrollTop = el.messages.scrollHeight;
}

async function runIris() {
  if (!state.tenantId) return;
  const prompt = el.irisInput.value.trim();
  if (!prompt) return;
  irisRow(prompt, 'iris-user');
  el.irisInput.value = '';

  try {
    const data = await api(`/api/tenants/${state.tenantId}/iris`, {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });

    irisRow(data.result?.reply || 'Done.', 'iris-bot');
    await refreshTenants();
    await refreshLaunchSafety();
    await refreshConversations();
    await refreshIncidents();
    if (state.activeWaId) await refreshMessages();
  } catch (e) {
    irisRow(`Error: ${e.message}`, 'iris-bot');
  }
}

async function sendText() {
  if (!state.tenantId || state.isSending) return;
  const to = el.sendTo.value.trim();
  const text = el.sendText.value.trim();
  const mode = el.sendMode?.value || 'SERVICE';
  const attachments = state.pendingAttachments.map(({ id: _id, lastModified: _lm, ...rest }) => rest);

  if (!to || (!text && attachments.length === 0)) return;

  try {
    setSendBusy(true);
    await api(`/api/tenants/${state.tenantId}/messages/send`, {
      method: 'POST',
      body: JSON.stringify({ to, text, mode, attachments })
    });

    el.sendText.value = '';
    autoResizeTextarea(el.sendText);
    state.pendingAttachments = [];
    renderAttachmentTray();

    state.activeWaId = to;
    await refreshConversations();
    await refreshMessages();
  } catch (e) {
    alert(e.message);
  } finally {
    setSendBusy(false);
  }
}

async function saveWabaConfig() {
  if (!state.tenantId) return;
  try {
    await api(`/api/tenants/${state.tenantId}/waba`, {
      method: 'PUT',
      body: JSON.stringify({
        name: el.tenantName.value.trim(),
        waba: {
          wabaId: el.wabaId.value.trim(),
          phoneNumberId: el.phoneNumberId.value.trim(),
          businessPhone: el.businessPhone.value.trim(),
          accessToken: el.accessToken.value.trim()
        }
      })
    });

    await refreshTenants();
    await refreshLaunchSafety();
    alert('WABA config saved.');
  } catch (e) {
    alert(e.message);
  }
}

async function completeMetaSignup({ code, stateToken, tenantId, wabaId = '', phoneNumberId = '', businessPhone = '' }) {
  const targetTenantId = tenantId || state.metaPendingTenantId || state.tenantId;
  if (!targetTenantId) {
    setMetaStatus('Meta callback received but no tenant is selected.', 'danger');
    return;
  }

  if (!code || !stateToken) {
    setMetaStatus('Meta callback is missing authorization code/state. Please retry onboarding.', 'danger');
    return;
  }

  try {
    setMetaStatus('Completing Meta onboarding and syncing WhatsApp credentials...');
    const data = await api(`/api/tenants/${targetTenantId}/meta/embedded-signup/complete`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        state: stateToken,
        wabaId,
        phoneNumberId,
        businessPhone
      })
    });

    state.metaPendingTenantId = null;
    state.tenantId = data?.tenant?.id || targetTenantId;

    await refreshTenants();
    el.tenantSelect.value = state.tenantId;
    await onTenantChanged();

    const discovered = data?.meta?.discovered || {};
    const resolvedWaba = discovered.wabaId || data?.tenant?.waba?.wabaId || '(pending)';
    const resolvedPhone = discovered.phoneNumberId || data?.tenant?.waba?.phoneNumberId || '(pending)';
    setMetaStatus(`Meta connected. WABA: ${resolvedWaba} | Phone Number ID: ${resolvedPhone}`, 'success');
  } catch (e) {
    setMetaStatus(`Meta onboarding failed: ${e.message}`, 'danger');
  }
}

async function startMetaSignup() {
  if (!state.tenantId) {
    alert('Create or select a tenant first.');
    return;
  }

  try {
    setMetaStatus('Opening Meta onboarding window...');
    const data = await api(`/api/tenants/${state.tenantId}/meta/embedded-signup/start`, {
      method: 'POST'
    });
    state.metaPendingTenantId = state.tenantId;

    const popup = window.open(
      data.authUrl,
      'omega_meta_embedded_signup',
      'popup=yes,width=720,height=780,resizable=yes,scrollbars=yes'
    );

    if (!popup) {
      setMetaStatus('Popup was blocked. Redirecting this tab to Meta onboarding...');
      window.location.href = data.authUrl;
      return;
    }

    setMetaStatus('Meta window opened. Finish setup there and we will sync automatically.');
  } catch (e) {
    setMetaStatus(`Unable to start Meta onboarding: ${e.message}`, 'danger');
  }
}

async function saveLaunchSafety() {
  if (!state.tenantId) return;

  try {
    await api(`/api/tenants/${state.tenantId}/launch`, {
      method: 'PUT',
      body: JSON.stringify({
        launch: {
          phase: el.launchPhase.value,
          noGoCampaign: Boolean(el.noGoCampaign.checked),
          outboundPaused: Boolean(el.outboundPaused.checked),
          checklist: {
            otpReachable: Boolean(el.gateOtp.checked),
            bmRole2faReady: Boolean(el.gateBm2fa.checked),
            webhookVerified: Boolean(el.gateWebhook.checked),
            templateApproved: Boolean(el.gateTemplate.checked),
            smokeInboundOutboundPassed: Boolean(el.gateSmoke.checked)
          }
        }
      })
    });

    await refreshTenants();
    await refreshLaunchSafety();
    alert('Launch safety updated.');
  } catch (e) {
    alert(e.message);
  }
}

async function createTenant() {
  try {
    await api('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({
        name: el.tenantName.value.trim() || 'New Tenant',
        lifecycle: 'ONBOARDING',
        tier: 'TIER_1',
        qualityRating: 'UNKNOWN',
        launch: {
          ownershipModel: 'CLIENT_OWNED',
          transport: 'META_DIRECT',
          voiceProvider: 'ELEVENLABS_OPTIONAL',
          phase: 'STAGE_TEST_NUMBER',
          noGoCampaign: true
        }
      })
    });

    await refreshTenants();
    await refreshLaunchSafety();
    await refreshConversations();
  } catch (e) {
    alert(e.message);
  }
}

async function loadTierPlan() {
  if (!state.tenantId) return;
  try {
    const data = await api(`/api/tenants/${state.tenantId}/tier-plan`);
    el.tierOut.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    el.tierOut.textContent = e.message;
  }
}

async function loadConfig() {
  try {
    const cfg = await api('/api/config');
    state.config = cfg;
    const strict = cfg.strictMode ? 'ON' : 'OFF';
    el.configInfo.textContent = `Webhook: ${cfg.webhookUrl} | Strict Guardrails: ${strict}`;
    el.webhookHint.textContent = `Meta webhook verify token: ${cfg.verifyToken || '(set WABA_VERIFY_TOKEN)'} | URL: ${cfg.webhookUrl} | Service window: ${cfg.serviceWindowHours}h`;
    const metaEnabled = Boolean(cfg?.metaEmbeddedSignup?.enabled);
    if (el.connectMetaBtn) {
      el.connectMetaBtn.disabled = !metaEnabled;
      if (!metaEnabled) {
        setMetaStatus('Meta embedded signup is not configured on server. Set OMEGA_META_APP_ID and OMEGA_META_APP_SECRET.', 'danger');
      } else {
        setMetaStatus('Ready. Click Continue with Meta to connect your WhatsApp Business setup.');
      }
    }
  } catch {
    // ignore config errors in UI
  }
}

async function onTenantChanged() {
  const tenant = state.tenants.find((t) => t.id === state.tenantId);
  fillTenantForm(tenant);
  state.activeWaId = null;
  el.messages.innerHTML = '';

  await Promise.all([
    refreshConversations(),
    refreshLaunchSafety(),
    refreshIncidents()
  ]);
}

function consumeMetaCallbackQuery() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('meta_code') || '';
  const stateToken = params.get('meta_state') || '';
  const error = params.get('meta_error') || '';
  const errorDescription = params.get('meta_error_description') || '';

  if (code || stateToken || error) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  return { code, stateToken, error, errorDescription };
}

function parseFacebookEventData(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') return raw;
  return null;
}

function wireMetaCallbackListener() {
  window.addEventListener('message', async (event) => {
    if (event.origin !== window.location.origin) return;
    const payload = parseFacebookEventData(event.data);
    if (!payload || payload.source !== 'omega-meta-callback') return;

    if (payload.error) {
      const message = payload.errorDescription || payload.error || 'Meta onboarding was cancelled.';
      setMetaStatus(`Meta onboarding stopped: ${message}`, 'danger');
      return;
    }

    await completeMetaSignup({
      code: payload.code || '',
      stateToken: payload.state || '',
      tenantId: state.metaPendingTenantId || state.tenantId,
      wabaId: payload.waba_id || payload.wabaId || '',
      phoneNumberId: payload.phone_number_id || payload.phoneNumberId || '',
      businessPhone: payload.display_phone_number || payload.businessPhone || ''
    });
  });
}

function attachEvents() {
  el.tenantSelect.onchange = async () => {
    state.tenantId = el.tenantSelect.value;
    await onTenantChanged();
  };

  el.chatSearch.oninput = () => {
    renderConversationList();
  };

  el.createTenantBtn.onclick = createTenant;
  el.saveWabaBtn.onclick = saveWabaConfig;
  if (el.connectMetaBtn) el.connectMetaBtn.onclick = startMetaSignup;
  el.saveLaunchBtn.onclick = saveLaunchSafety;
  el.refreshLaunchBtn.onclick = async () => {
    await refreshLaunchSafety();
    await refreshIncidents();
  };

  el.sendBtn.onclick = sendText;
  el.sendText.oninput = () => autoResizeTextarea(el.sendText);
  el.sendText.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };
  el.sendText.onpaste = (e) => {
    const files = e.clipboardData?.files;
    if (files?.length) addSelectedFiles(files);
  };

  el.irisSend.onclick = runIris;
  el.tierBtn.onclick = loadTierPlan;

  if (el.attachBtn && el.attachInput) {
    el.attachBtn.onclick = () => el.attachInput.click();
    el.attachInput.onchange = (e) => {
      addSelectedFiles(e.target.files);
      el.attachInput.value = '';
    };
  }

  if (el.composer) {
    el.composer.ondragover = (e) => {
      e.preventDefault();
      el.composer.classList.add('composer-drop-active');
    };
    el.composer.ondragleave = (e) => {
      if (!el.composer.contains(e.relatedTarget)) {
        el.composer.classList.remove('composer-drop-active');
      }
    };
    el.composer.ondrop = (e) => {
      e.preventDefault();
      el.composer.classList.remove('composer-drop-active');
      const files = e.dataTransfer?.files;
      if (files?.length) addSelectedFiles(files);
    };
  }
}

async function init() {
  attachEvents();
  wireMetaCallbackListener();
  renderAttachmentTray();
  autoResizeTextarea(el.sendText);

  await loadConfig();
  await refreshTenants();
  await onTenantChanged();

  const callbackData = consumeMetaCallbackQuery();
  if (callbackData.error) {
    setMetaStatus(`Meta onboarding stopped: ${callbackData.errorDescription || callbackData.error}`, 'danger');
  } else if (callbackData.code && callbackData.stateToken) {
    await completeMetaSignup({
      code: callbackData.code,
      stateToken: callbackData.stateToken,
      tenantId: state.metaPendingTenantId || state.tenantId
    });
  }

  setInterval(async () => {
    await refreshConversations();
    if (state.activeWaId) await refreshMessages();
  }, 5000);

  setInterval(async () => {
    await refreshLaunchSafety();
    await refreshIncidents();
  }, 15000);
}

init();
