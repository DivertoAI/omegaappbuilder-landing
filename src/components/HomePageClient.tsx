'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const Planet3D = dynamic(() => import('./Planet3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] flex items-center justify-center">
      <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em' }}>
        LOADING 3D…
      </span>
    </div>
  ),
});

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-xl border px-3 py-2.5 text-left min-w-[148px] backdrop-blur-md"
      style={{ background: 'rgba(17,17,20,0.88)', borderColor: 'var(--line-2)' }}
    >
      <p style={{ color: 'var(--fg-3)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold" style={{ color: 'var(--fg)' }}>{value}</p>
      <p style={{ color: 'var(--fg-3)', fontSize: 10, marginTop: 2 }}>{sub}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: 'linear-gradient(to right, transparent, var(--line), transparent)' }} />
  );
}

export default function HomePageClient() {
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--fg)' }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--line)', background: 'rgba(10,10,12,0.92)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-4">

            {/* Logo */}
            <a href="#home" className="flex items-center gap-2.5 shrink-0">
              <Image src="/logo.png" alt="Omega logo" width={28} height={28} priority />
              <div>
                <p className="text-sm font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>Omega</p>
                <p style={{ fontSize: 10, color: 'var(--fg-3)', lineHeight: 1 }}>Studio</p>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 text-[13px]">
              {[
                { label: 'AI Agents', id: 'agents' },
                { label: '3D Experiences', id: 'web3d' },
                { label: 'Apps', id: 'products' },
                { label: 'Funnel Systems', id: 'makeover' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className="rounded-lg px-3 py-1.5 font-medium transition-colors"
                  style={{ color: 'var(--fg-2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
                >
                  {label}
                </button>
              ))}
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-1.5 font-medium transition-colors"
                style={{ color: 'var(--fg-2)' }}
              >
                Pricing
              </Link>
              <button
                onClick={() => goTo('proof')}
                className="rounded-lg px-3 py-1.5 font-medium transition-colors"
                style={{ color: 'var(--fg-2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
              >
                Case Studies
              </button>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border"
                style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)' }}
                onClick={() => setMobileMenuOpen(p => !p)}
                aria-label="Toggle menu"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 20 20">
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l10 10M15 5L5 15" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14M3 10h14M3 15h14" />}
                </svg>
              </button>
              <button
                onClick={() => goTo('contact')}
                className="hidden sm:inline-flex items-center rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors"
                style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--fg-2)'; }}
              >
                Free Audit
              </button>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: 'var(--accent)' }}
              >
                Book a Call <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t lg:hidden" style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}>
            <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
              {[
                { label: 'AI Agents', id: 'agents' },
                { label: '3D Experiences', id: 'web3d' },
                { label: 'Apps', id: 'products' },
                { label: 'Funnel Systems', id: 'makeover' },
                { label: 'Case Studies', id: 'proof' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium"
                  style={{ color: 'var(--fg-2)' }}
                >
                  {label}
                </button>
              ))}
              <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm font-medium" style={{ color: 'var(--fg-2)' }} onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <button
                onClick={() => goTo('contact')}
                className="mt-2 rounded-lg py-2.5 text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Free Demo Funnel Audit
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="home" className="relative overflow-hidden scroll-mt-16">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 right-0 h-[700px] w-[700px] rounded-full blur-[130px]"
            style={{ background: 'oklch(0.55 0.22 290 / 0.12)' }} />
          <div className="absolute bottom-0 -left-32 h-[500px] w-[500px] rounded-full blur-[120px]"
            style={{ background: 'oklch(0.5 0.2 250 / 0.10)' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left: copy */}
            <div className="lg:col-span-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-6 text-xs font-medium"
                style={{ borderColor: 'var(--line-2)', color: 'var(--fg-3)', background: 'var(--bg-2)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                Founder-led · Outcome-driven
              </div>

              <h1
                className="text-[2.8rem] sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight"
                style={{ fontFamily: 'var(--serif)', fontWeight: 400, color: 'var(--fg)' }}
              >
                We build AI agents, 3D experiences, and apps that turn attention into{' '}
                <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>revenue.</em>
              </h1>

              <p className="mt-5 text-base leading-relaxed max-w-lg" style={{ color: 'var(--fg-2)' }}>
                Omega Studio is the AI + 3D partner for funded startups and growth teams.
                We ship measurable systems that drive demo bookings, shorten response times, and accelerate pipeline.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => goTo('contact')}
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                  style={{ background: 'var(--accent)' }}
                >
                  Book a Strategy Call
                </button>
                <button
                  onClick={() => goTo('proof')}
                  className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
                  style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--fg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--fg-2)'; }}
                >
                  See Case Studies
                </button>
              </div>

              {/* Trust logos */}
              <div className="mt-10">
                <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Trusted by founders &amp; growth teams
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['NovaBank', 'QuickCart', 'OrbitOps', 'Healthly', 'Adscribe', 'Nimbus Labs'].map(b => (
                    <span key={b} className="text-sm font-semibold" style={{ color: 'var(--fg-3)' }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Globe + stat cards */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Glow ring behind globe */}
                <div
                  className="absolute inset-4 rounded-full -z-10 blur-3xl"
                  style={{ background: 'oklch(0.55 0.22 290 / 0.18)' }}
                  aria-hidden="true"
                />

                {/* Floating stat cards — inside globe container, overlaying it */}
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}>
                  {/* Cards on top of globe (desktop only) */}
                  <div className="hidden lg:block absolute top-4 left-3 z-10">
                    <StatCard label="Demo Bookings" value="+217%" sub="30-day uplift" />
                  </div>
                  <div className="hidden lg:block absolute top-4 right-3 z-10">
                    <StatCard label="Pipeline Influenced" value="$4.8M+" sub="This Quarter" />
                  </div>

                  {/* Globe */}
                  <div className="hidden md:block">
                    <Planet3D />
                  </div>
                  <div className="md:hidden h-[280px] flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border"
                        style={{ borderColor: 'var(--line-2)', background: 'var(--bg-3)' }}
                      >
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium" style={{ color: 'var(--fg-2)' }}>Interactive 3D on desktop</p>
                    </div>
                  </div>

                  {/* Bottom cards */}
                  <div className="hidden lg:block absolute bottom-4 left-3 z-10">
                    <StatCard label="Response Time" value="-62%" sub="AI SDR Agents" />
                  </div>
                  <div className="hidden lg:block absolute bottom-4 right-3 z-10">
                    <StatCard label="Conversion Lift" value="+38%" sub="From 3D Experiences" />
                  </div>
                </div>

                {/* Mobile stat grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 lg:hidden">
                  {[
                    { label: 'Demo Bookings', value: '+217%', sub: '30-day uplift' },
                    { label: 'Pipeline', value: '$4.8M+', sub: 'This Quarter' },
                    { label: 'Response Time', value: '-62%', sub: 'AI SDR Agents' },
                    { label: 'Conversion Lift', value: '+38%', sub: '3D Experiences' },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="rounded-xl border p-3"
                      style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}
                    >
                      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</p>
                      <p className="text-lg font-semibold mt-0.5" style={{ color: 'var(--fg)' }}>{s.value}</p>
                      <p style={{ fontSize: 10, color: 'var(--fg-3)' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── METRICS BAR ── */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-2)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ borderLeft: 'none' }}>
            {[
              { icon: '📅', label: 'Demo Bookings Uplift', value: '+217%', sub: '30-day average' },
              { icon: '⚡', label: 'Response Time Reduction', value: '-62%', sub: 'with AI Agents' },
              { icon: '◈', label: 'Pipeline Influenced', value: '$4.8M+', sub: 'This Quarter' },
              { icon: '↗', label: 'Conversion Lift', value: '+38%', sub: 'with 3D Experiences' },
              { icon: '◷', label: 'Time to Launch', value: '2–4 wks', sub: 'Average Delivery' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-5 py-5"
                style={{ borderLeft: i > 0 ? '1px solid var(--line)' : undefined }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm"
                  style={{ borderColor: 'var(--line-2)', background: 'var(--bg-3)', color: 'var(--accent)' }}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{stat.label}</p>
                  <p className="text-xl font-bold leading-tight" style={{ color: 'var(--fg)' }}>{stat.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--fg-3)' }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── WHAT WE BUILD + CASE STUDY ── */}
      <section id="products" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">

            {/* Left: label + headline */}
            <div className="lg:col-span-3">
              <SectionLabel>What We Build</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold leading-snug" style={{ color: 'var(--fg)' }}>
                End-to-end systems that convert.
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                From AI agents to interactive 3D and high-converting funnels — everything we build drives measurable outcomes.
              </p>
            </div>

            {/* Middle: 5 service cards */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { icon: '◈', title: 'AI Agents', desc: 'SDR & Support agents that engage, qualify, and convert 24/7.' },
                { icon: '◉', title: '3D Web Experiences', desc: 'Immersive 3D that explains, engages, and drives action.' },
                { icon: '⬡', title: 'App Builds', desc: 'Custom web apps and internal tools that scale.' },
                { icon: '▽', title: 'Funnel Systems', desc: 'High-converting funnels and landing pages built to perform.' },
                { icon: '↻', title: 'Ongoing Optimization', desc: 'Data-driven iteration, A/B testing, and growth engineering.' },
              ].map(card => (
                <div
                  key={card.title}
                  className="group rounded-xl border p-4 transition-colors cursor-pointer"
                  style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg border mb-3 text-sm"
                    style={{ background: 'var(--bg-3)', borderColor: 'var(--line-2)', color: 'var(--accent)' }}
                  >
                    {card.icon}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--fg-3)' }}>{card.desc}</p>
                  <p className="mt-3 text-xs" style={{ color: 'var(--accent)' }}>→</p>
                </div>
              ))}
            </div>

            {/* Right: Case Study Spotlight */}
            <div className="lg:col-span-3">
              <div
                className="rounded-xl border overflow-hidden h-full flex flex-col"
                style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}
              >
                <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--line)' }}>
                  <SectionLabel>Case Study Spotlight</SectionLabel>
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>O</div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>OrbitOps</span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                      style={{ background: 'oklch(0.72 0.18 155 / 0.15)', color: 'var(--good)', border: '1px solid oklch(0.72 0.18 155 / 0.3)' }}
                    >
                      B2B SaaS
                    </span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug" style={{ color: 'var(--fg)' }}>
                    From scattered to scalable: 217% more demos in 30 days.
                  </h3>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Demo Bookings', value: '+217%' },
                      { label: 'Response Time', value: '-62%' },
                      { label: 'Conversion Lift', value: '+38%' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-3)', border: '1px solid var(--line)' }}>
                        <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>{s.value}</p>
                        <p style={{ fontSize: 9, color: 'var(--fg-3)', marginTop: 2 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => goTo('proof')} className="mt-4 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
                    View Full Case Study →
                  </button>
                </div>
                {/* Decorative gradient panel */}
                <div
                  className="h-28 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, oklch(0.45 0.22 290 / 0.3), oklch(0.45 0.2 250 / 0.2))' }}
                >
                  <div
                    className="h-14 w-14 rounded-xl border flex items-center justify-center"
                    style={{ borderColor: 'oklch(0.68 0.22 290 / 0.4)', background: 'oklch(0.55 0.22 290 / 0.2)' }}
                  >
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent-2)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PROCESS ── */}
      <section id="process" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            <div className="lg:col-span-4">
              <SectionLabel>Our Process</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold leading-snug" style={{ color: 'var(--fg)' }}>
                A proven system.<br />Built around outcomes.
              </h2>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { num: '01', title: 'Discover & Audit', desc: 'We audit your funnel, messaging, and tech stack.' },
                { num: '02', title: 'Strategy & Blueprint', desc: 'We design the right system for your goals.' },
                { num: '03', title: 'Build & Integrate', desc: 'We build, connect, and launch fast.' },
                { num: '04', title: 'Optimize & Scale', desc: 'We iterate, test, and scale what works.' },
              ].map(step => (
                <div key={step.num} className="rounded-xl border p-4" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 6 }}>{step.num}</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--fg-3)' }}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-xl p-5 text-white" style={{ background: 'var(--accent)' }}>
                <h3 className="text-base font-semibold">Ready to turn attention into revenue?</h3>
                <p className="mt-1.5 text-sm opacity-80">Book a free strategy call. Fixed quote in 48h.</p>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--bg)', color: 'var(--accent)' }}
                >
                  Book a Strategy Call →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PROOF / CASE STUDIES ── */}
      <section id="proof" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SectionLabel>Proof</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fg)' }}>Proof founders can feel</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-2)' }}>Results from our engagements — measured where it matters.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'DevTools SaaS',
                tag: '+32% demo conversions in 21 days',
                bullets: ['AI SDR follow-ups synced to HubSpot + Calendly', 'Hero rewrite with specific CTA + 3D pipeline visual', 'A/B test measured in GA + HubSpot deals created'],
              },
              {
                title: 'AI Productivity Platform',
                tag: '40 hrs/week saved for the founder',
                bullets: ['Agent triages inbound + sequences follow-ups', 'Slack alerts with transcript + approval gates', 'Bookings auto-logged to CRM; no manual data entry'],
              },
              {
                title: 'Fintech Platform',
                tag: '18% trial-start uplift in 30 days',
                bullets: ['3D hero variant + clarified pricing CTA', 'Lead capture tied to product-qualified triggers', 'Playbook for SDR agent to chase trials → demos'],
              },
            ].map(c => (
              <div key={c.title} className="rounded-xl border p-5 transition-colors" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>Case Study</p>
                <h3 className="mt-1 text-base font-semibold" style={{ color: 'var(--fg)' }}>{c.title}</h3>
                <div
                  className="mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-medium"
                  style={{ background: 'oklch(0.72 0.18 155 / 0.12)', color: 'var(--good)', border: '1px solid oklch(0.72 0.18 155 / 0.25)' }}
                >
                  {c.tag}
                </div>
                <ul className="mt-4 space-y-2">
                  {c.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── AI AGENTS ── */}
      <section id="agents" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SectionLabel>AI Agents</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fg)' }}>AI agents, productized</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-2)' }}>Outcome-first automations with real guardrails. Human-in-the-loop when it matters.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'SDR Agent (Lead Gen)',
                desc: 'Qualifies and books meetings from site chat + email follow-ups. Logs to your CRM with UTM/context.',
                features: ['Calendly/HubSpot/Salesforce', 'Multi-channel (web, email, WhatsApp)', 'Playbooks + approvals'],
              },
              {
                title: 'Support & Success Agent',
                desc: 'Doc-aware answers, ticket triage, and secure escalation with full conversation context.',
                features: ['RAG over KB & product docs', 'Zendesk/Intercom/Email', 'CSAT & deflection metrics'],
              },
              {
                title: 'Ops & Backoffice',
                desc: 'Reads spreadsheets/docs, updates systems, triggers workflows. Teams focus on edge cases.',
                features: ['Sheets/Notion/Drive', 'Zapier/Make/Direct APIs', 'Audits & transcripts'],
              },
            ].map(ag => (
              <div key={ag.title} className="rounded-xl border p-5" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--fg)' }}>{ag.title}</h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-2)' }}>{ag.desc}</p>
                <ul className="mt-4 space-y-2">
                  {ag.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--fg-2)' }}>
                      <span
                        className="h-4 w-4 rounded flex items-center justify-center shrink-0 text-[9px] font-bold"
                        style={{ background: 'oklch(0.68 0.22 290 / 0.15)', color: 'var(--accent)', border: '1px solid oklch(0.68 0.22 290 / 0.3)' }}
                      >✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => goTo('contact')} className="mt-5 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
                  Get an Agent Demo →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── 3D WEBSITES ── */}
      <section id="web3d" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SectionLabel>3D Experiences</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fg)' }}>3D websites &amp; interactive brand moments</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-2)' }}>Tasteful, performant 3D built with Three.js, Spline, and Model-Viewer — budgeted for speed.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: '3D Hero Scene', desc: 'Animated, interactive hero that showcases your product. Mobile-friendly & SEO-aware.' },
              { title: 'Product Configurator', desc: 'Real-time variants, materials, and pricing. Add to cart or lead capture built-in.' },
              { title: 'Scrollytelling Page', desc: 'Narrative 3D sections with pinned steps & micro-interactions that tell a story.' },
            ].map(w => (
              <div key={w.title} className="rounded-xl border p-5" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--fg)' }}>{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-2)' }}>{w.desc}</p>
                <p
                  className="mt-4 inline-flex rounded-md px-2.5 py-1 text-xs"
                  style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', background: 'oklch(0.68 0.22 290 / 0.1)', border: '1px solid oklch(0.68 0.22 290 / 0.25)' }}
                >
                  LCP &lt; 2.0s · AA contrast · A11y
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FREE AUDIT ── */}
      <section id="makeover" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-5 text-xs"
                style={{ borderColor: 'var(--line-2)', color: 'var(--fg-3)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', background: 'var(--bg-2)', textTransform: 'uppercase' }}
              >
                Free · No obligation
              </div>
              <h2 className="text-2xl font-semibold leading-snug" style={{ color: 'var(--fg)' }}>
                See your homepage rewritten &amp; redesigned for conversions — free
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                We&apos;ll remake your hero + fold 1 using 3D/AI, record a 90-second audit, and show the agent playbook to capture the lift.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  'Identify the 3 biggest conversion leaks on your homepage.',
                  'Ship a 3D/interactive hero mockup + CTA rewrite matched to your ICP.',
                  'Outline the AI SDR playbook to convert new demand into booked demos.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--fg-2)' }}>
                    <span className="mt-2 h-1 w-1 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => goTo('contact')}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                  style={{ background: 'var(--accent)' }}
                >
                  Claim the free audit
                </button>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
                  style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)' }}
                >
                  Book a 15-min call
                </a>
              </div>
              <p className="mt-3 text-xs" style={{ color: 'var(--fg-3)' }}>2 audit slots per week · we respond in &lt;24h</p>
            </div>

            <div className="rounded-xl border p-5" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--fg)' }}>What you&apos;ll receive</h3>
              <div className="space-y-3">
                {[
                  { title: '60–90 sec Loom-style teardown', desc: 'Screen walkthrough with callouts, not a generic talking head.' },
                  { title: '3D hero concept', desc: 'A quick visual showing how your product should appear above the fold.' },
                  { title: 'AI SDR playbook', desc: 'Suggested prompts, integrations, and guardrails for your ICP.' },
                  { title: 'Fixed quote (48h)', desc: 'Lock in your scope; setup fee waived while slots last.' },
                ].map(item => (
                  <div key={item.title} className="rounded-lg border px-4 py-3" style={{ background: 'var(--bg-3)', borderColor: 'var(--line)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--fg-3)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING CTA ── */}
      <section id="pricing" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fg)' }}>Simple engagements, scoped to outcomes</h2>
          <p className="mt-3 text-sm" style={{ color: 'var(--fg-2)' }}>
            Two clear paths — Essentials for your first agent or 3D hero, Growth for teams scaling AI ops and interactive web together.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--accent)' }}
            >
              See Plans
            </Link>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ borderColor: 'var(--line-2)', color: 'var(--fg-2)' }}
            >
              Book a 20-min Call
            </a>
          </div>
          <p className="mt-4 text-xs" style={{ color: 'var(--fg-3)' }}>Fixed quote within 48h after call · Risk-reversal: no lift = no service fee</p>
        </div>
      </section>

      <Divider />

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 text-2xl font-semibold mb-8" style={{ color: 'var(--fg)' }}>Common questions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { q: 'Which AI models do you use?', a: 'We pick the best model per use-case and can swap for quality/cost. Data is isolated per client.' },
              { q: 'How do you keep agents safe?', a: 'Guardrails, role & rate limits, approval steps, audit trails, and transcripts. Sensitive actions require human sign-off.' },
              { q: 'What about performance on 3D pages?', a: 'We budget assets, lazy-load, and measure Core Web Vitals. We ship fast fallbacks for low-end devices.' },
              { q: 'Do you work globally?', a: 'Yes — worldwide. USD pricing. Cards and bank transfer supported.' },
              { q: 'How many slots are available?', a: 'We onboard 2 clients per month. Book a call to check availability.' },
              { q: 'Can I upgrade my plan later?', a: 'Yes. You can upgrade anytime and keep your rate for the remainder of your promo window.' },
            ].map(f => (
              <div key={f.q} className="rounded-xl border p-5" style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{f.q}</h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--fg-2)' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <SectionLabel>Contact</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fg)' }}>
                Get your Omega Demo Funnel Audit (free)
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                Send your URL and goals. We&apos;ll find the 3 biggest conversion leaks, show the 3D/AI fixes, and send a teardown within 24 hours.
              </p>
              <ul className="mt-5 space-y-2 text-sm" style={{ color: 'var(--fg-2)' }}>
                <li>→ Email: <a className="underline hover:opacity-70 transition-opacity" href="mailto:hello@omegaappbuilder.com">hello@omegaappbuilder.com</a></li>
                <li>→ Call: <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">Book a 15-min slot</a></li>
                <li style={{ color: 'var(--fg-3)' }}>→ Based remotely · Worldwide</li>
              </ul>
            </div>

            <form
              className="rounded-xl border p-5 grid gap-3"
              style={{ background: 'var(--bg-2)', borderColor: 'var(--line)' }}
              method="POST"
              action="/site-api/lead?redirect=/thank-you"
            >
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="free_audit_request" />

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Name', name: 'name', placeholder: 'Your name', type: 'text', required: true },
                  { label: 'Email', name: 'email', placeholder: 'you@company.com', type: 'email', required: true },
                ].map(field => (
                  <label key={field.name} className="flex flex-col gap-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--fg-3)' }}>{field.label}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                      style={{
                        background: 'var(--bg-3)',
                        borderColor: 'var(--line-2)',
                        color: 'var(--fg)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
                    />
                  </label>
                ))}
              </div>

              {[
                { label: 'Company', name: 'company', placeholder: 'Company', type: 'text' },
                { label: 'Website/App URL', name: 'url', placeholder: 'https://example.com', type: 'text' },
              ].map(field => (
                <label key={field.name} className="flex flex-col gap-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--fg-3)' }}>{field.label}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
                    style={{ background: 'var(--bg-3)', borderColor: 'var(--line-2)', color: 'var(--fg)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
                  />
                </label>
              ))}

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium" style={{ color: 'var(--fg-3)' }}>Goal (30 days)</span>
                <textarea
                  name="message"
                  placeholder="What do you want to achieve in the next 30 days?"
                  className="rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors min-h-[100px] resize-none"
                  style={{ background: 'var(--bg-3)', borderColor: 'var(--line-2)', color: 'var(--fg)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
                />
              </label>

              <button
                className="mt-1 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: 'var(--accent)' }}
              >
                Send Audit Request
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--fg-3)' }}>
                Submitting adds you to our updates. Opt out anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
