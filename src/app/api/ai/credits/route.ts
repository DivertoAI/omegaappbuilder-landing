import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth/requireUser";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({
      creditsRemaining: 0,
      creditsMonthly: 0,
      resetAt: null,
      ledger: [],
      active: false,
    });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "active" },
    orderBy: { updatedAt: "desc" },
  });

  if (!subscription) {
    return NextResponse.json({
      creditsRemaining: 0,
      creditsMonthly: 0,
      resetAt: null,
      ledger: [],
      active: false,
    });
  }

  const ledger = await prisma.creditLedger.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    active: true,
    creditsRemaining: subscription.creditsRemaining,
    creditsMonthly: subscription.creditsMonthly,
    resetAt: subscription.creditsResetAt?.toISOString() ?? null,
    ledger: ledger.map((entry) => ({
      id: entry.id,
      type: entry.type,
      amount: entry.amount,
      reason: entry.reason,
      createdAt: entry.createdAt.toISOString(),
    })),
  });
}
