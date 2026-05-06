import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.04em]", {
  variants: {
    variant: {
      default: "bg-white/8 text-[var(--fg)]",
      outline: "border border-[var(--line)] text-[var(--fg-2)]",
      accent: "bg-[var(--accent)] text-white shadow-[0_0_24px_var(--accent-glow)]",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
