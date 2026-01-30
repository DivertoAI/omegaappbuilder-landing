import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function verifySignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature") || "";
  const bodyText = await req.text();

  if (!verifySignature(bodyText, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  type RazorpayTopupPayload = {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          notes?: Record<string, string>;
        };
      };
    };
  };

  let payload: RazorpayTopupPayload | null = null;
  try {
    payload = JSON.parse(bodyText) as RazorpayTopupPayload;
  } catch (error) {
    console.error("Topup webhook JSON parse failed", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = payload?.event;
  if (event !== "payment.captured") {
    return NextResponse.json({ ok: true });
  }

  const payment = payload?.payload?.payment?.entity;
  const notes = payment?.notes || {};
  const userId = notes.userId;
  const credits = Number(notes.credits || 0);

  if (!userId || !credits) {
    return NextResponse.json({ ok: true });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "active" },
    orderBy: { updatedAt: "desc" },
  });

  if (!subscription) {
    return NextResponse.json({ ok: true });
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      creditsRemaining: subscription.creditsRemaining + credits,
    },
  });

  await prisma.creditLedger.create({
    data: {
      userId,
      subscriptionId: subscription.id,
      type: "TOPUP",
      amount: credits,
      reason: "topup",
    },
  });

  return NextResponse.json({ ok: true });
}
