'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const Planet3D = dynamic(() => import('./Planet3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
      <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 shadow-sm">
        Loading 3D…
      </div>
    </div>
  ),
});

export default function HomePageClient() {
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-2">
            <a href="#home" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Omega logo"
                width={32}
                height={32}
                priority
              />
              <div className="leading-tight">
                <p className="text-xs font-semibold tracking-tight sm:text-sm">
                  Omega — AI Agents • 3D Web • Apps
                </p>
                <p className="hidden text-[11px] text-slate-500 sm:block">Studio</p>
              </div>
            </a>

            <nav className="hidden lg:flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-1 text-[12px] shadow-sm whitespace-nowrap">
              <a
                href="#agents"
                onClick={(e) => { e.preventDefault(); goTo('agents'); }}
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 whitespace-nowrap"
              >
                AI Agents
              </a>
              <a
                href="#web3d"
                onClick={(e) => { e.preventDefault(); goTo('web3d'); }}
                className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 whitespace-nowrap"
              >
                3D Websites
              </a>
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Products
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-3 w-96 whitespace-normal rounded-2xl border border-slate-200 bg-white shadow-xl opacity-0 translate-y-2 pointer-events-none transition group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                  <div className="p-3 grid gap-2">
                    <Link href="/voice-ai" className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-50">
                        <Image src="/icons/voice.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Integrated Voice Assistant</span>
                        <span className="block text-xs text-slate-500 leading-5">Answer calls 24/7 and book patients automatically.</span>
                      </span>
                    </Link>
                    <Link href="/ai" className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                        <Image src="/icons/app-builder.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">AI App Builder</span>
                        <span className="block text-xs text-slate-500 leading-5">Generate full products from a single brief.</span>
                      </span>
                    </Link>
                    <Link href="/omega-chat-api" className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                        <Image src="/icons/chat-api.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">Omega Chat API</span>
                        <span className="block text-xs text-slate-500 leading-5">Sign up, pay with Razorpay, get your auth token, and call chat completions.</span>
                      </span>
                    </Link>
                    <Link href="/omega-reach" className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <Image src="/icons/whatsapp-reach.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900 leading-5">Omega Reach - WhatsApp assistant</span>
                        <span className="block text-xs text-slate-500 leading-5">WhatsApp-first assistant for auto-replies, lead capture, and follow-up workflows.</span>
                      </span>
                    </Link>
                    <Link href="/omegareceptionist" className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                        <Image src="/icons/whatsapp-reach.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900 leading-5">Omega Receptionist</span>
                        <span className="block text-xs text-slate-500 leading-5">Human-like WhatsApp receptionist for inbound queries and bookings.</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/pricing" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 whitespace-nowrap">Pricing</Link>
              <a href="#faq" onClick={(e) => { e.preventDefault(); goTo('faq'); }} className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 whitespace-nowrap">FAQ</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }} className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600 whitespace-nowrap">Contact</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-main-menu"
                aria-label="Toggle navigation menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l10 10M15 5L5 15" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14M3 10h14M3 15h14" />
                  )}
                </svg>
              </button>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); goTo('contact'); setMobileMenuOpen(false); }}
                className="hidden sm:inline-flex rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 whitespace-nowrap"
              >
                Free Demo Funnel Audit
              </a>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:from-fuchsia-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 sm:px-4 whitespace-nowrap"
                aria-label="Book a call on Calendly (opens in a new tab)"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div id="mobile-main-menu" className="border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <a href="#agents" onClick={(e) => { e.preventDefault(); goTo('agents'); setMobileMenuOpen(false); }} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">AI Agents</a>
                <a href="#web3d" onClick={(e) => { e.preventDefault(); goTo('web3d'); setMobileMenuOpen(false); }} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">3D Websites</a>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">Products</p>
                  <div className="mt-1 grid gap-1">
                    <Link href="/voice-ai" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">Integrated Voice Assistant</Link>
                    <Link href="/ai" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">AI App Builder</Link>
                    <Link href="/omega-chat-api" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">Omega Chat API</Link>
                    <Link href="/omega-reach" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">Omega Reach</Link>
                    <Link href="/omegareceptionist" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">Omega Receptionist</Link>
                  </div>
                </div>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Pricing</Link>
                <a href="#faq" onClick={(e) => { e.preventDefault(); goTo('faq'); setMobileMenuOpen(false); }} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">FAQ</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); setMobileMenuOpen(false); }} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Contact</a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden scroll-mt-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                <span className="text-slate-900">We build AI SDRs and 3D funnels that increase demo bookings and conversion rates</span>{' '}
                <span className="text-fuchsia-600">— or we don&apos;t charge.</span>
              </h1>
              <p className="mt-5 text-slate-600 max-w-2xl">
                Founder-focused studio crafting measurable outcomes for funded SaaS, DevTools, AI, and fintech.
                SDR & Support agents wired to your CRM and inbox, plus immersive WebGL heroes (Three.js/Model-Viewer/Spline) that convert.
                Clear scopes, guardrails, enterprise polish.
              </p>
              <p className="mt-2 text-slate-600">
                Led by a senior software engineer (10+ years). If we don&apos;t measurably improve demo bookings or on-site conversion, you keep the assets and owe $0 on the service fee.*
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Get the Omega Demo Funnel Audit
                </a>
                <a
                  href="#agents"
                  onClick={(e) => { e.preventDefault(); goTo('agents'); }}
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  See Agent Use-Cases
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                *Risk-reversal applies to service fee only; software/usage costs (if any) are pass-through.
              </p>
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

            {/* 3D preview card — desktop only to prevent Three.js from loading on mobile */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200/50 to-indigo-200/50 blur-2xl rounded-3xl" aria-hidden="true" />
                <div className="relative rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-5">
                    <span className="text-sm font-medium text-slate-700">Live 3D Preview</span>
                    <span className="text-xs text-slate-500">interactive</span>
                  </div>
                  <div className="mt-3" aria-describedby="globe-controls-hint">
                    {/* Three.js only on md+ — avoids 25s LCP on mobile */}
                    <div className="hidden md:block">
                      <Planet3D />
                    </div>
                    <div className="md:hidden h-[360px] flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
                      <div className="text-center px-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100">
                          <svg className="h-10 w-10 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Interactive 3D on desktop</p>
                        <p className="mt-1 text-xs text-slate-500">WebGL • Three.js • Spline-ready</p>
                      </div>
                    </div>
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

      {/* Products Section */}
      <section id="products" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Products</h2>
            <p className="mt-4 text-slate-600">
              Focused, productized building blocks for revenue, support, and automation.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Integrated Voice Assistant', desc: 'Answer calls 24/7 and book patients automatically.', href: '/voice-ai' },
              { title: 'AI App Builder', desc: 'Generate full products from a single brief.', href: '/ai' },
              { title: 'Omega Chat API', desc: 'Sign up, pay with Razorpay, get your auth token, and call chat completions.', href: '/omega-chat-api' },
              { title: 'Omega Reach - WhatsApp assistant', desc: 'WhatsApp-first assistant for auto-replies, lead capture, and follow-up workflows.', href: '/omega-reach' },
            ].map((product) => (
              <div key={product.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{product.desc}</p>
                <Link href={product.href} className="mt-5 inline-flex items-center text-fuchsia-600 hover:text-fuchsia-700 font-medium text-sm">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof / Case Studies */}
      <section id="proof" className="py-20 border-t border-slate-200 bg-slate-50/50 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Proof founders can feel</h2>
            <p className="mt-4 text-slate-600">
              Quick, founder-friendly case studies (self-initiated + client) focused on demo bookings and conversion lifts.
              Want to see your version? We&apos;ll remake your hero for free and record a 90-sec audit.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'DevTools SaaS',
                metric: '+32% demo conversions in 21 days',
                bullets: [
                  'AI SDR follow-ups synced to HubSpot + Calendly',
                  'Hero rewrite with specific CTA + 3D pipeline visual',
                  'A/B test measured in GA + HubSpot deals created',
                ],
              },
              {
                title: 'AI Productivity Platform',
                metric: '40 hrs/week saved for the founder',
                bullets: [
                  'Agent triages inbound + sequences follow-ups',
                  'Slack alerts with transcript + approval gates',
                  'Bookings auto-logged to CRM; no manual data entry',
                ],
              },
              {
                title: 'Fintech platform',
                metric: '18% trial-start uplift in 30 days',
                bullets: [
                  '3D hero variant + clarified pricing CTA',
                  'Lead capture tied to product-qualified triggers',
                  'Playbook for SDR agent to chase trials → demos',
                ],
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Case Study</p>
                    <h3 className="mt-1 text-xl font-semibold">{c.title}</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {c.metric}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-center text-slate-500">
            *Some are self-initiated tear-downs to demonstrate the exact outcomes we deliver for funded SaaS/devtools/AI.
          </p>
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
              { title: '3D Hero Scene', desc: 'Animated, interactive hero that showcases your product. Mobile-friendly & SEO-aware.', tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues' },
              { title: 'Product Configurator', desc: 'Real-time variants, materials, and pricing. Add to cart or lead capture built-in.', tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues' },
              { title: 'Scrollytelling Page', desc: 'Narrative 3D sections with pinned steps & micro-interactions that tell a story.', tag: 'Perf budget: LCP < 2.0s • AA contrast • A11y cues' },
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

      {/* Free conversion teardown */}
      <section id="makeover" className="py-20 border-t border-slate-200 bg-white scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-100 to-indigo-100 px-4 py-2 text-xs font-semibold text-fuchsia-700">
                Omega Demo Funnel Audit (free)
              </div>
              <h2 className="mt-4 text-3xl font-bold">See your homepage rewritten & redesigned for conversions — free</h2>
              <p className="mt-3 text-slate-600 max-w-2xl">
                We&apos;ll remake your hero + fold 1 using 3D/AI, record a 90-second Loom-style audit, and show the agent playbook to capture the lift.
                Founder-friendly, zero obligations.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" aria-hidden="true" />
                  <span>Identify the 3 biggest conversion leaks on your homepage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" aria-hidden="true" />
                  <span>Ship a 3D/interactive hero mockup + CTA rewrite matched to your ICP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" aria-hidden="true" />
                  <span>Outline the AI SDR playbook to convert the new demand into booked demos.</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); goTo('contact'); }}
                  className="inline-flex rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-white font-medium hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Claim the free audit
                </a>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-800 font-medium hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Book a 15-min call
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500">2 audit slots per week • we respond in &lt;24h</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">What you&apos;ll receive</h3>
              <div className="mt-4 grid gap-3">
                {[
                  { title: '60–90 sec Loom-style teardown', desc: 'Screen walkthrough with callouts, not a generic talking head.' },
                  { title: '3D hero concept', desc: 'A quick visual showing how your product should appear above the fold.' },
                  { title: 'AI SDR playbook', desc: 'Suggested prompts, integrations, and guardrails for your ICP.' },
                  { title: 'Fixed quote (48h)', desc: 'Lock in founding rate; setup fee waived while slots last.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/70 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Simple engagements, scoped to outcomes</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Two clear paths — Essentials for your first agent or 3D hero, Growth for teams scaling AI ops and interactive web together. No upfront commitment.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
            >
              See Plans
            </Link>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Book a 20-min Call
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">Fixed quote within 48h after call · Risk-reversal: no lift = no service fee</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-t border-slate-200 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { q: 'Which Omega Agents do you use?', a: 'We pick the best Omega Agent per use-case and can swap for quality/cost. Data is isolated per client.' },
              { q: 'How do you keep agents safe?', a: 'Guardrails, role & rate limits, approval steps, audit trails, and transcripts. Sensitive actions require human sign-off.' },
              { q: 'What about performance on 3D pages?', a: 'We budget assets, lazy-load, and measure Core Web Vitals. We ship fast fallbacks for low-end devices.' },
              { q: 'Do you work globally?', a: 'Yes—worldwide. USD pricing. Cards and bank transfer supported.' },
              { q: 'How many founding slots are available?', a: 'We onboard 2 clients per month; 6 founding slots per quarter. Founding plan: setup fee waived + preferred rates for the first 3 months.' },
              { q: 'Can I upgrade my plan later?', a: 'Yes! You can upgrade anytime and keep your founding rate for the remainder of your 3‑month promo window.' },
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
              <h2 className="text-3xl font-bold">Get your Omega Demo Funnel Audit (free)</h2>
              <p className="mt-2 text-slate-600 max-w-xl">
                Send your URL and goals. We&apos;ll find the 3 biggest conversion leaks, show the 3D/AI fixes, and send a 60–90 sec Loom-style teardown within 24 hours.
              </p>
              <ul className="mt-6 space-y-3 text-slate-600 text-sm">
                <li>• Email: <a className="underline hover:text-slate-900" href="mailto:hello@omegaappbuilder.com">hello@omegaappbuilder.com</a></li>
                <li>• Call/Meet: <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">Book a 15-min slot</a></li>
                <li>• Based remotely • Worldwide</li>
              </ul>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm" method="POST" action="/site-api/lead?redirect=/thank-you">
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="free_audit_request" />
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Name</span>
                  <input className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="Your name" name="name" required />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Email</span>
                  <input className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" type="email" placeholder="you@company.com" name="email" required />
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Company</span>
                <input className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="Company" name="company" />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Website/App URL</span>
                <input className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="https://example.com" name="url" />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Goal (30 days)</span>
                <textarea className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[120px]" placeholder="What do you want to achieve in the next 30 days?" name="message" />
              </label>
              <button className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500" aria-label="Send audit request">
                Send Audit Request
              </button>
              <p className="text-xs text-slate-500">Submitting this form adds you to our updates. You can opt out anytime.</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
