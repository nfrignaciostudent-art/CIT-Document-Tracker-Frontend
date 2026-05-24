import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  QrCode,
  User,
  Building2,
  ArrowLeft,
  Clock,
  Activity,
  Lock,
  ShieldCheck,
  ShieldAlert,
  EyeOff,
  KeyRound,
  Crown,
  BadgeCheck,
} from "lucide-react";
import {
  findDocument,
  getFullDisplayId,
  movements,
  scanLogs,
} from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";


type Search = { track?: string };

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    track: typeof s.track === "string" ? s.track : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Document · CIT Document Tracker" },
      {
        name: "description",
        content:
          "Public document tracking receipt. Scan a CIT QR or enter a Document ID to view live status, progress, and full activity history.",
      },
    ],
  }),
  component: TrackPage,
});

type Viewer = "guest" | "wrong" | "owner" | "admin";

const VIEWERS: { id: Viewer; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "guest", label: "Guest", sub: "Not signed in", icon: EyeOff },
  { id: "wrong", label: "Other user", sub: "Wrong account", icon: ShieldAlert },
  { id: "owner", label: "Owner", sub: "Verified access", icon: BadgeCheck },
  { id: "admin", label: "Admin", sub: "Full access", icon: Crown },
];

function encryptString(s: string, salt = "CIT") {
  // Visual-only "cipher" for the masked state — deterministic, not real crypto.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (s[i] === " ") { out += " "; continue; }
    const k = salt.charCodeAt(i % salt.length);
    out += alphabet[(c * 7 + k * 13 + i) % alphabet.length];
  }
  return out;
}

