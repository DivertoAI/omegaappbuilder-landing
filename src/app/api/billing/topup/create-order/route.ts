import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  credits: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  userId: z.string().optional(),
});

const toMinorUnits = (value: number) => Math.round(value * 100);

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

  const currency = (payload.data.currency || process.env.RAZORPAY_CURRENCY || 'USD').toUpperCase();
  const credits = payload.data.credits;
  const amountValue = payload.data.amount ?? (credits ? credits : 0);

  if (!amountValue || amountValue <= 0) {
    return NextResponse.json({ error: 'Missing top-up amount.' }, { status: 400 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({
    amount: toMinorUnits(amountValue),
    currency,
    receipt: `topup_${Date.now()}`,
    notes: {
      type: 'topup',
      credits: credits ? String(credits) : String(amountValue),
      ...(payload.data.userId ? { userId: payload.data.userId } : {}),
    },
  });

  return NextResponse.json({
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    credits: credits ?? amountValue,
  });
}
