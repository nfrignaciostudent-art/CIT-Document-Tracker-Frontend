import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · CIT Document Tracker" },
      { name: "description", content: "Sign in to your CIT Document Tracker account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back, Admin Office");
      navigate({ to: "/dashboard" });
    }, 600);
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to manage your documents.">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@cit.edu" className="h-11 rounded-xl pl-9" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/login" className="text-[11px] text-accent hover:underline">Forgot?</Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" className="h-11 rounded-xl pl-9" />
        </div>
      </div>
      <Button type="submit" disabled={loading}
        className="h-11 w-full rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95">
        {loading ? "Signing in…" : <>Sign in <ArrowRight className="size-4" /></>}
      </Button>
    </form>
    <p className="mt-5 text-center text-sm text-muted-foreground">
      No account yet?{" "}
      <Link to="/signup" className="font-medium text-accent hover:underline">
        Create one
      </Link>
    </p>
  </AuthShell>;
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[image:var(--gradient-hero)] p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, white 0, transparent 35%), radial-gradient(circle at 90% 80%, var(--color-gold) 0, transparent 40%)",
          }}
        />
        <Link to="/" className="relative">
          <Wordmark size="md" tone="light" subtitle="Document & QR Portal" />
        </Link>
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            College of Information Technology
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
            Track every document, end to end.
          </h2>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
            Stable IDs, automatic scan logs, and encrypted files, all in one portal designed
            for academic workflows.
          </p>
        </div>
        <p className="relative text-[11px] text-primary-foreground/60">
          © {new Date().getFullYear()} CIT Document Tracker
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-10 md:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground lg:hidden">
            <Wordmark size="sm" showSubtitle={false} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
