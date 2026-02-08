'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/lib/firebaseClient';

type Plan = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  bullets: string[];
};

type PlanAction = {
  plan: string;
  label: string;
};

type Props = {
  plans: Plan[];
  planActions: PlanAction[];
  calendlyUrl: string;
};

export default function PricingPlansClient({ plans, planActions, calendlyUrl }: Props) {
  const [user, setUser] = useState<User | null>(firebaseAuth?.currentUser || null);

  useEffect(() => {
    if (!firebaseAuth) return;
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  const planCredits: Record<string, number> = {
    starter: 0.25,
    core: 25,
    teams: 40,
    enterprise: 100,
  };

  const handlePlanAction = async (plan: string) => {
    if (plan === 'starter') {
      window.location.href = '/signup';
      return;
    }
    if (plan === 'enterprise') {
      window.open(calendlyUrl, '_blank', 'noopener');
      return;
    }

    if (!firebaseAuth || !firestore || !user) {
      alert('Please log in before subscribing.');
      window.location.href = '/login';
      return;
    }

    const name = window.prompt('Your full name?') || '';
    const email = window.prompt('Billing email?') || '';
    const phone = window.prompt('Phone (optional)') || '';

    const response = await fetch('/api/billing/razorpay/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        userId: user.uid,
        customer: {
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
        },
      }),
    });

    if (!response.ok) {
      alert('Unable to start checkout. Please try again.');
      return;
    }

    const data = await response.json();
    const options = {
      key: data.keyId,
      subscription_id: data.subscriptionId,
      name: 'Omega AI Builder',
      description: `Omega ${plan} subscription`,
      prefill: {
        name,
        email,
        contact: phone,
      },
      theme: { color: '#7c3aed' },
      handler: async (response: { razorpay_subscription_id?: string }) => {
        const credits = planCredits[plan] ?? 0;
        await setDoc(
          doc(firestore, 'profiles', user.uid),
          {
            plan,
            credits,
            subscriptionStatus: 'active',
            subscriptionProvider: 'razorpay',
            subscriptionId: response.razorpay_subscription_id || data.subscriptionId || null,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        window.location.href = '/ai';
      },
    };

    const Razorpay = (window as { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } })
      .Razorpay;
    if (!Razorpay) {
      alert('Razorpay SDK not loaded.');
      return;
    }
    const checkout = new Razorpay(options);
    checkout.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <div key={plan.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{plan.name}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{plan.price}</p>
            <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">{plan.cadence}</p>
            <p className="mt-4 text-sm font-semibold text-slate-900">{plan.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.bullets.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              data-plan={planActions[index]?.plan}
              onClick={() => handlePlanAction(planActions[index]?.plan || plan.name.toLowerCase())}
              className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {planActions[index]?.label || `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
