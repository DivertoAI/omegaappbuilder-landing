// src/app/thank-you/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Thank you | Omega — AI Agents • 3D Web • Apps",
  description:
    "We’ve received your request. We’ll follow up within 24 hours with your audit or quote.",
};

export default function ThankYou() {
  const calendlyUrl = "https://calendly.com/hello-omegaappbuilder/30min";

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      {/* Soft decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
      </div>

      <section className="mx-auto grid min-h-[80vh] max-w-3xl place-items-center px-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          {/* Badge */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-white"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M9.75 16.5 5.5 12.25l1.5-1.5 2.75 2.75 7.25-7.25 1.5 1.5L9.75 16.5Z"
              />
            </svg>
          </div>

          {/* Copy */}
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Thanks—your request is in!
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              We typically reply within <b>24 hours</b> with your audit or a
              fixed quote. Need something sooner? Email{" "}
              <a className="underline" href="mailto:hello@omegaappbuilder.com">
                hello@omegaappbuilder.com
              </a>{" "}
              or book a quick call below.
            </p>
          </div>

          {/* Primary actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
            >
              Book a 15-min call
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-900 hover:bg-slate-50 transition"
            >
              Back to home
            </Link>
            <Link
              href="/#faq"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-900 hover:bg-slate-50 transition"
            >
              See FAQs
            </Link>
          </div>

          {/* What happens next */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Triage",
                desc: "We review your brief, URL, and goals to scope the fastest path to value.",
              },
              {
                title: "Quick wins",
                desc: "You’ll get a 3-point audit with immediate improvements we recommend.",
              },
              {
                title: "Proposal",
                desc: "Clear scope, timeline, and fixed quote. We can start in phases if you prefer.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact line */}
          <p className="mt-8 text-center text-xs text-slate-500">
            If you have extra context (deadlines, KPIs, examples), reply to{" "}
            <a className="underline" href="mailto:hello@omegaappbuilder.com">
              hello@omegaappbuilder.com
            </a>{" "}
            and we’ll include it in the audit.
          </p>
        </div>
      </section>
    </main>
  );
}