// src/app/page.tsx
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

// Lazy-load the 3D canvas (no SSR) to keep LCP snappy
const Planet3D = dynamic(() => import('../components/Planet3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 shadow-sm">
        Loading 3D…
      </div>
    </div>
  ),
});

// Lazy-load the chat widget (no SSR)
const ChatWidget = dynamic(() => import('../components/ChatWidget'), {
  ssr: false,
});

export default function Home() {
  // External scheduling
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';
  
  // Banner dismissal state
  const [showBanner, setShowBanner] = useState(true);

  // Utility: smooth scroll with graceful fallback
  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ----- Projects gallery settings (drop images in /public as p1.png etc.) -----
  const PROJECT_COUNT = 6;
  const PROJECT_PREFIX = 'p';
  const PROJECT_EXT = 'png';
  const projects = Array.from({ length: PROJECT_COUNT }, (_, i) => ({
    src: `/${PROJECT_PREFIX}${i + 1}.${PROJECT_EXT}`,
    title: `Project ${i + 1}`,
    caption: 'Design/Build • Performance • Conversion',
    priority: i < 2,
  }));
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Launch Pricing Banner */}
      {showBanner && (
        <div className="relative bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  🚀 LAUNCH OFFER
                </span>
                <p className="font-medium">
                  <span className="hidden sm:inline">50% off for first 10 clients • </span>
                  <span className="font-bold">6 spots remaining</span>
                  <span className="hidden sm:inline"> • Lock in this rate for 6 months</span>
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#home" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Omega logo"
                width={32}
                height={32}
                priority
              />
              <span className="font-semibold tracking-tight">
                Omega — AI Agents • 3D Web • Apps
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#agents" onClick={(e) => { e.preventDefault(); goTo('agents'); }} className="hover:text-fuchsia-600">AI Agents</a>
              <a href="#web3d" onClick={(e) => { e.preventDefault(); goTo('web3d'); }} className="hover:text-fuchsia-600">3D Websites</a>
              {/* <a href="#work" onClick={(e) => { e.preventDefault(); goTo('work'); }} className="hover:text-fuchsia-600">Work</a> */}
              <a href="#pricing" onClick={(e) => { e.preventDefault(); goTo('pricing'); }} className="hover:text-fuchsia-600">Pricing</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); goTo('faq'); }} className="hover:text-fuchsia-600">FAQ</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }} className="hover:text-fuchsia-600">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                className="hidden sm:inline-flex rounded-xl px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Get Free Audit
              </a>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                aria-label="Book a call on Calendly (opens in a new tab)"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden scroll-mt-28">
        {/* Decorative, gentle light gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="text-slate-900">AI agents that book meetings & resolve tickets.</span>{' '}
                <span className="text-fuchsia-600">3D websites</span> that make people stop and engage.
              </h1>
              <p className="mt-5 text-slate-600 max-w-2xl">
                Senior studio crafting measurable outcomes: SDR & Support agents wired to your CRM and inbox,
                plus immersive WebGL sites (Three.js/Model-Viewer/Spline) that convert.
                Clear scopes, strong governance, enterprise polish.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Get a 3-Point Free Audit
                </a>
                <a
                  href="#agents"
                  onClick={(e) => { e.preventDefault(); goTo('agents'); }}
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  See Agent Use-Cases
                </a>
              </div>
              <dl className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
                  <dt className="font-medium">Clear signifiers</dt><dd> • intuitive CTAs, labels, states</dd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
                  <dt className="font-medium">Immediate feedback</dt><dd> • focus, hover, success</dd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">✓</span>
                  <dt className="font-medium">Constraints</dt><dd> • guardrails & approvals</dd>
                </div>
              </dl>
            </div>

            {/* 3D preview card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200/50 to-indigo-200/50 blur-2xl rounded-3xl" aria-hidden="true" />
                <div className="relative rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-5">
                    <span className="text-sm font-medium text-slate-700">Live 3D Preview</span>
                    <span className="text-xs text-slate-500">interactive</span>
                  </div>
                  <div className="mt-3" aria-describedby="globe-controls-hint">
                    <Planet3D />
                  </div>
                  <div className="px-6 pb-5">
                    <p id="globe-controls-hint" className="text-xs text-center text-slate-500">
                      Tip: click & drag to rotate • scroll or pinch to zoom
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1">WebGL</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Three.js</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Spline-ready</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">GLTF</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">R3F/Drei</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">Performance-budgeted</span>
                    </div>
                  </div>
                </div>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                >
                  Book a 15-min Call
                </a>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-16 text-center">
            <p className="text-sm font-medium text-slate-700">Trusted by</p>
            <p className="text-sm text-slate-500 mt-1">Trusted by founders and operators worldwide</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['NovaBank', 'QuickCart', 'OrbitOps', 'Healthly', 'Adscribe', 'Nimbus Labs'].map((b) => (
                <span key={b} className="text-lg font-semibold text-slate-400">{b}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
                <span className="font-semibold text-emerald-700">+22%</span> more qualified demos (SDR agent)
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2">
                <span className="font-semibold text-indigo-700">41%</span> ticket deflection (support agent)
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2">
                <span className="font-semibold text-sky-700">&lt;1.5s</span> LCP on core pages (mobile)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">AI agents, productized</h2>
            <p className="mt-4 text-slate-600">
              Outcome-first automations with real guardrails. Connect CRM, calendar, email, ticketing, docs, and data.
              Human-in-the-loop when it matters.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'SDR Agent (Lead Gen)',
                desc: 'Qualifies and books meetings from site chat + email follow-ups. Logs to your CRM with UTM/context.',
                features: ['Calendars/HubSpot/Salesforce', 'Multi-channel (web, email, WhatsApp)', 'Playbooks + approvals'],
              },
              {
                title: 'Support & Success Agent',
                desc: 'Doc-aware answers, ticket triage, and secure escalation with full conversation context.',
                features: ['RAG over KB & product docs', 'Zendesk/Intercom/Email integration', 'CSAT & deflection metrics'],
              },
              {
                title: 'Ops & Backoffice Automations',
                desc: 'Reads spreadsheets/docs, updates systems, triggers workflows. Teams focus on edge cases.',
                features: ['Sheets/Notion/Drive', 'Zapier/Make/Direct APIs', 'Audits & transcripts'],
              },
            ].map((ag) => (
              <div key={ag.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold">{ag.title}</h3>
                <p className="mt-3 text-slate-600 text-sm">{ag.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {ag.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="inline-flex mt-0.5 h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                  className="mt-5 inline-flex items-center text-fuchsia-600 hover:text-fuchsia-700 font-medium text-sm"
                >
                  Get an Agent Demo →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Websites Section */}
      <section id="web3d" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">3D websites & interactive brand moments</h2>
            <p className="mt-4 text-slate-600">
              Tasteful, performant 3D: product tours, hero scenes, configurators, and scrollytelling.
              Built with Three.js, Spline, Model-Viewer—budgeted for speed.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: '3D Hero Scene',
                desc: 'Animated, interactive hero that showcases your product. Mobile-friendly & SEO-aware.',
                tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues',
              },
              {
                title: 'Product Configurator',
                desc: 'Real-time variants, materials, and pricing. Add to cart or lead capture built-in.',
                tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues',
              },
              {
                title: 'Scrollytelling Page',
                desc: 'Narrative 3D sections with pinned steps & micro-interactions that tell a story.',
                tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues',
              },
            ].map((w) => (
              <div key={w.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold">{w.title}</h3>
                <p className="mt-3 text-slate-600 text-sm">{w.desc}</p>
                <p className="mt-4 text-xs text-slate-500 rounded-lg bg-slate-50 px-3 py-2">{w.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-slate-600">
              Value-based quotes by scope and complexity. Below are typical bands clients choose.
            </p>
            
            {/* Launch pricing callout */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-100 to-indigo-100 px-5 py-2 text-sm font-medium text-fuchsia-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-600 text-white text-xs">🚀</span>
              Launch pricing active • 50% off • Lock in for 6 months • 6 spots left
            </div>
          </div>

          {/* AI Ops Retainer */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center">AI Ops Retainer (agents & automations)</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Starter',
                  originalPrice: '$1,999',
                  launchPrice: '$999',
                  period: '/ mo',
                  features: ['1 agent / month', 'Dashboards & alerts', 'SLA: next-business-day'],
                  popular: false,
                },
                {
                  name: 'Growth',
                  originalPrice: '$3,999',
                  launchPrice: '$1,999',
                  period: '/ mo',
                  features: ['2–3 agents / month', 'A/B prompts & playbooks', 'SLA: 24h (prio)'],
                  popular: true,
                },
                {
                  name: 'Scale',
                  originalPrice: '$7,999',
                  launchPrice: '$3,999',
                  period: '/ mo',
                  features: ['4+ agents / month', 'Advanced analytics', 'SLA: same-day (prio)'],
                  popular: false,
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`relative rounded-2xl border p-6 shadow-sm ${
                    p.popular ? 'border-fuchsia-500 ring-2 ring-fuchsia-500 shadow-lg' : 'border-slate-200 bg-white'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  {/* Launch badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold">{p.name}</h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      50% OFF
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{p.launchPrice}</span>
                    <span className="text-slate-500">{p.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    <span className="line-through">{p.originalPrice}</span> regular price
                  </p>
                  
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {p.features.map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                  
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 font-medium transition ${
                      p.popular
                        ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400'
                        : 'border border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    Request Proposal
                  </a>
                  
                  <p className="mt-3 text-xs text-center text-slate-500">
                    Lock in launch rate for 6 months
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Websites & Interactive */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center">3D Websites & Interactive</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: '3D Hero',
                  originalPrice: '$8,000 – $20,000',
                  launchPrice: '$4,000 – $10,000',
                  features: ['Guided discovery', 'Optimized assets', '2–4 weeks'],
                },
                {
                  name: 'Configurator',
                  originalPrice: '$25,000 – $80,000',
                  launchPrice: '$12,000 – $40,000',
                  features: ['Variants & materials', 'Cart/lead capture', '4–8+ weeks'],
                },
                {
                  name: 'Scrollytelling Site',
                  originalPrice: '$15,000 – $60,000',
                  launchPrice: '$7,500 – $30,000',
                  features: ['Narrative sections', 'Perf budget & QA', '3–6 weeks'],
                },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold">{p.name}</h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      50% OFF
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold text-slate-900">{p.launchPrice}</div>
                  <p className="mt-1 text-sm text-slate-500">
                    <span className="line-through">{p.originalPrice}</span> regular price
                  </p>
                  
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {p.features.map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                  
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                  >
                    Request a Quote
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Classic Services */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center">Classic Services</h3>
            <p className="mt-2 text-center text-sm text-slate-600">Standard pricing (no launch discount)</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  name: 'Web Design & Dev',
                  price: '$3,000 – $150,000+',
                  features: ['5–20+ pages', 'Custom UX/CMS', '2–16+ weeks'],
                },
                {
                  name: 'App Dev (Flutter/MVP)',
                  price: '$30,000 – $250,000+',
                  features: ['Auth/payments', 'Admin & analytics', '8–52 weeks'],
                },
                {
                  name: 'Branding & Identity',
                  price: '$1,500 – $100,000+',
                  features: ['Logo & system', 'Guidelines & launch', '2–12+ weeks'],
                },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="text-xl font-semibold">{p.name}</h4>
                  <div className="mt-4 text-2xl font-bold text-slate-900">{p.price}</div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {p.features.map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                  >
                    Request a Quote
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { q: 'Which models do you use?', a: 'We pick per use-case (OpenAI/Anthropic/etc.) and can swap for quality/cost. Data is isolated per client.' },
              { q: 'How do you keep agents safe?', a: 'Guardrails, role & rate limits, approval steps, audit trails, and transcripts. Sensitive actions require human sign-off.' },
              { q: 'What about performance on 3D pages?', a: 'We budget assets, lazy-load, and measure Core Web Vitals. We ship fast fallbacks for low-end devices.' },
              { q: 'Do you work globally?', a: 'Yes—worldwide. USD pricing. Cards and bank transfer supported.' },
              { q: 'What happens after 10 clients?', a: 'Launch pricing ends and we return to regular rates. Lock in your spot now to secure 50% off for 6 months.' },
              { q: 'Can I upgrade my plan later?', a: 'Yes! You can upgrade anytime and keep your launch pricing discount on the new tier.' },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-slate-600 text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold">Get your free 3-point audit</h2>
              <p className="mt-2 text-slate-600 max-w-xl">
                Send your URL and goals. We'll reply within 24 hours with quick wins and a fixed quote.
              </p>
              
              {/* Launch urgency reminder */}
              <div className="mt-6 rounded-xl bg-gradient-to-r from-fuchsia-50 to-indigo-50 border border-fuchsia-200 p-4">
                <p className="text-sm font-medium text-fuchsia-900">
                  🚀 <strong>6 launch spots remaining</strong> at 50% off
                </p>
                <p className="mt-1 text-xs text-fuchsia-700">
                  Book a call today to secure your discounted rate before we return to regular pricing.
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

            {/* Form with proper labels for a11y; posts to /api/lead */}
            <form
              className="rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
              method="POST"
              action="/api/lead?redirect=/thank-you"
            >
              {/* honeypot */}
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

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Omega. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="mailto:hello@omegaappbuilder.com" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
      {/* Floating chat widget */}
      {/* <ChatWidget /> */}
    </main>
  );
}