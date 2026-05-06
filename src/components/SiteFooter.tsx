import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>
          © {new Date().getFullYear()} Omega. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Privacy', href: '/legal/privacy' },
            { label: 'Terms', href: '/legal/terms' },
            { label: 'Refunds', href: '/legal/refunds' },
            { label: 'Contact', href: '/legal/contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{ fontSize: 13, color: 'var(--fg-3)' }}
              className="transition-colors hover:text-[var(--fg)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
