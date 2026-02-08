'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/lib/firebaseClient';

type NavItem = {
  label: string;
  href: string;
  key: string;
};

const PLAN_META: Record<
  string,
  { label: string; agent: string; creditCap?: number | null }
> = {
  starter: { label: 'Starter', agent: 'Omega 1', creditCap: 0.25 },
  core: { label: 'Core', agent: 'Omega 2', creditCap: 25 },
  teams: { label: 'Teams', agent: 'Omega 3', creditCap: 40 },
  enterprise: { label: 'Enterprise', agent: 'Omega 3', creditCap: null },
};

const formatCredits = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (value < 1) return value.toFixed(2);
  if (value < 100) return value.toFixed(1).replace(/\.0$/, '');
  return Math.round(value).toLocaleString();
};

const ADMIN_EMAIL = 'divertoai@gmail.com';

export default function OmegaTopNav({
  active,
  variant = 'builder',
}: {
  active?: string;
  variant?: 'builder' | 'pricing';
}) {
  const [credits, setCredits] = useState<number | null>(null);
  const [planKey, setPlanKey] = useState('starter');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const isAdminUser = Boolean(userEmail) && userEmail?.toLowerCase() === ADMIN_EMAIL;
  const planMeta = useMemo(
    () => (isAdminUser ? PLAN_META.enterprise : PLAN_META[planKey] || PLAN_META.starter),
    [isAdminUser, planKey]
  );
  const creditCap = isAdminUser ? null : planMeta.creditCap ?? null;
  const creditsRange = isAdminUser
    ? 'Unlimited'
    : creditCap !== null
    ? `${formatCredits(credits)} / ${formatCredits(creditCap)}`
    : formatCredits(credits);
  const creditsRatio =
    credits !== null && creditCap ? Math.max(0, Math.min(1, credits / creditCap)) : 0;
  const initials = userEmail
    ? userEmail.split('@')[0].slice(0, 2).toUpperCase()
    : 'GU';

  const navItems: NavItem[] = [
    { label: 'Builder', href: '/ai', key: 'builder' },
    { label: 'Workflow', href: '/workflow', key: 'workflow' },
    { label: 'Pricing', href: '/pricing', key: 'pricing' },
    { label: 'Contact', href: '/contact', key: 'contact' },
  ];

  useEffect(() => {
    let cancelled = false;
    const loadCredits = async (token?: string | null) => {
      try {
        if (firebaseAuth && firestore) {
          const current = firebaseAuth.currentUser;
          if (current) {
            const snapshot = await getDoc(doc(firestore, 'profiles', current.uid));
            if (snapshot.exists()) {
              const data = snapshot.data() as {
                credits?: number;
                plan?: string;
                subscriptionStatus?: string;
              };
              const isActive = data.subscriptionStatus === 'active' || data.plan === 'starter';
              const nextPlan = isActive ? data.plan || 'starter' : 'starter';
              if (cancelled) return;
              setCredits(typeof data.credits === 'number' ? data.credits : null);
              setPlanKey(nextPlan);
              return;
            }
          }
        }
        const response = await fetch('/api/credits', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { credits?: number; plan?: string };
        if (cancelled) return;
        setCredits(typeof data.credits === 'number' ? data.credits : null);
        setPlanKey(data.plan || 'starter');
      } catch {
        // ignore credit fetch errors
      }
    };
    if (isAdminUser) {
      setCredits(null);
      setPlanKey('enterprise');
      return;
    }
    loadCredits();
    return () => {
      cancelled = true;
    };
  }, [isAdminUser]);

  useEffect(() => {
    let mounted = true;
    if (!firebaseAuth) {
      setUserEmail(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!mounted) return;
      setUserEmail(user?.email || null);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const isBuilder = variant === 'builder';
  const navTextSize = isBuilder ? 'text-[12px]' : 'text-sm';
  const navPadding = isBuilder ? 'px-3' : 'px-4';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">
                  Omega — AI Agents • 3D Web • Apps
                </p>
                <p className="text-[11px] text-slate-500">Builder Console</p>
              </div>
            </Link>
            <nav
              className={`hidden lg:flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-1 shadow-sm whitespace-nowrap ${navTextSize}`}
            >
              {navItems.map((item) => {
                const isActive = active === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`rounded-full ${navPadding} py-1.5 font-medium transition ${
                      isActive
                        ? 'bg-white text-fuchsia-600 shadow-sm'
                        : 'text-slate-700 hover:bg-white hover:text-fuchsia-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
            {userEmail && (
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-600 shadow-sm">
                <div className="min-w-[84px]">
                  <p className="uppercase tracking-wide text-slate-400">Credits</p>
                  <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{creditsRange}</p>
                  <div className="mt-1 h-1 w-full rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                      style={{ width: `${creditsRatio * 100}%` }}
                    />
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="min-w-[60px]">
                  <p className="uppercase tracking-wide text-slate-400">Plan</p>
                  <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{planMeta.label}</p>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="min-w-[70px]">
                  <p className="uppercase tracking-wide text-slate-400">Agent</p>
                  <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{planMeta.agent}</p>
                </div>
                <Link
                  href="/pricing"
                  className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Manage
                </Link>
              </div>
            )}
              {userEmail ? (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold">
                    {initials}
                  </span>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Account</p>
                    <p className="text-sm font-semibold text-slate-900">{userEmail}</p>
                  </div>
                  <Link
                    href="/account"
                    className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Settings
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3">
        {userEmail && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Credits</p>
              <p className="text-sm font-semibold text-slate-900">{creditsRange}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
                  style={{ width: `${creditsRatio * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Plan</p>
              <p className="text-sm font-semibold text-slate-900">{planMeta.label}</p>
              <p className="text-[10px] font-semibold text-slate-500">{planMeta.agent}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold">
              {initials}
            </span>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Account</p>
              <p className="text-sm font-semibold text-slate-900">
                {userEmail || 'Guest'}
              </p>
            </div>
          </div>
          {userEmail ? (
            <Link
              href="/account"
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Settings
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
