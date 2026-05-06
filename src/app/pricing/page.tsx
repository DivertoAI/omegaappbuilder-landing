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
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>

      {/* Header nav */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--line)', background: 'rgba(10,10,12,0.92)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-[64px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Omega" width={26} height={26} />
            <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Omega</span>
          </Link>
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: 'var(--accent)' }}
          >
            Book a Meeting
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[36rem] w-[36rem] rounded-full blur-3xl"
            style={{ background: 'oklch(0.55 0.22 290 / 0.10)' }} />
          <div className="absolute -bottom-32 -right-24 h-[32rem] w-[32rem] rounded-full blur-3xl"
            style={{ background: 'oklch(0.5 0.2 250 / 0.08)' }} />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>
            Pricing
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
            Find the right engagement<br className="hidden sm:block" /> for your stage
          </h1>
          <p className="mt-5 text-base" style={{ color: 'var(--fg-2)' }}>
            No upfront commitment. No fluff. Start with a free Demo Funnel Audit to see exactly what we&apos;d build — in under 20 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--accent)' }}
            >
              Book a Meeting
            </a>
            <Link
              href="/#contact"
              className="rounded-lg border px-6 py-3 font-semibold transition-colors"
              style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)' }}
            >
              Get the Free Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">

            {/* Essentials */}
            <div className="rounded-2xl border p-8 flex flex-col" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
              <div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>Essentials</p>
                <h2 className="mt-2 text-xl font-semibold" style={{ color: 'var(--fg)' }}>For early-stage SaaS, DevTools &amp; AI startups</h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
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
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--fg-2)' }}>
                    <span
                      className="mt-0.5 flex-shrink-0 h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'oklch(0.72 0.18 155 / 0.15)', color: 'var(--good)', border: '1px solid oklch(0.72 0.18 155 / 0.3)' }}
                    >✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg border px-5 py-3 font-semibold text-sm transition-colors"
                style={{ borderColor: 'var(--line-2)', color: 'var(--fg)', background: 'transparent' }}
              >
                Book a scoping call
              </a>
            </div>

            {/* Growth */}
            <div className="relative rounded-2xl border-2 p-8 flex flex-col" style={{ background: 'var(--bg-2)', borderColor: 'var(--accent)' }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>
                  POPULAR
                </span>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase' }}>Growth</p>
                <h2 className="mt-2 text-xl font-semibold" style={{ color: 'var(--fg)' }}>For funded teams scaling AI ops &amp; 3D web together</h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                  When you&apos;re ready to run multiple agents, ship richer 3D experiences, and track performance rigorously.
                </p>
              </div>
              <div className="mt-6">
                <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>What you get</p>
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
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--fg-2)' }}>
                      <span
                        className="mt-0.5 flex-shrink-0 h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'oklch(0.68 0.22 290 / 0.15)', color: 'var(--accent)', border: '1px solid oklch(0.68 0.22 290 / 0.3)' }}
                      >✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 font-semibold text-sm text-white transition-opacity hover:opacity-85"
                style={{ background: 'var(--accent)' }}
              >
                Talk to sales
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed px-6 py-4 text-center" style={{ borderColor: 'var(--line-2)' }}>
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>
              Need a custom scope, white-label delivery, or agency pricing?{' '}
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
                Let&apos;s talk →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--fg-3)', textTransform: 'uppercase', textAlign: 'center' }}>
            Trusted by fastest-growing B2B SaaS startups
          </p>
          <h2 className="mt-3 text-center text-xl font-semibold" style={{ color: 'var(--fg)' }}>
            Here&apos;s how we help teams ship agents and 3D sites fast.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border p-5 flex flex-col gap-4" style={{ background: 'var(--bg-3)', borderColor: 'var(--line)' }}>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--fg-2)' }}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--fg-3)' }}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--fg)' }}>Not sure which plan fits?</h2>
          <p className="mt-4 text-sm" style={{ color: 'var(--fg-2)' }}>
            Book a free 20-min scoping call. We&apos;ll map your goals, identify the biggest conversion leaks, and send a fixed quote within 48 hours — no obligation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--accent)' }}
            >
              Book a Meeting
            </a>
            <Link
              href="/#contact"
              className="rounded-lg border px-6 py-3 font-semibold transition-colors"
              style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)' }}
            >
              Get the Free Audit
            </Link>
          </div>
          <p className="mt-4 text-xs" style={{ color: 'var(--fg-3)' }}>2 audit slots per week · We respond in &lt;24h</p>
        </div>
      </section>

    </main>
  );
}
