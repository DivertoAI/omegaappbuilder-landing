import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Omega AI Website Builder",
  description:
    "A production-grade AI website builder UI for chat-driven site generation, live preview, file tree, and build logs.",
  openGraph: {
    title: "Omega AI Website Builder",
    description:
      "Chat-driven website building with live preview, files, and build logs.",
    url: "/ai",
    type: "website",
  },
};

export default function AiBuilderPage() {
  const calendlyUrl = "https://calendly.com/hello-omegaappbuilder/30min";

  const fileTree = [
    "app/",
    "  page.tsx",
    "  layout.tsx",
    "components/",
    "  Hero.tsx",
    "  Pricing.tsx",
    "public/",
    "  logo.svg",
    "  preview.png",
    "styles/",
    "  globals.css",
  ];

  const logs = [
    "14:22:11  Parsing project scope and target platforms",
    "14:22:15  Generating architecture + component map",
    "14:22:22  Writing UI shell, auth flow, and data layer",
    "14:22:28  Building previews for web + mobile",
    "14:22:35  Linting, tests, and bundle optimization",
    "14:22:41  Build ready: Previews available",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
              <span className="font-semibold tracking-tight">
                Omega — AI Agents • 3D Web • Apps
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#builder" className="hover:text-fuchsia-600">Builder</a>
              <a href="#workflow" className="hover:text-fuchsia-600">Workflow</a>
              <a href="#contact" className="hover:text-fuchsia-600">Contact</a>
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Credits</p>
                  <p className="text-sm font-semibold text-slate-900">6,420</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Tier</p>
                  <p className="text-sm font-semibold text-slate-900">Growth</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  Manage
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold">
                  DS
                </span>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Account</p>
                  <p className="text-sm font-semibold text-slate-900">Diverto Studio</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  Settings
                </button>
              </div>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="builder" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Omega AI Builder
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                Build websites, apps, and full products from a single prompt.
              </h1>
              <p className="mt-4 text-slate-600 text-lg">
                Web, mobile (iOS/Android), desktop (macOS/Windows/Linux), and wearable-ready builds
                with chat-guided specs, live previews, and production-grade output.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Credits + subscription based. Higher tiers unlock higher-reasoning models for deeper
                architecture and planning.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:from-fuchsia-400 hover:to-indigo-400">
                Start a new build
              </button>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Book a live demo
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr] min-h-[70vh]">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Build chat</p>
                  <p className="text-xs text-slate-500">Guided setup for any product</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Live
                </span>
              </div>
              <div className="flex-1 space-y-4 px-4 py-5 text-sm text-slate-700 overflow-y-auto">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">You</p>
                  <p className="mt-1">
                    I want to build a product that works on web and mobile, with a modern onboarding flow.
                  </p>
                </div>
                <div className="rounded-2xl bg-fuchsia-50/70 p-3">
                  <p className="text-xs font-semibold text-fuchsia-700">Omega AI</p>
                  <p className="mt-1">
                    Great — let’s scope it. Answer a few quick questions so I can generate the right
                    architecture, UI, and codebase.
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <p>1) What are you building? (Website, web app, mobile app, desktop app, smartwatch)</p>
                    <p>2) Target platforms? (iOS, Android, macOS, Windows, Linux, web)</p>
                    <p>3) Preferred stack? (Next.js, React Native, Flutter, Electron, Tauri, etc.)</p>
                    <p>4) Any architecture preference? (Monolith, modular, microservices, serverless)</p>
                    <p>5) Key features and integrations? (Auth, payments, CRM, analytics)</p>
                    <p>6) Starting from scratch or importing an existing project folder?</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">You</p>
                  <p className="mt-1">
                    Mobile app for iOS + Android, React Native, modular architecture, OAuth login, and Stripe.
                  </p>
                </div>
                <div className="rounded-2xl bg-fuchsia-50/70 p-3">
                  <p className="text-xs font-semibold text-fuchsia-700">Omega AI</p>
                  <p className="mt-1">
                    Perfect. I’m generating the app shell, auth flow, and billing screens. Preview in 30 seconds.
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-200 px-4 py-4 mt-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-1">Website</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Web app</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">iOS</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Android</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Desktop</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Smartwatch</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Import folder</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="flex-1">Describe your project or answer the guided questions...</span>
                    <button
                      aria-label="Send message"
                      className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 p-2 text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M3.4 20.6 21 12 3.4 3.4 2.5 10l10 2-10 2 .9 6.6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      Project: Omega AI Build
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      Preview ready
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 px-2 py-1">Web</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">iOS</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">Android</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">Desktop</span>
                  </div>
                </div>
                <div className="border-b border-slate-200 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-sm text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-900">Import an existing project</p>
                      <p className="text-xs text-slate-500">
                        Drop your project folder to finish or modify it. We will map the structure and continue the build.
                      </p>
                    </div>
                    <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Upload folder
                    </button>
                  </div>
                </div>
                <div className="grid gap-0 xl:grid-cols-[240px_1fr]">
                  <aside className="border-r border-slate-200 bg-slate-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Files
                    </p>
                    <ul className="mt-3 space-y-1 text-xs text-slate-600 font-mono">
                      {fileTree.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </aside>
                  <div className="flex flex-col">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Live Preview
                      </p>
                      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="aspect-[16/9] w-full rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center text-xs text-slate-400">
                          Website preview renders here
                        </div>
                      </div>
                    </div>
                  <div className="flex-1 bg-slate-900 px-4 py-4 font-mono text-xs text-slate-100">
                    <p className="text-slate-400">/app/mobile/App.tsx</p>
                    <pre className="mt-3 whitespace-pre-wrap text-slate-200">
{`export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Auth" component={AuthFlow} />
        <Stack.Screen name="Home" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Build terminal</p>
                  <span className="text-xs text-slate-500">omega-builder@latest</span>
                </div>
                <div className="bg-slate-950 px-4 py-4 font-mono text-xs text-emerald-200 space-y-2">
                  {logs.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Describe the product",
                description:
                  "Share the product goal, audience, and platforms (web, mobile, desktop, wearable).",
              },
              {
                title: "Pick stack + architecture",
                description:
                  "Choose preferred frameworks or let the AI recommend the best fit.",
              },
              {
                title: "Generate + ship",
                description:
                  "Get clean code, previews, and a deploy-ready build in one workspace.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                detail: "Lower reasoning model",
                credits: "2,000 credits / mo",
                notes: "Great for simple websites and MVPs.",
              },
              {
                name: "Growth",
                detail: "Balanced reasoning model",
                credits: "8,000 credits / mo",
                notes: "Best for full web apps and mobile builds.",
              },
              {
                name: "Elite",
                detail: "Highest reasoning model",
                credits: "20,000 credits / mo",
                notes: "Ideal for complex systems and multi-platform products.",
              },
            ].map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">{tier.name}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tier.detail}</p>
                <p className="mt-2 text-sm text-slate-600">{tier.credits}</p>
                <p className="mt-4 text-sm text-slate-500">{tier.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-slate-50/60 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-slate-900">Start your build</h2>
              <p className="mt-3 text-slate-600">
                Share your product, goals, and timeline. We will map the build scope, confirm your
                content needs, and send a clear delivery plan.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  You will receive a quick audit of your current site and a build outline within 48 hours.
                </p>
              </div>
            </div>

            <form
              className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
              method="POST"
              action="/api/lead?redirect=/thank-you"
            >
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="ai_builder" />

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
                  placeholder="What should the AI builder help you ship?"
                  name="message"
                />
              </label>

              <button
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                aria-label="Send builder request"
              >
                Send Builder Request
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
