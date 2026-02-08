'use client';

import Link from 'next/link';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!firebaseAuth) {
      setStatus('error');
      setMessage('Auth is not configured yet.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const origin = window.location.origin;
      await sendPasswordResetEmail(firebaseAuth, email, {
        url: `${origin}/reset-password`,
        handleCodeInApp: true,
      });
      setStatus('success');
      setMessage('Reset link sent. Check your email to continue.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to send reset link');
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
            Reset
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-600">
            We will email you a secure link to set a new password.
          </p>

          <div className="mt-6 space-y-4">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="you@company.com"
              />
            </label>

            {status === 'error' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {message || 'Reset failed. Please try again.'}
              </div>
            )}

            {status === 'success' && message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Send reset link'}
            </button>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
