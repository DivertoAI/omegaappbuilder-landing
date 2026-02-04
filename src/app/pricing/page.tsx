import type { Metadata } from 'next';
import Link from 'next/link';
import OmegaTopNav from '@/components/layout/OmegaTopNav';

export const metadata: Metadata = {
  title: 'Omega AI Builder Pricing',
  description:
    'Detailed pricing for the Omega AI Builder, including plans, credits, agent tiers, and add-ons.',
  openGraph: {
    title: 'Omega AI Builder Pricing',
    description:
      'Plans, credits, and agent tiers for the Omega AI Builder.',
    url: '/pricing',
    type: 'website',
  },
};

export default function PricingPage() {
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      cadence: 'Free plan',
      summary: 'Build anything in one workspace with limited autonomy.',
      bullets: [
        '$0.25 daily credits',
        'Free credits for AI integrations',
        'Publish 1 app',
        'Limited autonomy',
        'Omega Agent: Omega 1',
      ],
    },
    {
      name: 'Core',
      price: '$20',
      cadence: 'per month, billed annually',
      summary: 'Create, launch, and share your apps.',
      bullets: [
        '$25 monthly credits',
        'Access to Omega Agent 2',
        'Publish and host live apps',
        'Autonomous long builds',
        'Remove "Made with Omega" badge',
        'Pay-as-you-go for additional usage (1 credit = $1)',
        'Omega Agent: Omega 2',
      ],
    },
    {
      name: 'Teams',
      price: '$35',
      cadence: 'per month, billed annually',
      summary: 'Bring the power of Omega to your entire team.',
      bullets: [
        'Everything included with Core',
        '$40 monthly credits',
        'Upfront credits on annual plans',
        '50 viewer seats',
        'Centralized billing',
        'Role-based access control',
        'Private workspaces',
        'Pay-as-you-go for additional usage (1 credit = $1)',
        'Omega Agent: Omega 3',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      cadence: 'pricing',
      summary: 'Meet your security and performance needs.',
      bullets: [
        'Everything in Teams',
        'Custom viewer seats',
        'SSO / SAML',
        'SCIM',
        'Advanced privacy controls',
        'Design system support',
        'Data warehouse connections',
        'Dedicated support',
        'Omega Agent: Omega 3',
      ],
    },
  ];

  const compareSections = [
    {
      title: 'Omega AI',
      rows: [
        {
          label: 'Omega Agent',
          values: ['Free daily credits', 'Included', 'Included', 'Included'],
        },
        {
          label: 'Autonomy',
          values: ['Limited', 'Advanced', 'Advanced', 'Advanced'],
        },
        {
          label: 'Code completion',
          values: ['Basic', 'Advanced', 'Advanced', 'Advanced'],
        },
        {
          label: 'Code generation',
          values: ['Basic', 'Advanced', 'Advanced', 'Advanced'],
        },
        {
          label: 'Debugger',
          values: ['Basic', 'Advanced', 'Advanced', 'Advanced'],
        },
        {
          label: 'Omega Agent level',
          values: ['Omega 1', 'Omega 2', 'Omega 3', 'Omega 3'],
        },
        {
          label: 'Pay-as-you-go rate',
          values: ['1 credit = $1', '1 credit = $1', '1 credit = $1', 'Custom'],
        },
      ],
    },
    {
      title: 'Build and development',
      rows: [
        {
          label: 'Concurrent workspaces',
          values: ['1', '4', '8', 'Custom'],
        },
        {
          label: 'Build minutes per month',
          values: ['1,200', 'Unlimited', 'Unlimited', 'Unlimited'],
        },
        {
          label: 'Simulator preview add-on',
          values: ['Optional', 'Optional', 'Optional', 'Included'],
        },
        {
          label: 'Publish apps',
          values: ['1', 'Unlimited', 'Unlimited', 'Unlimited'],
        },
        {
          label: 'Private apps',
          values: ['-', 'Yes', 'Yes', 'Yes'],
        },
        {
          label: 'Collaborators',
          values: ['1', '3', 'All team members', 'All team members'],
        },
      ],
    },
    {
      title: 'Storage and exports',
      rows: [
        {
          label: 'Storage per app (GiB)',
          values: ['2', '50', '256', 'Custom'],
        },
        {
          label: 'Export formats',
          values: ['Standard', 'Advanced', 'Advanced', 'Custom'],
        },
        {
          label: 'Deployment integrations',
          values: ['Basic', 'Advanced', 'Advanced', 'Custom'],
        },
      ],
    },
    {
      title: 'Security and compliance',
      rows: [
        {
          label: 'Role-based access control',
          values: ['-', 'Yes', 'Yes', 'Yes'],
        },
        {
          label: 'SSO',
          values: ['-', '-', 'Optional', 'Included'],
        },
        {
          label: 'Private networks',
          values: ['-', '-', 'Optional', 'Included'],
        },
        {
          label: 'Custom invoicing',
          values: ['-', 'Optional', 'Optional', 'Included'],
        },
      ],
    },
    {
      title: 'Member support',
      rows: [
        {
          label: 'Support',
          values: ['Community', 'Standard', 'Priority', 'Dedicated'],
        },
        {
          label: 'Early access to new features',
          values: ['-', 'Yes', 'Yes', 'Yes'],
        },
        {
          label: 'Onboarding support',
          values: ['-', '-', 'Yes', 'White glove'],
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <OmegaTopNav active="pricing" variant="pricing" />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Omega AI Builder Pricing
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                Build. Edit. Deploy.
              </h1>
              <p className="mt-4 text-lg text-slate-700">
                Build websites, apps, and full products from a single prompt -{' '}
                <span className="font-semibold text-slate-900">with any tech stack that fits</span>.
              </p>
              <p className="mt-4 text-slate-600 text-lg">
                Plans combine a monthly subscription with usage-based credits. Credits track Omega Agent
                usage across builds, previews, and exports. Higher tiers unlock deeper autonomy, longer
                runs, and multi-platform output.
              </p>
              <p className="mt-3 text-sm text-slate-500">All prices in USD.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/ai"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Start a build
                </Link>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Talk to sales
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">What is included</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  'Unlimited project briefs and guided scoping.',
                  'Web preview, file tree, and editor output.',
                  'Import existing repos for upgrades or fixes.',
                  'Downloadable source code and export bundles.',
                  'Native simulator previews available as an add-on.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Need a custom plan or agency pricing? We can tailor credits, capacity, and support.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Plans and tiers</h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Choose the autonomy depth and monthly credits that match your build pipeline.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">{plan.name}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{plan.price}</p>
                <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">{plan.cadence}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{plan.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {plan.bullets.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="py-16 bg-slate-50/60 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Compare plans</h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                A detailed breakdown of what each plan includes.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white overflow-hidden">
            <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="px-4 py-3">Plan</div>
              {['Starter', 'Core', 'Teams', 'Enterprise'].map((plan) => (
                <div key={plan} className="px-4 py-3 text-center">{plan}</div>
              ))}
            </div>

            {compareSections.map((section) => (
              <div key={section.title} className="border-t border-slate-200">
                <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {section.title}
                </div>
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.5fr_repeat(4,1fr)] border-t border-slate-200 text-sm text-slate-600"
                  >
                    <div className="px-4 py-3 font-medium text-slate-700">{row.label}</div>
                    {row.values.map((value, index) => (
                      <div key={`${row.label}-${index}`} className="px-4 py-3 text-center">
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Get started with Omega Teams</h2>
              <p className="mt-2 text-sm text-slate-600">
                Get enhanced security and compute for professional developers and teams shipping to production.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium"
              >
                Talk to sales
              </a>
              <Link
                href="/ai"
                className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition font-medium"
              >
                Start a build
              </Link>
            </div>
          </div>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">
              &quot;The rapid prototypes we build with Omega shift the dialog from &apos;Should we?&apos; to
              &apos;How should we?&apos; and that is a world of difference when driving change.&quot;
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-900">
              Chris Stevens, CMO of a launch-focused SaaS studio
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
