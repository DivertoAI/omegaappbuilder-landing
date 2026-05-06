"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { Building3D } from "@/app/components/building-3d";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

export function ShowcasePage() {
  const { mode } = useOmegaMode();
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  const [finish, setFinish] = useState<"warm" | "light" | "dark">("warm");
  const [time, setTime] = useState<"day" | "night">("day");

  if (mode === "machine") return <MachineView route="showcase" />;

  return (
    <>
      <PageHeader
        kicker="3D ENGINE"
        title={<>Walk it before they break ground.</>}
        sub="The Westbrook Towers - 14 floors, 142 units, six finish packages. Configured in your browser, no plugin."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <Card className="relative min-h-[640px] overflow-hidden p-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  time === "day"
                    ? "radial-gradient(ellipse at 70% 30%, oklch(0.4 0.08 60 / 0.4), transparent 60%)"
                    : "radial-gradient(ellipse at 30% 20%, oklch(0.4 0.18 290 / 0.5), transparent 60%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {view === "exterior" ? (
                <div className="h-[560px] w-full">
                  <Building3D />
                </div>
              ) : (
                <InteriorView finish={finish} time={time} />
              )}
            </div>
            <div className="absolute left-6 top-6 max-w-[320px] rounded-2xl border border-[var(--line)] bg-[rgba(8,8,12,0.85)] p-5 backdrop-blur-md">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]">● Active listing</div>
              <h3 className="text-2xl tracking-[-0.02em]">Westbrook Towers</h3>
              <div className="mt-1 text-sm text-[var(--fg-2)]">2400 Cesar Chavez · Austin, TX</div>
              <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[12px]">
                <div>
                  <div className="text-[var(--fg-3)]">From</div>
                  <div className="text-sm text-[var(--fg)]">$840K</div>
                </div>
                <div>
                  <div className="text-[var(--fg-3)]">Units</div>
                  <div className="text-sm text-[var(--fg)]">142 / 158</div>
                </div>
                <div>
                  <div className="text-[var(--fg-3)]">Floors</div>
                  <div className="text-sm text-[var(--fg)]">14</div>
                </div>
                <div>
                  <div className="text-[var(--fg-3)]">Ready</div>
                  <div className="text-sm text-[var(--fg)]">Q4 '26</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Controls</div>
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  {(["exterior", "interior"] as const).map((option) => (
                    <Button key={option} variant={view === option ? "accent" : "secondary"} onClick={() => setView(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["day", "night"] as const).map((option) => (
                    <Button key={option} variant={time === option ? "accent" : "secondary"} onClick={() => setTime(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["warm", "light", "dark"] as const).map((option) => (
                    <Button key={option} variant={finish === option ? "accent" : "secondary"} onClick={() => setFinish(option)}>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">What buyers do</div>
              <div className="grid gap-3 text-sm leading-7 text-[var(--fg-2)]">
                <p>Drag to orbit, switch finishes, and see the listing adapt in real time.</p>
                <p>One walkthrough replaces static renderings, PDFs, and long sales calls.</p>
              </div>
              <div className="mt-5 flex gap-2">
                <Badge variant="outline">WebGL 2.0</Badge>
                <Badge variant="outline">GLTF / USDZ</Badge>
                <Badge variant="outline">VR ready</Badge>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function InteriorView({ finish, time }: { finish: "warm" | "light" | "dark"; time: "day" | "night" }) {
  const palette = {
    warm: "from-[#d4a373] to-[#84563c]",
    light: "from-[#e2c7a6] to-[#c2b59b]",
    dark: "from-[#5b4a43] to-[#2d2627]",
  }[finish];

  return (
    <div className="relative h-[520px] w-[760px] max-w-[90%] overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--bg)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            time === "day"
              ? "radial-gradient(circle at 70% 18%, rgba(255,214,170,0.35), transparent 25%), linear-gradient(180deg, rgba(255,255,255,0.08), transparent)"
              : "radial-gradient(circle at 60% 16%, rgba(140,90,255,0.28), transparent 26%), linear-gradient(180deg, rgba(0,0,0,0.15), transparent)",
        }}
      />
      <div className="absolute inset-x-10 bottom-10 top-28 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
        <div className="absolute inset-x-8 top-8 h-40 rounded-[20px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute bottom-6 left-6 h-28 w-36 rounded-[18px] bg-gradient-to-br from-[var(--bg-3)] to-black/70" />
        <div className="absolute bottom-6 right-6 h-36 w-44 rounded-[18px] bg-gradient-to-br from-[var(--bg-3)] to-black/70" />
        <div className={`absolute left-1/2 top-[72px] h-32 w-40 -translate-x-1/2 rounded-[28px] bg-gradient-to-br ${palette} shadow-[0_0_30px_rgba(0,0,0,0.2)]`} />
        <div className="absolute inset-x-16 bottom-6 h-2 rounded-full bg-black/30" />
      </div>
      <div className="absolute right-6 top-6 rounded-full border border-[var(--line)] bg-[rgba(8,8,12,0.8)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-2)]">
        Interior preview
      </div>
    </div>
  );
}
