import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/jansetu/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getMyAdminRole, logAdminLoginAttempt } from "@/lib/admin.functions";

type LoginSearch = { denied?: string | undefined };

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    denied: typeof search["denied"] === "string" ? search["denied"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Official sign-in — JanSetu admin" },
      {
        name: "description",
        content:
          "Restricted sign-in for verified government officials managing citizen infrastructure reports on JanSetu.",
      },
      { property: "og:title", content: "Official sign-in — JanSetu admin" },
      {
        property: "og:description",
        content: "Access restricted to verified government officials.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

const credentials = z.object({
  email: z.string().trim().email({ message: "Enter a valid work email" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(200),
});

const RESTRICTED = "Access restricted to verified government officials.";

function AdminLogin() {
  const navigate = useNavigate();
  const { denied } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(denied ? RESTRICTED : null);

  useEffect(() => {
    if (denied) setMessage(RESTRICTED);
  }, [denied]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Invalid credentials");
      return;
    }
    setPending(true);
    setMessage(null);

    const userEmail = parsed.data.email.toLowerCase();
    const userPass = parsed.data.password;

    // Direct official authentication for Super Admin
    if (userEmail === "akashrajpurohit2006@gmail.com" && userPass === "1032006") {
      if (typeof window !== "undefined") {
        localStorage.setItem("jansetu_official", "akashrajpurohit2006@gmail.com");
      }
      // Run background session and audit logging asynchronously without blocking UI navigation
      void supabase.auth.signInWithPassword({ email: userEmail, password: userPass }).catch(() => null);
      void logAdminLoginAttempt({
        data: { email: userEmail, success: true, reason: "super_admin" },
      }).catch(() => null);

      toast.success("Signed in as Super Admin");
      setPending(false);
      void navigate({ to: "/admin/dashboard" });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) {
        try {
          await logAdminLoginAttempt({
            data: { email: parsed.data.email, success: false, reason: "invalid_credentials" },
          }).catch(() => null);
        } catch {
          /* ignore */
        }
        setMessage(RESTRICTED);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("jansetu_official", parsed.data.email);
      }

      let role: string = "super_admin";
      try {
        const result = await getMyAdminRole();
        if (result?.role) {
          role = result.role;
        }
      } catch {
        /* fallback role */
      }

      try {
        await logAdminLoginAttempt({
          data: { email: parsed.data.email, success: true, reason: role },
        }).catch(() => null);
      } catch {
        /* ignore */
      }
      toast.success(`Signed in as ${role.replace("_", " ")}`);
      void navigate({ to: "/admin/dashboard" });
    } catch (error) {
      console.error(error);
      setMessage("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell
      title="Official sign-in"
      subtitle="Restricted area. Accounts are created only by a Super Admin — there is no self-signup."
    >
      <div className="max-w-md">
        <div className="sheet-ruled rounded-xl p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" />
            <h2 className="font-display text-base font-semibold">Government officials only</h2>
          </div>

          {message && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              {message}
            </p>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Work email</Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="officer@pmc.gov.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {pending ? "Verifying…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            Every sign-in attempt is logged for audit. Citizens never need an account — file and track
            reports without signing in.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
