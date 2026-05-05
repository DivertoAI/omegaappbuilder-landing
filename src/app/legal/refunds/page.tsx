import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Omega App Builder",
  description: "Omega App Builder's refund and cancellation policy for AI agent and 3D web development services. Discovery fees are refundable before kickoff. Retainers require 30-day notice.",
  alternates: { canonical: "/legal/refunds" },
  robots: { index: true, follow: true },
};

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Cancellations & Refunds</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Digital Services</h2>
          <p className="mt-2">All Omega App Builder services are digital in nature — AI agent development, 3D web design, automation workflows, and related consulting. No physical goods are sold or shipped. Refund eligibility depends on the service type and the stage at which cancellation is requested.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Discovery & Setup Fees</h2>
          <p className="mt-2">Discovery and setup fees are fully refundable if cancellation is requested before the kickoff call is scheduled. Once the kickoff call has taken place and scoping work has begun, setup fees are non-refundable as significant upfront time has been invested.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Monthly Retainers</h2>
          <p className="mt-2">Retainer agreements (AI Ops, ongoing support) can be cancelled at any time with 30 days&apos; written notice to <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Future billing periods beyond the notice period will not be charged. The current billing period is non-refundable once work for that period has commenced.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Fixed-Scope Projects</h2>
          <p className="mt-2">For fixed-scope engagements (e.g., 3D hero scene, full web project), cancellation mid-project means all fees for completed milestones and work-in-progress (time and materials) are due and payable. Partially delivered work will be handed over in its current state. We do not charge for work not yet started at the point of cancellation.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Risk-Reversal Guarantee</h2>
          <p className="mt-2">For qualifying engagements where a risk-reversal guarantee applies: if we do not measurably improve the agreed conversion metric within the defined period, the service fee (not pass-through software/API costs) will not be charged. Specific terms are documented in your Statement of Work.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Delivery Acceptance & Defects</h2>
          <p className="mt-2">After final delivery, there is a 30-day window for raising defect issues that are within the original agreed scope. Defects are fixed at no additional cost. Requests for new features or scope changes during this window are treated as new work and quoted separately.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Refund Method & Timing</h2>
          <p className="mt-2">Approved refunds are returned via the original payment method (Razorpay or bank transfer). Refund initiation occurs within 5–7 business days of approval confirmation. Processing time thereafter depends on your bank or payment provider.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">How to Request a Refund</h2>
          <p className="mt-2">Email <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> with your project name, invoice reference, and reason for the request. We will respond within 2 business days.</p>
        </section>
      </div>
    </main>
  );
}
