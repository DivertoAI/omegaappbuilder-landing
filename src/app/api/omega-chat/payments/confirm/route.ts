import { NextResponse } from 'next/server';
import { z } from 'zod';
import { omegaChatRequest } from '@/lib/omega-chat/client';

export const runtime = 'nodejs';

const schema = z
  .object({
    sessionToken: z.string().min(16),
    paymentId: z.string().min(8),
    providerOrderId: z.string().min(8).optional(),
    providerPaymentId: z.string().min(8).optional(),
    providerSignature: z.string().min(16).optional(),
    simulateSuccess: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.simulateSuccess) {
      return;
    }
    if (!value.providerOrderId || !value.providerPaymentId || !value.providerSignature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Razorpay confirmation fields are required.',
      });
    }
  });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payment confirmation request.' }, { status: 400 });
  }

  const upstream = await omegaChatRequest({
    path: '/v1/payments/confirm',
    method: 'POST',
    token: parsed.data.sessionToken,
    body: {
      payment_id: parsed.data.paymentId,
      ...(parsed.data.simulateSuccess
        ? { simulate_success: true }
        : {
            provider_order_id: parsed.data.providerOrderId,
            provider_payment_id: parsed.data.providerPaymentId,
            provider_signature: parsed.data.providerSignature,
          }),
    },
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: upstream.error }, { status: upstream.status });
  }

  return NextResponse.json(upstream.data, { status: 200 });
}
