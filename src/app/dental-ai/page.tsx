import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Dental Receptionist — Answer Calls 24/7 & Book Patients",
  description:
    "Turn missed calls into booked appointments. Our AI receptionist answers every call, collects patient details, and schedules visits while your team focuses on care.",
  openGraph: {
    title: "AI Dental Receptionist — Answer Calls 24/7 & Book Patients",
    description:
      "Always-on, polite, and consistent. Capture every patient call and schedule appointments in real time.",
    url: "/dental-ai",
    type: "website",
  },
};

export default function DentalAiPage() {
  const calendlyUrl = "https://calendly.com/hello-omegaappbuilder/30min";
  const demoVideoSrc = "/videos/iris-demo-call.mp4";

  const benefits = [
    {
      title: "Never miss a call",
      description:
        "Answer new patient calls 24/7, capture intent, and follow up on every voicemail automatically.",
    },
    {
      title: "Fewer no-shows",
      description:
        "Confirm appointments, send reminders, and reschedule quickly without tying up your front desk.",
    },
    {
      title: "Built for busy clinics",
      description:
        "Handles common questions like pricing, insurance, and hours while your team stays focused.",
    },
    {
      title: "Real-time scheduling",
      description:
        "Collect patient details and offer available times based on your rules and capacity.",
    },
    {
      title: "Consistent patient experience",
      description:
        "Warm, professional tone that reflects your brand voice every time.",
    },
    {
      title: "Actionable insights",
      description:
        "See call summaries, appointment requests, and missed opportunities in one place.",
    },
  ];

  const callCapabilities = [
    "Collect patient name, phone, and email without missing details.",
    "Offer available times and confirm the appointment.",
    "Answer common questions about services, hours, and insurance.",
    "Send a structured summary to your team after the call.",
  ];

  const nextSteps = [
    "We confirm your preferred demo time.",
    "We load your clinic hours and FAQs.",
    "You hear the AI receptionist in action.",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">
                  Omega — AI Agents • 3D Web • Apps
                </p>
                <p className="text-[11px] text-slate-500">Dental AI</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center rounded-full border border-slate-200 bg-slate-50/80 p-1 text-[12px] shadow-sm whitespace-nowrap">
              <a href="#benefits" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600">Benefits</a>
              <a href="#demo" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600">Demo</a>
              <a href="#pricing" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600">Pricing</a>
              <a href="#contact" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-fuchsia-600">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 whitespace-nowrap"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                AI Reception for Dental Practices
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                AI Dental Receptionist — Answer Calls 24/7 &amp; Book Patients
              </h1>
              <p className="mt-5 text-slate-600 max-w-2xl">
                Turn missed calls into booked appointments. Our AI receptionist answers every call,
                collects patient details, and schedules visits while your team focuses on care.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  Book a 15-Min Demo
                </a>
                <a
                  href="#demo"
                  className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                >
                  See the live demo
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Avg. call pickup</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">2.4 sec</p>
                  <p className="mt-1 text-xs text-slate-500">AI answers instantly, even after hours.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Appointment capture</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">+32%</p>
                  <p className="mt-1 text-xs text-slate-500">Recover missed calls in minutes.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Live call flow</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Caller: I need a cleaning next week.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    AI: Mornings or afternoons? I have Tuesday at 10am or Thursday at 9am.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Live call flow</p>
                <div className="mt-3 text-sm text-slate-600 space-y-2">
                  <p>
                    <span className="font-semibold text-slate-900">Caller:</span> I need a cleaning appointment next week.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">AI:</span> I can help with that. Are mornings or afternoons better?
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Caller:</span> Mornings please. My name is Lauren.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">AI:</span> Great, I have Tuesday at 10am or Thursday at 9am.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-200/50 to-indigo-200/50 blur-2xl rounded-3xl" aria-hidden="true" />
                <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Demo video</span>
                    <span className="text-xs">AI receptionist</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                    <video
                      className="w-full h-auto"
                      controls
                      playsInline
                      preload="metadata"
                      src={demoVideoSrc}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Replace hold music with a warm voice that captures intent, books appointments,
                    and confirms details in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Built to feel like a full-time front desk
            </h2>
            <p className="mt-3 text-slate-600">
              Always on. Always polite. Always converting.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-16 bg-slate-50/60 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <h2 className="text-3xl font-bold text-slate-900">Demo preview</h2>
              <p className="mt-3 text-slate-600">
                Hear how patients experience your AI receptionist. Replace hold music with a warm
                voice that captures intent, books appointments, and confirms details in real time.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  What the AI can do on every call
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {callCapabilities.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                  <video
                    className="w-full h-auto"
                    controls
                    playsInline
                    preload="metadata"
                    src={demoVideoSrc}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Demo video preview of the AI receptionist experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">Pricing</h2>
            <p className="mt-3 text-slate-600">
              Plans built for growing dental practices. Month-to-month. Upgrade as call volume grows.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Starter</p>
              <p className="mt-1 text-sm text-slate-600">Best for solo practices</p>
              <p className="mt-6 text-4xl font-bold text-slate-900">$599</p>
              <p className="text-sm text-slate-500">/month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>• Up to 400 AI receptionist minutes</li>
                <li>• Appointment capture + reminders</li>
                <li>• Call summaries sent to email</li>
                <li>• Clinic hours + FAQ handling</li>
              </ul>
              <a
                href="#contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
              >
                Book a 15-Min Demo
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Growth</p>
              <p className="mt-1 text-sm text-slate-600">Best for multi-chair clinics</p>
              <p className="mt-6 text-4xl font-bold text-slate-900">$1,199</p>
              <p className="text-sm text-slate-500">/month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>• Up to 1,200 AI receptionist minutes</li>
                <li>• Priority routing + after-hours overflow</li>
                <li>• Daily missed-call recovery lists</li>
                <li>• Multilingual greeting support</li>
              </ul>
              <a
                href="#contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
              >
                Book a 15-Min Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-slate-50/60 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-slate-900">
                Ready to capture every patient call?
              </h2>
              <p className="mt-3 text-slate-600">
                Share a few details and we will walk you through a live demo tailored to your clinic
                flow and schedule rules.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                >
                  Schedule a Call
                </a>
                <a
                  href="#contact-form"
                  className="inline-flex rounded-xl px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  Send the form
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">What happens next</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {nextSteps.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <form
              id="contact-form"
              className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
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
                  placeholder="Company"
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
