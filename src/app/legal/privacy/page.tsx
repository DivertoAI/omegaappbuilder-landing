import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Omega App Builder",
  description: "How Omega App Builder collects, uses, and protects your personal data. We do not sell data. Inquiry records retained up to 24 months; payments handled by Razorpay.",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm">Last updated: {LEGAL.lastUpdated}</p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-900">1. What We Collect</h2>
          <p className="mt-2">When you contact us or use our services, we may collect your name, email address, company name, website URL, and any messages you submit. If you book a call via Calendly, that service collects scheduling data under its own privacy policy. Payment information is handled entirely by Razorpay — we do not store card numbers or full payment credentials on our systems.</p>
          <p className="mt-2">We also collect standard web analytics data (page views, referrer, device type) via Cloudflare Insights to understand site performance. This data is aggregated and not linked to your identity.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">2. Why We Use Your Data</h2>
          <p className="mt-2">We use the information you share to respond to inquiries, prepare scoping quotes, deliver contracted services, send project updates, and comply with applicable laws. We do not use your data for advertising profiling or sell it to third parties under any circumstances.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">3. Lawful Basis</h2>
          <p className="mt-2">For B2B enquiries, our lawful basis is legitimate interests — we have a genuine business reason to process contact data to respond to you. For active clients, processing is necessary to perform our contract. Where we send marketing updates, we rely on your consent, which you can withdraw at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">4. Data Sharing</h2>
          <p className="mt-2">We share data only with service providers necessary to run our business: Razorpay (payments), Calendly (scheduling), Cloudflare (analytics and CDN), and email providers. Each processor operates under its own terms and data processing agreements. We never sell, rent, or trade your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">5. International Transfers</h2>
          <p className="mt-2">Our business is based in India. Some processors (e.g., Cloudflare, Calendly) may process data outside India. Where required, we ensure appropriate safeguards such as standard contractual clauses are in place.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">6. Retention</h2>
          <p className="mt-2">Inquiry and lead data is retained for up to 24 months. Active client records are kept for the duration of the engagement plus any legally required retention period (typically 7 years for financial records under Indian tax law). You may request deletion of non-legally-required data at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">7. Your Rights</h2>
          <p className="mt-2">Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data, object to processing, or request data portability. To exercise any of these rights, email us at the address below. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">8. Cookies</h2>
          <p className="mt-2">We use minimal analytics cookies via Cloudflare Insights. No third-party advertising cookies are placed. You can disable cookies in your browser settings; core site functionality will not be affected.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">9. Security</h2>
          <p className="mt-2">We apply reasonable technical and organisational measures to protect your data, including HTTPS encryption, access controls, and environment-variable management of secrets. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900">10. Contact & Grievance</h2>
          <p className="mt-2">For privacy queries, data requests, or to raise a grievance, contact us at: <a className="underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. We will acknowledge your message within 2 business days.</p>
        </section>
      </div>
    </main>
  );
}
