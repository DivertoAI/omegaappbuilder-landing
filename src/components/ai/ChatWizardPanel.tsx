"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import PricingPanel from "@/components/ai/PricingPanel";
import TopUpPanel from "@/components/ai/TopUpPanel";
import type { BuildConfig } from "@/lib/ai/types";
import { computeBuildCredits } from "@/lib/billing/credits";
import { supabase } from "@/lib/supabaseClient";

type SubscriptionStatus = {
  active: boolean;
  planKey: string | null;
  creditsMonthly: number;
  creditsRemaining: number;
  resetAt: string | null;
  requiresAuth?: boolean;
};

type CreditsStatus = {
  active: boolean;
  creditsRemaining: number;
  creditsMonthly: number;
  resetAt: string | null;
  ledger: { id: string; type: string; amount: number; reason: string; createdAt: string }[];
};

type Message = { role: "assistant" | "user"; content: string };

type StepKey =
  | "confirm"
  | "websiteType"
  | "rendering"
  | "frontendStack"
  | "backendStack"
  | "database"
  | "auth"
  | "styling"
  | "deployment"
  | "appName"
  | "prompt";

type Step = {
  key: StepKey;
  prompt: string;
  options?: string[];
  input?: "text" | "textarea";
  placeholder?: string;
};

const STEPS: Step[] = [
  {
    key: "confirm",
    prompt: "What are you building today?",
    options: ["Website"],
  },
  {
    key: "websiteType",
    prompt: "Choose a website type:",
    options: ["Landing page", "Marketing site", "Web app dashboard", "Blog", "Ecommerce (basic)", "Other"],
  },
  {
    key: "rendering",
    prompt: "Rendering preference?",
    options: ["Static", "SPA", "SSR"],
  },
  {
    key: "frontendStack",
    prompt: "Frontend stack?",
    options: ["Next.js + TypeScript", "React + Vite", "Other"],
  },
  {
    key: "backendStack",
    prompt: "Backend?",
    options: ["None", "Next API routes", "Node (Express)", "Python (FastAPI)"],
  },
  {
    key: "database",
    prompt: "Database?",
    options: ["None", "Postgres", "SQLite"],
  },
  {
    key: "auth",
    prompt: "Auth?",
    options: ["None", "Email+Password", "OAuth"],
  },
  {
    key: "styling",
    prompt: "Styling preference?",
    options: ["Tailwind", "CSS Modules"],
  },
  {
    key: "deployment",
    prompt: "Deployment target?",
    options: ["Vercel", "Netlify", "Docker", "Other"],
  },
  {
    key: "appName",
    prompt: "App name",
    input: "text",
    placeholder: "e.g. Aurora Analytics",
  },
  {
    key: "prompt",
    prompt: "Describe your website. Include pages, users, CTAs, and must-have features.",
    input: "textarea",
    placeholder: "3-8 sentences about the product, pages, and flows...",
  },
];

type RazorpayHandler = () => void;

