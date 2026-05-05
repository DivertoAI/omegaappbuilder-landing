import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Omega Receptionist | OmegaAppBuilder',
  description:
    'Omega Receptionist is a WhatsApp-first receptionist that handles inbound inquiries, qualifies leads, and books calls with natural, human replies.',
  alternates: { canonical: '/omegareceptionist' },
  openGraph: {
    title: 'Omega Receptionist',
    description:
      'A WhatsApp receptionist that replies like a human, captures intent, and schedules follow-ups without leaking internal ops.',
    url: '/omegareceptionist',
    type: 'website',
  },
};

const highlights = [
  {
    title: 'Human-like replies, always',
    description:
      'Short, sharp, and natural responses that feel like a real staff member on WhatsApp.',
  },
  {
    title: 'Lead capture + qualification',
    description:
      'Captures intent, prioritizes warm leads, and moves qualified prospects to a booked slot.',
  },
  {
    title: 'Scheduling + handoff',
    description:
      'Books calls or meetings between 10 AM–10 PM and keeps owner context clean.',
  },
  {
    title: 'Guardrails by design',
    description:
      'No internal tooling leaks, no automation disclosure, and strict offer boundaries.',
  },
];

const plans = [
  {
    name: 'WhatsApp chatbot',
    price: '₹2,999/mo',
    note: 'Monthly plan',
    features: [
      'Human-like replies',
      'Lead capture + follow-up',
      'Owner handoff when needed',
    ],
  },
  {
    name: 'Voice agent',
    price: '₹2,999/mo',
    note: 'Monthly plan',
    features: [
      'Voice call handling',
      'Call summaries',
      'Escalation when needed',
    ],
  },
];

export default function OmegaReceptionistPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
            <div className="leading-tight">
              <p className="text-xs font-semibold tracking-tight sm:text-sm">
                Omega — AI Agents • 3D Web • Apps
              </p>
              <p className="hidden text-[11px] text-slate-500 sm:block">Studio</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link href="/omega-reach" className="text-slate-600 hover:text-slate-900">
              Omega Reach
            </Link>
            <a
              href="https://calendly.com/hello-omegaappbuilder/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 font-semibold text-white"
            >
              Book a Call
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-600">
              Omega Receptionist
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              WhatsApp receptionist that feels human and books faster
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Handle inbound WhatsApp chats like a real staff member. Capture intent, qualify leads, and schedule
              follow-ups without internal leakage or robotic replies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://calendly.com/hello-omegaappbuilder/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white"
              >
                Book a demo call
              </a>
              <Link
                href="/omega-reach"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Compare with Omega Reach
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Best for</p>
              <h2 className="mt-2 text-xl font-semibold">Service businesses and agencies</h2>
              <p className="mt-3 text-sm text-slate-600">
                Keep replies fast, friendly, and consistent while still sounding like a human. No tool leakage, no
                “bot” language, no awkward scripts.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Answer inquiries instantly without exposing automation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Confirm time slots between 10 AM–10 PM
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Silent back-office memory and owner handoff
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Why teams pick Omega Receptionist</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Pricing</p>
              <h2 className="mt-2 text-3xl font-bold">Omega Receptionist plans</h2>
            </div>
            <a
              href="https://calendly.com/hello-omegaappbuilder/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Schedule a call
            </a>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{plan.price}</p>
                <p className="mt-1 text-xs text-slate-500">{plan.note}</p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
