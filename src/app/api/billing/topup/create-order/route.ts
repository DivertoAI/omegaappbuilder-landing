import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth/requireUser";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/billing/razorpay";
import { TOPUP_PACKS, DEFAULT_CURRENCY } from "@/lib/billing/plans";

export const runtime = "nodejs";

const BodySchema = z.object({
  pack: z.enum(["20", "60", "150"]),
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
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }
    const pack = TOPUP_PACKS[parsed.data.pack];
    const client = getRazorpayClient();

    const order = await client.orders.create({
      amount: pack.amount,
      currency: DEFAULT_CURRENCY,
      notes: {
        userId: user.id,
        pack: parsed.data.pack,
        credits: String(pack.credits),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      credits: pack.credits,
    });
  } catch (error) {
    console.error("Topup order failed", error);
    return NextResponse.json({ error: "Topup failed" }, { status: 500 });
  }
}
