import type { Metadata } from 'next';
import OmegaTopNav from '@/components/layout/OmegaTopNav';

export const metadata: Metadata = {
  title: 'Contact Omega',
  description: 'Start your Omega build. Share your goals and we will map the scope and timeline.',
  openGraph: {
    title: 'Contact Omega',
    description: 'Share your goals and we will map the build scope and timeline.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <OmegaTopNav active="contact" variant="pricing" />

      <section className="py-16 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Contact
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
                Start your build
              </h1>
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
