'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebaseClient';

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [verified, setVerified] = useState(false);

  const oobCode = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('oobCode');
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!oobCode) return;
      try {
        await verifyPasswordResetCode(firebaseAuth, oobCode);
        setVerified(true);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Invalid or expired reset link.');
      }
    };
    verify();
  }, [oobCode]);

  const handleReset = async () => {
    if (!oobCode) return;
    if (!password || password !== confirm) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      await confirmPasswordReset(firebaseAuth, oobCode, password);
      setStatus('success');
      setMessage('Password updated. You can sign in now.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Reset failed.');
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
            Reset
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Set a new password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Finish the password reset you started via email.
          </p>

          {!oobCode ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Missing reset token. Please use the link from your email.
            </div>
          ) : !verified && status !== 'error' ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Verifying reset link…
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="At least 8 characters"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Re-enter password"
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
                {status === 'loading' ? 'Updating…' : 'Update password'}
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-slate-600">
            Back to{' '}
            <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
              login
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}
