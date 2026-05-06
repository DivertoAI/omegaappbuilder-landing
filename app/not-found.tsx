import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-24">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-3)]">404</div>
      <h1 className="mt-4 text-4xl tracking-[-0.04em] md:text-6xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--fg-2)]">
        The route does not exist in this build. Return home or open one of the available product pages.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-full border border-[var(--line)] bg-[var(--bg-2)] px-5 py-3 text-sm text-[var(--fg)]">
          Go home
        </Link>
        <Link href="/pricing" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-white">
          View pricing
        </Link>
      </div>
    </div>
  );
}
