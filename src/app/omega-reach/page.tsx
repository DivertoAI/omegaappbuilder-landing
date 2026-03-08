import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Omega Reach - WhatsApp assistant | OmegaAppBuilder',
  description:
    'Omega Reach is a WhatsApp-first assistant for auto-replies, lead capture, onboarding flows, and follow-up automation.',
  alternates: { canonical: '/omega-reach' },
  openGraph: {
    title: 'Omega Reach - WhatsApp assistant',
    description:
      'Run your full WhatsApp sales and support motion with isolated assistants, lead memory, and managed automations.',
    url: '/omega-reach',
    type: 'website',
  },
};

const highlights = [
  {
    title: 'Auto-reply with guardrails',
    description:
      'Professional replies only in your approved business context, with no internal tool disclosure and owner handoff when needed.',
  },
  {
    title: 'Lead capture + follow-up',
    description:
      'Every conversation is tracked as a lead timeline so your team can revisit intent, status, and next best action instantly.',
  },
  {
    title: 'Client onboarding by QR',
    description:
      'Clients connect their own WhatsApp using secure onboarding links and get an isolated assistant line and memory.',
  },
  {
    title: 'Tenant isolation',
    description:
      'Each client runs in isolated runtime scope with separate workspace, prompt behavior, and WhatsApp state.',
  },
  {
    title: 'Cloudflare-ready exposure',
    description:
      'Securely expose your Omega Reach backend to the internet while keeping your management endpoints protected.',
  },
];

const steps = [
  'User asks for Omega Reach in WhatsApp.',
  'Magda asks for onboarding confirmation (YES/NO).',
  'On YES, user receives customer ID and secure QR link.',
  'User scans QR from Linked Devices to connect their own number.',
  'Agent line becomes active with isolated context and policy guardrails.',
];

