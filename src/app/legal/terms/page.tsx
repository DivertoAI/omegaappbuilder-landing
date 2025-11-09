import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — Omega",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-4">
        <p><strong>Scope.</strong> We provide AI agents, automations, and 3D/web development per accepted quotes/SOWs.</p>
        <p><strong>Fulfillment.</strong> All engagements are digital services (no physical shipping); deliverables are shared electronically.</p>
        <p><strong>Pricing & Payments.</strong> Setup fees and retainers as quoted; invoices due within 7–14 days; late fee may apply after the due date.</p>
        <p><strong>Changes.</strong> Out-of-scope requests are quoted separately.</p>
        <p><strong>IP.</strong> Client owns final deliverables upon full payment. We retain rights to internal tools/frameworks.</p>
        <p><strong>Confidentiality.</strong> Mutual confidentiality; sharing only with processors on a need-to-know basis.</p>
        <p><strong>Warranties.</strong> Workmanlike services; 30-day defect fix window for in-scope items.</p>
        <p><strong>Liability.</strong> Capped at fees paid in the prior 3 months; no indirect or consequential damages.</p>
        <p><strong>Governing Law.</strong> India; Courts at [Your City], India. Disputes → negotiation → arbitration (single arbitrator, English).</p>
        <p><strong>Updates.</strong> We may revise these Terms; continued use indicates acceptance.</p>
      </div>
    </main>
  );
}
