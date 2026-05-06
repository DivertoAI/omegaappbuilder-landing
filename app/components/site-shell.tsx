"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight } from "lucide-react";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { OmegaMark } from "@/app/components/omega-mark";
import { navLinks } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { cn } from "@/app/lib/cn";

function ShellLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-full px-4 py-2 text-sm text-[var(--fg-2)] transition hover:bg-white/5 hover:text-[var(--fg)]",
        active && "text-[var(--fg)]"
      )}
    >
      {children}
      {active ? <span className="absolute inset-x-3 -bottom-1 h-px bg-[var(--accent)]" /> : null}
    </Link>
  );
}

function ModePill() {
  const { mode, setMode } = useOmegaMode();
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/5 p-1 text-[10px] uppercase tracking-[0.16em] text-[var(--fg-2)]">
      <button
        type="button"
        onClick={() => setMode("human")}
        className={cn("rounded-full px-3 py-2 transition", mode === "human" && "bg-[var(--fg)] text-[var(--bg)]")}
      >
        Human
      </button>
      <button
        type="button"
        onClick={() => setMode("machine")}
        className={cn("rounded-full px-3 py-2 transition", mode === "machine" && "bg-[var(--fg)] text-[var(--bg)]")}
      >
        Machine
      </button>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="lg:hidden">
          <Menu className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(92vw,30rem)]">
        <DialogHeader>
          <DialogTitle>OmegaAppBuilder</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <DialogClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] transition hover:border-[var(--line-2)] hover:bg-[var(--bg-3)]"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-[var(--fg-3)]" />
                </Link>
              </DialogClose>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button asChild variant="secondary" className="flex-1">
                <Link href="/pricing">Free Audit</Link>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button asChild variant="accent" className="flex-1">
                <Link href="/contact">Book a Call</Link>
              </Button>
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-[color:rgba(10,10,12,0.72)] backdrop-blur-[18px] supports-[backdrop-filter]:bg-[color:rgba(10,10,12,0.72)]">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <OmegaMark size={40} />
          <div className="leading-none">
            <div className="font-mono text-[13px] font-semibold tracking-[-0.02em] text-[var(--fg)]">OmegaAppBuilder</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <ShellLink key={link.href} href={link.href}>
              {link.label}
            </ShellLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ModePill />
          <Button asChild variant="secondary">
            <Link href="/pricing">Free Audit</Link>
          </Button>
          <Button asChild variant="accent">
            <Link href="/contact">
              Book a Call <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ModePill />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const pathname = usePathname();
  const { mode } = useOmegaMode();
  if (mode === "machine") return null;

  const columns = [
    { title: "Products", links: [["3D Websites", "/showcase"], ["Marketing Sites", "/products"], ["Mobile Apps", "/products"], ["AI CRM", "/crm"], ["Ops Platform", "/products"], ["AI Agents", "/agents"]] },
    { title: "For", links: [["Builders", "/products"], ["Developers", "/products"], ["Brokerages", "/products"], ["Investors", "/products"]] },
    { title: "Resources", links: [["Pricing", "/pricing"], ["Contact", "/contact"], ["Showcase", "/showcase"], ["Products", "/products"]] },
    { title: "Company", links: [["About", "/"], ["Customers", "/"], ["Careers", "/"], ["Contact", "/contact"]] },
  ];

  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-[var(--bg-2)]/70">
      <div className="mx-auto max-w-[1320px] px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <OmegaMark size={40} />
              <div className="font-mono text-[16px] font-semibold">OmegaAppBuilder</div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[var(--fg-2)]">
              The operating system for real estate developers. 3D properties, sites, apps, CRM, and autonomous agents for US builders.
            </p>
            <div className="mt-6 grid gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-3)]">
              <div>Austin, TX</div>
              <div>SOC 2 Type II · ISO 27001</div>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-3)]">{column.title}</div>
              <div className="grid gap-3">
                {column.links.map(([label, href]) => (
                  <Link key={label} href={href} className="text-sm text-[var(--fg-2)] transition hover:text-[var(--fg)]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--line)] pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-3)] md:flex-row md:items-center md:justify-between">
          <div>OmegaAppBuilder · Built for {pathname === "/" ? "Home" : pathname.slice(1)}</div>
          <div>hello@omegaappbuilder.com</div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { mode } = useOmegaMode();
  return (
    <div className="min-h-screen">
      <Header />
      <main className={cn("relative", mode === "machine" && "bg-black")}>{children}</main>
      <Footer />
    </div>
  );
}

export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("mx-auto w-full max-w-[1320px] px-4 py-16 md:px-8 md:py-20", className)}>{children}</section>;
}

export function Eyebrow({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={cn("mb-4 font-mono text-[11px] uppercase tracking-[0.18em]", accent ? "text-[var(--accent-2)]" : "text-[var(--fg-3)]")}>
      {children}
    </div>
  );
}

export function PageHeader({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--line)] bg-[radial-gradient(ellipse_at_80%_50%,oklch(0.55_0.2_290/_0.12),transparent_60%)]">
      <Section className="py-20 md:py-24">
        <Eyebrow accent>● {kicker}</Eyebrow>
        <h1 className="max-w-5xl text-balance text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">{title}</h1>
        {sub ? <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--fg-2)]">{sub}</p> : null}
      </Section>
    </div>
  );
}
