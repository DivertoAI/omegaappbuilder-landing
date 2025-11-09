import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="py-10 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Omega. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/legal/privacy" className="hover:text-slate-900">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-slate-900">Terms</Link>
          <Link href="/legal/refunds" className="hover:text-slate-900">Refunds</Link>
          <Link href="/legal/shipping" className="hover:text-slate-900">Shipping</Link>
          <Link href="/legal/contact" className="hover:text-slate-900">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
