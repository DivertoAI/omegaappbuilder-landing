import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Shipping Policy — Omega",
  robots: { index: true, follow: true },
};

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Shipping Policy</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-4">
        <p><strong>Digital Services Only.</strong> We provide digital services (no physical shipping) and deliver everything remotely.</p>
        <p><strong>Deliverables.</strong> Source files, links, dashboards, and access credentials as applicable.</p>
        <p><strong>Timelines.</strong> As per your quote/SOW; progress updates via email/PM tools.</p>
        <p><strong>Returns.</strong> Not applicable. See “Cancellations & Refunds.”</p>
        <p><strong>Contact.</strong> <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></p>
      </div>
    </main>
  );
}
