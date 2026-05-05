import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work With Omega — AI Agents & 3D Web',
  description: 'Find the right engagement for your stage. No upfront commitment. Start with a free Demo Funnel Audit to see exactly what we would build for you.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Work With Omega — AI Agents & 3D Web',
    description: 'Two clear paths: Essentials for first agents and heroes, Growth for teams scaling AI ops and 3D web together.',
    url: '/pricing',
    type: 'website',
  },
};

const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';

const testimonials = [
  {
    name: 'Marcus T.',
    title: 'Co-Founder, DevTools SaaS',
    quote: 'Omega shipped our SDR agent in two weeks. It books demos into HubSpot automatically and the 3D hero they built cut our bounce rate measurably. No fluff, just outcomes.',
  },
  {
    name: 'Priya R.',
    title: 'Head of Growth, AI Productivity Platform',
    quote: 'We were skeptical of the risk-reversal promise. They improved our trial-to-demo rate by 18% in 30 days. The agent handles inbound triage so the founder can focus on closing.',
  },
  {
    name: 'James W.',
    title: 'CTO, Fintech Startup',
    quote: 'The 3D hero Omega built is the first thing every investor comments on. The team understood our product deeply and translated it into something visually credible without slowing the page down.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Header nav */}
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Omega" width={28} height={28} />
            <span className="text-sm font-semibold">Omega</span>
          </Link>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
          >
            Book a Meeting
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">Pricing</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
            Find the right engagement<br className="hidden sm:block" /> for your stage
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            No upfront commitment. No fluff. Start with a free Demo Funnel Audit to see exactly what we&apos;d build — in under 20 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
            >
              Book a Meeting
            </a>
            <Link
              href="/#contact"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Get the Free Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">

            {/* Essentials */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Essentials</p>
                <h2 className="mt-2 text-2xl font-bold">For early-stage SaaS, DevTools &amp; AI startups</h2>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  Designed for founders who need their first AI agent or 3D hero — shipped fast, scoped clearly, with a risk-reversal guarantee.
                </p>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {[
                  '1 AI agent (SDR, support, or receptionist)',
                  'Up to 2 workflows or automations',
                  'CRM / calendar sync (HubSpot, Salesforce, Calendly)',
                  'Weekly async updates + Loom walkthroughs',
                  '30-day defect fix window',
                  '1 onboarding scoping call + delivery roadmap',
                  'Risk-reversal: no lift = no service fee',
                  'Optional: 3D hero or interactive brand moment',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-1 flex-shrink-0 h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Book a scoping call
              </a>
            </div>

            {/* Growth */}
            <div className="relative rounded-3xl border-2 border-fuchsia-500 bg-white p-8 shadow-lg flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white tracking-wide">
                  POPULAR
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-600">Growth</p>
                <h2 className="mt-2 text-2xl font-bold">For funded teams scaling AI ops &amp; 3D web together</h2>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  When you&apos;re ready to run multiple agents, ship richer 3D experiences, and track performance rigorously.
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">What you get</p>
                <ul className="mt-4 space-y-3">
                  {[
                    '2–3 AI agents per month',
                    'Up to 3 stack integrations (CRM, ticketing, WhatsApp, email)',
                    '3D hero, configurator, or scrollytelling page',
                    'A/B prompt testing + monthly performance report',
                    'Priority 24h SLA',
                    'Dedicated delivery lead',
                    'Playbook for SDR agent to capture new demand',
                    'Ongoing toxic-link monitoring & disavowal (SEO)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-1 flex-shrink-0 h-4 w-4 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 text-xs">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Talk to sales
              </a>
            </div>

          </div>

          {/* Enterprise nudge */}
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-5 text-center">
            <p className="text-sm text-slate-600">
              Need a custom scope, white-label delivery, or agency pricing?{' '}
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-fuchsia-600 hover:underline">
                Let&apos;s talk →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
            Trusted by fastest-growing B2B SaaS startups
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold">
            Here&apos;s how we help teams ship agents and 3D sites fast — and with depth.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Not sure which plan fits?</h2>
          <p className="mt-4 text-slate-600">
            Book a free 20-min scoping call. We&apos;ll map your goals, identify the biggest conversion leaks, and send a fixed quote within 48 hours — no obligation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
            >
              Book a Meeting
            </a>
            <Link
              href="/#contact"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Get the Free Audit
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">2 audit slots per week · We respond in &lt;24h</p>
        </div>
      </section>

    </main>
  );
}
