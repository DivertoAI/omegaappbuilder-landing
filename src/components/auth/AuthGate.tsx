'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebaseClient';

type Props = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      setChecking(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setHasSession(Boolean(user));
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Checking session…
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
              Omega Account
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
              Sign in to continue
            </h1>
            <p className="mt-4 text-slate-600">
              Access your saved workspaces, credits, and build history with a secure Omega account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Create an account
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Need help? Email hello@omegaappbuilder.com and we will get you set up.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
