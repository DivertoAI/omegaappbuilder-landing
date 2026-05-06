import { useId } from "react";
import { cn } from "@/app/lib/cn";

export function OmegaMark({ className, size = 32 }: { className?: string; size?: number }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.25 320)" />
          <stop offset="100%" stopColor="oklch(0.55 0.22 270)" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="44" fill={`url(#${id})`} />
      <path
        d="M 50 154 L 50 142 L 70 142 Q 56 132 50 116 Q 42 96 52 78 Q 64 56 100 56 Q 136 56 148 78 Q 158 96 150 116 Q 144 132 130 142 L 150 142 L 150 154 Z M 100 76 Q 78 76 72 92 Q 68 104 76 120 Q 84 132 100 132 Q 116 132 124 120 Q 132 104 128 92 Q 122 76 100 76 Z"
        fill="#0a0a0c"
        fillRule="evenodd"
      />
      <path d="M 100 86 L 84 130 L 92 130 L 96 120 L 104 120 L 108 130 L 116 130 Z M 98 112 L 100 104 L 102 112 Z" fill="#0a0a0c" />
    </svg>
  );
}
