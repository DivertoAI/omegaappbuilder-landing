'use client';

import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type AuthMode = 'signup' | 'login';

type Plan = {
  id: 'omega_limited_9999' | 'omega_limited_29999' | 'omega_unlimited_49999';
  name: string;
  price: string;
  tagline: string;
  monthlyTokens: string;
};

type UsageSnapshot = {
  status: 'active' | 'inactive';
  usedTokens: number;
  tokenCap: number | null;
  remainingTokens: number | null;
  planName: string | null;
  cycleStartsAt: string | null;
  cycleEndsAt: string | null;
};

const PLANS: Plan[] = [
  {
    id: 'omega_limited_9999',
    name: 'Limited 9,999',
    price: 'INR 9,999/mo',
    tagline: 'Best to launch and test production workloads',
    monthlyTokens: '388,000,000 tokens/month',
  },
  {
    id: 'omega_limited_29999',
    name: 'Limited 29,999',
    price: 'INR 29,999/mo',
    tagline: 'High-volume API usage with larger monthly capacity',
    monthlyTokens: '1,165,000,000 tokens/month',
  },
  {
    id: 'omega_unlimited_49999',
    name: 'Unlimited 49,999',
    price: 'INR 49,999/mo',
    tagline: 'No monthly token cap for continuous operations',
    monthlyTokens: 'Truly unlimited',
  },
];

const MODEL_GUIDE = [
  {
    id: 'omega-fast-default',
    label: 'Omega Fast',
    speedTier: 'Fast',
    bestFor: 'Default production chat, customer support, and most assistant tasks.',
    benefit: 'Balanced latency and quality for day-to-day workloads.',
  },
  {
    id: 'omega-fast-instant',
    label: 'Omega Fast Instant',
    speedTier: 'Fast',
    bestFor: 'Short replies, routing, intent checks, and high-throughput automations.',
    benefit: 'Lowest latency for quick responses at scale.',
  },
  {
    id: 'omega-slow-long',
    label: 'Omega Slow Long',
    speedTier: 'Slow',
    bestFor: 'Long prompts, large context windows, and extended sessions.',
    benefit: 'Better handling of large context and long-form continuity.',
  },
  {
    id: 'omega-slow-pro',
    label: 'Omega Slow Pro',
    speedTier: 'Slow',
    bestFor: 'Harder reasoning, multi-step analysis, and precision outputs.',
    benefit: 'Higher capability for complex request quality.',
  },
  {
    id: 'omega-slow-max',
    label: 'Omega Slow Max',
    speedTier: 'Slow',
    bestFor: 'Most complex requests requiring maximum capability and long context.',
    benefit: 'Best quality ceiling when accuracy matters more than speed.',
  },
];

const ENDPOINT_GUIDE = [
  {
    method: 'GET',
    path: '/health',
    auth: 'No',
    purpose: 'Service status and payment-provider health.',
  },
  {
    method: 'GET',
    path: '/v1/plans',
    auth: 'No',
    purpose: 'Available pricing plans and billing metadata.',
  },
  {
    method: 'POST',
    path: '/v1/auth/signup',
    auth: 'No',
    purpose: 'Create account and receive session + API key.',
  },
  {
    method: 'POST',
    path: '/v1/auth/login',
    auth: 'No',
    purpose: 'Log in and receive session + API key.',
  },
  {
    method: 'GET',
    path: '/v1/account',
    auth: 'Session',
    purpose: 'View subscription, plan, usage, and tokens left.',
  },
  {
    method: 'POST',
    path: '/v1/payments/create',
    auth: 'Session',
    purpose: 'Create a payment order for selected plan.',
  },
  {
    method: 'POST',
    path: '/v1/payments/confirm',
    auth: 'Session',
    purpose: 'Confirm payment and activate subscription.',
  },
  {
    method: 'GET',
    path: '/v1/models',
    auth: 'API key',
    purpose: 'Fetch model catalog with speed tiers and labels.',
  },
  {
    method: 'POST',
    path: '/v1/chat/completions',
    auth: 'API key',
    purpose: 'OpenAI-style chat completion endpoint.',
    body: '{"model":"omega-fast-default","messages":[{"role":"user","content":"Hello"}]}',
  },
];

