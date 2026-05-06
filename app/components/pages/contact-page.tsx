"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { contactSteps } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

export function ContactPage() {
  const { mode } = useOmegaMode();
  const [submitted, setSubmitted] = useState(false);

  if (mode === "machine") return <MachineView route="contact" />;

  return (
    <>
      <PageHeader
        kicker="GET A WALKTHROUGH"
        title={
          <>
            Show us your project. We&apos;ll show you the <span className="font-serif italic text-[var(--fg-2)]">future</span>.
          </>
        }
        sub="A 30-minute walkthrough - your project, our platform, side by side. No slides."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6 md:p-8">
            {!submitted ? (
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Your name" placeholder="Avery Chen" />
                  <Field label="Work email" placeholder="avery@meridian.com" />
                  <Field label="Company" placeholder="Meridian Properties" />
                  <Field label="Active projects" placeholder="12" />
                </div>
                <div className="grid gap-2">
                  <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Tell us about your project</label>
                  <Textarea placeholder="14-floor mixed-use in East Austin, breaking ground Q1..." />
                </div>
                <Button className="w-full" variant="accent" onClick={() => setSubmitted(true)}>
                  Book my walkthrough
                </Button>
              </div>
            ) : (
              <div className="grid place-items-center gap-4 py-14 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_0_24px_var(--accent-glow)]">
                  <Check className="size-6" />
                </div>
                <div>
                  <h3 className="text-2xl tracking-[-0.03em]">Booked.</h3>
                  <p className="mt-2 text-[var(--fg-2)]">You&apos;ll get a calendar invite within 5 minutes.</p>
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">What to expect</div>
              <div className="mt-4 grid gap-3">
                {contactSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 text-sm leading-7 text-[var(--fg-2)]">
                    <span className="font-mono text-[var(--accent-2)]">{["00:00", "00:08", "00:16", "00:24"][index]}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Direct line</div>
              <div className="mt-4 grid gap-2 font-mono text-sm">
                <div>sales@omegaappbuilder.com</div>
                <div>+1 (512) 555-OMEGA</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="outline">Austin, TX</Badge>
                <Badge variant="outline">24/7 agent coverage</Badge>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="grid gap-2">
      <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{label}</label>
      <Input placeholder={placeholder} />
    </div>
  );
}
