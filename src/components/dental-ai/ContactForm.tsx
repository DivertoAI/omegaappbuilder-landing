'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
    'http://localhost:4000';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      setMessage('Thanks! We will reach out to confirm a demo time.');
      setForm({ name: '', email: '', phone: '', clinicName: '' });
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="Dr. Priya Sharma"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="hello@sunrise-smiles.com"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium">Phone</span>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="(555) 123-4567"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium">Clinic Name</span>
          <input
            name="clinicName"
            value={form.clinicName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="Sunrise Dental Care"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending...' : 'Book a 15-Min Demo'}
      </button>
      <p className="mt-4 text-xs text-slate-500" aria-live="polite">
        {message}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        By submitting this form you agree to be contacted about the demo.
      </p>
    </form>
  );
}
