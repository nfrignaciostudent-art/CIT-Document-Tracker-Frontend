import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/logout")({
  head: () => ({
    meta: [
      { title: "Log out · CIT Tracker" },
      { name: "description", content: "Sign out of the document tracking portal." },
    ],
  }),
  component: LogoutPage,
});

function LogoutPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <LogOut className="size-6 text-muted-foreground" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">You've been signed out</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Thanks for using CIT DocTracker. Sign in again to continue managing documents.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
