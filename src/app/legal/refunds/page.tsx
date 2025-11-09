import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cancellations & Refunds — Omega",
  robots: { index: true, follow: true },
};

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Cancellations & Refunds</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-4">
        <p><strong>Digital Services.</strong> All purchases relate to digital services (no physical shipping) delivered remotely.</p>
        <p><strong>Discovery/Setup Fees.</strong> Fully refundable until kickoff call is scheduled; thereafter non-refundable.</p>
        <p><strong>Retainers.</strong> Cancel anytime with 30-day notice. Future months not billed; current month non-refundable once work starts.</p>
        <p><strong>Fixed-scope Projects.</strong> If cancelled mid-project, fees for completed milestones & work-in-progress are due.</p>
        <p><strong>Delivery Acceptance.</strong> 30-day window for defect fixes aligned to scope; change requests are new scope.</p>
        <p><strong>Refund Method/Timing.</strong> Original payment method; initiation within 5–7 business days after approval.</p>
        <p><strong>Contact.</strong> <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></p>
      </div>
    </main>
  );
}
