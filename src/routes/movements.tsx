import { createFileRoute, Link } from "@tanstack/react-router";
import { movements, findByInternalId } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/movements")({
  head: () => ({
    meta: [
      { title: "Movements · CIT Tracker" },
      { name: "description", content: "Manual movement log for tracked school documents." },
    ],
  }),
  component: MovementsPage,
});

function MovementsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Movements</h1>
        <p className="text-sm text-muted-foreground">Admin-recorded routing across offices.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <form
          className="space-y-3 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]"
          onSubmit={(e) => { e.preventDefault(); toast.success("Movement logged (demo)"); }}
        >
          <h3 className="text-sm font-semibold">Log a movement</h3>
          <div>
            <Label>Display ID</Label>
            <Input placeholder="DOC-20260418-0001-A7F2" className="mt-1.5 rounded-xl font-mono text-xs" />
          </div>
          <div>
            <Label>From</Label>
            <Input placeholder="IT Department Office" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label>To</Label>
            <Input placeholder="VPAA Office" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label>Note</Label>
            <Textarea placeholder="Forwarded for signature…" className="mt-1.5 rounded-xl" />
          </div>
          <Button type="submit" className="w-full rounded-xl">Log movement</Button>
        </form>

        <ol className="lg:col-span-2 space-y-3">
          {movements.map((m) => {
            const doc = findByInternalId(m.internalId);
            return (
              <li key={m.id} className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to="/documents/$docId" params={{ docId: m.internalId }} className="font-mono text-xs text-accent hover:underline">
                      {m.displayId}
                    </Link>
                    <p className="mt-0.5 truncate text-sm font-semibold">{doc?.name ?? "N/A"}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="rounded-md bg-muted px-2 py-0.5">{m.from}</span>
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      <span className="rounded-md bg-gold/15 px-2 py-0.5 text-gold-foreground">{m.to}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
                  </div>
                  <span className="whitespace-nowrap text-[11px] uppercase tracking-wide text-muted-foreground/70">
                    {formatDistanceToNow(new Date(m.at), { addSuffix: true })}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
