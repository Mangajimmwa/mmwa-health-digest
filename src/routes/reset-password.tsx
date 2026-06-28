import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set New Password — JOSEPH MMWA" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Supabase puts the recovery token in the URL hash and fires PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If user navigated here with a session already (link just opened), allow it.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
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
          <h1 className="font-display font-bold text-3xl">Set a new password</h1>
          <p className="mt-3 text-sm text-text-body font-serif">
            Enter a new password for your JOSEPH MMWA account.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <input
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mute hover:text-gold"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              disabled={loading || !ready}
              className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
            >
              {loading ? "..." : ready ? "Update Password" : "Waiting for recovery link..."}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
