"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/app/components/ui/card";
import { Section } from "@/app/components/site-shell";
import { MachineView } from "@/app/components/machine-view";
import { useOmegaMode } from "@/app/components/mode-provider";
import { pricingTiers } from "@/app/lib/site-data";
import { cn } from "@/app/lib/cn";

const pricingProof = [
  {
    initials: "SB",
    name: "Sales lead",
    company: "Bangalore-based developer group",
    quote:
      "We replaced scattered inquiry forms and spreadsheets with one flow. Tour requests are cleaner, follow-up is faster, and the team spends less time reconciling data.",
  },
  {
    initials: "FB",
    name: "Founder",
    company: "Boutique brokerage network",
    quote:
      "The site, CRM, and tour handoff now tell one story. Buyers get a cleaner experience, and our team stops losing context between tools.",
  },
  {
    initials: "CO",
    name: "COO",
    company: "Multi-project builder",
    quote:
      "We can see inventory, tours, and follow-up in one place. That made launch coordination and sales visibility much easier to manage.",
  },
  {
    initials: "DO",
    name: "Director of operations",
    company: "Mixed-use developer",
    quote:
      "The stack feels smaller without losing capability. Marketing pages, 3D tours, and CRM routing all work together instead of fighting each other.",
  },
];

const trustSignals = [
  { value: "412", label: "properties live in 3D" },
  { value: "$4.2B", label: "inventory powered" },
  { value: "8.4x", label: "more qualified leads" },
  { value: "11 min", label: "average time-to-tour" },
];

const closingBlocks = [
  {
    title: "Modules",
    items: ["3D Properties", "Marketing Websites", "AI CRM", "AI Agents", "Ops Platform", "Mobile Apps"],
  },
  {
    title: "Use cases",
    items: ["Pre-sales launch", "New development campaigns", "Brokerage lead handling", "Inventory tours", "Owner reporting"],
  },
  {
    title: "Compliance",
    items: ["Bangalore, India", "SOC 2 Type II", "ISO 27001", "RESPA-aware flows", "TCPA-aware agents"],
  },
];

export function PricingPage() {
  const { mode } = useOmegaMode();
  if (mode === "machine") return <MachineView route="pricing" />;

  return (
    <>
      <Section className="pt-4 md:pt-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-3)]">PRICING</div>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[0.95] tracking-[-0.06em] md:text-7xl">
              Find a plan that fits your growth stage
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--fg-2)]">
              Pick a package aligned to your inventory, launch speed, and sales motion. Start with the smallest plan that covers the job, then scale when the next project lands.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Button asChild size="lg" className="w-full rounded-full px-7 text-base md:w-auto">
              <Link href="/contact">
                Book a Meeting <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const highlighted = tier.name === "Builder";

            return (
            <Card
              key={tier.name}
              className={cn(
                "relative overflow-hidden p-0",
                highlighted
                  ? "border-[oklch(0.45_0.2_290/_0.55)] bg-[linear-gradient(180deg,oklch(0.22_0.1_290/_0.35),var(--bg-2))] shadow-[0_0_60px_oklch(0.55_0.2_290/_0.12)]"
                  : "border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"
              )}
            >
              {highlighted ? (
                <div className="absolute left-7 top-6">
                  <Badge className="rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">Popular</Badge>
                </div>
              ) : null}
              <div className={cn("border-b border-[var(--line)] px-7 py-6", highlighted && "pt-14")}>
                <div className="text-sm font-medium text-[var(--fg-2)]">{tier.name}</div>
                <div className="mt-1 text-sm text-[var(--fg-3)]">{tier.desc}</div>
                <div className="mt-5 flex items-end gap-2">
                  <div className="text-4xl tracking-[-0.05em] text-[var(--fg)]">{tier.price}</div>
                  {tier.per ? <div className="pb-1 text-sm text-[var(--fg-3)]">{tier.per}</div> : null}
                </div>
              </div>
              <CardContent className="px-7 py-7">
                <div className="grid gap-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-[15px] leading-7 text-[var(--fg-2)]">
                      <Check className="mt-1 size-4 shrink-0 text-[var(--accent-2)]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4 border-t border-[var(--line)] px-7 py-6">
                <Button asChild variant={highlighted ? "accent" : "secondary"} className="w-full rounded-full">
                  <Link href="/contact">{tier.cta}</Link>
                </Button>
                {tier.name === "Studio" ? <p className="text-sm text-[var(--fg-3)]">Fastest path to a live launch for a single project or smaller portfolio.</p> : null}
                {tier.name === "Builder" ? <p className="text-sm text-[var(--fg-3)]">Best fit for active pipelines, multiple projects, and a tighter sales handoff.</p> : null}
                {tier.name === "Enterprise" ? <p className="text-sm text-[var(--fg-3)]">For larger rollout scopes, custom integrations, and multi-region teams.</p> : null}
              </CardFooter>
            </Card>
            );
          })}
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-3)]">Built to reduce tool sprawl</div>
          <h2 className="mt-4 text-3xl tracking-[-0.04em] md:text-5xl">One stack for listing pages, tours, leads, and follow-up</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricingProof.map((item) => (
            <Card key={item.company} className="h-full border-[var(--line)] p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold text-[var(--fg)]">
                  {item.initials}
                </div>
                <div>
                  <div className="font-medium text-[var(--fg)]">{item.name}</div>
                  <div className="text-sm text-[var(--fg-3)]">{item.company}</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--fg-2)]">{item.quote}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 md:p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-3)]">Trust signals</div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {trustSignals.map((stat) => (
                <div key={stat.label} className="rounded-[20px] border border-[var(--line)] bg-[var(--bg)] px-4 py-5">
                  <div className="text-3xl tracking-[-0.05em] text-[var(--fg)]">{stat.value}</div>
                  <div className="mt-2 text-sm leading-6 text-[var(--fg-2)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-3)]">Location and compliance</div>
            <h3 className="mt-4 text-3xl tracking-[-0.04em]">Bangalore, India</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--fg-2)]">
              OmegaAppBuilder is run from Bangalore with a product stack built for US real estate operators. The visible compliance line stays simple and stable.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline">Bangalore, India</Badge>
              <Badge variant="outline">SOC 2 Type II</Badge>
              <Badge variant="outline">ISO 27001</Badge>
            </div>
            <Button asChild variant="accent" className="mt-8 w-full rounded-full">
              <Link href="/contact">
                Book a meeting <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </Section>

      <Section className="pt-10">
        <div className="grid gap-6 md:grid-cols-3">
          {closingBlocks.map((column) => (
            <Card key={column.title} className="h-full p-6">
              <CardTitle className="text-base">{column.title}</CardTitle>
              <div className="mt-4 grid gap-3">
                {column.items.map((label) => (
                  <div key={label} className="text-sm text-[var(--fg-2)]">
                    {label}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
