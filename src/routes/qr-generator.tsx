import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getFullDisplayId, type Document } from "@/lib/dashboard-utils";
import { toast } from "sonner";
import api from "@/lib/api";

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [docId, setDocId] = useState<string | undefined>(search.id);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data || []);
        if (res.data?.length > 0 && !search.id) {
          setDocId(res.data[0].internalId);
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocs();
  }, [search.id]);

  const doc = documents.find((d) => d.internalId === docId) ?? documents[0];
  const trackUrl = typeof window !== "undefined" && doc ? `${window.location.origin}/track?track=${doc.internalId}&source=qr` : "";

  const download = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#qr-canvas canvas");
    if (!canvas || !doc) return;
    const link = document.createElement("a");
    link.download = `${getFullDisplayId(doc)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const copy = () => { navigator.clipboard.writeText(trackUrl); toast.success("Tracking URL copied"); };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!doc) {
    return <div className="p-8 text-center text-muted-foreground">No documents found to generate QR.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 print:hidden">
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

      {/* ==================================================================
          PRINT LAYOUT: MODERN SINGLE-PAGE OFFICIAL DOCUMENT QR RECEIPT
          ================================================================== */}
      <div id="qr-receipt-print" className="hidden print:block font-sans text-slate-900 bg-white max-w-[320px] mx-auto p-6 rounded-2xl border border-slate-200 text-center relative">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page {
              size: portrait;
              margin: 10mm;
            }
            body {
              background: white !important;
              color: #0f172a !important;
              font-family: 'Inter', sans-serif !important;
            }
            /* Hide web page layout completely when printing */
            header, nav, aside, footer, [data-sidebar="sidebar"], .top-header, .no-print, button, .tabs-list, [role="tablist"], .mx-auto.max-w-5xl {
              display: none !important;
            }
            #qr-receipt-print {
              display: block !important;
              width: 100% !important;
              max-width: 320px !important;
              border: 1px solid #e2e8f0 !important;
              padding: 24px !important;
              margin: 20px auto !important;
              box-shadow: none !important;
              background: white !important;
            }
          }
        ` }} />
        
        {/* Header decoration */}
        <div className="space-y-1 pb-4 border-b border-dashed border-slate-200">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[#0B2545] text-[#EEB902] font-bold text-lg ring-1 ring-[#EEB902]/40">
            C
          </div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900 mt-2">CIT DocTracker</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Official QR Tracking Slip</p>
        </div>

        {/* QR Code */}
        <div className="py-6 flex justify-center">
          <div className="p-3 border border-slate-100 rounded-xl bg-white shadow-sm ring-1 ring-slate-150">
            <QRCodeCanvas value={trackUrl} size={180} fgColor="#0B2545" includeMargin={false} />
          </div>
        </div>

        {/* Document Details */}
        <div className="space-y-3 pt-4 border-t border-dashed border-slate-200 text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Document Name</span>
            <span className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5">{doc.name}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Tracking ID</span>
            <span className="text-sm font-mono font-bold text-slate-950 block mt-0.5">{getFullDisplayId(doc)}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Department</span>
            <span className="text-xs font-semibold text-slate-700 block mt-0.5">{doc.department || "General"}</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-1.5">
          <p className="font-semibold text-center w-full block">Scan to track live progress</p>
          <p className="font-mono text-[8px] break-all text-slate-400/90 leading-tight bg-slate-50 p-2 rounded-lg text-center w-full block">{trackUrl}</p>
        </div>
      </div>
    </div>
  );
}
