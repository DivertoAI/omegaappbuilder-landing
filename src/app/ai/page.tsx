import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Website Builder — Coming Soon",
  description:
    "A production-grade AI website builder that turns specs into fast, on-brand web experiences. Join the early access list.",
  openGraph: {
    title: "AI Website Builder — Coming Soon",
    description:
      "Turn product specs into a launch-ready website with conversion-focused structure, design, and copy.",
    url: "/ai",
    type: "website",
  },
};

export default function AiBuilderPage() {
  const calendlyUrl = "https://calendly.com/hello-omegaappbuilder/30min";

  const highlights = [
    {
      title: "Structured input → launch-ready output",
      description:
        "Share your product info once and generate a complete, conversion-ready site.",
    },
    {
      title: "On-brand visuals & messaging",
      description:
        "Tone, typography, and layout match your positioning and ICP.",
    },
    {
      title: "Exportable codebase",
      description:
        "Clean Next.js + Tailwind output you can hand to any dev team.",
    },
  ];

  const steps = [
    "Describe your product, ICP, and positioning.",
    "Review a structured outline and key sections.",
    "Approve the visual direction + copy drafts.",
    "Launch with high-performing defaults and analytics.",
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
              <a href="#overview" className="hover:text-fuchsia-600">Overview</a>
              <a href="#capabilities" className="hover:text-fuchsia-600">Capabilities</a>
              <a href="#early-access" className="hover:text-fuchsia-600">Early Access</a>
            </nav>
            <div className="flex items-center gap-3">
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

      <section id="overview" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
              Coming soon
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
              AI Website Builder
            </h1>
            <p className="mt-5 text-slate-600 text-lg">
              Turn product specs into a launch-ready website with conversion-focused structure,
              design, and copy. Built for founders who need speed without sacrificing quality.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#early-access"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Join Early Access
              </a>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Book a 15-min Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">Why teams want this</h2>
            <p className="mt-3 text-slate-600">
              The AI Builder is built to remove launch friction, keep design on-brand, and give
              founders a clean, production-ready codebase.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h3 className="text-xl font-semibold text-slate-900">How it works</h3>
              <p className="mt-3 text-slate-600">
                A guided workflow that keeps quality high and decisions clear.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ol className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 text-sm text-slate-600">
                {steps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="early-access" className="py-16 bg-slate-50/60 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-slate-900">Get early access</h2>
              <p className="mt-3 text-slate-600">
                Tell us about your product and goals. We will prioritize access for teams who can
                benefit most from the first release.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  You will also receive a quick audit of your current landing experience.
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
                aria-label="Send early access request"
              >
                Send Early Access Request
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
