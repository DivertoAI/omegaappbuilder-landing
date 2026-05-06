"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Building3D } from "@/app/components/building-3d";
import { OmegaMark } from "@/app/components/omega-mark";
import { Section, Eyebrow } from "@/app/components/site-shell";
import { heroStats, productTiles, whyOmega } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

function StatStrip() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--bg-2)]/90">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 md:grid-cols-4 md:px-8 md:py-12">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <div className="text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-[-0.05em]">{stat.value}</div>
            <div className="mt-2 text-sm text-[var(--fg-2)]">{stat.label}</div>
            {stat.note ? <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-3)]">{stat.note}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductTiles() {
  return (
    <Section>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>● THE STACK</Eyebrow>
          <h2 className="max-w-3xl text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Six products. <span className="font-serif italic text-[var(--fg-2)]">One</span> integrated platform.
          </h2>
        </div>
        <p className="max-w-md text-base leading-7 text-[var(--fg-2)]">
          Pick one module or run the full stack. Everything shares the same property graph, brand kit, and lead pipeline.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {productTiles.map((tile) => (
          <Link key={tile.title} href={tile.href} className={tile.span ?? ""}>
            <Card className="group relative min-h-[360px] overflow-hidden border-[var(--line)] bg-[var(--bg-2)] p-8 transition duration-300 hover:bg-[var(--bg-3)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{tile.kicker}</div>
              <h3 className="mt-4 text-3xl tracking-[-0.03em]">{tile.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--fg-2)]">{tile.desc}</p>
              <div className="absolute right-6 top-6 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-3)] transition group-hover:text-[var(--accent-2)]">
                Open
              </div>
              <div className="mt-8 flex min-h-[180px] items-end">{tile.visual === "building" ? <Building3D /> : <PreviewVisual kind={tile.visual} />}</div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function PreviewVisual({ kind }: { kind: string }) {
  if (kind === "site") {
    return (
      <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3">
        <div className="mb-3 flex gap-1.5">
          <div className="size-1.5 rounded-full bg-[var(--fg-3)]" />
          <div className="size-1.5 rounded-full bg-[var(--fg-3)]" />
          <div className="size-1.5 rounded-full bg-[var(--fg-3)]" />
        </div>
        <div className="mb-3 h-24 rounded-xl bg-[linear-gradient(135deg,oklch(0.3_0.12_290),oklch(0.2_0.06_290))]" />
        <div className="mb-2 h-1.5 w-2/3 rounded-full bg-[var(--fg-3)]" />
        <div className="mb-3 h-1 w-1/2 rounded-full bg-[var(--line-2)]" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 rounded-lg bg-[var(--bg-3)]" />
          <div className="h-8 rounded-lg bg-[var(--bg-3)]" />
          <div className="h-8 rounded-lg bg-[var(--bg-3)]" />
        </div>
      </div>
    );
  }
  if (kind === "phone") {
    return (
      <div className="mx-auto w-[110px] rounded-[22px] border-2 border-[var(--line-2)] bg-[var(--bg)] p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <div className="rounded-[16px] bg-[var(--bg-3)] p-2">
          <div className="mb-2 h-6 rounded-md bg-[linear-gradient(135deg,oklch(0.3_0.12_290),oklch(0.2_0.06_290))]" />
          <div className="mb-1 h-1 w-4/5 rounded-full bg-[var(--fg-3)]" />
          <div className="mb-3 h-1 w-3/5 rounded-full bg-[var(--line-2)]" />
          <div className="grid gap-1.5">
            <div className="h-4 rounded-md border border-[var(--line)] bg-[var(--bg)]" />
            <div className="h-4 rounded-md border border-[var(--line)] bg-[var(--bg)]" />
            <div className="h-4 rounded-md border border-[var(--line)] bg-[var(--bg)]" />
          </div>
        </div>
      </div>
    );
  }
  if (kind === "crm") {
    return (
      <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">Pipeline · 142 leads</div>
        <div className="grid grid-cols-4 gap-2">
          {["New", "Tour", "Offer", "Closed"].map((stage, index) => (
            <div key={stage} className="rounded-xl bg-[var(--bg-2)] p-2">
              <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--fg-3)]">{stage}</div>
              {Array.from({ length: 4 - index }).map((_, i) => (
                <div key={i} className="mb-2 rounded-md border border-[var(--line)] bg-[var(--bg-3)] p-2">
                  <div className="mb-1 h-1.5 w-4/5 rounded-full bg-[var(--fg-2)]" />
                  <div className="h-1 w-1/2 rounded-full bg-[var(--fg-3)]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "ops") {
    return (
      <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3 font-mono text-[10px]">
        <div className="mb-2 uppercase tracking-[0.12em] text-[var(--fg-3)]">Draw schedule · Q3</div>
        {[
          ["Foundation", 100],
          ["Framing", 80],
          ["MEP rough", 45],
          ["Drywall", 0],
        ].map(([label, value]) => (
          <div key={label} className="mb-3">
            <div className="mb-1 flex justify-between text-[var(--fg-2)]">
              <span>{label}</span>
              <span>{value as number}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-3)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3">
      <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">
        <span>Call · inbound</span>
        <span className="text-[var(--good)]">Live</span>
      </div>
      <div className="space-y-2">
        <div className="w-4/5 rounded-md bg-[var(--bg-3)] px-2 py-1 text-[10px] text-[var(--fg-2)]">Hi, is the 3-bed still available?</div>
        <div className="ml-auto w-4/5 rounded-md bg-[oklch(0.3_0.12_290)] px-2 py-1 text-[10px] text-[var(--fg)]">Yes. Saturday at 11 works?</div>
        <div className="w-2/3 rounded-md bg-[var(--bg-3)] px-2 py-1 text-[10px] text-[var(--fg-2)]">Saturday works.</div>
        <div className="ml-auto w-4/5 rounded-md bg-[oklch(0.3_0.12_290)] px-2 py-1 text-[10px] text-[var(--fg)]">Booked. Confirmation sent.</div>
      </div>
    </div>
  );
}

function WhySection() {
  return (
    <Section>
      <Eyebrow>● THE THESIS</Eyebrow>
      <h2 className="max-w-5xl text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">
        Builders shouldn't <span className="font-serif italic text-[var(--fg-2)]">integrate ten tools</span> to sell a unit.
      </h2>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {whyOmega.map((item, index) => (
          <div key={item.title}>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-2)]">{String(index + 1).padStart(2, "0")}</div>
            <h3 className="text-2xl tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-3 max-w-lg text-base leading-7 text-[var(--fg-2)]">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <Section className="pb-24">
      <div className="relative overflow-hidden rounded-[28px] border border-[oklch(0.4_0.15_290/_0.4)] bg-[linear-gradient(135deg,oklch(0.25_0.12_290),oklch(0.12_0.04_290))] px-6 py-16 md:px-12 md:py-24">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.25_290/_0.25),transparent_70%)] blur-3xl" />
        <Eyebrow accent>● Build with Omega</Eyebrow>
        <h2 className="max-w-4xl text-5xl leading-[0.92] tracking-[-0.05em] md:text-7xl">
          Stop assembling.
          <br />
          <span className="font-serif italic text-[var(--accent-2)]">Start shipping.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--fg-2)]">
          We onboard new builders in 14 days. Bring your floor plans, brand, and inventory. We handle the rest.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/contact">Book your walkthrough <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/crm">Try the CRM demo</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

function HumanHomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,oklch(0.68_0.22_290/_0.18),transparent_55%),radial-gradient(ellipse_at_20%_80%,oklch(0.55_0.2_270/_0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        <Section className="relative grid min-h-[calc(100vh-80px)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow accent>● Live · now building the next 1,000 properties</Eyebrow>
            <h1 className="max-w-4xl text-balance text-5xl leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-[5.8rem]">
              The operating system <span className="font-serif italic text-[var(--accent-2)]">for real estate</span> developers.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--fg-2)]">
              Omega builds the entire stack - interactive 3D properties, modern websites, mobile apps, AI CRM, ops platform, and autonomous agents - for US real estate builders and brokerages.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/contact">Book a 30-minute walkthrough <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/showcase">See a live 3D property</Link>
              </Button>
            </div>
            <div className="mt-12">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Trusted by US developers shipping → $4.2B in inventory</div>
              <div className="flex flex-wrap items-center gap-5 opacity-60">
                {["MERIDIAN", "Lennox & Co.", "ALTITUDE", "Westbrook", "PRISM HOMES", "Atlas Bldg"].map((name) => (
                  <span key={name} className="font-serif text-xl text-[var(--fg-2)]">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative h-[560px]">
            <Building3D />
            <div className="absolute left-4 bottom-4 flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--bg-2)]/85 px-4 py-2 backdrop-blur-md">
              <OmegaMark size={40} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Founder-led · outcome-driven</div>
                <div className="font-serif text-sm text-[var(--fg-2)]">Drag the model to inspect inventory.</div>
              </div>
            </div>
          </div>
        </Section>
      </section>
      <StatStrip />
      <ProductTiles />
      <WhySection />
      <CTA />
    </>
  );
}

export function HomePage() {
  const { mode } = useOmegaMode();
  if (mode === "machine") return <MachineView route="home" />;
  return <HumanHomePage />;
}
