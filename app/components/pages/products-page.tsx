"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader, Section } from "@/app/components/site-shell";
import { products } from "@/app/lib/site-data";
import { useOmegaMode } from "@/app/components/mode-provider";
import { MachineView } from "@/app/components/machine-view";

export function ProductsPage() {
  const { mode } = useOmegaMode();
  if (mode === "machine") return <MachineView route="products" />;

  return (
    <>
      <PageHeader
        kicker="THE PLATFORM"
        title={
          <>
            Six products that <span className="font-serif italic text-[var(--fg-2)]">act like one</span>.
          </>
        }
        sub="Adopt the modules you need today; the rest plug in later. Same data graph, same brand kit, same login."
      />
      <Section>
        <div className="grid gap-6">
          {products.map((product, index) => (
            <Card key={product.name} className="grid gap-6 p-6 md:grid-cols-[120px_1fr_1.15fr_0.8fr] md:p-8">
              <div className="font-mono text-[13px] uppercase tracking-[0.16em] text-[var(--accent-2)]">/ {product.tag}</div>
              <div>
                <h2 className="text-3xl tracking-[-0.03em]">{product.name}</h2>
                <div className="mt-2 font-serif text-lg italic text-[var(--fg-2)]">{product.kicker}</div>
                <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--fg-2)]">{product.desc}</p>
                <Button asChild variant="ghost" className="mt-4 px-0 text-[var(--accent-2)] hover:bg-transparent hover:text-[var(--fg)]">
                  <Link href={index === 0 ? "/showcase" : index === 3 ? "/crm" : "/contact"}>
                    Open module <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Capabilities</div>
                <ul className="grid gap-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[var(--fg)]">
                      <span className="mt-1 size-3 rounded-[3px] border border-[var(--accent)] bg-[rgba(140,90,255,0.12)] shadow-[inset_0_0_0_3px_var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-3)]">Specs</div>
                <div className="grid gap-2">
                  {product.specs.map((spec) => (
                    <Badge key={spec} variant="outline" className="justify-start rounded-2xl px-3 py-2 text-[11px] uppercase tracking-[0.12em]">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
