import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — JOSEPH MMWA" },
      { name: "description", content: "Sign in or create your JOSEPH MMWA reader account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function describeError(err: unknown): string {
    console.error("[auth] error:", err);
    if (err && typeof err === "object") {
      const anyErr = err as { message?: string; error_description?: string; name?: string; status?: number };
      const msg = anyErr.message || anyErr.error_description;
      if (msg && msg.trim()) return msg;
      if (anyErr.status) return `Request failed (status ${anyErr.status}). Please try again.`;
      if (anyErr.name) return anyErr.name;
    }
    if (typeof err === "string" && err.trim()) return err;
    return "Something went wrong. Please try again.";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        console.log("[auth] signUp start", { email });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        console.log("[auth] signUp response", { data, error });
        if (error) throw error;
        if (!data.user && !data.session) {
          toast.error("Signup did not return a user. Please try again.");
          return;
        }
        toast.success("Account created. Check your email to confirm your account.");
      } else {
        console.log("[auth] signIn start", { email });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log("[auth] signIn response", { data, error });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    try {
      // NOTE: Supabase Auth → URL Configuration → Redirect URLs must include:
      //   https://josephmmwa.com/auth/callback
      //   https://www.josephmmwa.com/auth/callback
      //   http://localhost:8080/auth/callback (for local dev)
      // Google Client ID/Secret are configured inside Supabase (Auth → Providers → Google).
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) toast.error(describeError(error));
    } catch (err) {
      toast.error(describeError(err));
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster theme="dark" position="top-right" />
      <header className="px-6 py-6">
        <Link to="/" className="inline-block">
          <Logo size="md" />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
          <div className="text-center">
            <Logo size="lg" />
            <p className="mt-3 text-sm text-text-mute font-serif">
              Access the Joseph Mmwa newsroom
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 bg-surface-2 rounded-md p-1 text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 rounded-md font-medium transition-colors ${
                  mode === m ? "bg-gold text-primary-foreground" : "text-text-body"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <button
            onClick={google}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-surface-2 border border-border hover:border-gold/40 rounded-md py-3 text-sm font-medium"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-text-mute">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mute hover:text-gold"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "signin" && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-gold hover:text-gold-hover">
                  Forgot your password?
                </Link>
              </div>
            )}
            <button
              disabled={loading}
              className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
            >
              {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-xs text-text-mute text-center">
            By continuing you agree to our terms and privacy policy.
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
