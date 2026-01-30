"use client";

type Props = {
  onSubscribe: (planKey: "starter" | "pro" | "scale") => void;
  loadingPlan?: string | null;
};

const tiers = [
  {
    key: "starter" as const,
    name: "Starter",
    price: "$29/mo",
    credits: "30 credits",
    summary: "For landing pages and quick marketing sites.",
  },
  {
    key: "pro" as const,
    name: "Pro",
    price: "$79/mo",
    credits: "120 credits",
    summary: "For growing web apps and dashboards.",
  },
  {
    key: "scale" as const,
    name: "Scale",
    price: "$199/mo",
    credits: "400 credits",
    summary: "For teams shipping multiple sites monthly.",
  },
];

export default function PricingPanel({ onSubscribe, loadingPlan }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        <p className="font-medium text-slate-900">Subscription required</p>
        <p className="mt-1 text-slate-500">
          Choose a plan to unlock builds. Credits reset each billing cycle.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{tier.name}</h3>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                {tier.credits}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">{tier.price}</p>
            <p className="mt-2 text-slate-500">{tier.summary}</p>
            <button
              type="button"
              onClick={() => onSubscribe(tier.key)}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white"
              disabled={loadingPlan === tier.key}
            >
              {loadingPlan === tier.key ? "Starting..." : `Subscribe to ${tier.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
