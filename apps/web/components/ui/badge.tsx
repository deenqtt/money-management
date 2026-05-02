import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Badge({
  className,
  children,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "bg-white/10 text-slate-200",
        tone === "success" && "bg-emerald-500/15 text-emerald-300",
        tone === "warning" && "bg-amber-500/15 text-amber-200",
        tone === "danger" && "bg-rose-500/15 text-rose-200",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