const GO_LIVE_CHECKLIST = [
  'Set production API base URL and verify DNS/TLS.',
  'Enable Razorpay mode on server and configure key id + secret.',
  'Test full flow: signup -> payment create -> payment confirm -> completion.',
  'Verify /v1/account usage updates after real chat requests.',
  'Set monitoring/alerts for 5xx, 402, and timeout spikes.',
];

const ERROR_GUIDE = [
  {
    code: '401 unauthorized',
    reason: 'Missing/invalid session token or API key.',
    fix: 'Use `Authorization: Bearer <session_token>` for account/payment and `x-api-key` for completions.',
  },
  {
    code: '402 payment_required',
    reason: 'No active subscription or token cap reached on limited plan.',
    fix: 'Activate/renew plan and check remaining tokens via `/v1/account`.',
  },
  {
    code: '400 invalid_request_error',
    reason: 'Unknown model or malformed payload.',
    fix: 'Use a valid model from `/v1/models` and include non-empty `messages` array.',
  },
  {
    code: '504 timeout_error',
    reason: 'Model engine timed out for current request.',
    fix: 'Retry with smaller prompt or move task to a faster model.',
  },
];

const DEFAULT_BASE_URL = 'https://server.omegaappbuilder.com';
const TOKEN_FORMATTER = new Intl.NumberFormat('en-IN');

const toNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const formatTokens = (value: number | null) => {
  if (value === null) return '--';
  return TOKEN_FORMATTER.format(Math.max(0, Math.floor(value)));
};

const formatCycleEnd = (value: string | null) => {
  if (!value) return 'Not available';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not available';
  return parsed.toLocaleString('en-IN');
};

const formatCycleWindow = (start: string | null, end: string | null) => {
  if (!start || !end) return 'Not available';
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 'Not available';
  return `${startDate.toLocaleDateString('en-IN')} - ${endDate.toLocaleDateString('en-IN')}`;
};

const daysLeftInCycle = (end: string | null) => {
  if (!end) return null;
  const endDate = new Date(end).getTime();
  if (!Number.isFinite(endDate)) return null;
  const diffMs = endDate - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
};

