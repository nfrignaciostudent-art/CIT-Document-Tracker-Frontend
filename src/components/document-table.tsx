import { Link } from "@tanstack/react-router";
import { Download, Eye, QrCode } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { getFullDisplayId, type Document } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export function DocumentTable({ docs }: { docs: Document[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="px-4">Display ID</TableHead>
            <TableHead>Document</TableHead>
            <TableHead className="hidden md:table-cell">Owner</TableHead>
            <TableHead className="hidden lg:table-cell">Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="text-right px-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                No documents match your filters.
              </TableCell>
            </TableRow>
          )}
          {docs.map((d) => (
            <TableRow key={d.internalId} className="group">
              <TableCell className="px-4 font-mono text-xs">
                <span className="rounded-md bg-muted px-2 py-1">{getFullDisplayId(d)}</span>
              </TableCell>
              <TableCell className="max-w-[280px]">
                <p className="truncate font-medium">{d.name}</p>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {d.owner}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {d.department}
              </TableCell>
              <TableCell>
                <StatusBadge status={d.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(d.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="px-4 text-right">
                <div className="flex justify-end gap-1 opacity-70 transition group-hover:opacity-100">
                  <Button asChild size="icon" variant="ghost" className="size-8">
                    <Link to="/documents/$docId" params={{ docId: d.internalId }} aria-label="View">
                      <Eye className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="ghost" className="size-8">
                    <Link
                      to="/qr-generator"
                      search={{ id: d.internalId }}
                      aria-label="QR"
                    >
                      <QrCode className="size-4" />
                    </Link>
                  </Button>
                  {d.status === "Released" && d.hasProcessedFile && (
                    <Button size="icon" variant="ghost" className="size-8" aria-label="Download">
                      <Download className="size-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
