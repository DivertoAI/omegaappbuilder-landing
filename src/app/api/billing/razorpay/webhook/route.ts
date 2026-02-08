import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { supabase } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const PLAN_CREDITS: Record<string, number> = {
  starter: 0.25,
  core: 25,
  teams: 40,
  enterprise: 100,
};

const resolvePlanFromPlanId = (planId?: string | null) => {
  const map: Record<string, string | undefined> = {
    [process.env.RAZORPAY_PLAN_ID_STARTER || '']: 'starter',
    [process.env.RAZORPAY_PLAN_ID_PRO || '']: 'core',
    [process.env.RAZORPAY_PLAN_ID_SCALE || '']: 'teams',
    [process.env.RAZORPAY_PLAN_ID_ENTERPRISE || '']: 'enterprise',
  };
  if (!planId) return null;
  return map[planId] || null;
};

const updateCredits = async (userId: string, delta: number, plan?: string | null) => {
  if (!userId) return;
  const { data } = await supabase
    .from('profiles')
    .select('id, credits, plan')
    .eq('id', userId)
    .single();
  const currentCredits = Number(data?.credits || 0);
  const nextCredits = Math.max(0, currentCredits + delta);
  const nextPlan = plan || data?.plan || 'starter';
  await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        credits: nextCredits,
        plan: nextPlan,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
};

const setPlanCredits = async (userId: string, plan: string) => {
  if (!userId) return;
  const credits = PLAN_CREDITS[plan] ?? 0;
  await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        credits,
        plan,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
};

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    subscription?: { entity?: { plan_id?: string; notes?: Record<string, string> } };
    payment?: { entity?: { notes?: Record<string, string | number> } };
  };
};

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('x-razorpay-signature') || '';
  const bodyText = await request.text();
  const expected = crypto.createHmac('sha256', webhookSecret).update(bodyText).digest('hex');
  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const payload = JSON.parse(bodyText || '{}') as RazorpayWebhookPayload;
  const event = payload?.event || '';

  const defaultUserId = process.env.OMEGA_DEFAULT_USER_ID || '';

  if (event.startsWith('subscription.')) {
    const subscription = payload?.payload?.subscription?.entity;
    const planId = subscription?.plan_id as string | undefined;
    const plan = resolvePlanFromPlanId(planId) || subscription?.notes?.plan || null;
    const userId = subscription?.notes?.userId || defaultUserId;
    if (userId && plan) {
      await setPlanCredits(userId, plan);
    }
  }

  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload?.payload?.payment?.entity;
    const notes = payment?.notes || {};
    const userId = notes.userId || defaultUserId;
    const creditsRaw = notes.credits ? Number(notes.credits) : null;
    if (userId && creditsRaw) {
      await updateCredits(userId, creditsRaw, null);
    }
  }

  return NextResponse.json({ ok: true });
}
