import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Contact Us — Omega",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const calendlyUrl = "https://calendly.com/hello-omegaappbuilder/30min";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-4">
        <p><strong>Company:</strong> {LEGAL.company}</p>
        <p>
          <strong>Email:</strong> <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        </p>
        <p><strong>Hours:</strong> Available 24/7 — we respond within one business day.</p>
        <p>
          <strong>Bookings:</strong>{" "}
          <a className="underline" href={calendlyUrl} target="_blank" rel="noopener noreferrer">
            Calendly link
          </a>
        </p>
        <p className="text-sm text-slate-500">We provide digital services (no physical shipping).</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Request a 3-point audit</h2>
        <p className="mt-2 text-sm text-slate-500">Answer a few quick questions and we will reply within one business day.</p>

        <form
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
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
      </section>
    </main>
  );
}
