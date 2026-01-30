"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Script from "next/script";
import ChatWizardPanel from "@/components/ai/ChatWizardPanel";
import BuildOutputPanel from "@/components/ai/BuildOutputPanel";
import { supabase } from "@/lib/supabaseClient";

export type AiTab = "preview" | "files" | "logs" | "notes";

type BuildData = {
  id: string;
  status: string;
  logs: string;
  files: string[];
  tree: any[];
  readme: string;
  envVars: string[];
  previewPort?: number | null;
};

export default function AiBuilder() {
  const [activeTab, setActiveTab] = useState<AiTab>("preview");
  const [buildId, setBuildId] = useState<string | null>(null);
  const [buildData, setBuildData] = useState<BuildData | null>(null);
  const [buildStatus, setBuildStatus] = useState<string | null>("idle");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const accessToken = session?.access_token || null;
  const authHeaders = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  const handleBuild = async (config: any, prompt: string) => {
    const res = await fetch("/api/ai/build", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(authHeaders || {}) },
      body: JSON.stringify({ config, prompt }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setBuildStatus("error");
      return { ok: false, error: data.error || "Build failed" };
    }
    const data = await res.json();
    setBuildId(data.buildId);
    setBuildStatus("building");
    setActiveTab("logs");
    return { ok: true };
  };

  useEffect(() => {
    if (!buildId) return;
    let active = true;
    const poll = async () => {
      const res = await fetch(`/api/ai/build/${buildId}/status`, {
        cache: "no-store",
        headers: authHeaders,
      });
      if (!res.ok) return;
      const data = (await res.json()) as BuildData;
      if (!active) return;
      setBuildData(data);
      setBuildStatus(data.status);
      if (data.status === "ready" || data.status === "failed") return;
    };

    poll();
    const interval = setInterval(poll, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [buildId, accessToken]);

  const handleRestartPreview = async () => {
    if (!buildId) return;
    await fetch(`/api/ai/build/${buildId}/preview/restart`, {
      method: "POST",
      headers: authHeaders,
    });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Omega AI Builder
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Prompt to production code. Frontend + backend. Repo-ready.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Generated code is editable. Review before production use.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <ChatWizardPanel onBuild={handleBuild} buildStatus={buildStatus} />
          <BuildOutputPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            buildId={buildId}
            buildData={buildData}
            onRestartPreview={handleRestartPreview}
            accessToken={accessToken}
          />
        </section>
      </div>
    </main>
  );
}
