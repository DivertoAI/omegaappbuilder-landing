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

  let payload: any = null;
  try {
    payload = JSON.parse(bodyText);
  } catch (error) {
    console.error("Webhook JSON parse failed", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = payload?.event as string | undefined;
  const subscriptionEntity = payload?.payload?.subscription?.entity;

  if (!subscriptionEntity?.id) {
    return NextResponse.json({ ok: true });
  }

  const subId = subscriptionEntity.id as string;
  const status = subscriptionEntity.status as string;
  const currentStart = subscriptionEntity.current_start
    ? new Date(subscriptionEntity.current_start * 1000)
    : null;
  const currentEnd = subscriptionEntity.current_end
    ? new Date(subscriptionEntity.current_end * 1000)
    : null;

  const subscription = await prisma.subscription.findUnique({
    where: { razorpaySubscriptionId: subId },
  });

  if (!subscription) {
    return NextResponse.json({ ok: true });
  }

  const shouldReset = event === "subscription.charged" || event === "subscription.activated";

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      currentPeriodStart: currentStart,
      currentPeriodEnd: currentEnd,
      creditsResetAt: currentEnd,
      creditsRemaining: shouldReset ? subscription.creditsMonthly : subscription.creditsRemaining,
    },
  });

  if (shouldReset) {
    await prisma.creditLedger.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        type: "ALLOCATE",
        amount: subscription.creditsMonthly,
        reason: "monthly_reset",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
