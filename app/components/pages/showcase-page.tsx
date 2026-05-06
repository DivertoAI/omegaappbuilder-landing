"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
          <Card className="relative hidden min-h-[640px] overflow-hidden p-0 lg:block">
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

          <MobileShowcaseFallback />

          <div className="grid gap-6">
            <Card className="hidden p-6 lg:block">
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

            <Card className="hidden p-6 lg:block">
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

function MobileShowcaseFallback() {
  return (
    <Card className="overflow-hidden border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-0 lg:hidden">
      <div className="relative isolate overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.68_0.22_290/_0.18),transparent_42%),radial-gradient(circle_at_bottom,oklch(0.55_0.2_270/_0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,oklch(0.68_0.22_290/_0.24),transparent_70%)] blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,oklch(0.78_0.18_70/_0.16),transparent_70%)] blur-3xl" />

        <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
          <Badge className="rounded-full border border-[var(--line)] bg-[var(--bg)]/80 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--fg-2)]">
            Desktop only 3D
          </Badge>
          <h3 className="mt-5 text-3xl leading-[0.96] tracking-[-0.04em]">
            Open this showcase on a larger screen to explore the interactive 3D version.
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--fg-2)]">
            Mobile is optimized for the story, the details, and the next step. The full 3D walkthrough is best experienced on desktop.
          </p>

          <div className="mt-8 w-full rounded-[28px] border border-[var(--line)] bg-[rgba(8,8,12,0.78)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <MobileOrbitIllustration />
          </div>

          <div className="mt-6 grid w-full gap-3">
            <Button asChild variant="accent" className="w-full">
              <Link href="/contact">
                Book a desktop walkthrough <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/products">View the platform</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline">WebGL 2.0</Badge>
            <Badge variant="outline">GLTF / USDZ</Badge>
            <Badge variant="outline">VR ready</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MobileOrbitIllustration() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(140,90,255,0.24),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(120,190,255,0.12),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.22))]" />

      <div className="absolute inset-x-8 top-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />
      <div className="absolute inset-x-8 bottom-12 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />

      <div className="absolute h-60 w-60 animate-[spin_20s_linear_infinite] rounded-full border border-[var(--accent)]/40 shadow-[0_0_36px_var(--accent-glow)]" />
      <div className="absolute h-44 w-44 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-[var(--line)]/70" />
      <div className="absolute h-28 w-28 animate-pulse rounded-full bg-[radial-gradient(circle,oklch(0.68_0.22_290/_0.45),transparent_72%)]" />

      <div className="absolute left-1/2 top-1/2 h-44 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-3 top-3 h-10 rounded-[14px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-x-3 top-16 h-2 rounded-full bg-[var(--accent)]/80 shadow-[0_0_16px_var(--accent-glow)]" />
        <div className="absolute inset-x-3 bottom-3 flex gap-2">
          <div className="h-7 flex-1 rounded-[10px] bg-[var(--bg-2)]/90" />
          <div className="h-7 flex-1 rounded-[10px] bg-[var(--bg-2)]/90" />
        </div>
      </div>

      <div className="absolute left-5 top-8 rounded-full border border-[var(--line)] bg-[rgba(10,10,12,0.88)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--fg-2)]">
        3D preview
      </div>
      <div className="absolute bottom-8 right-5 rounded-full border border-[var(--line)] bg-[rgba(10,10,12,0.88)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--fg-2)]">
        Desktop only
      </div>
      <Sparkles className="absolute right-6 top-1/2 size-5 -translate-y-1/2 animate-pulse text-[var(--accent-2)] opacity-80" />
    </div>
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
