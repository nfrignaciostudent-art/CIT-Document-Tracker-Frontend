import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

/**
 * Status chip — Linear / Vercel / Stripe register.
 * Neutral glass surface, hairline ring, colored dot does the talking.
 * No saturated tints, no chunky pills, no candy colors.
 */
const dotColor: Record<DocStatus, string> = {
  Received: "oklch(0.72 0.02 260)",        // neutral slate
  Processing: "oklch(0.68 0.14 235)",      // sky
  "For Approval": "oklch(0.74 0.15 60)",   // soft orange
  Approved: "oklch(0.68 0.16 155)",        // emerald
  Released: "oklch(0.76 0.14 80)",         // warm amber
  Rejected: "oklch(0.62 0.20 25)",         // muted red
};

export function StatusBadge({
  status,
  className,
}: {
  status: DocStatus;
  className?: string;
}) {
  const color = dotColor[status];
  const isProcessing = status === "Processing";

  return (
    <span
      className={cn(
        "group/chip inline-flex items-center gap-1.5 rounded-full",
        "px-2 py-[3px] text-[11px] font-medium leading-none tracking-[-0.005em] whitespace-nowrap",
        "text-foreground/80",
        "bg-[oklch(1_0_0/0.55)] dark:bg-[oklch(0.22_0.01_260/0.55)]",
        "backdrop-blur-md backdrop-saturate-150",
        "ring-1 ring-inset ring-foreground/[0.08] dark:ring-white/[0.06]",
        "shadow-[0_1px_1px_-0.5px_oklch(0_0_0/0.06),inset_0_1px_0_oklch(1_0_0/0.5)]",
        "dark:shadow-[0_1px_1px_-0.5px_oklch(0_0_0/0.4),inset_0_1px_0_oklch(1_0_0/0.04)]",
        "transition-[transform,box-shadow,background-color,color] duration-200 ease-out",
        "hover:text-foreground hover:-translate-y-[0.5px]",
        "hover:ring-foreground/[0.14] dark:hover:ring-white/[0.12]",
        "hover:shadow-[0_2px_6px_-2px_oklch(0_0_0/0.10),inset_0_1px_0_oklch(1_0_0/0.6)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative size-1.5 rounded-full",
          isProcessing && "animate-pulse",
        )}
        style={{
          background: color,
          boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent), 0 0 6px 0 color-mix(in oklab, ${color} 55%, transparent)`,
        }}
      />
      <span>{status}</span>
    </span>
  );
}
