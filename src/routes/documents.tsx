import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { DocumentTable } from "@/components/document-table";
import { documents, getFullDisplayId, type DocStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents · CIT Document Tracker" },
      { name: "description", content: "Full registry of tracked school documents with filters and status." },
      { property: "og:title", content: "Documents · CIT Document Tracker" },
      { property: "og:description", content: "Full registry of tracked school documents with filters and status." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<DocStatus | "all">("all");
  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return documents.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (!needle) return true;
      return (
        d.name.toLowerCase().includes(needle) ||
        d.owner.toLowerCase().includes(needle) ||
        d.displayId.toLowerCase().includes(needle) ||
        getFullDisplayId(d).toLowerCase().includes(needle)
      );
    });
  }, [q, status]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {documents.length} records · synced live
        </p>
      </div>
      <FilterBar query={q} onQuery={setQ} status={status} onStatus={setStatus} />
      <DocumentTable docs={filtered} />
    </div>
  );
}
