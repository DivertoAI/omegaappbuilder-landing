import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Omega",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-4">
        <p><strong>What We Collect.</strong> Name, email, company, website URL, messages; site analytics/cookies. Payment info is handled by our processors (e.g., Razorpay/Stripe) — we do not store card details.</p>
        <p><strong>Why.</strong> Respond to inquiries, provide quotes/services, improve the site, comply with law.</p>
        <p><strong>Lawful Basis.</strong> Consent and legitimate interests (B2B), contract necessity for clients.</p>
        <p><strong>Sharing.</strong> Processors only (e.g., Razorpay, Calendly, analytics/email providers); no sale of personal data.</p>
        <p><strong>International Transfers.</strong> Data may be processed outside India with appropriate safeguards.</p>
        <p><strong>Retention.</strong> Inquiry data up to 24 months; client records per contract/tax law.</p>
        <p><strong>Your Choices.</strong> Access/correct/delete where applicable; opt-out of marketing anytime.</p>
        <p><strong>Cookies.</strong> Basic analytics; you can disable via your browser.</p>
        <p><strong>Security.</strong> Reasonable technical/organizational measures, but no method is 100% secure.</p>
        <p><strong>Service Nature.</strong> We provide digital services (no physical shipping); fulfillment occurs online.</p>
        <p><strong>Grievance/Contact.</strong> <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></p>
      </div>
    </main>
  );
}
