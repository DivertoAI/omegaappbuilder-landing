import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { PLAN_CONFIG, type PlanKey } from "@/lib/billing/plans";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/billing/razorpay";

export const runtime = "nodejs";

const BodySchema = z.object({
  planKey: z.enum(["starter", "pro", "scale"]),
});

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as unknown;
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLAN_CONFIG[parsed.data.planKey as PlanKey];
    const planId = process.env[plan.razorpayPlanEnv];
    if (!planId) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
    }

    const client = getRazorpayClient();
    const subscription = await client.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12,
    });

    await prisma.subscription.upsert({
      where: { razorpaySubscriptionId: subscription.id },
      update: {
        planKey: plan.key,
        status: subscription.status,
      },
      create: {
        userId: user.id,
        planKey: plan.key,
        razorpaySubscriptionId: subscription.id,
        status: subscription.status,
        creditsMonthly: plan.creditsMonthly,
        creditsRemaining: plan.creditsMonthly,
        creditsResetAt: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
        currentPeriodStart: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : null,
        currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
      },
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      subscriptionId: subscription.id,
      planKey: plan.key,
    });
  } catch (error) {
    console.error("Create subscription failed", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
