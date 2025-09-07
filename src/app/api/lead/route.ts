// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

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

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSvcKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseSvcKey, { auth: { persistSession: false } });

const transporter =
  process.env.EMAIL_HOST
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT ?? 465),
        secure: Number(process.env.EMAIL_PORT ?? 465) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

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
      // only keep string-like values for our schema
      obj[k as keyof RawLeadInput] = String(v);
    });
    return obj;
  }
}

export async function POST(req: Request) {
  try {
    const data = await parseRequestBody(req);

    const url = new URL(req.url);
    const redirect = url.searchParams.get("redirect");

    const parsed = LeadSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const lead = parsed.data;

    // Honeypot
    if (lead.hp) {
      return NextResponse.json({ ok: true });
    }

    const { ip, ua } = getClientInfo(req);

    // Store in Supabase
    const { error: dbErr } = await supabase.from("leads").insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      url: lead.url,
      service: lead.service,
      message: lead.message,
      ip,
      ua,
      source: "website",
    });
    if (dbErr) {
      console.error("Supabase insert error:", dbErr);
    }

    // Notify via SMTP
    if (transporter && process.env.NOTIFY_TO) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: process.env.NOTIFY_TO,
          subject: `New Lead: ${lead.name} (${lead.email})`,
          html: `
            <h2>New Website Lead</h2>
            <p><b>Name:</b> ${lead.name}</p>
            <p><b>Email:</b> ${lead.email}</p>
            <p><b>Company:</b> ${lead.company}</p>
            <p><b>URL:</b> ${lead.url}</p>
            <p><b>Service:</b> ${lead.service}</p>
            <p><b>Message:</b><br/>${(lead.message || "").replace(/\n/g, "<br/>")}</p>
            <hr/>
            <p><b>IP:</b> ${ip}</p>
            <p><b>UA:</b> ${ua}</p>
          `,
        });
      } catch (e) {
        console.error("Email send failed:", getErrorMessage(e));
      }
    }

    // Zapier webhook
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
            service: lead.service,
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