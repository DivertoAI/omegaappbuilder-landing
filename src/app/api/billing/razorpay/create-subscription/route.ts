import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  plan: z.enum(['starter', 'core', 'teams', 'enterprise']).default('starter'),
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  userId: z.string().optional(),
});

const resolvePlanId = (plan: string) => {
  const map: Record<string, string | undefined> = {
    starter: process.env.RAZORPAY_PLAN_ID_STARTER,
    core: process.env.RAZORPAY_PLAN_ID_PRO,
    teams: process.env.RAZORPAY_PLAN_ID_SCALE,
    enterprise: process.env.RAZORPAY_PLAN_ID_ENTERPRISE,
  };
  return map[plan];
};

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay keys are missing.' }, { status: 500 });
  }

  const payload = schema.safeParse(await request.json().catch(() => ({})));
  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { plan, customer, userId } = payload.data;
  const planId = resolvePlanId(plan);
  if (!planId) {
    return NextResponse.json({ error: 'Plan ID not configured.' }, { status: 500 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  let customerId: string | undefined;
  if (customer?.email || customer?.phone) {
    const created = await razorpay.customers.create({
      name: customer?.name,
      email: customer?.email,
      contact: customer?.phone,
      notes: userId ? { userId } : undefined,
    });
    customerId = created.id;
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    customer_notify: 1,
    notes: {
      plan,
      ...(userId ? { userId } : {}),
      ...(customerId ? { customerId } : {}),
    },
  });

  return NextResponse.json({
    keyId,
    plan,
    subscriptionId: subscription.id,
    customerId,
  });
}
