import * as React from "react";
import { cn } from "@/app/lib/cn";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg-3)] shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
