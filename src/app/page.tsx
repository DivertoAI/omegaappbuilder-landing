// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#home" className="flex items-center gap-2">
              {/* If you placed public/logo.png this will show it; else keep the fallback square */}
              <Image
                src="/logo.png"
                alt="Omega App Builder logo"
                width={32}
                height={32}
                priority
               
              />
              <span className="font-semibold tracking-tight">Omega App Builder</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#services" className="hover:text-fuchsia-600">Services</a>
              <a href="#work" className="hover:text-fuchsia-600">Work</a>
              <a href="#pricing" className="hover:text-fuchsia-600">Pricing</a>
              <a href="#faq" className="hover:text-fuchsia-600">FAQ</a>
              <a href="#contact" className="hover:text-fuchsia-600">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="#contact" className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 transition">Get Free Audit</a>
              <a href="https://calendly.com/your-handle/15min" className="inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition">Book a Call</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        {/* Redesigned decorative blobs (subtle, gradient) */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {/* Top-left blob */}
          <svg
            className="absolute -top-40 -left-28 h-[40rem] w-[40rem]"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="blobGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDF2FF" />
                <stop offset="100%" stopColor="#E9D5FF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#blobGrad1)"
              fillOpacity="0.7"
              d="M44.9,-65.1C57.9,-58.4,68.6,-48.3,74.1,-35.9C79.7,-23.6,80,-8.9,77.6,5.6C75.2,20.2,70.3,34.5,60.8,45.2C51.3,55.9,37.2,62.9,22.9,67.3C8.5,71.7,-6.1,73.6,-20.5,70.5C-34.8,67.3,-49,59,-59.2,47.2C-69.5,35.4,-75.8,20.1,-77.6,4.1C-79.4,-11.9,-76.7,-28.7,-68.7,-42.3C-60.8,-55.9,-47.7,-66.3,-33.1,-72.7C-18.5,-79.1,-9.3,-81.5,2.3,-85.2C13.9,-88.9,27.8,-93.8,44.9,-65.1Z"
              transform="translate(100 100)"
            />
          </svg>
          {/* Bottom-right blob */}
          <svg
            className="absolute -bottom-40 -right-28 h-[36rem] w-[36rem] rotate-12"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="blobGrad2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DBEAFE" />
                <stop offset="100%" stopColor="#E0E7FF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#blobGrad2)"
              fillOpacity="0.6"
              d="M44.9,-65.1C57.9,-58.4,68.6,-48.3,74.1,-35.9C79.7,-23.6,80,-8.9,77.6,5.6C75.2,20.2,70.3,34.5,60.8,45.2C51.3,55.9,37.2,62.9,22.9,67.3C8.5,71.7,-6.1,73.6,-20.5,70.5C-34.8,67.3,-49,59,-59.2,47.2C-69.5,35.4,-75.8,20.1,-77.6,4.1C-79.4,-11.9,-76.7,-28.7,-68.7,-42.3C-60.8,-55.9,-47.7,-66.3,-33.1,-72.7C-18.5,-79.1,-9.3,-81.5,2.3,-85.2C13.9,-88.9,27.8,-93.8,44.9,-65.1Z"
              transform="translate(100 100) rotate(18)"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Landing pages & product sites that <span className="text-fuchsia-600">convert</span>.
              </h1>
              <p className="mt-5 text-slate-600 max-w-2xl">
                We design and build high-performing landing pages, websites, and app UI with clear messaging, fast load
                times, and strong calls-to-action—so more visitors become customers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium"
                >
                  Get a 3-Point Free Audit
                </a>
                <a
                  href="#work"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  See Work
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                <span>✓ Typical turnaround: landing page 48–72h</span>
                <span>✓ App screen set: 3–5 days</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div
                  className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200/50 to-indigo-200/50 blur-2xl rounded-3xl"
                  aria-hidden="true"
                />
                <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Quick Quote</span>
                    <span className="text-xs text-slate-500">~2 min</span>
                  </div>
                  <form className="mt-4 grid gap-3" method="POST" action="#">
                    <input
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      placeholder="Your name"
                      name="name"
                      required
                    />
                    <input
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      type="email"
                      placeholder="Email"
                      name="email"
                      required
                    />
                    <input
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      placeholder="Company or project"
                      name="company"
                    />
                    <input
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      placeholder="URL (optional)"
                      name="url"
                    />
                    <select
                      name="service"
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option>Landing page</option>
                      <option>5-page website</option>
                      <option>App UI (5–10 screens)</option>
                      <option>Full-stack MVP</option>
                      <option>Marketing & CRO</option>
                    </select>
                    <textarea
                      className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[100px]"
                      placeholder="What do you need? (goals, deadline)"
                      name="message"
                    />
                    <button className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition">
                      Request Quote
                    </button>
                    <p className="text-xs text-slate-500">
                      Or email us:{" "}
                      <a className="underline hover:text-slate-800" href="mailto:hello@omegaappbuilder.com">
                        hello@omegaappbuilder.com
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-sm text-slate-500">Trusted by founders and marketers worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 opacity-80">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">What we ship</h2>
            <p className="mt-2 text-slate-600">Clear messaging. Fast builds. Measurable results.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Landing Pages", desc: "High-converting hero + proof + CTA, SEO-ready. Typical 48–72h." },
              { title: "5-Page Websites", desc: "Home, About, Features, Pricing, Contact. Clean, fast, responsive." },
              { title: "App UI (5–10 screens)", desc: "Flows in Figma with components, prototyping, and handoff." },
              { title: "Full-stack MVP", desc: "React/Next + Flutter/Firebase, auth, DB, basic admin. 1–2 weeks." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Recent work</h2>
            <p className="mt-2 text-slate-600">A few snapshots. Ask for a full walkthrough on the call.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <figure key={i} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[16/10] bg-gradient-to-br from-fuchsia-200/60 to-indigo-200/60 group-hover:from-fuchsia-300/70 group-hover:to-indigo-300/70 transition" />
                <figcaption className="p-4">
                  <p className="font-medium">Project {i + 1}</p>
                  <p className="text-sm text-slate-600">Landing/UX • Performance • Conversion</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-2 text-slate-600">Standard starting points. Fixed quotes after a quick call or free audit.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            {[
              { name: "Landing Page", priceINR: "₹20k+", priceUSD: "$350+", features: ["Hero + sections", "SEO + analytics", "48–72h turnaround"] },
              { name: "5-Page Website", priceINR: "₹35k+", priceUSD: "$600+", features: ["Home + 4 pages", "CMS optional", "1–2 weeks"] },
              { name: "App UI (5–10)", priceINR: "₹25k+", priceUSD: "$500+", features: ["Design system", "Clickable prototype", "Handoff"] },
              { name: "Full-stack MVP", priceINR: "₹2L+", priceUSD: "$3k+", features: ["Auth + DB", "Payments optional", "1–2 weeks"] },
            ].map((p, idx) => (
              <div
                key={p.name}
                className={
                  "rounded-2xl border " +
                  (idx === 0 ? "border-fuchsia-300" : "border-slate-200") +
                  " bg-white p-6 shadow-sm"
                }
              >
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold">
                  {p.priceINR}{" "}
                  <span className="text-base font-normal text-slate-500">({p.priceUSD})</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 list-disc list-inside">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                >
                  Request a Quote
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Audit & Plan", text: "Free 3-point audit + scope call. Fixed quote." },
              { step: "02", title: "Design", text: "Figma mockups with quick iteration (short looms for feedback)." },
              { step: "03", title: "Build", text: "Clean, responsive implementation with SEO and analytics." },
              { step: "04", title: "Launch & Optimize", text: "Ship fast, measure, and suggest improvements." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-slate-500">{s.step}</div>
                <div className="mt-1 text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { q: "How fast can you deliver?", a: "Landing pages typically in 48–72 hours. App UI sets in 3–5 days. Full MVPs in ~1–2 weeks depending on scope." },
              { q: "Do you work globally?", a: "Yes — worldwide. We price in USD (or local currency) and accept cards or bank transfer." },
              { q: "What do you need from us to start?", a: "Your URL (if any), a short description of your audience and offer, and any brand assets (logo, colors, fonts)." },
              { q: "Do we own the work?", a: "Yes. You receive editable source files and full rights on final payment." },
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
      <section id="contact" className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold">Get your free 3-point audit</h2>
              <p className="mt-2 text-slate-600 max-w-xl">
                Send your URL and goals. We’ll reply within 24 hours with quick wins and a fixed quote.
              </p>
              <ul className="mt-6 space-y-3 text-slate-600 text-sm">
                <li>
                  • Email:{" "}
                  <a className="underline hover:text-slate-900" href="mailto:hello@omegaappbuilder.com">
                    hello@omegaappbuilder.com
                  </a>
                </li>
                <li>
                  • Call/Meet:{" "}
                  <a className="underline hover:text-slate-900" href="https://calendly.com/your-handle/15min">
                    Book a 15-min slot
                  </a>
                </li>
                <li>• Based remotely • Worldwide</li>
              </ul>
            </div>
            <form className="rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm" method="POST" action="#">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Name"
                  name="name"
                  required
                />
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                />
              </div>
              <input
                className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Company"
                name="company"
              />
              <input
                className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Website/App URL"
                name="url"
              />
              <textarea
                className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[120px]"
                placeholder="What do you want to achieve in the next 30 days?"
                name="goal"
              />
              <button className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition">
                Send Audit Request
              </button>
              <p className="text-xs text-slate-500">Submitting this form adds you to our updates. You can opt out anytime.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Omega App Builder. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="mailto:hello@omegaappbuilder.com" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}