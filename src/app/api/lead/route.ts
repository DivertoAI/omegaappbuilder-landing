// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Ensure Node runtime (needed for nodemailer on Vercel)
export const runtime = "nodejs";

/** ---------- Validation ---------- */
const LeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().default(""),
  url: z.string().optional().default(""),
  service: z.string().optional().default(""),
  message: z.string().optional().default(""),
  hp: z.string().optional().default(""), // honeypot
});

type RawLeadInput = {
  name?: string;
  email?: string;
  company?: string;
  url?: string;
  service?: string;
  message?: string;
  hp?: string;
};

/** ---------- Helpers ---------- */
function clean(str: string) {
  return str
    .toLowerCase()
    .replace(/[–—]/g, "-") // en/em dashes → hyphen
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Map a variety of human labels/synonyms to your HubSpot internal values
const SERVICE_MAP: Record<string, string> = {
  // Landing page
  "landing page": "landing_page",
  "landing_page": "landing_page",

  // 5-page website
  "5-page website": "five_page_website",
  "5 page website": "five_page_website",
  "five_page_website": "five_page_website",

  // App UI (5–10 screens)
  "app ui (5-10 screens)": "app_ui_5_10",
  "app ui 5-10 screens": "app_ui_5_10",
  "app ui 5-10": "app_ui_5_10",
  "app ui (5–10 screens)": "app_ui_5_10",
  "app_ui_5_10": "app_ui_5_10",

  // Full-stack MVP
  "full-stack mvp": "full_stack_mvp",
  "full stack mvp": "full_stack_mvp",
  "full_stack_mvp": "full_stack_mvp",

  // Marketing & CRO
  "marketing & cro": "marketing_cro",
  "marketing and cro": "marketing_cro",
  "marketing_cro": "marketing_cro",

  // Free Audit
  "free audit request": "free_audit_request",
  "free_audit_request": "free_audit_request",

  // Calendly
  "30-min call calendly": "calendly_30min_call",
  "30 min call calendly": "calendly_30min_call",
  "30-min call": "calendly_30min_call",
  "calendly 30min call": "calendly_30min_call",
  "calendly_30min_call": "calendly_30min_call",
};

function normalizeService(s?: string): string {
  if (!s) return "";
  const c = clean(s);
  // Direct hit on cleaned version
  if (SERVICE_MAP[c]) return SERVICE_MAP[c];
  // If the incoming value is already an internal value, pass it through
  if (
    [
      "landing_page",
      "five_page_website",
      "app_ui_5_10",
      "full_stack_mvp",
      "marketing_cro",
      "free_audit_request",
      "calendly_30min_call",
    ].includes(s)
  ) {
    return s;
  }
  // Fallback: return cleaned label (last resort)
  return c;
}

function getClientInfo(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "")
      .split(",")[0]
      .trim() || req.headers.get("x-real-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  return { ip, ua };
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

async function parseRequestBody(req: Request): Promise<RawLeadInput> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = (await req.json()) as unknown;
    if (json && typeof json === "object") {
      return json as RawLeadInput;
    }
    return {};
  } else {
    const fd = await req.formData();
    const obj: RawLeadInput = {};
    fd.forEach((v, k) => {
      obj[k as keyof RawLeadInput] = String(v);
    });
    return obj;
  }
}


/** ---------- Mailer (Gmail SMTP) ---------- */
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFY_FROM = process.env.NOTIFY_FROM || GMAIL_USER || "";
const NOTIFY_TO = process.env.NOTIFY_TO || GMAIL_USER || "";

const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null;

/** ---------- Handler ---------- */
export async function POST(req: Request) {
  try {
    const data = await parseRequestBody(req);

    const url = new URL(req.url);
    const redirect = url.searchParams.get("redirect") || undefined;

    const parsed = LeadSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const lead = parsed.data;

    // Honeypot trap
    if (lead.hp) {
      return NextResponse.json({ ok: true }); // silently accept bots
    }

    const { ip, ua } = getClientInfo(req);

    // Normalize service for HubSpot/Zapier compatibility
    const normalizedService = normalizeService(lead.service);

    // Supabase storage disabled: shortest path is email only.

    // Notify via email (Gmail SMTP)
    if (transporter && NOTIFY_TO && NOTIFY_FROM) {
      try {
        await transporter.sendMail({
          from: NOTIFY_FROM, // e.g. "Omega App Builder <hello@omegaappbuilder.com>"
          to: NOTIFY_TO, // where you want notifications
          replyTo: lead.email, // clicking reply goes to the lead
          subject: `New Lead: ${lead.name} (${lead.email})`,
          html: `
            <h2>New Website Lead</h2>
            <p><b>Name:</b> ${lead.name}</p>
            <p><b>Email:</b> ${lead.email}</p>
            <p><b>Company:</b> ${lead.company}</p>
            <p><b>URL:</b> ${lead.url}</p>
            <p><b>Service:</b> ${normalizedService}</p>
            <p><b>Message:</b><br/>${(lead.message || "")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, "<br/>")}</p>
            <hr/>
            <p><b>IP:</b> ${ip}</p>
            <p><b>User-Agent:</b> ${ua}</p>
          `,
        });
      } catch (e) {
        console.error("Email send failed:", getErrorMessage(e));
      }
    }

    // Optional: Zapier webhook (if provided)
    if (process.env.ZAPIER_HOOK_URL) {
      try {
        await fetch(process.env.ZAPIER_HOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "website",
            name: lead.name,
            email: lead.email,
            company: lead.company,
            url: lead.url,
            service: normalizedService, // send normalized for HubSpot dropdown
            message: lead.message,
            ip,
            ua,
          }),
        });
      } catch (e) {
        console.error("Zapier webhook failed:", getErrorMessage(e));
      }
    }

    if (redirect) {
      return NextResponse.redirect(new URL(redirect, url.origin), { status: 303 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = getErrorMessage(e);
    console.error(msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
