"use client";

import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Star } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/app/components/ui/card";
import { Section } from "@/app/components/site-shell";
import { MachineView } from "@/app/components/machine-view";
import { useOmegaMode } from "@/app/components/mode-provider";

const starterFeatures = [
  "4 long-form technical blogs/month (with diagrams or code where needed)",
  "1 SDK guide or integration walkthrough (React/Node.js/Python/etc.)",
  "SEO-backed topic ideation based on monthly search volume (MSV)",
  "Developer persona mapping + content format mix (e.g., how-to, comparison, teardown)",
  "Weekly async updates + Google Doc delivery",
  "Up to 2 revisions/post",
  "Optional CMS publishing (Markdown or Webflow)",
  "7–10 day turnaround/post",
  "1 onboarding call + content roadmap setup",
  "Support for founder-led POV content (upon request)",
];

const scaleFeatures = [
  "6–8 technical blogs/month",
  "2 video walkthroughs/month",
  "Use case libraries, onboarding docs, SDK examples",
  "Landing page + feature copy",
  "Dedicated content strategist",
  "Monthly performance tracking + content calendar",
];

const testimonials = [
  {
    name: "Cindy Blake",
    role: "VP Marketing",
    company: "Firefly",
    quote:
      "Infrasity was quick to onboard and understand how to best show off the capabilities of Firefly's cloud asset management. Team has been super responsive and collaborative.",
  },
  {
    name: "Josh",
    role: "Co-Founder",
    company: "Terrateam",
    quote:
      "The Infrasity team has been fantastic to work with. Their attention to detail and level of accuracy is top notch. I'd fully recommend their services to anyone.",
  },
  {
    name: "Shaked Askayo",
    role: "CTO",
    company: "Kubiya.ai",
    quote:
      "Infrasity's creative content has significantly enhanced the visibility and appeal of our product in a competitive market. Crafting content that engages our audience and eloquently highlights the advanced capabilities of Kubiya.ai.",
  },
  {
    name: "Frank Weissmann",
    role: "Customer Success Lead",
    company: "firefly.ai",
    quote:
      "Infrasity's work has improved the client's SEO, earning a score of over 75%. They've also enabled the client to onboard end customers faster. Moreover, the team listens to the client's content needs, produces work that aligns with their conversation and delivers output in a quick turnaround time.",
  },
];