const normalizeError = async (response: Response) => {
  const text = await response.text();
  if (!text) return `Request failed (${response.status})`;
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (typeof parsed.error === 'string') return parsed.error;
    if (parsed.error && typeof parsed.error === 'object') {
      const nested = parsed.error as Record<string, unknown>;
      if (typeof nested.message === 'string') return nested.message;
    }
    if (typeof parsed.message === 'string') return parsed.message;
    return `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

export default function OmegaChatApiClient() {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [selectedPlan, setSelectedPlan] = useState<Plan['id']>('omega_limited_9999');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [sessionToken, setSessionToken] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [accountActive, setAccountActive] = useState(false);
  const [usage, setUsage] = useState<UsageSnapshot>({
    status: 'inactive',
    usedTokens: 0,
    tokenCap: null,
    remainingTokens: null,
    planName: null,
    cycleStartsAt: null,
    cycleEndsAt: null,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lastUsageSyncAt, setLastUsageSyncAt] = useState<string | null>(null);

  const [paymentBusy, setPaymentBusy] = useState(false);

  const selectedPlanMeta = useMemo(
    () => PLANS.find((plan) => plan.id === selectedPlan) || PLANS[0],
    [selectedPlan]
  );

  const baseUrl = process.env.NEXT_PUBLIC_OMEGA_CHAT_API_BASE_URL || DEFAULT_BASE_URL;

  const authReady = Boolean(sessionToken && apiKey);
  const canCheckout = authReady && !paymentBusy;
  const usagePercent =
    usage.tokenCap && usage.tokenCap > 0
      ? Math.max(0, Math.min(100, Math.round((usage.usedTokens / usage.tokenCap) * 100)))
      : null;
  const sessionTokenPreview = sessionToken || 'oc_your_session_token';
  const apiKeyPreview = apiKey || 'sk_omega_your_api_key';

  const curlSnippet = useMemo(() => {
    if (!apiKey) return '';
    return [
      `curl -X POST ${baseUrl}/v1/chat/completions \\\n  -H "x-api-key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{`,
      '    "model": "omega-fast-default",',
      '    "messages": [{"role":"user","content":"Say hello in one line"}]',
      "  }'",
    ].join('\n');
  }, [apiKey, baseUrl]);

  const accountCurlSnippet = useMemo(
    () =>
      [
        `curl -X GET ${baseUrl}/v1/account \\`,
        `  -H "Authorization: Bearer ${sessionTokenPreview}"`,
      ].join('\n'),
    [baseUrl, sessionTokenPreview]
  );

  const modelsCurlSnippet = useMemo(
    () =>
      [
        `curl -X GET ${baseUrl}/v1/models \\`,
        `  -H "x-api-key: ${apiKeyPreview}"`,
      ].join('\n'),
    [apiKeyPreview, baseUrl]
  );

  const signupCurlSnippet = useMemo(
    () =>
      [
        `curl -X POST ${baseUrl}/v1/auth/signup \\`,
        '  -H "Content-Type: application/json" \\',
        '  -d \'{"name":"Your Name","email":"you@company.com","password":"StrongPass123"}\'',
      ].join('\n'),
    [baseUrl]
  );

  const paymentCreateCurlSnippet = useMemo(
    () =>
      [
        `curl -X POST ${baseUrl}/v1/payments/create \\`,
        `  -H "Authorization: Bearer ${sessionTokenPreview}" \\`,
        '  -H "Content-Type: application/json" \\',
        `  -d '{"plan_id":"${selectedPlan}"}'`,
      ].join('\n'),
    [baseUrl, selectedPlan, sessionTokenPreview]
  );

  const paymentConfirmCurlSnippet = useMemo(
    () =>
      [
        `curl -X POST ${baseUrl}/v1/payments/confirm \\`,
        `  -H "Authorization: Bearer ${sessionTokenPreview}" \\`,
        '  -H "Content-Type: application/json" \\',
        "  -d '{\"payment_id\":\"pay_your_id\",\"provider_order_id\":\"order_x\",\"provider_payment_id\":\"pay_x\",\"provider_signature\":\"sig_x\"}'",
      ].join('\n'),
    [baseUrl, sessionTokenPreview]
  );

  const checkAccount = async (token: string) => {
    try {
      const response = await fetch('/api/omega-chat/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      });

      if (!response.ok) {
        setAccountActive(false);
        setUsage({
          status: 'inactive',
          usedTokens: 0,
          tokenCap: null,
          remainingTokens: null,
          planName: null,
          cycleStartsAt: null,
          cycleEndsAt: null,
        });
        return;
      }

      const payload = (await response.json()) as {
        subscription?: {
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
        } | null;
        plan?: { name?: string | null } | null;
        usage?: {
          status?: string;
          used_tokens?: number | string | null;
          token_cap?: number | string | null;
          remaining_tokens?: number | string | null;
        } | null;
      };

      setAccountActive(payload.subscription?.status === 'active');
      setUsage({
        status: payload.usage?.status === 'active' ? 'active' : 'inactive',
        usedTokens: Math.max(0, toNumber(payload.usage?.used_tokens) || 0),
        tokenCap: toNumber(payload.usage?.token_cap),
        remainingTokens: toNumber(payload.usage?.remaining_tokens),
        planName: payload.plan?.name || null,
        cycleStartsAt: payload.subscription?.current_period_start || null,
        cycleEndsAt: payload.subscription?.current_period_end || null,
      });
      setLastUsageSyncAt(new Date().toISOString());
    } catch {
      setAccountActive(false);
      setUsage({
        status: 'inactive',
        usedTokens: 0,
        tokenCap: null,
        remainingTokens: null,
        planName: null,
        cycleStartsAt: null,
        cycleEndsAt: null,
      });
    }
  };

  useEffect(() => {
    if (!sessionToken) return;
    const timer = setInterval(() => {
      void checkAccount(sessionToken);
    }, 30000);
    return () => clearInterval(timer);
  }, [sessionToken]);

  const handleAuth = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const url = authMode === 'signup' ? '/api/omega-chat/auth/signup' : '/api/omega-chat/auth/login';
      const body =
        authMode === 'signup'
          ? { name: name.trim() || 'Omega User', email: email.trim(), password }
          : { email: email.trim(), password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await normalizeError(response);
        setStatus('error');
        setMessage(errorText);
        return;
      }

      const payload = (await response.json()) as {
        session_token?: string;
        api_key?: string;
      };

      const token = payload.session_token || '';
      const key = payload.api_key || '';

      if (!token || !key) {
        setStatus('error');
        setMessage('Auth succeeded but token payload is incomplete.');
        return;
      }

      setSessionToken(token);
      setApiKey(key);
      await checkAccount(token);

      setStatus('success');
      setMessage('Account ready. Continue to payment to activate API access.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Auth request failed');
    }
  };

  const handleCheckout = async () => {
    if (!sessionToken) {
      setStatus('error');
      setMessage('Please sign up or log in first.');
      return;
    }

    setPaymentBusy(true);
    setMessage('Creating payment order...');

    try {
      const createResponse = await fetch('/api/omega-chat/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          planId: selectedPlan,
        }),
      });

      if (!createResponse.ok) {
        const errorText = await normalizeError(createResponse);
        setStatus('error');
        setMessage(errorText);
        setPaymentBusy(false);
        return;
      }

      const payload = (await createResponse.json()) as {
        payment?: { id?: string };
        checkout?: {
          provider?: string;
          key_id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          name?: string;
          description?: string;
          prefill?: { name?: string; email?: string };
        };
      };

      const paymentId = payload.payment?.id || '';
      const checkout = payload.checkout;

      if (!paymentId || !checkout) {
        setStatus('error');
        setMessage('Payment order was created but checkout payload is missing.');
        setPaymentBusy(false);
        return;
      }

      if (checkout.provider === 'mock') {
        const confirmResponse = await fetch('/api/omega-chat/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken,
            paymentId,
            simulateSuccess: true,
          }),
        });

        if (!confirmResponse.ok) {
          const errorText = await normalizeError(confirmResponse);
          setStatus('error');
          setMessage(errorText);
          setPaymentBusy(false);
          return;
        }

        await checkAccount(sessionToken);
        setStatus('success');
        setMessage('Payment verified. Your auth token is now active for chat completions.');
        setPaymentBusy(false);
        return;
      }

      if (checkout.provider !== 'razorpay') {
        setStatus('error');
        setMessage(
          'Unsupported payment provider on API server. Configure Razorpay for production checkout.'
        );
        setPaymentBusy(false);
        return;
      }

      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        setStatus('error');
        setMessage('Razorpay SDK did not load. Refresh and try again.');
        setPaymentBusy(false);
        return;
      }

      const checkoutInstance = new Razorpay({
        key: checkout.key_id,
        order_id: checkout.order_id,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.name || 'Omega Chat API',
        description: checkout.description || `${selectedPlanMeta.name} subscription`,
        prefill: {
          name: checkout.prefill?.name || name || undefined,
          email: checkout.prefill?.email || email || undefined,
        },
        theme: { color: '#d946ef' },
        handler: async (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          try {
            const confirmResponse = await fetch('/api/omega-chat/payments/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionToken,
                paymentId,
                providerOrderId: response.razorpay_order_id,
                providerPaymentId: response.razorpay_payment_id,
                providerSignature: response.razorpay_signature,
              }),
            });

            if (!confirmResponse.ok) {
              const errorText = await normalizeError(confirmResponse);
              setStatus('error');
              setMessage(errorText);
              setPaymentBusy(false);
              return;
            }

            await checkAccount(sessionToken);
            setStatus('success');
            setMessage('Payment verified. Your auth token is now active for chat completions.');
            setPaymentBusy(false);
          } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Payment confirmation failed');
            setPaymentBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentBusy(false);
            if (status !== 'success') {
              setMessage('Checkout closed before completion.');
            }
          },
        },
      });

      checkoutInstance.open();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start checkout');
      setPaymentBusy(false);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage('Copied to clipboard.');
      setStatus('success');
    } catch {
      setStatus('error');
      setMessage('Unable to copy automatically.');
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-600">Product</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Omega Chat Completion API
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Go live in minutes: create account, pay securely with Razorpay, copy your auth token, and call the API.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Value basis: token delivery at 0.7 INR for 1 INR GPT-equivalent benchmark value (about 42.9% higher
              token value).
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Step 1 — Choose a plan</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`rounded-xl border px-3 py-3 text-left transition ${
                        selectedPlan === plan.id
                          ? 'border-fuchsia-300 bg-white shadow-sm'
                          : 'border-slate-200 bg-white hover:border-fuchsia-200'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{plan.price}</p>
                      <p className="mt-1 text-xs font-semibold text-indigo-700">{plan.monthlyTokens}</p>
                      <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Step 2 — Sign up or log in</p>
                <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs">
                  {(['signup', 'login'] as AuthMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAuthMode(mode)}
                      className={`rounded-full px-3 py-1 font-semibold transition ${
                        authMode === mode ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-slate-500'
                      }`}
                    >
                      {mode === 'signup' ? 'Sign up' : 'Log in'}
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {authMode === 'signup' && (
                    <label className="grid gap-1 text-sm sm:col-span-2">
                      <span className="text-slate-700">Full name</span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      />
                    </label>
                  )}

                  <label className="grid gap-1 text-sm sm:col-span-2">
                    <span className="text-slate-700">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </label>

                  <label className="grid gap-1 text-sm sm:col-span-2">
                    <span className="text-slate-700">Password</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={status === 'loading'}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-60"
                >
                  {status === 'loading'
                    ? 'Processing...'
                    : authMode === 'signup'
                    ? 'Create account'
                    : 'Log in'}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Step 3 — Pay with Razorpay</p>
                <p className="mt-1 text-xs text-slate-500">
                  Selected plan: <span className="font-semibold text-slate-700">{selectedPlanMeta.price}</span>
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {paymentBusy ? 'Opening checkout...' : 'Pay securely via Razorpay'}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`mt-5 rounded-xl border px-3 py-2 text-sm ${
                  status === 'error'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {message}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Step 4</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Get your auth token</h2>
              <p className="mt-2 text-sm text-slate-600">
                After payment, use this API key as `x-api-key` for chat completions.
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">API key</p>
                <code className="mt-1 block break-all text-xs text-slate-900">
                  {apiKey || 'Generate after signup/login'}
                </code>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!apiKey}
                  onClick={() => copyToClipboard(apiKey)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Copy API key
                </button>
                <button
                  type="button"
                  disabled={!sessionToken}
                  onClick={() => copyToClipboard(sessionToken)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Copy session token
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">cURL quick start</p>
                <pre className="overflow-x-auto whitespace-pre-wrap">{curlSnippet || 'Token appears here after auth.'}</pre>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">Activation checklist</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${authReady ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Account authenticated
                </li>
                <li className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${accountActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Subscription active
                </li>
                <li className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${Boolean(apiKey) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  API key available
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Usage tracker</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    See total usage and remaining tokens for your active billing cycle.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!sessionToken}
                  onClick={() => checkAccount(sessionToken)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Used</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatTokens(usage.usedTokens)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Left</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {usage.status === 'active' && usage.tokenCap === null
                      ? 'Unlimited'
                      : formatTokens(usage.remainingTokens)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Monthly cap</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {usage.status === 'active' && usage.tokenCap === null ? 'Unlimited' : formatTokens(usage.tokenCap)}
                  </p>
                </div>
              </div>

              {usagePercent !== null && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{usagePercent}% of monthly cap used</p>
                </div>
              )}

              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p>Plan: {usage.planName || 'Not active yet'}</p>
                <p>Monthly cycle: {formatCycleWindow(usage.cycleStartsAt, usage.cycleEndsAt)}</p>
                <p>Billing cycle ends: {formatCycleEnd(usage.cycleEndsAt)}</p>
                <p>
                  Days left this cycle:{' '}
                  {daysLeftInCycle(usage.cycleEndsAt) === null ? 'Not available' : daysLeftInCycle(usage.cycleEndsAt)}
                </p>
                <p>Last synced: {lastUsageSyncAt ? new Date(lastUsageSyncAt).toLocaleString('en-IN') : 'Not yet'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Developer guide</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">How to use Omega Chat API</h2>
          <p className="mt-2 text-sm text-slate-600">
            End-to-end usage flow, model guidance, and endpoint contracts for quick integration.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Integration flow</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>1. Sign up or log in to receive `session_token` and `api_key`.</li>
                <li>2. Create payment for your selected plan.</li>
                <li>3. Confirm payment to activate subscription.</li>
                <li>4. Call `/v1/chat/completions` with `x-api-key`.</li>
                <li>5. Track usage and tokens left using `/v1/account`.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Auth modes</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  `Session token`: account/payment endpoints (`Authorization: Bearer &lt;session_token&gt;`).
                </li>
                <li>`API key`: inference/model endpoints (`x-api-key: &lt;api_key&gt;`).</li>
                <li>Only active paid subscriptions can call chat completions.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm font-semibold text-slate-900">Plan token commitments</p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>INR 9,999: 388,000,000 tokens/month (limited)</li>
                <li>INR 29,999: 1,165,000,000 tokens/month (limited)</li>
                <li>INR 49,999: truly unlimited (no monthly cap)</li>
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Pricing model retained as configured: 0.7 INR delivery for 1 INR GPT-equivalent benchmark value.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">Usage check</p>
              <pre className="overflow-x-auto whitespace-pre-wrap">{accountCurlSnippet}</pre>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">Model list</p>
              <pre className="overflow-x-auto whitespace-pre-wrap">{modelsCurlSnippet}</pre>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">Models and benefits</h3>
            <p className="mt-1 text-sm text-slate-600">
              Choose by speed tier first, then optimize based on quality needs.
            </p>

            <div className="mt-5 space-y-3">
              {MODEL_GUIDE.map((model) => (
                <div key={model.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{model.label}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        model.speedTier === 'Fast'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {model.speedTier}
                    </span>
                    <code className="rounded bg-white px-1.5 py-0.5 text-[11px] text-slate-700">{model.id}</code>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Best for:</span> {model.bestFor}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Benefit:</span> {model.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">Endpoint reference</h3>
            <p className="mt-1 text-sm text-slate-600">Auth requirements and purpose for each API route.</p>

            <div className="mt-5 space-y-2">
              {ENDPOINT_GUIDE.map((endpoint) => (
                <div key={`${endpoint.method}:${endpoint.path}`} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {endpoint.method}
                    </span>
                    <code className="text-xs font-semibold text-slate-900">{endpoint.path}</code>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Auth: {endpoint.auth}</p>
                  <p className="mt-1 text-sm text-slate-600">{endpoint.purpose}</p>
                  {'body' in endpoint && endpoint.body && (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Request body example
                      </p>
                      <code className="mt-1 block break-all text-[11px] text-slate-700">{endpoint.body}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-900">API test commands</h3>
            <p className="mt-1 text-sm text-slate-600">
              Use these commands to validate the complete paid access flow.
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">1) Signup</p>
                <pre className="overflow-x-auto whitespace-pre-wrap">{signupCurlSnippet}</pre>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">2) Create payment</p>
                <pre className="overflow-x-auto whitespace-pre-wrap">{paymentCreateCurlSnippet}</pre>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-100">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">3) Confirm payment</p>
                <pre className="overflow-x-auto whitespace-pre-wrap">{paymentConfirmCurlSnippet}</pre>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900">Common API errors</h3>
              <div className="mt-4 space-y-2">
                {ERROR_GUIDE.map((item) => (
                  <div key={item.code} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{item.code}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
                    <p className="mt-1 text-xs text-slate-500">Fix: {item.fix}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900">Go-live checklist</h3>
              <ol className="mt-4 space-y-2 text-sm text-slate-600">
                {GO_LIVE_CHECKLIST.map((item, index) => (
                  <li key={item}>
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
