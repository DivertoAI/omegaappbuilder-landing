import type { Metadata } from 'next';
import Link from 'next/link';
import OmegaTopNav from '@/components/layout/OmegaTopNav';

export const metadata: Metadata = {
  title: 'Omega AI Builder Workflow',
  description:
    'A clear workflow for building with Omega: scope, select stack, and ship with live previews and deploy-ready output.',
  openGraph: {
    title: 'Omega AI Builder Workflow',
    description:
      'Scope, plan, and ship with Omega. Clear steps for reliable multi-platform builds.',
    url: '/workflow',
    type: 'website',
  },
};

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <OmegaTopNav active="workflow" variant="pricing" />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
              Omega Workflow
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
              Build with clarity, ship with confidence.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Omega turns a single brief into a structured plan, clean codebase, and live preview
              across web, mobile, desktop, and wearable surfaces.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ai"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
              >
                Start a build
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Describe the product',
                description:
                  'Share the goal, audience, and platforms (web, mobile, desktop, wearable).',
              },
              {
                title: 'Pick stack + architecture',
                description:
                  'Choose preferred frameworks or let Omega recommend the best fit.',
              },
              {
                title: 'Generate + ship',
                description:
                  'Get clean code, previews, and a deploy-ready build in one workspace.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Starter',
                detail: 'Free plan',
                credits: '$0.25 daily credits',
                notes: 'Omega 1 agent with limited autonomy for quick MVPs.',
              },
              {
                name: 'Core',
                detail: '$20 / month (billed annually)',
                credits: '25 monthly credits',
                notes: 'Omega 2 agent with long builds, previews, and publish-ready output.',
              },
              {
                name: 'Teams',
                detail: '$35 / month (billed annually)',
                credits: '40 monthly credits',
                notes: 'Omega 3 agent with shared workspaces, billing, and collaboration.',
              },
              {
                name: 'Enterprise',
                detail: 'Custom pricing',
                credits: 'Custom credits + capacity',
                notes: 'Omega 3 agent with SSO, privacy controls, and dedicated support.',
              },
            ].map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">{tier.name}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tier.detail}</p>
                <p className="mt-2 text-sm text-slate-600">{tier.credits}</p>
                <p className="mt-4 text-sm text-slate-500">{tier.notes}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Credit multipliers</h3>
              <p className="mt-2 text-sm text-slate-600">
                Credits scale with agent complexity and autonomy depth.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {[
                  { name: 'Omega 1', value: '0.6x' },
                  { name: 'Omega 2', value: '1.0x' },
                  { name: 'Omega 3', value: '1.4x' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Autonomy multipliers</h3>
              <p className="mt-2 text-sm text-slate-600">
                Higher autonomy levels use more credits per build.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {[
                  { name: 'Standard', value: '1.0x' },
                  { name: 'Advanced', value: '1.5x' },
                  { name: 'Elite', value: '2.0x' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