type RazorpayOptions = {
  key: string;
  subscription_id?: string;
  order_id?: string;
  name: string;
  description: string;
  handler: RazorpayHandler;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

type Props = {
  onBuild: (config: BuildConfig, prompt: string) => Promise<{ ok: boolean; error?: string }>;
  buildStatus?: string | null;
};

export default function ChatWizardPanel({ onBuild, buildStatus }: Props) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [credits, setCredits] = useState<CreditsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topupLoading, setTopupLoading] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to Omega AI Builder. We will generate your website repo." },
    { role: "assistant", content: STEPS[0].prompt },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [config, setConfig] = useState<BuildConfig>({
    websiteType: "Landing page",
    rendering: "SSR",
    frontendStack: "Next.js + TypeScript",
    backendStack: "Next API routes",
    database: "None",
    auth: "None",
    styling: "Tailwind",
    deployment: "Vercel",
    appName: "",
  });
  const [userPrompt, setUserPrompt] = useState("");
  const [buildLoading, setBuildLoading] = useState(false);

  const currentStep = STEPS[stepIndex];

  const authFetch = async (url: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
    return fetch(url, { ...init, headers });
  };

  const loadStatus = useCallback(async (accessToken?: string | null) => {
    try {
      const headers = new Headers();
      const token = accessToken ?? session?.access_token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const res = await fetch("/api/billing/subscription-status", { cache: "no-store", headers });
      const data = (await res.json()) as SubscriptionStatus;
      setStatus(data);
      if (data.active) {
        const creditsRes = await fetch("/api/ai/credits", { cache: "no-store", headers });
        const creditsData = (await creditsRes.json()) as CreditsStatus;
        setCredits(creditsData);
      } else {
        setCredits(null);
      }
    } catch {
      setStatus({ active: false, planKey: null, creditsMonthly: 0, creditsRemaining: 0, resetAt: null });
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      loadStatus(data.session?.access_token);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      loadStatus(newSession?.access_token);
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadStatus]);

  const handleLogin = async () => {
    setError(null);
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/ai`,
        },
      });
      if (error) throw error;
      setAuthNotice("Magic link sent. Check your email to finish signing in.");
    } catch {
      setError("Enter a valid email to continue.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubscribe = async (planKey: "starter" | "pro" | "scale") => {
    setError(null);
    setLoadingPlan(planKey);
    try {
      const res = await authFetch("/api/billing/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      if (!res.ok) throw new Error("Unable to start subscription");
      const data = await res.json();
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Omega AI Builder",
        description: `${planKey.toUpperCase()} subscription`,
        handler: () => loadStatus(),
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setError("Subscription checkout failed. Try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleTopup = async (pack: "20" | "60" | "150") => {
    setError(null);
    setTopupLoading(pack);
    try {
      const res = await authFetch("/api/billing/topup/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });
      if (!res.ok) throw new Error("Topup failed");
      const data = await res.json();
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }
      const options = {
        key: data.keyId,
        order_id: data.orderId,
        name: "Omega AI Builder",
        description: `Credit top-up (+${data.credits})`,
        handler: () => loadStatus(),
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      setError("Top-up failed. Try again.");
    } finally {
      setTopupLoading(null);
    }
  };

  const handleAnswer = (value: string) => {
    const nextMessages: Message[] = [...messages, { role: "user", content: value }];
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    if (currentStep.key !== "prompt") {
      nextMessages.push({ role: "assistant", content: STEPS[nextIndex].prompt });
    }
    setMessages(nextMessages);
    setStepIndex(nextIndex);
    setInputValue("");
    setCustomValue("");
  };

  const applyStepValue = (value: string) => {
    switch (currentStep.key) {
      case "websiteType":
        setConfig((prev) => ({ ...prev, websiteType: value }));
        break;
      case "rendering":
        setConfig((prev) => ({ ...prev, rendering: value }));
        break;
      case "frontendStack":
        setConfig((prev) => ({ ...prev, frontendStack: value }));
        break;
      case "backendStack":
        setConfig((prev) => ({ ...prev, backendStack: value }));
        break;
      case "database":
        setConfig((prev) => ({ ...prev, database: value }));
        break;
      case "auth":
        setConfig((prev) => ({ ...prev, auth: value }));
        break;
      case "styling":
        setConfig((prev) => ({ ...prev, styling: value }));
        break;
      case "deployment":
        setConfig((prev) => ({ ...prev, deployment: value }));
        break;
      case "appName":
        setConfig((prev) => ({ ...prev, appName: value }));
        break;
      case "prompt":
        setUserPrompt(value);
        break;
      default:
        break;
    }
  };

  const handleOptionSelect = (value: string) => {
    if (value === "Other") {
      setCustomValue("");
      return;
    }
    applyStepValue(value);
    handleAnswer(value);
  };

  const handleCustomSubmit = () => {
    if (!customValue.trim()) return;
    applyStepValue(customValue.trim());
    handleAnswer(customValue.trim());
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    applyStepValue(inputValue.trim());
    handleAnswer(inputValue.trim());
  };

  const handlePromptSubmit = () => {
    if (!inputValue.trim()) return;
    setUserPrompt(inputValue.trim());
    setMessages((prev) => [...prev, { role: "user", content: inputValue.trim() }]);
    setInputValue("");
  };

  const cost = useMemo(() => computeBuildCredits(config), [config]);
  const creditsRemaining = credits?.creditsRemaining ?? 0;
  const insufficientCredits = creditsRemaining < cost;

  const handleBuild = async () => {
    setError(null);
    setBuildLoading(true);
    const result = await onBuild(config, userPrompt);
    if (!result.ok) {
      setError(result.error || "Build failed.");
    }
    setBuildLoading(false);
  };

  const signedIn = Boolean(session);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setStatus(null);
    setCredits(null);
  };

  const canBuild = status?.active && userPrompt.length >= 10 && !insufficientCredits;
  const readyToBuild = stepIndex === STEPS.length - 1 && userPrompt.length >= 10;

  return (
    <section className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold">Chat Wizard</h2>
          <p className="text-xs text-slate-500">Collect requirements before building.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
            {loading ? "Checking..." : status?.active ? "Active" : "Unsubscribed"}
          </span>
          {signedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-4 text-sm text-slate-700">
        <div className="space-y-3">
          {messages.map((message, idx) => (
            <div
              key={`${message.role}-${idx}`}
              className={`rounded-xl border ${
                message.role === "assistant"
                  ? "border-slate-200 bg-slate-50 text-slate-700"
                  : "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
              } p-4 text-sm`}
            >
              {message.content}
            </div>
          ))}
        </div>

        {!signedIn ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Sign in with your email to continue.</p>
            <input
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleLogin}
              disabled={authLoading}
              className="w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white"
            >
              {authLoading ? "Sending..." : "Send magic link"}
            </button>
            {authNotice && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {authNotice}
              </div>
            )}
          </div>
        ) : !status?.active ? (
          <PricingPanel onSubscribe={handleSubscribe} loadingPlan={loadingPlan} />
        ) : (
          <div className="space-y-4">
            {currentStep.options && (
              <div className="flex flex-wrap gap-2">
                {currentStep.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep.options?.includes("Other") && (
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <input
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Add custom details"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
                >
                  Use custom
                </button>
              </div>
            )}

            {currentStep.input === "text" && (
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleInputSubmit}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
                >
                  Save
                </button>
              </div>
            )}

            {currentStep.input === "textarea" && (
              <div className="space-y-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handlePromptSubmit}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
                >
                  Save prompt
                </button>
              </div>
            )}

            {readyToBuild && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="text-slate-900">Build summary</p>
                <div className="mt-2 space-y-1">
                  <div>Type: {config.websiteType}</div>
                  <div>Rendering: {config.rendering}</div>
                  <div>Frontend: {config.frontendStack}</div>
                  <div>Backend: {config.backendStack}</div>
                  <div>DB: {config.database}</div>
                  <div>Auth: {config.auth}</div>
                  <div>Styling: {config.styling}</div>
                  <div>Deploy: {config.deployment}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {status?.active && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <span>
                Plan: {status?.planKey?.toUpperCase()} | Credits: {credits?.creditsRemaining ?? 0}/{credits?.creditsMonthly ?? 0}
                {credits?.resetAt ? ` | Resets: ${new Date(credits.resetAt).toLocaleDateString()}` : ""}
              </span>
              <a
                href="/billing"
                className="rounded-full border border-emerald-300 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-700"
              >
                Manage billing
              </a>
            </div>
            {credits && credits.creditsMonthly > 0 && credits.creditsRemaining <= Math.ceil(credits.creditsMonthly * 0.1) && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Low credits remaining. Consider topping up.
              </div>
            )}
            <TopUpPanel onTopup={handleTopup} loadingPack={topupLoading} />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-800">Recent credit activity</p>
              <div className="mt-3 space-y-2 text-xs text-slate-500">
                {(credits?.ledger || []).length === 0 && <p>No credit activity yet.</p>}
                {(credits?.ledger || []).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <span>
                      {entry.type} - {entry.reason}
                    </span>
                    <span>
                      {entry.amount > 0 ? "+" : "-"}
                      {Math.abs(entry.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStepIndex(STEPS.length - 1)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
        >
          Edit prompt
        </button>
        <div className="flex items-center gap-2">
          {buildStatus === "ready" && (
            <button
              type="button"
              disabled={!canBuild || buildLoading || !readyToBuild}
              onClick={handleBuild}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Regenerate
            </button>
          )}
          <button
            type="button"
            disabled={!canBuild || buildLoading || !readyToBuild}
            onClick={handleBuild}
            className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buildLoading ? "Building..." : `Build (cost: ${cost} credits)`}
          </button>
        </div>
      </div>

      {insufficientCredits && status?.active && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Insufficient credits. Upgrade or top up to continue.
        </div>
      )}

      {buildStatus && buildStatus !== "idle" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <p className="text-slate-900">Build progress</p>
          <ul className="mt-2 space-y-1">
            <li>Designing architecture</li>
            <li>Generating files</li>
            <li>Adding .env</li>
            <li>Running checks</li>
            <li>Packaging</li>
          </ul>
          <p className="mt-2 text-slate-400">Status: {buildStatus}</p>
        </div>
      )}
    </section>
  );
}
