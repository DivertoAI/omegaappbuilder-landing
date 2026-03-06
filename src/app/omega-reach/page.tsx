import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Omega Reach - Whatsapp assistant | OmegaAppBuilder',
  description:
    'Omega Reach is a WhatsApp-first assistant for auto-replies, lead capture, onboarding flows, and follow-up automation.',
  alternates: { canonical: '/omega-reach' },
  openGraph: {
    title: 'Omega Reach - Whatsapp assistant',
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
                Omega Reach - Whatsapp assistant
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
