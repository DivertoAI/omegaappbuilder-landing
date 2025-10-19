// src/app/page.tsx
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

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
                    {/* Uses /public/planet/scene.gltf */}
                    <Planet3D height={360} autoRotateSpeed={0.55} />
                  </div>

                  {/* 👇 Interaction hint */}
                  <p
                    id="globe-controls-hint"
                    className="px-6 pt-3 text-[11px] leading-5 text-slate-500 sm:text-xs"
                  >
                    Tip: <span className="font-medium text-slate-700">click & drag</span> to rotate •{' '}
                    <span className="font-medium text-slate-700">scroll or pinch</span> to zoom
                  </p>

                  <div className="px-6 py-5 border-t border-slate-200 bg-white">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['WebGL', 'Three.js', 'Spline-ready', 'GLTF', 'R3F/Drei', 'Performance-budgeted'].map((t) => (
                        <span key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">{t}</span>
                      ))}
                    </div>
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                    >
                      Book a 15-min Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* /3D preview card */}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200 bg-slate-50" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="trust-heading" className="sr-only">Trusted by</h2>
          <p className="mb-6 text-center text-sm text-slate-500">Trusted by founders and operators worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['NovaBank', 'QuickCart', 'OrbitOps', 'Healthly', 'Adscribe', 'Nimbus Labs'].map((name) => (
              <div key={name} className="px-3 py-2 rounded-full border border-slate-300 bg-white text-slate-600 text-xs sm:text-sm" aria-label={`Client: ${name}`}>
                {name}
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 text-center text-slate-600 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="font-semibold text-slate-900">+22%</span> more qualified demos (SDR agent)
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="font-semibold text-slate-900">41%</span> ticket deflection (support agent)
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="font-semibold text-slate-900">&lt;1.5s</span> LCP on core pages (mobile)
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents (Productized) */}
      <section id="agents" className="py-20 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">AI agents, productized</h2>
            <p className="mt-2 text-slate-600">
              Outcome-first automations with real guardrails. Connect CRM, calendar, email, ticketing, docs, and data.
              Human-in-the-loop when it matters.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'SDR Agent (Lead Gen)',
                desc: 'Qualifies and books meetings from site chat + email follow-ups. Logs to your CRM with UTM/context.',
                bullets: ['Calendars/HubSpot/Salesforce', 'Multi-channel (web, email, WhatsApp)', 'Playbooks + approvals'],
              },
              {
                title: 'Support & Success Agent',
                desc: 'Doc-aware answers, ticket triage, and secure escalation with full conversation context.',
                bullets: ['RAG over KB & product docs', 'Zendesk/Intercom/Email integration', 'CSAT & deflection metrics'],
              },
              {
                title: 'Ops & Backoffice Automations',
                desc: 'Reads spreadsheets/docs, updates systems, triggers workflows. Teams focus on edge cases.',
                bullets: ['Sheets/Notion/Drive', 'Zapier/Make/Direct APIs', 'Audits & transcripts'],
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                  {c.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Get an Agent Demo
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Websites & Experiences */}
      <section id="web3d" className="py-20 border-t border-slate-200 bg-slate-50 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">3D websites & interactive brand moments</h2>
            <p className="mt-2 text-slate-600">
              Tasteful, performant 3D: product tours, hero scenes, configurators, and scrollytelling.
              Built with Three.js, Spline, Model-Viewer—budgeted for speed.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: '3D Hero Scene',
                desc: 'Animated, interactive hero that showcases your product. Mobile-friendly & SEO-aware.',
              },
              {
                title: 'Product Configurator',
                desc: 'Real-time variants, materials, and pricing. Add to cart or lead capture built-in.',
              },
              {
                title: 'Scrollytelling Page',
                desc: 'Narrative 3D sections with pinned steps & micro-interactions that tell a story.',
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
                <div className="mt-4 text-xs text-slate-500">Perf budget: LCP &lt; 2.0s • AA contrast • A11y cues</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      {/* <section id="work" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Recent work</h2>
            <p className="mt-2 text-slate-600">Snapshots—ask for a full walkthrough on the call.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((it, idx) => {
              const isContain = idx === 5;
              return (
                <figure key={it.src} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10]">
                    {!isContain ? (
                      <Image
                        src={it.src}
                        alt={it.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority={it.priority}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <Image
                          src={it.src}
                          alt={it.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain"
                          priority={it.priority}
                        />
                      </div>
                    )}
                  </div>
                  <figcaption className="p-4">
                    <p className="font-medium">{it.title}</p>
                    <p className="text-sm text-slate-600">{it.caption}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Pricing */}
      <section id="pricing" className="py-20 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-2 text-slate-600">
              Value-based quotes by scope and complexity. Below are typical bands clients choose.
            </p>
          </div>

          {/* AI Ops Retainer */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold">AI Ops Retainer (agents & automations)</h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              {[
                { name: 'Starter', price: '$1,999 / mo', features: ['1 agent / month', 'Dashboards & alerts', 'SLA: next-business-day'] },
                { name: 'Growth', price: '$3,999 / mo', features: ['2–3 agents / month', 'A/B prompts & playbooks', 'SLA: 24h (prio)'], highlight: true },
                { name: 'Scale', price: '$7,999 / mo', features: ['4+ agents / month', 'Advanced analytics', 'SLA: same-day (prio)'] },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl border ${p.highlight ? 'border-fuchsia-300' : 'border-slate-200'} bg-white p-6 shadow-sm`}>
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <div className="mt-1 text-2xl font-bold">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                  >
                    Request Proposal
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Websites & Interactive */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold">3D Websites & Interactive</h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              {[
                { name: '3D Hero', price: '$8,000 – $20,000', features: ['Guided discovery', 'Optimized assets', '2–4 weeks'] },
                { name: 'Configurator', price: '$25,000 – $80,000', features: ['Variants & materials', 'Cart/lead capture', '4–8+ weeks'], highlight: true },
                { name: 'Scrollytelling Site', price: '$15,000 – $60,000', features: ['Narrative sections', 'Perf budget & QA', '3–6 weeks'] },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl border ${p.highlight ? 'border-fuchsia-300' : 'border-slate-200'} bg-white p-6 shadow-sm`}>
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <div className="mt-1 text-2xl font-bold">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
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

          {/* Classic Services (brief) */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold">Classic Services</h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              {[
                { name: 'Web Design & Dev', price: '$3,000 – $150,000+', features: ['5–20+ pages', 'Custom UX/CMS', '2–16+ weeks'] },
                { name: 'App Dev (Flutter/MVP)', price: '$30,000 – $250,000+', features: ['Auth/payments', 'Admin & analytics', '8–52 weeks'] },
                { name: 'Branding & Identity', price: '$1,500 – $100,000+', features: ['Logo & system', 'Guidelines & launch', '2–12+ weeks'] },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <div className="mt-1 text-2xl font-bold">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
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
                Send your URL and goals. We’ll reply within 24 hours with quick wins and a fixed quote.
              </p>
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