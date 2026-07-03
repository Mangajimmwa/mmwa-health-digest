import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — JOSEPH MMWA" },
      { name: "description", content: "Reset your JOSEPH MMWA account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      console.error("Auth error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      const msg =
        (error.message && error.message.trim()) ||
        ((error as { error_description?: string }).error_description ?? "").trim() ||
        (error.code ? String(error.code) : "") ||
        "Something went wrong. Please try again.";
      toast.error(msg);
      return;
    }
    setSent(true);
    toast.success("Reset link sent. Check your inbox.");
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
          <h1 className="font-display font-bold text-3xl">Reset password</h1>
          <p className="mt-3 text-sm text-text-body font-serif">
            Enter your email address and we will send you a link to reset your
            password.
          </p>

          {sent ? (
            <div className="mt-6 rounded-md border border-gold/30 bg-gold/5 p-4 text-sm text-text-body">
              We've sent a reset link to <span className="text-gold">{email}</span>.
              Follow the link in the email to set a new password.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-3">
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
              <button
                disabled={loading}
                className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
              >
                {loading ? "..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-text-mute text-center">
            <Link to="/auth" className="text-gold hover:text-gold-hover">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
