import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseAdmin";
import { leadSchema } from "@/lib/schema";
import { sendLeadEmail } from "@/lib/mailer";

export const runtime = "nodejs"; // required for nodemailer

export async function POST(req: Request) {
  const url = new URL(req.url);
  const redirectParam = url.searchParams.get("redirect") || "/thank-you";

  const form = await req.formData();
  const raw = Object.fromEntries(form.entries());

  // Honeypot: if filled, treat as spam but return success-looking redirect
  if ((raw.hp as string)?.trim()) {
    return NextResponse.redirect(new URL(`${redirectParam}?ok=1`, url.origin));
  }

  const parsed = leadSchema.safeParse({
    hp: raw.hp,
    name: raw.name,
    email: raw.email,
    company: raw.company,
    url: raw.url,
    service: raw.service,
    message: raw.message,
  });

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.flatten());
    return NextResponse.redirect(new URL(`${redirectParam}?ok=0`, url.origin));
  }

  const data = parsed.data;

  // Store in Supabase
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    company: data.company || null,
    url: data.url || null,
    service: data.service || null,
    message: data.message || null,
    source: "website",
    ua: req.headers.get("user-agent"),
    ip: (req.headers.get("x-forwarded-for") || "").split(",")[0] || null,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    // continue to email + redirect (don't lose the lead)
  }

  try {
    await sendLeadEmail({
      name: data.name,
      email: data.email,
      company: data.company || "",
      url: data.url || "",
      service: data.service || "",
      message: data.message || "",
    });
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.redirect(new URL(`${redirectParam}?ok=1`, url.origin));
}
