import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: `About ${LEGAL?.company ?? "Omega"} — AI Agents, 3D Web, Apps`,
  description:
    "Senior AI/automation & 3D web studio delivering measurable outcomes: SDR/support agents and performant 3D sites with clear scopes, governance, and polish.",
  robots: { index: true, follow: true },
  openGraph: {
    title: `About ${LEGAL?.company ?? "Omega"}`,
    description:
      "AI agents that book meetings & resolve tickets, and 3D websites that convert. Outcome-first, enterprise polish.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  const company = LEGAL?.company ?? "Omega";

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 py-12 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">About {company}</h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: {LEGAL?.lastUpdated ?? "09 Nov 2025"}
      </p>

      <section className="mt-8 space-y-5 leading-relaxed">
        <p>
          {company} is a senior studio focused on outcomes:{" "}
          <strong>AI agents</strong> that book meetings & resolve tickets, and{" "}
          <strong>3D websites</strong> that make people stop and engage. We wire agents
          into your CRM, calendar, and inbox with guardrails; we build WebGL experiences
          that stay fast and accessible.
        </p>

        <h2 className="text-xl font-semibold text-slate-900">Who we help</h2>
        <p>
          Funded founders and growth teams who want predictable pipeline and support
          deflection—without babysitting another tool. We ship clean scopes, sensible
          approvals, and clear SLAs.
        </p>

        <h2 className="text-xl font-semibold text-slate-900">Proof & principles</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>+22% qualified demos</strong> from SDR agents on typical installs.</li>
          <li><strong>~41% ticket deflection</strong> for support agents with docs wired in.</li>
          <li><strong>&lt;1.5s LCP</strong> on core 3D pages (mobile budgets, lazy-load, fallbacks).</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">How we work</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Discover → Scope:</strong> quick audit and fixed quote.</li>
          <li><strong>Build → Govern:</strong> agents/playbooks or 3D builds with approvals.</li>
          <li><strong>QA → Measure:</strong> guardrails, transcripts, Core Web Vitals.</li>
        </ol>

        <h2 className="text-xl font-semibold text-slate-900 mt-8">About the founder</h2>
        <p className="mt-2">
          Omega is led by <strong>Saswata Saha</strong>, a senior software engineer with <strong>10+ years</strong> of experience
          across AI, automation, and high-performance frontends.
        </p>

        <p className="mt-6">
          — <strong>Saswata Saha</strong>, Senior Software Engineer & Founder •{" "}
          <a className="underline" href={`mailto:${LEGAL?.email ?? "hello@omegaappbuilder.com"}`}>
            {LEGAL?.email ?? "hello@omegaappbuilder.com"}
          </a>
        </p>

        <div className="mt-8">
          <a
            href="/#contact"
            className="inline-flex rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
          >
            Get a 3-point free audit
          </a>
        </div>
      </section>
    </main>
  );
}
