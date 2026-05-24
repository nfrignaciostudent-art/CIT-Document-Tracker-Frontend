import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

/**
 * Modern SaaS status chip — Linear / Vercel / Stripe register.
 * Hairline ring, glassy tinted surface, soft inner highlight, low shadow.
 */
type Tone = {
  /** dot color */
  dot: string;
  /** glow ring around the dot */
  dotGlow: string;
  /** text color */
  text: string;
  /** gradient + ring on the chip surface */
  surface: string;
  /** subtle pulse on Processing only */
  pulse?: boolean;
};

const tones: Record<DocStatus, Tone> = {
  Received: {
    dot: "bg-slate-400",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.70_0.02_260/0.18)]",
    text: "text-slate-700 dark:text-slate-200",
    surface:
      "bg-gradient-to-b from-slate-500/[0.10] to-slate-500/[0.04] ring-slate-500/15 hover:ring-slate-500/30",
  },
  Processing: {
    dot: "bg-sky-500",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.70_0.13_240/0.22)]",
    text: "text-sky-700 dark:text-sky-300",
    surface:
      "bg-gradient-to-b from-sky-500/[0.12] to-sky-500/[0.05] ring-sky-500/20 hover:ring-sky-500/35",
    pulse: true,
  },
  "For Approval": {
    dot: "bg-orange-500",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.75_0.15_55/0.22)]",
    text: "text-orange-700 dark:text-orange-300",
    surface:
      "bg-gradient-to-b from-orange-500/[0.12] to-orange-500/[0.05] ring-orange-500/20 hover:ring-orange-500/35",
  },
  Approved: {
    dot: "bg-emerald-500",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.72_0.16_155/0.22)]",
    text: "text-emerald-700 dark:text-emerald-300",
    surface:
      "bg-gradient-to-b from-emerald-500/[0.12] to-emerald-500/[0.05] ring-emerald-500/20 hover:ring-emerald-500/35",
  },
  Released: {
    dot: "bg-amber-500",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.78_0.15_80/0.22)]",
    text: "text-amber-700 dark:text-amber-300",
    surface:
      "bg-gradient-to-b from-amber-500/[0.13] to-amber-500/[0.05] ring-amber-500/20 hover:ring-amber-500/35",
  },
  Rejected: {
    dot: "bg-red-500",
    dotGlow: "shadow-[0_0_0_3px_oklch(0.65_0.20_25/0.22)]",
    text: "text-red-700 dark:text-red-300",
    surface:
      "bg-gradient-to-b from-red-500/[0.12] to-red-500/[0.05] ring-red-500/20 hover:ring-red-500/35",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: DocStatus;
  className?: string;
}) {
  const t = tones[status];
  return (
    <span
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-[11px] font-medium leading-[1.4] tracking-tight whitespace-nowrap",
        "ring-1 ring-inset backdrop-blur-md",
        "shadow-[0_1px_2px_-1px_oklch(0_0_0/0.08),inset_0_1px_0_oklch(1_0_0/0.06)]",
        "transition-[transform,box-shadow,background-color,color] duration-200 ease-out",
        "hover:-translate-y-[0.5px] hover:shadow-[0_2px_6px_-2px_oklch(0_0_0/0.12),inset_0_1px_0_oklch(1_0_0/0.08)]",
        t.surface,
        t.text,
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          t.dot,
          t.dotGlow,
          t.pulse && "animate-pulse",
        )}
      />
      {status}
    </span>
  );
}
