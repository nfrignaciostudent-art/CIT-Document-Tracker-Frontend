import { createFileRoute } from "@tanstack/react-router";
import { users, type UserRole } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const ROLE_STYLES: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary ring-1 ring-primary/20",
  faculty: "bg-[var(--color-gold)]/15 text-[var(--color-gold)] ring-1 ring-[var(--color-gold)]/30",
  staff: "bg-accent/10 text-accent ring-1 ring-accent/20",
  student: "bg-success/10 text-success ring-1 ring-success/20",
};

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[role]}`}>
      {role}
    </span>
  );
}


export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users · CIT Tracker" },
      { name: "description", content: "Manage portal users and review heartbeat-based online status." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Online status pings every 2 minutes.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-4">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="px-4 text-right">Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {u.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                      <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card ${u.online ? "bg-success" : "bg-muted-foreground"}`} />
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <RoleBadge role={u.role} />
                </TableCell>

                <TableCell>
                  {u.online ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                      <span className="size-1.5 rounded-full bg-success" /> Online
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Offline</span>
                  )}
                </TableCell>
                <TableCell className="px-4 text-right text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
