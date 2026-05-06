"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

export function ThankYouPage() {
  const { mode } = useOmegaMode();

  if (mode === "machine") return <MachineView route="thankYou" />;

  return (
    <>
      <PageHeader
        kicker="REQUEST RECEIVED"
        title={
          <>
            We got it. We&apos;ll reply from <span className="font-serif italic text-[var(--fg-2)]">hello@omegaappbuilder.com</span>.
          </>
        }
        sub="Your walkthrough request is on the way. If you do not see a reply soon, check your spam folder."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_0_24px_var(--accent-glow)]">
                <Check className="size-6" />
              </div>
              <div>
                <h2 className="text-3xl tracking-[-0.03em]">Booked.</h2>
                <p className="mt-1 text-[var(--fg-2)]">Your request has been delivered without a backend server.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 text-sm leading-7 text-[var(--fg-2)]">
              <p>We will review your project, timing, and goals.</p>
              <p>Then we will reply directly to the email address you submitted.</p>
              <p>The form is now wired to a frontend-only relay, so there is no app-managed SMTP or API route involved.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link href="/contact">
                  Send another request <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">Back home</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">What happens next</div>
            <div className="mt-4 grid gap-3">
              {[
                "We receive the request in hello@omegaappbuilder.com",
                "We review the project details and timeline",
                "We reply with next steps and availability",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 text-sm leading-7 text-[var(--fg-2)]">
                  <span className="font-mono text-[var(--accent-2)]">{["00:00", "00:08", "00:16"][index]}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="outline">No backend server</Badge>
              <Badge variant="outline">Relay delivery</Badge>
              <Badge variant="outline">Reply-to preserved</Badge>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
