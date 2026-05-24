import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account · CIT Document Tracker" },
      { name: "description", content: "Create your CIT Document Tracker account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created · welcome!");
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <AuthShell title="Create your account" subtitle="Get a CIT DocTracker account in seconds.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" required placeholder="Juan Dela Cruz" className="h-11 rounded-xl pl-9" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required placeholder="you@cit.edu" className="h-11 rounded-xl pl-9" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" required minLength={8} placeholder="At least 8 characters" className="h-11 rounded-xl pl-9" />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          By creating an account, you agree to the CIT acceptable-use policy.
        </p>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
        >
          {loading ? "Creating…" : <>Create account <ArrowRight className="size-4" /></>}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
