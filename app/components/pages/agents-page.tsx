"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { agentTranscript } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

export function AgentsPage() {
  const { mode } = useOmegaMode();
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    setTranscript([]);
    const script = [
      "AI: Hello, I saw the Westbrook listing. Is the 3-bed still available?",
      "Lead: Yes, and I can do Saturday at 11.",
      "AI: Booked. I’ll send a confirmation and floor plan now.",
      "AI: Follow-up SMS and lender intro queued.",
    ];

    const run = async () => {
      for (const line of script) {
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 700));
        setTranscript((current) => [...current, line]);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === "machine") return <MachineView route="agents" />;

  return (
    <>
      <PageHeader
        kicker="AI AGENTS"
        title={<>Voice + chat agents that book tours.</>}
        sub="The demo transcript below is intentionally simple; the product story is the same: qualify, schedule, and hand off with context."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Live transcript</div>
            <div className="space-y-3 rounded-[24px] border border-[var(--line)] bg-[var(--bg)] p-4">
              {transcript.map((line) => (
                <div key={line} className={line.startsWith("AI:") ? "ml-auto w-[88%] rounded-2xl bg-[oklch(0.3_0.12_290)] p-3 text-sm text-[var(--fg)]" : "w-[88%] rounded-2xl border border-[var(--line)] bg-[var(--bg-3)] p-3 text-sm text-[var(--fg-2)]"}>
                  {line.replace(/^AI:\s?/, "").replace(/^Lead:\s?/, "")}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="accent">TCPA aware</Badge>
              <Badge variant="outline">Human handoff</Badge>
              <Badge variant="outline">26 languages</Badge>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Capabilities</div>
              <div className="grid gap-3 text-sm leading-7 text-[var(--fg-2)]">
                <p>Qualify intent, budget, and timing in one conversation.</p>
                <p>Look up live unit availability and book tours into the calendar.</p>
                <p>Send follow-up SMS/email with full context after the handoff.</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Flow</div>
              <div className="grid gap-3">
                {["Capture lead", "Score intent", "Book tour", "Hand off to human"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full border border-[var(--line)] font-mono text-[11px] text-[var(--fg-3)]">{index + 1}</div>
                    <div className="text-sm">{step}</div>
                  </div>
                ))}
              </div>
              <Button className="mt-5" variant="accent">
                Book a demo <ArrowRight className="size-4" />
              </Button>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
