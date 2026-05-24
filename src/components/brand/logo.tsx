import { cn } from "@/lib/utils";

export type LogoVariant = "shield" | "monogram" | "emblem";

/**
 * 3 SVG logo concepts for CIT DocTracker.
 * All use the dark-navy + royal-blue + subtle-gold palette via CSS tokens.
 * Render at any size — pure SVG, no raster, favicon-safe.
 */
export function Logo({
  variant = "shield",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  if (variant === "monogram") return <MonogramMark className={className} />;
  if (variant === "emblem") return <EmblemMark className={className} />;
  return <ShieldMark className={className} />;
}

/* CONCEPT 1 — Minimal Academic Shield
   Shield outline with a document + QR corner integrated inside. */
function ShieldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="cit-shield-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="oklch(0.20 0.05 260)" />
          <stop offset="100%" stopColor="oklch(0.32 0.10 258)" />
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path
        d="M20 2.5 L34.5 7.2 V20 C34.5 28.5 28.2 34.5 20 37.5 C11.8 34.5 5.5 28.5 5.5 20 V7.2 Z"
        fill="url(#cit-shield-bg)"
        stroke="oklch(0.74 0.13 85 / 0.55)"
        strokeWidth="0.8"
      />
      {/* Document */}
      <path
        d="M14 12.5 H22.5 L26 16 V26.5 C26 27.3 25.3 28 24.5 28 H14 C13.2 28 12.5 27.3 12.5 26.5 V14 C12.5 13.2 13.2 12.5 14 12.5 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path d="M22.5 12.5 V16 H26" stroke="oklch(0.20 0.05 260)" strokeWidth="0.7" fill="none" />
      {/* Doc lines */}
      <rect x="14.5" y="18.5" width="7.5" height="0.9" rx="0.45" fill="oklch(0.20 0.05 260 / 0.55)" />
      <rect x="14.5" y="20.6" width="9" height="0.9" rx="0.45" fill="oklch(0.20 0.05 260 / 0.4)" />
      {/* QR corner */}
      <rect x="20" y="22.8" width="4.4" height="4.4" rx="0.6" fill="oklch(0.20 0.05 260)" />
      <rect x="20.7" y="23.5" width="1.2" height="1.2" fill="oklch(0.74 0.13 85)" />
      <rect x="22.5" y="23.5" width="1.2" height="1.2" fill="white" />
      <rect x="20.7" y="25.3" width="1.2" height="1.2" fill="white" />
      <rect x="22.5" y="25.3" width="1.2" height="1.2" fill="oklch(0.74 0.13 85)" />
    </svg>
  );
}

/* CONCEPT 2 — Smart QR Monogram (C·D·T overlapping in a rounded square with QR pixels) */
function MonogramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="cit-mono-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="oklch(0.18 0.05 260)" />
          <stop offset="100%" stopColor="oklch(0.36 0.12 258)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="9" fill="url(#cit-mono-bg)" />
      {/* subtle QR pixel grid in corner */}
      <g opacity="0.35" fill="white">
        <rect x="29" y="6" width="2" height="2" rx="0.4" />
        <rect x="32" y="6" width="2" height="2" rx="0.4" />
        <rect x="29" y="9" width="2" height="2" rx="0.4" />
        <rect x="32" y="12" width="2" height="2" rx="0.4" />
      </g>
      <g opacity="0.35" fill="white">
        <rect x="6" y="29" width="2" height="2" rx="0.4" />
        <rect x="6" y="32" width="2" height="2" rx="0.4" />
        <rect x="9" y="32" width="2" height="2" rx="0.4" />
      </g>
      {/* C monogram arc */}
      <path
        d="M22 13 A 8 8 0 1 0 22 27"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* T crossbar + stem (gold accent) */}
      <path
        d="M16 20 H26 M21 20 V27"
        stroke="oklch(0.78 0.14 82)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* CONCEPT 3 — Secure Document Emblem (circular with doc + lock) */
function EmblemMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="cit-emblem-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="oklch(0.20 0.05 260)" />
          <stop offset="100%" stopColor="oklch(0.34 0.11 258)" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#cit-emblem-bg)" />
      <circle
        cx="20"
        cy="20"
        r="15.5"
        stroke="oklch(0.74 0.13 85 / 0.45)"
        strokeWidth="0.6"
        strokeDasharray="1.2 1.6"
        fill="none"
      />
      {/* document */}
      <path
        d="M14 12.5 H21.5 L25 16 V25 C25 25.83 24.33 26.5 23.5 26.5 H14 C13.17 26.5 12.5 25.83 12.5 25 V14 C12.5 13.17 13.17 12.5 14 12.5 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path d="M21.5 12.5 V16 H25" stroke="oklch(0.20 0.05 260)" strokeWidth="0.7" fill="none" />
      <rect x="14.5" y="18" width="6" height="0.9" rx="0.45" fill="oklch(0.20 0.05 260 / 0.5)" />
      <rect x="14.5" y="20" width="8" height="0.9" rx="0.45" fill="oklch(0.20 0.05 260 / 0.35)" />
      {/* lock badge on bottom-right */}
      <circle cx="26" cy="26" r="4.8" fill="oklch(0.20 0.05 260)" stroke="oklch(0.74 0.13 85)" strokeWidth="0.6" />
      <path
        d="M24.3 25.6 V24.4 C24.3 23.45 25.06 22.7 26 22.7 C26.94 22.7 27.7 23.45 27.7 24.4 V25.6"
        stroke="oklch(0.78 0.14 82)"
        strokeWidth="0.7"
        fill="none"
      />
      <rect x="23.8" y="25.5" width="4.4" height="3.2" rx="0.6" fill="oklch(0.78 0.14 82)" />
    </svg>
  );
}

export function Wordmark({
  variant = "shield",
  className,
  showSubtitle = true,
}: {
  variant?: LogoVariant;
  className?: string;
  showSubtitle?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo variant={variant} className="size-9" />
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight">CIT DocTracker</p>
        {showSubtitle && (
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Document &amp; QR Generator
          </p>
        )}
      </div>
    </div>
  );
}