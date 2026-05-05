import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Omega App Builder",
  description: "All Omega App Builder services are delivered digitally. No physical shipping. Learn about delivery timelines, milestone handoffs, and how we transfer files and credentials.",
  alternates: { canonical: "/legal/shipping" },
  robots: { index: true, follow: true },
};

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Shipping Policy</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Digital Services Only</h2>
          <p className="mt-2">Omega App Builder provides exclusively digital services — AI agent development, 3D web development, automation workflows, and related consulting. We do not manufacture, stock, or ship any physical goods. All deliverables are transferred electronically.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">What We Deliver</h2>
          <p className="mt-2">Depending on the scope of your project, deliverables may include:</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
            <li>Source code repositories (GitHub/GitLab access or ZIP export)</li>
            <li>Deployed application URLs and environment credentials</li>
            <li>Agent configuration files and prompt libraries</li>
            <li>Design files (Figma, exported assets)</li>
            <li>Documentation, runbooks, and handoff notes</li>
            <li>Dashboard access and API tokens as applicable</li>
          </ul>
          <p className="mt-2">All file transfers use secure methods (encrypted links, private repositories, or password-protected archives).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Delivery Timelines</h2>
          <p className="mt-2">Timelines are defined in your quote or Statement of Work (SOW). Typical ranges:</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
            <li>AI agent setup: 1–3 weeks depending on integrations</li>
            <li>3D hero scene: 2–4 weeks</li>
            <li>Full web project: 2–8 weeks</li>
            <li>MVP app development: 8–24 weeks</li>
          </ul>
          <p className="mt-2">You will receive progress updates via email or your agreed project management tool (Notion, Linear, etc.) at each milestone. We flag blockers early rather than delivering late without notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Acceptance & Handoff</h2>
          <p className="mt-2">Each deliverable milestone is subject to a review window (typically 5–7 business days). Feedback during this window is addressed within the agreed scope. Requests outside scope are quoted separately. Silence beyond the review window is treated as acceptance for that milestone.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Returns</h2>
          <p className="mt-2">Physical returns are not applicable. For service cancellations or disputes about deliverables, please refer to our <a className="underline" href="/legal/refunds">Cancellations &amp; Refunds Policy</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p className="mt-2">Delivery questions or handoff issues: <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></p>
        </section>
      </div>
    </main>
  );
}
