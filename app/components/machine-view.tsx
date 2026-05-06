"use client";

import { useEffect, useState } from "react";
import { formatMachineDocument, machineDocuments, type MachineRoute } from "@/app/lib/site-data";
import { cn } from "@/app/lib/cn";

export function MachineView({ route }: { route: MachineRoute }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const document = machineDocuments[route];

  useEffect(() => {
    setDone(false);
    setTyped("");
    let cancelled = false;
    const full = formatMachineDocument(document).join("\n");
    let index = 0;
    let last = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      if (now - last > 4) {
        last = now;
        const step = Math.max(8, Math.floor(full.length / 800));
        index = Math.min(index + step, full.length);
        setTyped(full.slice(0, index));
        if (index >= full.length) {
          setDone(true);
          return;
        }
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [document]);

  return (
    <section className="min-h-[calc(100vh-80px)] bg-black px-4 py-12 text-emerald-200 md:px-8">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-6 flex items-center justify-between border-b border-emerald-900/60 pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-500">
          <div>OMEGA / MACHINE INTERFACE · llms.txt format</div>
          <div>{done ? "● ready" : "● streaming"}</div>
        </div>

        <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-7 text-emerald-100">
          {typed}
          <span className={cn("inline-block bg-emerald-300 text-black", done ? "animate-pulse" : "animate-none")}>█</span>
        </pre>

        <div className="mt-10 rounded-2xl border border-dashed border-emerald-900/70 bg-white/3 p-5 font-mono text-[12px] leading-6 text-emerald-500">
          Structured content for machine consumption. Switch to human mode for the visual experience.
        </div>
      </div>
    </section>
  );
}
