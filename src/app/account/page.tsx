'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, updateProfile, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import OmegaTopNav from '@/components/layout/OmegaTopNav';
import { firebaseAuth, firestore } from '@/lib/firebaseClient';

type Project = {
  id: string;
  name: string;
  workspacePath?: string | null;
  updatedAt?: string | null;
};

type Profile = {
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  plan?: string | null;
  credits?: number | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error' | 'success'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const ref = doc(firestore, 'profiles', user.uid);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        setProfile({ email: user.email });
        return;
      }
      const data = snapshot.data() as Profile;
      setProfile({
        email: data.email || user.email || null,
        username: data.username || null,
        displayName: data.displayName || user.displayName || null,
        plan: data.plan || 'starter',
        credits: typeof data.credits === 'number' ? data.credits : null,
      });
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setEditName(profile?.displayName || user.displayName || '');
    setEditUsername(profile?.username || '');
  }, [profile, user]);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      const q = query(
        collection(firestore, 'projects'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const rows: Project[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          name: string;
          workspacePath?: string | null;
          updatedAt?: { toDate?: () => Date } | string | null;
        };
        const updatedAtValue =
          typeof data.updatedAt === 'string'
            ? data.updatedAt
            : data.updatedAt?.toDate?.().toISOString();
        return {
          id: docSnap.id,
          name: data.name,
          workspacePath: data.workspacePath || null,
          updatedAt: updatedAtValue || null,
        };
      });
      setProjects(rows);
    };
    loadProjects();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(firebaseAuth);
    window.location.href = '/login';
  };

  const handleProfileSave = async () => {
    if (!user) return;
    setSaveStatus('saving');
    setSaveMessage('');
    const nextName = editName.trim();
    const nextUsername = editUsername.trim().toLowerCase();
    if (nextUsername && !/^[a-z0-9_-]{3,24}$/.test(nextUsername)) {
      setSaveStatus('error');
      setSaveMessage('Username must be 3-24 chars (a-z, 0-9, _ or -).');
      return;
    }
    try {
      if (nextUsername) {
        const q = query(collection(firestore, 'profiles'), where('username', '==', nextUsername));
        const snapshot = await getDocs(q);
        const conflict = snapshot.docs.find((docSnap) => docSnap.id !== user.uid);
        if (conflict) {
          setSaveStatus('error');
          setSaveMessage('That username is already taken.');
          return;
        }
      }

      if (nextName && nextName !== user.displayName) {
        await updateProfile(user, { displayName: nextName });
      }

      await setDoc(
        doc(firestore, 'profiles', user.uid),
        {
          email: user.email || null,
          username: nextUsername || null,
          displayName: nextName || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setProfile((prev) => ({
        ...(prev || {}),
        email: user.email || prev?.email || null,
        username: nextUsername || null,
        displayName: nextName || null,
      }));
      setSaveStatus('success');
      setSaveMessage('Profile updated.');
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Profile update failed.');
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <OmegaTopNav active="account" variant="pricing" />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Profile
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Account overview</h1>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Email</span>
                  <span className="font-semibold text-slate-900">{profile?.email || '—'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Name</span>
                  <span className="font-semibold text-slate-900">
                    {profile?.displayName || user?.displayName || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Username</span>
                  <span className="font-semibold text-slate-900">{profile?.username || '—'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Plan</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {profile?.plan || 'starter'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>Credits</span>
                  <span className="font-semibold text-slate-900">
                    {profile?.credits !== null && profile?.credits !== undefined
                      ? profile.credits.toFixed(2)
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Edit profile
                </p>
                <div className="mt-4 grid gap-4 text-sm text-slate-700">
                  <label className="grid gap-1">
                    <span>Name</span>
                    <input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span>Username</span>
                    <input
                      value={editUsername}
                      onChange={(event) => setEditUsername(event.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                      placeholder="omega-builder"
                    />
                  </label>
                  {saveStatus === 'error' && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                      {saveMessage || 'Update failed.'}
                    </div>
                  )}
                  {saveStatus === 'success' && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
                      {saveMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    disabled={saveStatus === 'saving'}
                    className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 disabled:opacity-60"
                  >
                    {saveStatus === 'saving' ? 'Saving…' : 'Save profile'}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
                >
                  Manage plan
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Projects
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Recent workspaces</h2>
              <p className="mt-2 text-sm text-slate-600">
                Jump back into any build you have started.
              </p>

              <div className="mt-6 space-y-3">
                {projects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    No saved projects yet. Start a build and it will appear here.
                  </div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500">
                          {project.updatedAt
                            ? new Date(project.updatedAt).toLocaleString()
                            : '—'}
                        </p>
                      </div>
                      <Link
                        href="/ai"
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Open
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
