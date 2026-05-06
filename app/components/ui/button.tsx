import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--accent-2)]",
        secondary: "bg-[var(--bg-2)] text-[var(--fg)] border border-[var(--line)] hover:border-[var(--line-2)] hover:bg-[var(--bg-3)]",
        ghost: "bg-transparent text-[var(--fg)] hover:bg-white/5",
        outline: "border border-[var(--line)] bg-transparent text-[var(--fg)] hover:bg-white/5",
        danger: "bg-[var(--danger)] text-white hover:opacity-90",
        accent: "bg-[var(--accent)] text-white shadow-[0_0_30px_var(--accent-glow)] hover:opacity-95",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
