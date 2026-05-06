"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { contactSteps } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";
import { contactRelay } from "@/app/lib/contact-relay";

export function ContactPage() {
  const { mode } = useOmegaMode();
  const [submitting, setSubmitting] = useState(false);
  const [nextUrl, setNextUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNextUrl(`${window.location.origin}${contactRelay.thankYouPath}`);
  }, []);

  if (mode === "machine") return <MachineView route="contact" />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setError("");

    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    const replyTo = form.querySelector<HTMLInputElement>('input[name="_replyto"]');

    if (replyTo && typeof email === "string") {
      replyTo.value = email;
    }

    if (!nextUrl) {
      event.preventDefault();
      setError("The form is still loading. Please try again in a moment.");
      return;
    }

    const honeypot = form.querySelector<HTMLInputElement>('input[name="_honey"]');
    if (honeypot) honeypot.value = "";

    setSubmitting(true);
  };

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
            <form
              className="grid gap-5"
              method="POST"
              action={contactRelay.endpoint}
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value={contactRelay.subject} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value={contactRelay.template} />
              <input type="hidden" name="_next" value={nextUrl} />
              <input type="hidden" name="_replyto" value="" />
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your name" placeholder="Avery Chen" name="name" required />
                <Field label="Work email" placeholder="avery@meridian.com" name="email" type="email" required />
                <Field label="Company" placeholder="Meridian Properties" name="company" />
                <Field label="Active projects" placeholder="12" name="activeProjects" />
              </div>
              <div className="grid gap-2">
                <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Tell us about your project</label>
                <Textarea name="projectDetails" required placeholder="14-floor mixed-use in East Austin, breaking ground Q1..." />
              </div>
              {error ? <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
              <Button className="w-full" variant="accent" type="submit" disabled={submitting || !nextUrl}>
                {submitting ? "Sending..." : "Book my walkthrough"}
              </Button>
              <p className="text-xs text-[var(--fg-3)]">
                This form sends directly to <span className="text-[var(--fg-2)]">hello@omegaappbuilder.com</span> through a frontend relay. No backend server.
              </p>
            </form>
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
                <div>hello@omegaappbuilder.com</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="outline">Bangalore, India</Badge>
                <Badge variant="outline">24/7 agent coverage</Badge>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  placeholder,
  name,
  type,
  required,
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-3)]">{label}</label>
      <Input placeholder={placeholder} name={name} type={type} required={required} />
    </div>
  );
}
