import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, FileLock2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register Document · CIT Tracker" },
      { name: "description", content: "Register a new document. Files are encrypted client-side before upload." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Register a document</h1>
        <p className="text-sm text-muted-foreground">A QR code and display ID will be generated on submission.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); toast.success("Document registered (demo)"); }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div>
            <Label>Document name</Label>
            <Input placeholder="e.g. Transcript of Records Request" className="mt-1.5 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Owner</Label>
              <Input placeholder="Student / staff full name" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label>IT Unit</Label>
              <Select defaultValue="IT Department Office">
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["IT Department Office","Dean of IT","IT Faculty Room","IT Student Services","IT OJT Coordinator","IT Laboratory"].map((d) =>
                    <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>
          <div>
            <Label>Notes</Label>
            <Textarea placeholder="Any additional context…" className="mt-1.5 rounded-xl" />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Attach file</span>
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition hover:border-accent/60 hover:bg-accent/5">
              <div>
                <UploadCloud className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  {file ? file.name : "Drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, JPG · up to 25 MB</p>
              </div>
              <input type="file" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
            <Button type="submit" className="rounded-xl">Register document</Button>
          </div>
        </div>

        <aside className="space-y-3 rounded-2xl border bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <ShieldCheck className="size-6 text-[var(--color-gold)]" />
          <h3 className="text-base font-semibold">Client-side encryption</h3>
          <p className="text-xs text-primary-foreground/80">
            Document names and files are encrypted in your browser before reaching the server.
            The server never holds raw file data.
          </p>
          <div className="rounded-xl bg-white/10 p-3 text-xs">
            <div className="flex items-center gap-2 font-medium"><FileLock2 className="size-4 text-[var(--color-gold)]" /> Dual-ID system</div>
            <p className="mt-1 text-primary-foreground/70">
              A stable internal ULID powers the QR, while a human-friendly DOC-YYYYMMDD-XXXX shows on receipts.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
