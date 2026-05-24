import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Clock,
  CheckCircle2,
  PackageCheck,
  AlertOctagon,
  QrCode,
  ScanLine,
  FilePlus2,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import {
  documents,
  scanLogs,
  movements,
  statusCounts,
  registrationsTrend,
  departmentCounts,
  users,
  getFullDisplayId,
} from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · CIT Document Tracker" },
      { name: "description", content: "Overview of IT department document statuses, recent scans, and movements." },
      { property: "og:title", content: "Dashboard · CIT Document Tracker" },
      { property: "og:description", content: "Overview of IT department document statuses, recent scans, and movements." },
    ],
  }),
  component: Dashboard,
});

// Single-hue ramp keyed off primary · modern, no rainbow boxes.
const STATUS_HUE: Record<string, string> = {
  Received: "oklch(0.78 0.04 255)",
  Processing: "oklch(0.65 0.13 230)",
  "For Approval": "oklch(0.74 0.13 85)",
  Approved: "oklch(0.62 0.15 155)",
  Released: "oklch(0.74 0.13 75)",
  Rejected: "oklch(0.62 0.20 25)",
};


function Dashboard() {
  const counts = statusCounts();
  const trend = registrationsTrend(14);
  const byDept = departmentCounts();
  const total = documents.length;
  const released = counts.find((c) => c.status === "Released")?.count ?? 0;
  const processing = counts.find((c) => c.status === "Processing")?.count ?? 0;
  const forApproval = counts.find((c) => c.status === "For Approval")?.count ?? 0;
  const rejected = counts.find((c) => c.status === "Rejected")?.count ?? 0;

  const timeline = [
    ...scanLogs.map((s) => ({ kind: "scan" as const, at: s.at, label: `Scanned ${s.displayId}`, sub: s.userAgent })),
    ...movements.map((m) => ({ kind: "move" as const, at: m.at, label: `${m.displayId}: ${m.from} → ${m.to}`, sub: m.note })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 7);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-elegant)] md:p-8">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, white 0, transparent 35%), radial-gradient(circle at 90% 80%, oklch(0.74 0.13 85) 0, transparent 40%)",
        }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              College of Information Technology · Document Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Good day, Admin Office</h1>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              {processing + forApproval} documents need attention today. Last sync just now.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-xl bg-white text-primary hover:bg-white/90">
              <Link to="/register"><FilePlus2 className="size-4" /> Register</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/qr-generator"><QrCode className="size-4" /> Generate QR</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/qr-scanner"><ScanLine className="size-4" /> Scan QR</Link>
            </Button>
          </div>
        </div>
      </section>

      
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Documents" value={total} icon={FileText} accent="primary" delta="All time" />
        <StatCard label="Processing" value={processing} icon={Clock} accent="info" delta="In transit" />
        <StatCard label="For Approval" value={forApproval} icon={AlertOctagon} accent="warning" delta="Awaiting signature" />
        <StatCard label="Approved" value={counts.find((c) => c.status === "Approved")?.count ?? 0} icon={CheckCircle2} accent="success" />
        <StatCard label="Released" value={released} icon={PackageCheck} accent="gold" delta={`${rejected} rejected`} />
      </section>

      
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="flex items-start justify-between px-6 pb-2 pt-6 md:px-8 md:pt-8">
            <div>
              <h2 className="text-lg font-bold">Status overview</h2>
              <p className="mt-1 text-xs text-muted-foreground">Document distribution by current status</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group text-xs font-semibold">
              <Link to="/documents">View all <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
            </Button>
          </div>

          <div className="px-6 pb-8 md:px-8">
            <div className="mt-4 flex flex-col items-center gap-10 md:flex-row md:gap-12">
              
              <div className="relative shrink-0">
                <div
                  className="size-52 rounded-full"
                  style={{
                    background: (() => {
                      let acc = 0;
                      const stops: string[] = [];
                      counts.forEach((c) => {
                        const start = total ? (acc / total) * 100 : 0;
                        acc += c.count;
                        const end = total ? (acc / total) * 100 : 0;
                        if (end > start) stops.push(`${STATUS_HUE[c.status]} ${start}% ${end}%`);
                      });
                      return stops.length
                        ? `conic-gradient(${stops.join(", ")})`
                        : "oklch(0.95 0.01 250)";
                    })(),
                  }}
                />
                <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-card shadow-inner">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Total</span>
                  <span className="text-4xl font-extrabold tracking-tight">{total}</span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Documents</span>
                </div>
              </div>

              
              <div className="grid w-full flex-1 grid-cols-2 gap-x-10 gap-y-5">
                {counts.map((c) => {
                  const pct = total ? Math.round((c.count / total) * 100) : 0;
                  return (
                    <div key={c.status} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: STATUS_HUE[c.status] }} />
                        <span className="text-sm font-medium text-muted-foreground">{c.status}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold tabular-nums">{c.count}</span>
                        <span className="text-xs font-medium text-muted-foreground/70 tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          
          <div className="flex items-center justify-between border-t bg-muted/40 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground md:px-8">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full" style={{ background: STATUS_HUE["Released"] }} />
                {released} Released
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full" style={{ background: STATUS_HUE["Processing"] }} />
                {processing + forApproval} In-flight
              </span>
            </div>
            <span>Updated just now</span>
          </div>
        </div>


        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent activity</h2>
            <Link to="/scan-logs" className="text-xs text-accent hover:underline">All logs</Link>
          </div>
          <ol className="relative space-y-4 border-l border-border pl-4">
            {timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[21px] mt-1 size-2.5 rounded-full ring-4 ring-card ${t.kind === "scan" ? "bg-accent" : "bg-[var(--color-gold)]"}`} />
                <p className="text-sm font-medium leading-snug">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                  {formatDistanceToNow(new Date(t.at), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Registrations trend</h2>
              <p className="text-xs text-muted-foreground">New documents per day · last 14 days</p>
            </div>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
              {trend.reduce((s, t) => s + t.count, 0)} total
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.13 230)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.65 0.13 230)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(0.91 0.012 250)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.03 255)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 255)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ stroke: "oklch(0.65 0.13 230)", strokeOpacity: 0.3 }}
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.012 250)", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="count" stroke="oklch(0.55 0.15 240)" strokeWidth={2} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-4">
            <h2 className="text-base font-semibold">By IT unit</h2>
            <p className="text-xs text-muted-foreground">Workload across IT offices</p>
          </div>
          <ul className="space-y-3.5">
            {byDept.map((d) => {
              const max = Math.max(...byDept.map((x) => x.count), 1);
              const pct = (d.count / max) * 100;
              return (
                <li key={d.department} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium">{d.department}</span>
                    <span className="tabular-nums text-muted-foreground">{d.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, oklch(0.55 0.15 240), oklch(0.65 0.13 230))",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

      </section>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-base font-semibold">Online now</h2>
          <p className="mb-4 text-xs text-muted-foreground">Heartbeat updates every 2 minutes</p>
          <ul className="space-y-2">
            {users.filter((u) => u.online).map((u) => (
              <li key={u.id} className="flex items-center gap-3 rounded-xl border bg-background/60 p-2.5">
                <div className="relative flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {u.name.split(" ").map((s) => s[0]).slice(0,2).join("")}
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-success" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{u.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Latest documents</h2>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/documents">Open registry <ArrowRight className="size-3.5" /></Link>
            </Button>
          </div>
          <ul className="divide-y">
            {documents.slice(0, 5).map((d) => (
              <li key={d.internalId} className="flex items-center gap-3 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link to="/documents/$docId" params={{ docId: d.internalId }} className="block truncate text-sm font-medium hover:text-accent">
                    {d.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    <span className="font-mono">{getFullDisplayId(d)}</span> · {d.department}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
