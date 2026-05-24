import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Download, FileText, History, Lock, Printer, Send } from "lucide-react";
import { documents, findByInternalId, getFullDisplayId, movements, scanLogs } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/documents/$docId")({
  loader: ({ params }) => {
    const doc = findByInternalId(params.docId);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.doc.name} · CIT Tracker` : "Document · CIT Tracker" },
      { name: "description", content: "Detailed document tracking, QR code, files and movement history." },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">Document not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">It may have been removed or the ID is incorrect.</p>
      <Button asChild className="mt-4"><Link to="/documents">Back to documents</Link></Button>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">Couldn't load this document</h2>
      <Button onClick={reset} className="mt-4">Try again</Button>
    </div>
  ),
  component: DocumentDetail,
});

function DocumentDetail() {
  const { doc } = Route.useLoaderData();
  const trackUrl = typeof window !== "undefined" ? `${window.location.origin}/track?track=${doc.internalId}` : `/track?track=${doc.internalId}`;
  const scans = scanLogs.filter((s) => s.internalId === doc.internalId);
  const moves = movements.filter((m) => m.internalId === doc.internalId);
  const timeline = [
    ...scans.map((s) => ({ kind: "scan" as const, at: s.at, label: "QR scanned", sub: `${s.userAgent} · ${s.ip}` })),
    ...moves.map((m) => ({ kind: "move" as const, at: m.at, label: `${m.from} → ${m.to}`, sub: m.note })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/documents"><ArrowLeft className="size-4" /> Documents</Link>
        </Button>
        <p className="font-mono text-xs text-muted-foreground">internalId: {doc.internalId}</p>
      </div>

      <header className="overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="bg-[image:var(--gradient-primary)] px-6 py-5 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">{doc.department}</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{doc.name}</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Display ID</p>
            <p className="mt-1 font-mono text-sm font-semibold">{getFullDisplayId(doc)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Owner</p>
            <p className="mt-1 text-sm font-semibold">{doc.owner}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
            <div className="mt-1"><StatusBadge status={doc.status} /></div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Updated</p>
            <p className="mt-1 text-sm font-semibold">{formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList className="rounded-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qr">QR</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] lg:col-span-2">
            <h3 className="text-sm font-semibold">Lifecycle</h3>
            <ol className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {["Received","Processing","For Approval","Approved","Released"].map((s, i) => (
                <li key={s} className="rounded-xl border bg-background/60 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Step {i+1}</p>
                  <p className="mt-1 text-sm font-medium">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">Created {format(new Date(doc.createdAt), "PPpp")}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" className="justify-start rounded-xl"><Send className="size-4" /> Email status to owner</Button>
              <Button variant="outline" className="justify-start rounded-xl"><Printer className="size-4" /> Print receipt</Button>
              <Button variant="outline" className="justify-start rounded-xl"><History className="size-4" /> Add movement</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qr" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="rounded-2xl bg-white p-4 shadow-inner ring-1 ring-border">
              <QRCodeCanvas value={trackUrl} size={208} fgColor="#0B2545" />
            </div>
            <p className="mt-4 font-mono text-sm font-semibold">{getFullDisplayId(doc)}</p>
            <p className="text-xs text-muted-foreground">Scan to view live status</p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold">Tracking URL</h3>
            <p className="mt-2 break-all rounded-xl bg-muted p-3 font-mono text-xs">{trackUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="rounded-xl"><Download className="size-4" /> Download PNG</Button>
              <Button variant="outline" className="rounded-xl"><Printer className="size-4" /> Print receipt</Button>
            </div>
            <div className="mt-5 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
              QR encodes the stable internalId. The display ID rotates daily for human reference.
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FileCard
            title="Original submission"
            subtitle="Encrypted reference copy · not downloadable"
            locked
          />
          <FileCard
            title="Processed file"
            subtitle={doc.hasProcessedFile ? "Released file · decrypted in your browser" : "Will appear once the document is Released"}
            locked={!doc.hasProcessedFile}
            released={doc.hasProcessedFile}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
            {timeline.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            <ol className="relative space-y-4 border-l border-border pl-5">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[26px] mt-1 size-2.5 rounded-full ring-4 ring-card ${t.kind === "scan" ? "bg-accent" : "bg-[var(--color-gold)]"}`} />
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.sub}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                    {format(new Date(t.at), "PPpp")}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="movement" className="mt-4">
          <form className="grid grid-cols-1 gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] md:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label>From</Label>
              <Input defaultValue={doc.department} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>To</Label>
              <Input placeholder="e.g. VPAA Office" className="mt-1.5 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <Label>Note</Label>
              <Textarea placeholder="Forwarded for signature…" className="mt-1.5 rounded-xl" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button className="rounded-xl">Log movement</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FileCard({ title, subtitle, locked, released }: { title: string; subtitle: string; locked?: boolean; released?: boolean }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className={`flex size-11 items-center justify-center rounded-xl ${released ? "bg-gold/15 text-gold-foreground" : "bg-muted text-muted-foreground"}`}>
          {locked && !released ? <Lock className="size-5" /> : <FileText className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button disabled={!released} className="w-full rounded-xl" variant={released ? "default" : "outline"}>
          <Download className="size-4" /> {released ? "Download" : "Locked"}
        </Button>
      </div>
    </div>
  );
}
