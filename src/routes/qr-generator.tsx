import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { documents, getFullDisplayId } from "@/lib/mock-data";
import { toast } from "sonner";

type Search = { id?: string };

export const Route = createFileRoute("/qr-generator")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "QR Generator · CIT Tracker" },
      { name: "description", content: "Generate printable QR codes for tracked documents." },
    ],
  }),
  component: QRGeneratorPage,
});

function QRGeneratorPage() {
  const search = Route.useSearch();
  const [docId, setDocId] = useState(search.id ?? documents[0].internalId);
  const doc = documents.find((d) => d.internalId === docId) ?? documents[0];
  const trackUrl = typeof window !== "undefined" ? `${window.location.origin}/track?track=${doc.internalId}` : `/track?track=${doc.internalId}`;

  const download = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#qr-canvas canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${getFullDisplayId(doc)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const copy = () => { navigator.clipboard.writeText(trackUrl); toast.success("Tracking URL copied"); };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">QR Generator</h1>
        <p className="text-sm text-muted-foreground">Print or share a QR that always reflects the document's live status.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div>
            <Label>Select document</Label>
            <Select value={docId} onValueChange={setDocId}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {documents.map((d) => (
                  <SelectItem key={d.internalId} value={d.internalId}>
                    <span className="font-mono text-xs">{getFullDisplayId(d)}</span> · {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3 text-xs">
            <p className="font-semibold uppercase tracking-wider text-muted-foreground">Tracking URL</p>
            <p className="mt-1 break-all font-mono">{trackUrl}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={download} className="rounded-xl"><Download className="size-4" /> Download PNG</Button>
            <Button onClick={() => window.print()} variant="outline" className="rounded-xl"><Printer className="size-4" /> Print receipt</Button>
            <Button onClick={copy} variant="outline" className="rounded-xl"><Copy className="size-4" /> Copy URL</Button>
          </div>
        </div>

        <div id="qr-canvas" className="relative flex flex-col items-center justify-center rounded-2xl border bg-[image:var(--gradient-primary)] p-8 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <div className="absolute inset-0 rounded-2xl opacity-15" style={{
            backgroundImage: "radial-gradient(circle at 30% 0%, white, transparent 40%)",
          }} />
          <div className="relative rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-[var(--color-gold)]/40">
            <QRCodeCanvas value={trackUrl} size={224} fgColor="#0B2545" includeMargin={false} />
          </div>
          <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            CIT · DocTracker
          </p>
          <p className="relative mt-1 font-mono text-base font-bold">{getFullDisplayId(doc)}</p>
          <p className="relative mt-1 max-w-xs text-center text-xs text-primary-foreground/70">{doc.name}</p>
        </div>
      </div>
    </div>
  );
}
