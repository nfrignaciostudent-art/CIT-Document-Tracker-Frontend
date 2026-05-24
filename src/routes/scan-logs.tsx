import { createFileRoute, Link } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scanLogs, findByInternalId } from "@/lib/mock-data";
import { formatDistanceToNow, format } from "date-fns";

export const Route = createFileRoute("/scan-logs")({
  head: () => ({
    meta: [
      { title: "Scan Logs · CIT Tracker" },
      { name: "description", content: "Automatic QR scan logs across all tracked documents." },
    ],
  }),
  component: ScanLogsPage,
});

function ScanLogsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Scan logs</h1>
        <p className="text-sm text-muted-foreground">Immutable, automatically captured on every QR scan.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-4">Display ID</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="hidden md:table-cell">IP</TableHead>
              <TableHead className="hidden md:table-cell">Agent</TableHead>
              <TableHead className="px-4 text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanLogs.map((s) => {
              const doc = findByInternalId(s.internalId);
              return (
                <TableRow key={s.id}>
                  <TableCell className="px-4 font-mono text-xs">
                    <Link to="/documents/$docId" params={{ docId: s.internalId }} className="rounded-md bg-muted px-2 py-1 hover:text-accent">
                      {s.displayId}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-sm">{doc?.name ?? "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">{s.ip}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{s.userAgent}</TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="text-sm">{formatDistanceToNow(new Date(s.at), { addSuffix: true })}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">{format(new Date(s.at), "PP p")}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
