"use client";

type Props = {
  onTopup: (pack: "20" | "60" | "150") => void;
  loadingPack?: string | null;
};

const packs = [
  { key: "20" as const, label: "+20 credits", price: "$10" },
  { key: "60" as const, label: "+60 credits", price: "$25" },
  { key: "150" as const, label: "+150 credits", price: "$50" },
];

export default function TopUpPanel({ onTopup, loadingPack }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-800">Top up credits</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {packs.map((pack) => (
          <button
            key={pack.key}
            type="button"
            onClick={() => onTopup(pack.key)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
            disabled={loadingPack === pack.key}
          >
            {loadingPack === pack.key ? "Starting..." : `${pack.label} - ${pack.price}`}
          </button>
        ))}
      </div>
    </div>
  );
}