const corePlans = [
  {
    name: 'Starter',
    monthly: 'INR 19,999/mo',
    setup: 'INR 29,999 one-time setup',
    bestFor: 'Small clinics and local businesses',
    features: [
      '1 WhatsApp number',
      '1 brand/workspace',
      'Up to 3,000 conversations/month',
      'Basic automations + lead capture',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    monthly: 'INR 59,999/mo',
    setup: 'INR 89,999 one-time setup',
    bestFor: 'Growing teams and agencies',
    features: [
      'Up to 3 WhatsApp numbers',
      'Multi-workspace support',
      'Up to 10,000 conversations/month',
      'Advanced follow-up journeys',
      'Priority support + onboarding help',
    ],
  },
  {
    name: 'Scale',
    monthly: 'INR 1,19,999/mo',
    setup: 'INR 1,79,999 one-time setup',
    bestFor: 'Agencies and multi-location businesses',
    features: [
      'Up to 10 WhatsApp numbers',
      'Full tenant isolation + admin controls',
      'Up to 30,000 conversations/month',
      'Custom workflows + API/webhooks',
      'Dedicated success support',
    ],
  },
];

const enterpriseWabaPlans = [
  {
    name: 'Enterprise Launch',
    monthly: 'INR 2,99,000/mo',
    setup: 'INR 4,50,000 one-time setup',
    volume: 'Up to 1,000 conversations/day (~30,000/month)',
    features: [
      '1 WABA, up to 5 sender numbers',
      'Template management + approval ops',
      'Campaign scheduler + audience segmentation',
      'Delivery/read/reply analytics dashboard',
      'Webhook + CRM integration',
      'Priority support (business hours)',
    ],
  },
  {
    name: 'Enterprise Growth',
    monthly: 'INR 5,99,000/mo',
    setup: 'INR 9,00,000 one-time setup',
    volume: 'Up to 10,000 conversations/day (~300,000/month)',
    features: [
      'Up to 3 WABA, up to 20 sender numbers',
      'Multi-tenant routing + throttling controls',
      'Advanced retry/failover logic',
      'Dedicated onboarding + solution engineer',
      '24x7 priority support (P1)',
    ],
  },
  {
    name: 'Enterprise Scale',
    monthly: 'INR 11,99,000/mo',
    setup: 'INR 18,00,000 one-time setup',
    volume: 'Up to 50,000 conversations/day (~1.5M/month)',
    features: [
      'Up to 10 WABA, up to 75 sender numbers',
      'Queue orchestration + burst traffic controls',
      'Compliance guardrails + audit logs',
      'Custom SLA + dedicated account manager',
      'Custom integrations (ERP/CDP/data warehouse)',
    ],
  },
  {
    name: 'Enterprise HyperScale',
    monthly: 'INR 19,99,000+/mo',
    setup: 'INR 30,00,000+ one-time setup',
    volume: 'Up to 100,000 conversations/day (~3M/month)',
    features: [
      'Custom infra + regional routing',
      'Dedicated throughput lane + failover architecture',
      'Security package (SSO, IP allowlist, compliance controls)',
      '99.9%+ SLA options',
      'Joint success + quarterly architecture reviews',
    ],
  },
];

const voiceAddonPlans = [
  {
    name: 'Growth Plus',
    monthly: 'INR 89,999/mo',
    setup: 'INR 1,29,999 one-time setup',
    scope: 'Growth plan + voice receptionist integration',
    features: [
      'ElevenLabs voice agent binding (single tenant)',
      'Call summary + recording sync to WhatsApp owner',
      'Basic call routing, fallback, and escalation',
      'Voice usage billed as pass-through',
    ],
  },
  {
    name: 'Scale Plus',
    monthly: 'INR 1,79,999/mo',
    setup: 'INR 2,49,999 one-time setup',
    scope: 'Scale plan + multi-flow voice operations',
    features: [
      'Advanced voice workflows and intake logic',
      'Call transcript/summary persistence with guardrails',
      'Priority voice incident handling',
      'Voice + telephony usage billed as pass-through',
    ],
  },
  {
    name: 'Enterprise Launch Plus',
    monthly: 'INR 3,99,000/mo',
    setup: 'INR 6,00,000 one-time setup',
    scope: 'Enterprise Launch + dedicated voice orchestration',
    features: [
      'Dedicated voice onboarding and QA',
      'Tenant-level voice controls in ops workflow',
      'Call lifecycle observability and escalation hooks',
      'Usage and telephony charges billed separately',
    ],
  },
  {
    name: 'Enterprise Growth Plus',
    monthly: 'INR 7,99,000/mo',
    setup: 'INR 12,00,000 one-time setup',
    scope: 'Enterprise Growth + high-volume voice support',
    features: [
      'Multi-agent voice routing and failover policies',
      'Higher concurrency voice handling',
      '24x7 P1 voice escalation path',
      'Voice usage pass-through + minimum commit',
    ],
  },
  {
    name: 'Enterprise Scale Plus',
    monthly: 'INR 14,99,000/mo',
    setup: 'INR 24,00,000 one-time setup',
    scope: 'Enterprise Scale + heavy-duty voice operations',
    features: [
      'Burst-ready voice orchestration and controls',
      'Advanced compliance and audit support for calls',
      'Dedicated reliability engineering lane',
      'Pass-through usage with quarterly repricing guardrail',
    ],
  },
  {
    name: 'Enterprise HyperScale Plus',
    monthly: 'INR 24,99,000+/mo',
    setup: 'INR 40,00,000+ one-time setup',
    scope: 'Enterprise HyperScale + custom voice infrastructure',
    features: [
      'Custom voice infra and regional routing strategy',
      'High-throughput voice continuity architecture',
      'Premium SLA and dedicated success governance',
      'Usage billed separately with reserved capacity model',
    ],
  },
];

const overageBands = [
  'Starter: INR 2.5 per extra conversation',
  'Growth: INR 2.0 per extra conversation',
  'Scale: INR 1.5 per extra conversation',
  'Soft limit alert at 85%, hard alert at 100%',
];

const addons = [
  'Extra WhatsApp number: INR 4,999/mo',
  'Additional automation pack: INR 7,999/mo',
  'Human handoff dashboard seats: INR 999/user/mo',
  'Managed campaign/follow-up ops: INR 15,000 to INR 50,000/mo',
];

const enterpriseProfitRules = [
  'Client bill is always platform fee + pass-through usage + overage + add-ons.',
  'Target gross margin: >=75% for Launch/Growth and >=65% for Scale/HyperScale.',
  'Setup fee floor: max(2x monthly platform fee, 1.25x implementation cost).',
  'Enterprise minimum monthly commit is mandatory.',
  'SLA and reserved throughput commitments are billed as premium add-ons.',
  'Quarterly repricing applies for Meta/Twilio rate updates and traffic mix changes.',
];

export default function OmegaReachPage() {
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">
                  Omega - AI Agents | 3D Web | Apps
                </p>
                <p className="text-[11px] text-slate-500">Omega Reach</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-1 text-[12px] shadow-sm whitespace-nowrap">
              <a
                href="#features"
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600"
              >
                Contact
              </a>
            </nav>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
            >
              Book a Call
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-emerald-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-sky-100 to-fuchsia-100 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                WhatsApp-First Product
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                Omega Reach - WhatsApp assistant
              </h1>
              <p className="mt-5 text-slate-600 max-w-2xl">
                Build your full WhatsApp business flow with Magda: inbound handling, onboarding,
                lead memory, follow-ups, and tenant-isolated operations from one managed stack.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium"
                >
                  Request a setup call
                </a>
                <Link
                  href="/"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  Back to main site
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <p className="text-xs uppercase tracking-wide text-slate-500">Included in Omega Reach</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li>- First-message and follow-up behavior controls</li>
                  <li>- WhatsApp onboarding flow with secure QR links</li>
                  <li>- Tenant-level isolation and policy boundaries</li>
                  <li>- Conversation and token usage reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 border-t border-slate-200 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Core capabilities</h2>
            <p className="mt-3 text-slate-600">
              Everything required to run WhatsApp automation as a managed client-ready product.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-slate-50/70 border-t border-slate-200 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">How onboarding works</h2>
            <p className="mt-3 text-slate-600">
              A clean client-side activation flow designed for speed and control.
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-fuchsia-600">STEP {index + 1}</p>
                <p className="mt-2 text-sm text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="py-16 border-t border-slate-200 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">Omega Reach pricing</h2>
            <p className="mt-3 text-slate-600">
              Three-layer pricing helps buyers self-select quickly while preserving delivery margins.
              Annual billing option: get 2 months free.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {corePlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{plan.monthly}</h3>
                <p className="mt-1 text-sm font-medium text-fuchsia-700">{plan.setup}</p>
                <p className="mt-2 text-xs text-slate-500">Best for: {plan.bestFor}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Overage model</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {overageBands.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Add-ons</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {addons.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <h3 className="text-xl font-semibold text-indigo-900">Enterprise profitability rule</h3>
            <ul className="mt-3 space-y-2 text-sm text-indigo-900">
              {enterpriseProfitRules.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/70 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">Enterprise plan family (WABA high volume)</h2>
            <p className="mt-3 text-slate-600">
              For outbound + inbound operations at 1,000 to 100,000 conversations per day with
              higher throughput, orchestration, and dedicated support.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {enterpriseWabaPlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{plan.monthly}</h3>
                <p className="mt-1 text-sm font-medium text-fuchsia-700">{plan.setup}</p>
                <p className="mt-2 text-sm text-slate-600">{plan.volume}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-lg font-semibold text-amber-900">Important billing note</h3>
            <p className="mt-2 text-sm text-amber-900">
              Meta/WhatsApp usage charges and BSP pass-through charges are billed separately from Omega Reach
              platform fees. Enterprise overage is billed per additional conversation/day slab.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <h3 className="text-xl font-semibold text-violet-900">
              Voice add-on plans (from Growth onward)
            </h3>
            <p className="mt-2 text-sm text-violet-900">
              Dedicated pricing for voice agent integration on top of Omega Reach plans.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {voiceAddonPlans.map((plan) => (
                <article key={plan.name} className="rounded-xl border border-violet-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{plan.name}</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">{plan.monthly}</h4>
                  <p className="mt-1 text-sm font-medium text-violet-700">{plan.setup}</p>
                  <p className="mt-1 text-xs text-slate-500">{plan.scope}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {plan.features.map((feature) => (
                      <li key={feature}>- {feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold">Get your Omega Demo Funnel Audit (free)</h2>
              <p className="mt-2 text-slate-600 max-w-xl">
                Send your URL and goals. We&apos;ll find the 3 biggest conversion leaks, show the 3D/AI fixes, and send a 60–90 sec Loom-style teardown within 24 hours.
              </p>

              <div className="mt-6 rounded-xl bg-gradient-to-r from-fuchsia-50 to-indigo-50 border border-fuchsia-200 p-4">
                <p className="text-sm font-medium text-fuchsia-900">
                  🚀 <strong>6 founding slots this quarter</strong>
                </p>
                <p className="mt-1 text-xs text-fuchsia-700">
                  Setup fee waived + preferred rates for your first 3 months. Book a call to secure a slot.
                </p>
              </div>

              <ul className="mt-6 space-y-3 text-slate-600 text-sm">
                <li>
                  • Email:{' '}
                  <a className="underline hover:text-slate-900" href="mailto:hello@omegaappbuilder.com">
                    hello@omegaappbuilder.com
                  </a>
                </li>
                <li>
                  • Call/Meet:{' '}
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-slate-900"
                  >
                    Book a 15-min slot
                  </a>
                </li>
                <li>• Based remotely • Worldwide</li>
              </ul>
            </div>

            <form
              className="rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
              method="POST"
              action="/api/lead?redirect=/thank-you"
            >
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="free_audit_request" />

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Name</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    placeholder="Your name"
                    name="name"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Email</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    type="email"
                    placeholder="you@company.com"
                    name="email"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Company</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Company"
                  name="company"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Website/App URL</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="https://example.com"
                  name="url"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Goal (30 days)</span>
                <textarea
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[120px]"
                  placeholder="What do you want to achieve in the next 30 days?"
                  name="message"
                />
              </label>

              <button
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                aria-label="Send audit request"
              >
                Send Audit Request
              </button>

              <p className="text-xs text-slate-500">
                Submitting this form adds you to our updates. You can opt out anytime.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