function TrackPage() {
  const { track } = Route.useSearch();
  const doc = track ? findDocument(track) : undefined;
  const [viewer, setViewer] = useState<Viewer>("guest");
  const [reveal, setReveal] = useState(false);

  const authorized = viewer === "owner" || viewer === "admin";
  const showSensitive = authorized && reveal;

  const cipherName = useMemo(() => doc ? encryptString(doc.name, doc.verifyCode) : "", [doc]);
  const cipherOwner = useMemo(() => doc ? encryptString(doc.owner, doc.internalId.slice(-4)) : "", [doc]);

  if (!doc) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
            <QrCode className="size-6 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-bold">No document found</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Make sure the QR was scanned from a CIT receipt, or that the Document ID is correct.
          </p>
          <Button asChild className="mt-5 rounded-xl">
            <Link to="/">Back to portal</Link>
          </Button>
        </div>
      </div>
    );
  }

  const scans = scanLogs.filter((s) => s.internalId === doc.internalId);
  const moves = movements.filter((m) => m.internalId === doc.internalId);
  const timeline = [
    ...scans.map((s) => ({ at: s.at, label: "QR scanned", sub: s.ip })),
    ...moves.map((m) => ({ at: m.at, label: `${m.from} → ${m.to}`, sub: m.by })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  const rejected = doc.status === "Rejected";
  const qrPayload = `${typeof window !== "undefined" ? window.location.origin : ""}/track?track=${doc.internalId}`;
  const qrCells = Array.from({ length: 169 }, (_, i) => {
    const hash =
      (doc.internalId.charCodeAt(i % doc.internalId.length) * (i + 7)) % 7;
    return hash > 3;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 md:py-10">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Search another document
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-gold)]" />
          Live receipt
        </span>
      </div>

      {/* Viewer simulator — demo control for access-level testing */}
      <div className="rounded-2xl border bg-card/60 p-2 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            View as
          </p>
          <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-row">
            {VIEWERS.map((v) => {
              const active = viewer === v.id;
              const Icon = v.icon;
              return (
                <button
                  key={v.id}
                  onClick={() => { setViewer(v.id); setReveal(false); }}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-left text-xs font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[11px] font-semibold">{v.label}</span>
                    <span className={cn("text-[9px] uppercase tracking-wider opacity-70", active && "opacity-90")}>
                      {v.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <article className="overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-elegant)]">
        <header className="relative overflow-hidden bg-[image:var(--gradient-hero)] px-6 py-5 text-primary-foreground md:px-8">
          {/* secure mesh overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-gold)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                CIT · Document Receipt
              </p>
              <h1 className="mt-0.5 text-lg font-bold md:text-xl">
                <SecretText
                  value={doc.name}
                  cipher={cipherName}
                  revealed={showSensitive}
                  tone="light"
                />
              </h1>
              <p className="mt-1 font-mono text-[11px] text-primary-foreground/75">
                {getFullDisplayId(doc)}
              </p>
            </div>
            <StatusBadge
              status={doc.status}
              className="shrink-0 bg-white/10 text-white ring-1 ring-white/25 backdrop-blur"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] ring-1 ring-white/20 backdrop-blur">
              <MapPin className="size-3" />
              Currently with: <span className="font-semibold">{doc.department}</span>
            </div>
            <AccessBadge viewer={viewer} />
          </div>
        </header>

        <div className="space-y-7 p-6 md:p-8">
          {/* Access banner */}
          <AccessBanner viewer={viewer} reveal={reveal} onToggle={() => setReveal((r) => !r)} />

          {rejected && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              This document was <strong>rejected</strong>. Please contact the
              issuing office for details.
            </div>
          )}

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <section>
                <SectionLabel icon={FileText}>Document Details</SectionLabel>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <SecretField
                    icon={User}
                    label="Owner Name"
                    value={doc.owner}
                    cipher={cipherOwner}
                    revealed={showSensitive}
                  />
                  <Field icon={Building2} label="Department" value={doc.department} />
                  <SecretField
                    icon={FileText}
                    label="Document Name"
                    value={doc.name}
                    cipher={cipherName}
                    revealed={showSensitive}
                  />
                  <Field
                    icon={Calendar}
                    label="Created"
                    value={format(new Date(doc.createdAt), "PP")}
                  />
                  <Field
                    icon={Clock}
                    label="Last update"
                    value={formatDistanceToNow(new Date(doc.updatedAt), {
                      addSuffix: true,
                    })}
                  />
                </dl>
              </section>

              <section>
                <SectionLabel icon={Activity}>Activity History</SectionLabel>
                <ol className="relative mt-3 space-y-3 border-l border-border pl-5">
                  {timeline.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                  )}
                  {timeline.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[26px] mt-1.5 size-2.5 rounded-full bg-accent ring-4 ring-card" />
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground" suppressHydrationWarning>
                        {format(new Date(t.at), "PPp")}
                        {t.sub ? ` · ${t.sub}` : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="space-y-5">
              <section>
                <SectionLabel icon={QrCode}>QR Code · Scan to Track</SectionLabel>
                <div className="mt-3 rounded-2xl border bg-gradient-to-b from-muted/30 to-background p-4 text-center">
                  <div
                    className="mx-auto grid aspect-square w-44 grid-cols-13 gap-px rounded-lg bg-white p-2 shadow-[var(--shadow-soft)] ring-1 ring-border"
                    style={{ gridTemplateColumns: "repeat(13, 1fr)" }}
                    aria-label="Document QR code"
                  >
                    {qrCells.map((on, i) => (
                      <span
                        key={i}
                        className={on ? "bg-primary" : "bg-transparent"}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Point any phone camera at this code
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">
                    {qrPayload}
                  </p>
                </div>
              </section>

              {doc.status === "Released" && doc.hasProcessedFile ? (
                <Button className="w-full rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-95">
                  <Download className="size-4" />
                  Download document
                </Button>
              ) : (
                <div className="rounded-xl border border-dashed bg-muted/30 px-3 py-3 text-center text-[11px] text-muted-foreground">
                  Download will be available once status is{" "}
                  <span className="font-semibold text-foreground">Released</span>.
                </div>
              )}
            </aside>
          </div>
        </div>

        <footer className="border-t bg-muted/30 px-6 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:px-8">
          CIT Document Tracker · Official Receipt
        </footer>
      </article>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
      <Icon className="size-3.5 text-accent" />
      {children}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="truncate text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}

function SecretText({
  value,
  cipher,
  revealed,
  tone = "dark",
}: {
  value: string;
  cipher: string;
  revealed: boolean;
  tone?: "dark" | "light";
}) {
  // SECURITY: when not revealed, the real value never reaches the DOM.
  // We render a deterministic token (SECURED_DOC_XXXX) — no blur, no aria value.
  if (revealed) {
    return (
      <span className={tone === "light" ? "text-primary-foreground" : "text-foreground"}>
        {value}
      </span>
    );
  }
  const token = `SECURED_DOC_${cipher.replace(/\s+/g, "").slice(0, 6).toUpperCase()}`;
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span
        className={cn(
          "font-mono text-[0.85em] tracking-[0.06em]",
          tone === "light" ? "text-[var(--color-gold)]/90" : "text-primary/80",
        )}
        aria-label="Protected field"
      >
        {token}
      </span>
      <Lock
        className={cn(
          "size-3.5 shrink-0",
          tone === "light" ? "text-[var(--color-gold)]" : "text-primary/70",
        )}
      />
    </span>
  );
}

function SecretField({
  icon: Icon,
  label,
  value,
  cipher,
  revealed,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  cipher: string;
  revealed: boolean;
}) {
  // SECURITY: real value is only inserted into the DOM when revealed.
  // Unauthorized state renders a masked dot pattern + opaque secured token.
  const mask = "•".repeat(Math.min(Math.max(value.length, 6), 14));
  const token = `SECURED_${label.toUpperCase().replace(/\s+/g, "_")}_${cipher.replace(/\s+/g, "").slice(0, 4).toUpperCase()}`;
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          revealed
            ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25"
            : "bg-primary/10 text-primary ring-1 ring-primary/20",
        )}
      >
        {revealed ? <Icon className="size-3.5" /> : <Lock className="size-3.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
          <span
            className={cn(
              "rounded-full px-1.5 py-px text-[8px] font-bold tracking-wider ring-1 ring-inset",
              revealed
                ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300"
                : "bg-primary/10 text-primary ring-primary/20",
            )}
          >
            {revealed ? "VISIBLE" : "PROTECTED"}
          </span>
        </dt>
        {revealed ? (
          <dd className="mt-0.5 truncate text-sm font-medium text-foreground">
            {value}
          </dd>
        ) : (
          <dd
            className="mt-1 flex min-w-0 items-center gap-2"
            aria-label="Protected field"
            title={token}
          >
            <span
              className="select-none font-mono text-[15px] leading-none tracking-[0.18em] text-foreground/45"
              aria-hidden
            >
              {mask}
            </span>
            <span className="hidden truncate rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground ring-1 ring-inset ring-border md:inline-block">
              {token.slice(0, 22)}
            </span>
          </dd>
        )}
      </div>
    </div>
  );
}

function AccessBadge({ viewer }: { viewer: Viewer }) {
  const map: Record<Viewer, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
    guest: { label: "Restricted · Guest", icon: Lock, cls: "bg-white/10 text-white ring-white/25" },
    wrong: { label: "Restricted · Wrong account", icon: ShieldAlert, cls: "bg-destructive/20 text-white ring-destructive/40" },
    owner: { label: "Verified Owner", icon: ShieldCheck, cls: "bg-success/25 text-white ring-success/50" },
    admin: { label: "Admin Override", icon: Crown, cls: "bg-[var(--color-gold)]/25 text-[var(--color-gold)] ring-[var(--color-gold)]/50" },
  };
  const v = map[viewer];
  const Icon = v.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 backdrop-blur", v.cls)}>
      <Icon className="size-3" />
      {v.label}
    </span>
  );
}

function AccessBanner({
  viewer,
  reveal,
  onToggle,
}: {
  viewer: Viewer;
  reveal: boolean;
  onToggle: () => void;
}) {
  const authorized = viewer === "owner" || viewer === "admin";

  if (!authorized) {
    const isWrong = viewer === "wrong";
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-4",
          isWrong
            ? "border-destructive/30 bg-destructive/5"
            : "border-primary/20 bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1",
              isWrong
                ? "bg-destructive/10 text-destructive ring-destructive/30"
                : "bg-primary/10 text-primary ring-primary/20",
            )}
          >
            {isWrong ? <ShieldAlert className="size-4" /> : <Lock className="size-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {isWrong
                ? "Access denied · This document doesn't belong to your account"
                : "Sensitive fields are encrypted"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isWrong
                ? "Owner Name and Document Name stay hidden. Sign in with the correct account or contact an admin."
                : "Sign in with the owner or admin account to decrypt Owner Name and Document Name. Status, timestamps, and verification remain public."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-success/30 bg-success/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success ring-1 ring-success/30">
          {viewer === "admin" ? <Crown className="size-4" /> : <ShieldCheck className="size-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {viewer === "admin" ? "Admin access · Full document visibility" : "Verified owner · You may decrypt this document"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            All fields are available. Toggle the visibility of sensitive fields below.
          </p>
        </div>
        <Button
          size="sm"
          onClick={onToggle}
          className={cn(
            "shrink-0 rounded-xl text-xs",
            reveal
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {reveal ? <EyeOff className="size-3.5" /> : <KeyRound className="size-3.5" />}
          {reveal ? "Hide sensitive" : "Decrypt fields"}
        </Button>
      </div>
    </div>
  );
}
