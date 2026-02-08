'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firestore, googleProvider, githubProvider } from '@/lib/firebaseClient';

type Method = 'email';

export default function SignupPage() {
  const router = useRouter();
  const [method] = useState<Method>('email');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!firebaseAuth) {
      setMessage('Auth is not configured yet.');
      setStatus('error');
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.push('/ai');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const ensureProfile = async (user: User, overrideUsername?: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'profiles', user.uid);
    const snapshot = await getDoc(ref);
    const existing = snapshot.exists() ? snapshot.data() : null;
    const nextUsername = overrideUsername?.trim().toLowerCase() || existing?.username || null;
    const nextPlan = existing?.plan || 'starter';
    const nextCredits = typeof existing?.credits === 'number' ? existing.credits : 0.25;
    const nextStatus =
      existing?.subscriptionStatus || (nextPlan === 'starter' ? 'active' : 'inactive');
    await setDoc(
      ref,
      {
        email: user.email || existing?.email || null,
        username: nextUsername,
        plan: nextPlan,
        credits: nextCredits,
        subscriptionStatus: nextStatus,
        updatedAt: serverTimestamp(),
        createdAt: existing?.createdAt || serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleSignup = async () => {
    if (!firebaseAuth) {
      setStatus('error');
      setMessage('Auth is not configured yet.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const email = identifier.trim();
      if (!email) throw new Error('Email is required.');
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await ensureProfile(credential.user, username);
      router.push('/ai');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleProviderSignup = async (provider: 'google' | 'github') => {
    if (!firebaseAuth) {
      setStatus('error');
      setMessage('Auth is not configured yet.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const selected = provider === 'google' ? googleProvider : githubProvider;
      if (!selected) {
        throw new Error('Auth provider is not configured.');
      }
      const credential = await signInWithPopup(firebaseAuth, selected);
      await ensureProfile(credential.user, username);
      router.push('/ai');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">Sign up</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Save workspaces, track credits, and return to builds anytime.
          </p>

          <div className="mt-6 space-y-4">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-700">Username (optional, lets you sign in by handle)</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="omega-builder"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-slate-700">Email</span>
              <input
                type="email"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="you@company.com"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-slate-700">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="At least 8 characters"
              />
            </label>

            {status === 'error' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {message || 'Signup failed. Please try again.'}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignup}
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-60"
            >
              {status === 'loading' ? 'Creating account…' : 'Create account'}
            </button>
          </div>

          <div className="mt-5 text-sm text-slate-600 flex items-center justify-between">
            <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
              Already have an account?
            </Link>
            <Link href="/forgot-password" className="text-fuchsia-600 hover:text-fuchsia-500">
              Forgot password?
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => handleProviderSignup('google')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignup('github')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue with GitHub
            </button>
            <p className="mt-2 text-xs text-slate-500">
              If you want SSO, magic-link login, password reset, or a richer project dashboard,
              say the word.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