const footerColumns = [
  {
    title: "Tools",
    links: ["Script Generator", "ROI Calculator", "Reddit Comment Generator"],
  },
  {
    title: "Use Cases",
    links: ["AI Agents GTM Services", "GTM Content", "GTM Content Services For YC Startups", "Technical Content GTM"],
  },
  {
    title: "By Role",
    links: ["Infrasity Vs DevRel", "Services", "Developer Marketing Agency", "AEO/GEO Services", "Technical Writing Services", "Video Production", "Webflow Agency", "Reddit Marketing Services"],
  },
  {
    title: "Resources",
    links: ["Home", "Blog", "Case Studies", "Careers", "Contact Us"],
  },
  {
    title: "Follow us",
    links: ["Youtube", "LinkedIn"],
  },
  {
    title: "Awards",
    links: ["#1 Startup in New Delhi,India", "Infra Logo", "Mentioned", "Recognized by TechGig"],
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
              No upfront commitment. No fluff. Start your journey toward developer-first content and GTM clarity — in under 5 minutes.
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
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="relative overflow-hidden border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-0">
            <div className="border-b border-[var(--line)] px-7 py-6">
              <div className="text-sm font-medium text-[var(--fg-2)]">Starter Plan</div>
              <div className="mt-1 text-sm text-[var(--fg-3)]">For early-stage infra, AI, and DevTool startups</div>
            </div>
            <CardContent className="px-7 py-7">
              <p className="max-w-xl text-sm leading-7 text-[var(--fg-2)]">
                Designed for teams who need developer-focused content to drive sign-ups, not vanity traffic.
              </p>
              <div className="mt-8 grid gap-3">
                {starterFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-[15px] leading-7 text-[var(--fg-2)]">
                    <Check className="mt-1 size-4 shrink-0 text-[var(--accent-2)]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t border-[var(--line)] px-7 py-6">
              <Button asChild variant="accent" className="w-full rounded-full">
                <Link href="/contact">Sign up</Link>
              </Button>
              <p className="text-sm text-[var(--fg-3)]">Get a 30-day POC to test Infrasity for your business</p>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-[oklch(0.45_0.2_290/_0.55)] bg-[linear-gradient(180deg,oklch(0.22_0.1_290/_0.4),var(--bg-2))] p-0 shadow-[0_0_60px_oklch(0.55_0.2_290/_0.12)]">
            <div className="absolute left-7 top-6">
              <Badge className="rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">Popular</Badge>
            </div>
            <div className="border-b border-[var(--line)] px-7 py-6 pt-14">
              <div className="text-sm font-medium text-[var(--fg-2)]">Scale Plan</div>
              <div className="mt-1 text-sm text-[var(--fg-3)]">For growing teams who need DevRel-style content at volume</div>
            </div>
            <CardContent className="px-7 py-7">
              <p className="max-w-xl text-sm leading-7 text-[var(--fg-2)]">
                When you’re ready to scale content across docs, demos, and GTM efforts.
              </p>
              <div className="mt-8">
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-3)]">What you get:</div>
                <div className="grid gap-3">
                  {scaleFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-[15px] leading-7 text-[var(--fg-2)]">
                      <Check className="mt-1 size-4 shrink-0 text-[var(--accent-2)]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t border-[var(--line)] px-7 py-6">
              <Button asChild variant="secondary" className="w-full rounded-full">
                <Link href="/contact">Talk to sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-3)]">Here’s how we help them ship content fast — and with depth.</div>
          <h2 className="mt-4 text-3xl tracking-[-0.04em] md:text-5xl">Why teams backed by YC, Boldstart, and Eclipse trust Infrasity</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <Card key={item.name} className="h-full border-[var(--line)] p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-sm font-semibold text-[var(--fg)]">
                  {item.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-medium text-[var(--fg)]">{item.name}</div>
                  <div className="text-sm text-[var(--fg-3)]">{item.role}, {item.company}</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--fg-2)]">{item.quote}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-6">
        <div className="rounded-[32px] border border-[var(--line)] bg-[var(--bg-2)]/80 p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-3)]">Trusted by fastest growing B2B SaaS Startups.</div>
              <h3 className="mt-4 max-w-2xl text-3xl tracking-[-0.04em] md:text-4xl">Trusted by YC startups. Built for developer-first companies.</h3>
              <Button asChild className="mt-8 rounded-full px-6">
                <Link href="/contact">
                  Book Demo <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg)] p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                  <Star className="size-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--fg)]">Infra Logo</div>
                  <div className="text-sm text-[var(--fg-3)]">Amplifying product visibility through technical content and SEO that drives awareness and boosts search rankings.</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["AICPA SOC", "GDPR"].map((chip) => (
                  <span key={chip} className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-3)]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {footerColumns.map((column) => (
            <Card key={column.title} className="h-full p-6">
              <CardTitle className="text-base">{column.title}</CardTitle>
              <div className="mt-4 grid gap-3">
                {column.links.map((label) => (
                  <Link key={label} href="/" className="text-sm text-[var(--fg-2)] transition hover:text-[var(--fg)]">
                    {label}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-[var(--line)] bg-[var(--bg-2)]/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Infrasity Outline Generator - Assisting Engineering Startups with tech Content | Product Hunt</div>
              <div className="mt-2 text-sm text-[var(--fg-2)]">© 2026 Infrasity. All rights reserved.</div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--fg-3)]">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--fg)]">
                Privacy Policy <ExternalLink className="size-3.5" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--fg)]">
                Terms of Service <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
