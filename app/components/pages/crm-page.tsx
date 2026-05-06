"use client";

import * as React from "react";
import { ChevronRight, Sparkles, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { PageHeader, Section } from "@/app/components/site-shell";
import { crmSeedLeads, crmStages } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

type Lead = {
  id: string;
  name: string;
  unit: string;
  price: string;
  score: number;
  stage: "new" | "tour" | "offer" | "closed";
  source: string;
  budget: string;
  lastTouch: string;
  tags: string[];
  notes: string;
};

export function CRMPage() {
  const { mode } = useOmegaMode();
  const [leads, setLeads] = React.useState<Lead[]>(
    crmSeedLeads.map((lead) => ({
      ...lead,
      tags: [...lead.tags],
      stage: lead.stage as Lead["stage"],
    }))
  );
  const [filter, setFilter] = React.useState<"all" | "hot" | "cash">("all");
  const [search, setSearch] = React.useState("");
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [openLead, setOpenLead] = React.useState<Lead | null>(null);
  const [composeOpen, setComposeOpen] = React.useState(false);

  if (mode === "machine") return <MachineView route="crm" />;

  const filtered = leads.filter((lead) => {
    if (filter === "hot" && !lead.tags.includes("Hot")) return false;
    if (filter === "cash" && !lead.tags.includes("Cash")) return false;
    if (search && !`${lead.name} ${lead.unit} ${lead.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const moveLead = (id: string, stage: Lead["stage"]) => {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)));
  };

  return (
    <>
      <PageHeader
        kicker="AI CRM"
        title={<>Your pipeline, animated.</>}
        sub="Drag cards between stages. Open a lead for context. The AI panel is there to show the workflow, not just decorate the page."
      />
      <Section className="space-y-6">
        <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, unit, ID…" className="md:max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {(["all", "hot", "cash"] as const).map((option) => (
              <Button key={option} variant={filter === option ? "accent" : "secondary"} onClick={() => setFilter(option)}>
                {option === "all" ? "All" : option === "hot" ? "Hot" : "Cash buyers"}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => setComposeOpen(true)}>
              <Sparkles className="size-4" /> AI Compose
            </Button>
            <Button variant="accent">
              <Plus className="size-4" /> New lead
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Pipeline value", `$${leads.reduce((sum, lead) => sum + Number(lead.price.replace(/[$M]/g, "")), 0).toFixed(1)}M`],
            ["Active leads", leads.filter((lead) => lead.stage !== "closed").length],
            ["Tours this week", "12"],
            ["Avg lead score", Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)],
          ].map(([label, value]) => (
            <Card key={label} className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{label}</div>
              <div className="mt-2 text-3xl tracking-[-0.03em]">{value}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {crmStages.map((stage) => {
            const items = filtered.filter((lead) => lead.stage === stage.id);
            return (
              <Card
                key={stage.id}
                className="min-h-[560px] p-4"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedId) moveLead(draggedId, stage.id);
                  setDraggedId(null);
                }}
              >
                <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: stage.color }} />
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-2)]">{stage.label}</div>
                    <div className="font-mono text-[11px] text-[var(--fg-3)]">· {items.length}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Plus className="size-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  {items.map((lead) => (
                    <button
                      key={lead.id}
                      draggable
                      onDragStart={() => setDraggedId(lead.id)}
                      onDragEnd={() => setDraggedId(null)}
                      onClick={() => setOpenLead(lead)}
                      className="group rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 text-left transition hover:-translate-y-0.5 hover:bg-[var(--bg-3)]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{lead.name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">{lead.id}</div>
                        </div>
                        <ScoreBadge score={lead.score} />
                      </div>
                      <div className="text-sm text-[var(--fg-2)]">{lead.unit}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="font-mono text-[11px] font-medium">{lead.price}</div>
                        <div className="flex gap-1">
                          {lead.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant={tag === "Hot" ? "accent" : "outline"} className="rounded-full px-2 py-0.5 text-[9px] uppercase">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">
                        <span>{lead.source}</span>
                        <span>{lead.lastTouch}</span>
                      </div>
                    </button>
                  ))}
                  {items.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--fg-3)]">Drop a lead here</div> : null}
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <LeadDialog lead={openLead} onClose={() => setOpenLead(null)} onUpdate={(updated) => setLeads((current) => current.map((lead) => (lead.id === updated.id ? updated : lead)))} />
      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
      <AIAssistant leads={leads} />
    </>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score > 85 ? "var(--accent)" : score > 70 ? "var(--accent-2)" : "var(--fg-3)";
  return (
    <div className="flex size-8 items-center justify-center rounded-full border text-[11px] font-medium" style={{ borderColor: color, color }}>
      {score}
    </div>
  );
}

function LeadDialog({ lead, onClose, onUpdate }: { lead: Lead | null; onClose: () => void; onUpdate: (lead: Lead) => void }) {
  const [tab, setTab] = React.useState<"activity" | "compose" | "ai" | "files">("activity");
  const [draft, setDraft] = React.useState("");
  const [generating, setGenerating] = React.useState(false);

  React.useEffect(() => {
    if (lead) {
      setTab("activity");
      setDraft("");
      setGenerating(false);
    }
  }, [lead]);

  if (!lead) return null;

  const draftMessage = async () => {
    setGenerating(true);
    setDraft("");
    const text = `Hi ${lead.name.split(" ")[0]}, just confirming your tour of ${lead.unit} for Saturday at 11am. I'll meet you in the lobby with the floor plans and finish samples. Reply STOP to cancel — Lena`;
    for (let i = 1; i <= text.length; i++) {
      setDraft(text.slice(0, i));
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
    setGenerating(false);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="left-auto top-0 h-screen w-[min(92vw,34rem)] translate-x-0 translate-y-0 rounded-none border-l border-[var(--line)] bg-[var(--bg-2)] p-0"
        style={{ left: "auto", right: 0, top: 0, transform: "none", width: "min(92vw, 34rem)", height: "100vh", borderRadius: 0 }}
      >
        <DialogHeader className="p-6 pr-14">
          <DialogTitle className="text-2xl">{lead.name}</DialogTitle>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{lead.id} · {lead.source}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            {lead.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full px-2 py-1 text-[10px] uppercase">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <LeadMeta label="Score" value={String(lead.score)} />
            <LeadMeta label="Unit" value={lead.unit} />
            <LeadMeta label="Price" value={lead.price} />
            <LeadMeta label="Budget" value={lead.budget} />
            <LeadMeta label="Last touch" value={lead.lastTouch} />
            <LeadMeta label="Stage" value={crmStages.find((stage) => stage.id === lead.stage)?.label ?? lead.stage} />
          </div>
          <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-2">
            {(["activity", "compose", "ai", "files"] as const).map((option) => (
              <Button key={option} variant={tab === option ? "accent" : "secondary"} size="sm" onClick={() => setTab(option)}>
                {option}
              </Button>
            ))}
          </div>
          {tab === "activity" ? (
            <div className="grid gap-4">
              <TimelineRow time="12m ago" who="Lena AI" action="Sent confirmation SMS" detail={lead.notes || "Tour confirmation delivered."} accent />
              <TimelineRow time="2h ago" who="Lena AI" action="Booked tour" detail="Saturday 11:00 AM with Lena." accent />
              <TimelineRow time="2h ago" who="System" action="Score updated" detail="Lead score increased after repeat 3D visits." />
              <TimelineRow time="5h ago" who="Lead" action="Returned to 3D model" detail="Spent 4m 12s in the living room." />
              <TimelineRow time="1d ago" who="Lena AI" action="Sent follow-up email" detail="Floor plans plus finish samples." />
            </div>
          ) : null}
          {tab === "compose" ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                {["SMS", "Email", "Voice call"].map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full px-3 py-1.5 uppercase">
                    {item}
                  </Badge>
                ))}
              </div>
              <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message…" />
              <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={draftMessage} disabled={generating}>
                  <Sparkles className="size-4" /> {generating ? "Drafting…" : "Draft with AI"}
                </Button>
                <Button onClick={() => onUpdate({ ...lead, stage: lead.stage === "new" ? "tour" : lead.stage })}>Send</Button>
              </div>
            </div>
          ) : null}
          {tab === "ai" ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[oklch(0.4_0.18_290/_0.4)] bg-[linear-gradient(180deg,oklch(0.22_0.1_290/_0.3),var(--bg))] p-4">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]">Omega recommends</div>
                <p className="text-sm leading-7 text-[var(--fg)]">
                  {lead.name.split(" ")[0]} has a {lead.score}/100 intent score. They returned to the 3D model multiple times and are strong candidates for a finish-sample follow-up.
                </p>
              </div>
              <SuggestionCard title="Schedule weekend follow-up" desc="Auto-text if they no-show, then resurface Sunday morning." action="Enable" />
              <SuggestionCard title="Match similar inventory" desc={`${lead.unit} has a comparable release nearby at a different price point.`} action="Show match" />
              <SuggestionCard title="Lender intro" desc="Pre-approved leads can be routed to a partner lender workflow." action="Send intro" />
            </div>
          ) : null}
          {tab === "files" ? (
            <div className="grid gap-3">
              {[
                ["Pre-approval letter.pdf", "412 KB", "Verified"],
                ["Floor plan — 1402.pdf", "2.1 MB", ""],
                ["Finish package — Warm Oak.pdf", "8.4 MB", ""],
                ["Disclosures.pdf", "1.6 MB", "Pending"],
              ].map(([name, size, status]) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--bg-3)] font-mono text-[9px] uppercase text-[var(--fg-3)]">PDF</div>
                  <div className="flex-1">
                    <div className="text-sm">{name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">{size}</div>
                  </div>
                  {status ? <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--warn)]">{status}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function LeadMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{label}</div>
      <div className="text-sm text-[var(--fg)]">{value}</div>
    </div>
  );
}

function TimelineRow({ time, who, action, detail, accent = false }: { time: string; who: string; action: string; detail: string; accent?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="pt-1">
        <div className="size-2 rounded-full shadow-[0_0_8px_var(--accent-glow)]" style={{ background: accent ? "var(--accent)" : "var(--fg-3)" }} />
      </div>
      <div className="flex-1 border-b border-[var(--line)] pb-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="text-sm font-medium">
            <span className={accent ? "text-[var(--accent-2)]" : "text-[var(--fg)]"}>{who}</span> <span className="text-[var(--fg-2)]">{action}</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-3)]">{time}</div>
        </div>
        <p className="text-sm leading-6 text-[var(--fg-2)]">{detail}</p>
      </div>
    </div>
  );
}

function SuggestionCard({ title, desc, action }: { title: string; desc: string; action: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[var(--fg-2)]">{desc}</div>
      <Button variant="ghost" size="sm" className="mt-3 px-0 text-[var(--accent-2)] hover:bg-transparent">
        {action} <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function ComposeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [prompt, setPrompt] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const samples = [
    "Send a check-in to all leads who toured this week",
    "Draft a price drop announcement for Atrium 0204",
    "Build a list of cash buyers under $2M",
  ];

  const run = async () => {
    setBusy(true);
    setOutput("");
    const text = `Plan ready:
1. Identify ${prompt.toLowerCase().includes("cash") ? "4" : "23"} leads matching criteria
2. Draft personalized message for each
3. Schedule send for Tuesday 9:30 AM
4. Tag follow-up for non-responders in 48h

Estimated reach: ${prompt.toLowerCase().includes("cash") ? "4" : "23"} contacts. Ready to execute?`;
    for (let i = 1; i <= text.length; i++) {
      setOutput(text.slice(0, i));
      await new Promise((resolve) => setTimeout(resolve, 8));
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Compose</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. Build a list of cash buyers in the Westbrook pipeline and send a thank-you note." />
          <div className="flex flex-wrap gap-2">
            {samples.map((sample) => (
              <Button key={sample} variant="secondary" size="sm" onClick={() => setPrompt(sample)}>
                {sample}
              </Button>
            ))}
          </div>
          {output ? <pre className="whitespace-pre-wrap rounded-2xl border border-[oklch(0.4_0.18_290/_0.4)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-7">{output}</pre> : null}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={run} disabled={busy || !prompt}>
              {busy ? "Thinking…" : "Run plan"}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function AIAssistant({ leads }: { leads: Lead[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_8px_32px_var(--accent-glow)]"
      >
        <Sparkles className="size-5" />
      </button>
      {open ? (
        <Card className="fixed bottom-24 right-6 z-40 w-[min(92vw,360px)] p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-2)]">Omega is working for you</div>
          <div className="text-sm leading-7 text-[var(--fg)]">
            While you&apos;ve been here, the assistant would qualify high-intent leads, book a tour, and route follow-ups.
          </div>
          <div className="mt-4 grid gap-1 font-mono text-[11px] text-[var(--fg-2)]">
            <div>● latest: {leads[0]?.id ?? "n/a"} qualified</div>
            <div>● latest: follow-up drafted</div>
            <div>● latest: tour booked</div>
          </div>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Card>
      ) : null}
    </>
  );
}
