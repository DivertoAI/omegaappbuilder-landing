import nodemailer from "nodemailer";

type MailLead = {
  name: string;
  email: string;
  company?: string;
  url?: string;
  service?: string;
  message?: string;
};

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function sendLeadEmail(lead: MailLead) {
  const from = process.env.NOTIFY_FROM!;
  const to = process.env.NOTIFY_TO || from;
  const subject = `New Lead: ${lead.name} · ${lead.service || "General"}`;

  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "-"}`,
    `URL: ${lead.url || "-"}`,
    `Service: ${lead.service || "-"}`,
    "",
    (lead.message || "").trim(),
  ].join("\n");

  const html = `
    <h2>New Lead</h2>
    <p><b>Name:</b> ${lead.name}</p>
    <p><b>Email:</b> ${lead.email}</p>
    <p><b>Company:</b> ${lead.company || "-"}</p>
    <p><b>URL:</b> ${lead.url || "-"}</p>
    <p><b>Service:</b> ${lead.service || "-"}</p>
    <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;">${(lead.message || "").trim()}</pre>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    replyTo: lead.email,
  });
}
