import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({
        active: false,
        planKey: null,
        creditsMonthly: 0,
        creditsRemaining: 0,
        resetAt: null,
        requiresAuth: true,
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: "active" },
      orderBy: { updatedAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json({
        active: false,
        planKey: null,
        creditsMonthly: 0,
        creditsRemaining: 0,
        resetAt: null,
      });
    }

    return NextResponse.json({
      active: true,
      planKey: subscription.planKey,
      creditsMonthly: subscription.creditsMonthly,
      creditsRemaining: subscription.creditsRemaining,
      resetAt: subscription.creditsResetAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Subscription status error", error);
    return NextResponse.json({
      active: false,
      planKey: null,
      creditsMonthly: 0,
      creditsRemaining: 0,
      resetAt: null,
    });
  }
}
