'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseAuth, firestore, googleProvider, githubProvider } from '@/lib/firebaseClient';

type Method = 'email' | 'username';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
    setStatus('idle');
  }, [method]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.push('/ai');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const ensureProfile = async (user: User) => {
    const ref = doc(firestore, 'profiles', user.uid);
    const snapshot = await getDoc(ref);
    const existing = snapshot.exists() ? snapshot.data() : null;
    await setDoc(
      ref,
      {
        email: user.email || existing?.email || null,
        username: existing?.username || null,
        updatedAt: serverTimestamp(),
        createdAt: existing?.createdAt || serverTimestamp(),
      },
      { merge: true }
    );
  };

  const resolveEmail = async () => {
    if (method === 'email') return identifier.trim();
    const normalized = identifier.trim().toLowerCase();
    if (!normalized) throw new Error('Enter your username.');
    const q = query(collection(firestore, 'profiles'), where('username', '==', normalized));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      throw new Error('Username not found.');
    }
    const data = snapshot.docs[0].data() as { email?: string | null };
    if (!data?.email) throw new Error('Username does not have an email on file.');
    return data.email;
  };

  const handlePasswordLogin = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const email = await resolveEmail();
      if (!email) throw new Error('Email is required for login.');
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      await ensureProfile(credential.user);
      router.push('/ai');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    setStatus('loading');
    setMessage('');
    try {
      const selected = provider === 'google' ? googleProvider : githubProvider;
      const credential = await signInWithPopup(firebaseAuth, selected);
      await ensureProfile(credential.user);
      router.push('/ai');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">Login</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your saved Omega projects and credits.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50/80 p-1 text-xs">
            {(['email', 'username'] as Method[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMethod(item)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  method === item ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {item === 'email' ? 'Email' : 'Username'}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-700">{method === 'email' ? 'Email' : 'Username'}</span>
              <input
                type={method === 'email' ? 'email' : 'text'}
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder={method === 'email' ? 'you@company.com' : 'omega-builder'}
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
                placeholder="••••••••"
              />
            </label>

            {status === 'error' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {message || 'Login failed. Please try again.'}
              </div>
            )}

            <button
              type="button"
              onClick={handlePasswordLogin}
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-60"
            >
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </button>
          </div>

          <div className="mt-5 text-sm text-slate-600 flex items-center justify-between">
            <Link href="/forgot-password" className="text-fuchsia-600 hover:text-fuchsia-500">
              Forgot password?
            </Link>
            <Link href="/signup" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
              Create an account
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => handleProviderLogin('google')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleProviderLogin('github')}
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
