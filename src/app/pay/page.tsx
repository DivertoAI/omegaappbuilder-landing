import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

const COMPANY = LEGAL.company || "Omega";
const EMAIL = LEGAL.email || "hello@omegaappbuilder.com";
const PHONE = LEGAL.phone || "+91 8170997368";

const PAYMENT_LINKS = [
  {
    id: "founding",
    title: "Founding Plan Deposit",
    subTitle: "Locks your build slot + scope workshop",
    amount: "₹50,000",
    cadence: "one-time",
    href: "https://rzp.io/i/omega-founding-plan",
    deliverables: [
      "20-min kickoff + detailed scope doc",
      "Reserved build window (7–10 biz days)",
      "Fully transferable if timelines shift",
    ],
  },
  {
    id: "agents",
    title: "AI Agent Sprint",
    subTitle: "SDR/support agent install + guardrails",
    amount: "₹1,10,000",
    cadence: "per sprint",
    href: "https://rzp.io/i/omega-agent-sprint",
    deliverables: [
      "Playbooks wired to CRM & inbox",
      "Transcripts + governance review",
      "Warranty handoff + async updates",
    ],
  },
  {
    id: "care",
    title: "Care Plan Retainer",
    subTitle: "Performance tuning, content & fixes",
    amount: "₹65,000",
    cadence: "monthly",
    href: "https://rzp.io/i/omega-care-plan",
    deliverables: [
      "Core Web Vitals watch + fixes",
      "Conversation QA + prompt refreshes",
      "Priority channel (Slack/WhatsApp)",
    ],
  },
] as const;

export const metadata: Metadata = {
  title: `${COMPANY} • Secure Razorpay Payments`,
  description:
    "Pay onboarding deposits, AI agent sprints, or retainers via Razorpay. Card, UPI, and netbanking supported.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pay" },
  openGraph: {
    title: `${COMPANY} — Pay via Razorpay`,
    description:
      "Hosted Razorpay links for deposits, sprints, and care plans. No cards stored on our servers.",
    url: "/pay",
  },
};

export default function PayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Secure checkout</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pay {COMPANY} via Razorpay</h1>
          <p className="mt-4 text-base text-slate-600">
            Hosted links run on Razorpay&apos;s PCI-DSS compliant stack. Card, UPI, and netbanking are supported. We
            never store card numbers or OTP data — everything flows through Razorpay.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 tracking-tight">
              🔒 3D Secure, OTP, and device binding handled by Razorpay
            </span>
            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 tracking-tight">
              📄 GST invoices issued after payment confirmation
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PAYMENT_LINKS.map((link) => (
            <article
              key={link.id}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 backdrop-blur shadow-sm"
            >
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{link.cadence}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{link.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{link.subTitle}</p>
                <p className="mt-4 text-4xl font-bold text-slate-900">{link.amount}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  {link.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-fuchsia-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Pay on Razorpay
              </a>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
          <h3 className="text-lg font-semibold text-slate-900">Need a different amount or PO?</h3>
          <p className="mt-3">
            Email <a className="font-medium text-fuchsia-600" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a> or call <a className="font-medium text-fuchsia-600" href={`tel:${PHONE}`}>
              {PHONE}
            </a>. We can issue a fresh Razorpay link, split payments, or share banking details for offline transfers.
          </p>
          <p className="mt-3">
            Receipts and GST invoices are delivered automatically once Razorpay marks the payment as captured. Please
            include your legal entity name and GSTIN (if applicable) in the payment notes so we can attribute it
            correctly.
          </p>
        </div>
      </section>
    </main>
  );
}
