import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

// The redirectTo must go through /auth/callback with type=recovery
// so the recovery token is exchanged before reaching /reset-password
const RECOVERY_CALLBACK = "https://josephmmwa.com/auth/callback?type=recovery";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — JOSEPH MMWA" },
      {
        name: "description",
        content: "Reset your JOSEPH MMWA account password.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RECOVERY_CALLBACK,
    });
    setLoading(false);
    if (err) {
      console.error(
        "Auth error:",
        JSON.stringify(err, Object.getOwnPropertyNames(err)),
      );
      setError(
        err.message?.trim() ||
          (err as { error_description?: string }).error_description?.trim() ||
          "Something went wrong. Please try again.",
      );
      return;
    }
    setSent(true);
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
            <div
              style={{
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                border: "1px solid rgba(22, 163, 74, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
              }}
            >
              <p style={{ color: "#16a34a", fontSize: "14px" }}>
                ✓ Reset link sent to{" "}
                <strong>{email}</strong>. Check your inbox and click the link
                to set a new password. Check your spam folder if you do not see
                it.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                  }}
                >
                  <p style={{ color: "#dc2626", fontSize: "14px" }}>
                    ⚠ {error}
                  </p>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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
