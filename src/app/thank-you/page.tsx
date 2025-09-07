// src/app/thank-you/page.tsx
import Link from "next/link";

export default function ThankYou() {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-white text-slate-900 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold">Thanks! We got your request.</h1>
        <p className="mt-3 text-slate-600">
          We usually reply within <b>24 hours</b> with your audit or quote. If you need something urgent,
          email{" "}
          <a className="underline" href="mailto:hello@omegaappbuilder.com">
            hello@omegaappbuilder.com
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-slate-900 text-white px-5 py-3"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}