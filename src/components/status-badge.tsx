import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

/**
 * Modern SaaS status chip — Linear / Vercel / Stripe register.
 * Soft tinted surface, hairline ring, faint inner gradient, subtle dot.
 * Colors per spec:
 *   Released → soft amber · Approved → emerald · For Approval → muted orange
 *   Processing → sky · Received → neutral · Rejected → red
 */
const map: Record<DocStatus, { dot: string; chip: string }> = {
  Received: {
    dot: "bg-slate-400",
    chip: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300",
  },
  Processing: {
    dot: "bg-sky-500",
    chip: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300",
  },
  "For Approval": {
    dot: "bg-orange-500",
    chip: "bg-orange-500/10 text-orange-700 ring-orange-500/25 dark:text-orange-300",
  },
  Approved: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  },
  Released: {
    dot: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  },
  Rejected: {
    dot: "bg-red-500",
    chip: "bg-red-500/10 text-red-700 ring-red-500/25 dark:text-red-300",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: DocStatus;
  className?: string;
}) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
        "ring-1 ring-inset backdrop-blur-sm transition-all",
        "shadow-[0_1px_0_oklch(1_0_0/0.04)_inset,0_1px_2px_oklch(0.20_0.05_260/0.04)]",
        "hover:ring-2",
        s.chip,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", s.dot)} />
        <span className={cn("relative inline-flex size-1.5 rounded-full", s.dot)} />
      </span>
      {status}
    </span>
  );
}
