const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';
const demoVideoSrc = '/videos/iris-demo-call.mp4';

const benefits = [
  {
    title: 'Never miss a call',
    description:
      'Answer new patient calls 24/7, capture intent, and follow up on every voicemail automatically.',
  },
  {
    title: 'Fewer no-shows',
    description:
      'Confirm appointments, send reminders, and reschedule quickly without tying up your front desk.',
  },
  {
    title: 'Built for busy clinics',
    description:
      'Handles common questions like pricing, insurance, and hours while your team stays focused.',
  },
  {
    title: 'Real-time scheduling',
    description:
      'Collect patient details and offer available times based on your rules and capacity.',
  },
  {
    title: 'Consistent patient experience',
    description:
      'Warm, professional tone that reflects your brand voice every time.',
  },
  {
    title: 'Actionable insights',
    description:
      'See call summaries, appointment requests, and missed opportunities in one place.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '$599',
    cadence: '/month',
    highlight: 'Best for solo practices',
    features: [
      'Up to 400 AI receptionist minutes',
      'Appointment capture + reminders',
      'Call summaries sent to email',
      'Clinic hours + FAQ handling',
    ],
  },
  {
    name: 'Growth',
    price: '$1,199',
    cadence: '/month',
    highlight: 'Best for multi-chair clinics',
    features: [
      'Up to 1,200 AI receptionist minutes',
      'Priority routing + after-hours overflow',
      'Daily missed-call recovery lists',
      'Multilingual greeting support',
    ],
  },
];

export default function DentalAiLanding() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                AI Reception for Dental Practices
              </span>
              <h1
                className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                AI Dental Receptionist - Answer Calls 24/7 &amp; Book Patients
              </h1>
              <p className="text-lg text-slate-700">
                Turn missed calls into booked appointments. Our AI receptionist
                answers every call, collects patient details, and schedules visits
                while your team focuses on care.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-200 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Book a 15-Min Demo
                </a>
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  See the live demo
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Avg. call pickup
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">2.4 sec</p>
                  <p className="text-sm text-slate-600">
                    AI answers instantly, even after hours.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Appointment capture
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">+32%</p>
                  <p className="text-sm text-slate-600">
                    Recover missed calls in minutes.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
                  Live call flow
                </p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="rounded-2xl bg-indigo-50 px-4 py-3">
                    Caller: I need a cleaning appointment next week.
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3">
                    AI: I can help with that. Are mornings or afternoons better?
                  </div>
                  <div className="rounded-2xl bg-indigo-50 px-4 py-3">
                    Caller: Mornings please. My name is Lauren.
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3">
                    AI: Great, I have Tuesday at 10am or Thursday at 9am.
                  </div>
                </div>
                <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <video
                    className="h-full w-full object-cover"
                    src={demoVideoSrc}
                    controls
                    playsInline
                    muted
                    preload="metadata"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Benefits
            </p>
            <h2
              className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl"
            >
              Built to feel like a full-time front desk
            </h2>
          </div>
          <div className="hidden text-sm text-slate-600 lg:block">
            Always on. Always polite. Always converting.
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                Demo preview
              </p>
              <h3
                className="mt-4 text-3xl font-semibold"
              >
                Hear how patients experience your AI receptionist
              </h3>
              <p className="mt-4 text-sm text-indigo-100">
                Replace hold music with a warm voice that captures intent, books
                appointments, and confirms details in real time.
              </p>
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-white/30 bg-white/10">
                <video
                  className="h-full w-full object-cover"
                  src={demoVideoSrc}
                  controls
                  playsInline
                  muted
                  preload="metadata"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3
                className="text-2xl font-semibold text-slate-900"
              >
                What the AI can do on every call
              </h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  Collect patient name, phone, and email without missing details.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  Offer available times and confirm the appointment.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  Answer common questions about services, hours, and insurance.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  Send a structured summary to your team after the call.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Pricing
          </p>
          <h2
            className="text-3xl font-bold text-slate-900 sm:text-4xl"
          >
            Plans built for growing dental practices
          </h2>
          <p className="text-sm text-slate-600">
            Month-to-month. Upgrade as call volume grows.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {tier.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-600">
                    {tier.highlight}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-slate-900">
                    {tier.price}
                  </p>
                  <p className="text-xs text-slate-500">{tier.cadence}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Book a 15-Min Demo
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-20 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                Contact
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Ready to capture every patient call?
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Share a few details and we will walk you through a live demo
                tailored to your clinic flow and schedule rules.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Schedule a Call
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Send the form
                </a>
              </div>
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">What happens next</p>
                <ul className="mt-4 space-y-2">
                  <li>• We confirm your preferred demo time.</li>
                  <li>• We load your clinic hours and FAQs.</li>
                  <li>• You hear the AI receptionist in action.</li>
                </ul>
              </div>
            </div>
            <form
              className="rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
              method="POST"
              action="/api/lead?redirect=/thank-you"
            >
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="dental_ai_demo" />

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Name</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    placeholder="Your name"
                    name="name"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Email</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    type="email"
                    placeholder="you@clinic.com"
                    name="email"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Company</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Clinic name"
                  name="company"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Website/App URL</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="https://example.com"
                  name="url"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Goal (30 days)</span>
                <textarea
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[120px]"
                  placeholder="What do you want the AI receptionist to improve?"
                  name="message"
                />
              </label>

              <button
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                aria-label="Send demo request"
              >
                Send Demo Request
              </button>

              <p className="text-xs text-slate-500">
                Submitting this form adds you to our updates. You can opt out anytime.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
