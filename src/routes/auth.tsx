import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

type AuthSearch = { error?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In — JOSEPH MMWA" },
      {
        name: "description",
        content: "Sign in or create your JOSEPH MMWA reader account.",
      },
    ],
  }),
  component: AuthPage,
});

function describeError(err: unknown): string {
  console.error(
    "Auth error:",
    JSON.stringify(err, Object.getOwnPropertyNames(err ?? {})),
  );
  if (err && typeof err === "object") {
    const e = err as {
      message?: string;
      msg?: string;
      error_description?: string;
      code?: string;
      name?: string;
      status?: number;
    };
    if (e.message && e.message.trim()) return e.message;
    if (e.msg && e.msg.trim()) return e.msg;
    if (e.error_description && e.error_description.trim())
      return e.error_description;
    if (e.code && String(e.code).trim()) return String(e.code);
    if (e.status)
      return `Request failed (status ${e.status}). Please try again.`;
    if (e.name && e.name.trim()) return e.name;
  }
  if (typeof err === "string" && err.trim()) return err;
  return "Something went wrong. Please try again.";
}

function friendlyCallbackError(code?: string): string | null {
  if (!code) return null;
  switch (code) {
    case "google_callback_failed":
      return "Google sign-in failed. Please try again.";
    case "no_session":
    case "session_failed":
      return "Authentication failed. Please try signing in again.";
    default:
      return code;
  }
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const search = Route.useSearch();

  // 🚀 Redirection Hook: Instant admin panel forwarder
  useEffect(() => {
    const msg = friendlyCallbackError(search.error);
    if (msg) toast.error(msg);

    async function checkActiveSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email === "mmwajoseph@gmail.com") {
          navigate({ to: "/admin" });
        }
      } catch (e) {
        console.error("Session lookup error:", e);
      }
    }
    checkActiveSession();

    // Listen for the exact millisecond you hit submit or log in successfully
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === "mmwajoseph@gmail.com" && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/admin" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [search.error, navigate]);

  function clearMessages() {
    setFormError(null);
    setFormSuccess(null);
  }

  function getCallbackURL() {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/auth/callback`;
    }
    return "https://josephmmwa.com/auth/callback";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (mode === "signup" && password !== confirmPassword) {
      setFormError("Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getCallbackURL(),
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success(
            "Welcome to Joseph Mmwa — your trusted source for global health news.",
          );
          if (data.session.user?.email === "mmwajoseph@gmail.com") {
            navigate({ to: "/admin" });
          } else {
            navigate({ to: "/" });
          }
          return;
        }

        if (data.user) {
          setAwaitingConfirm(email);
          return;
        }

        setFormError("Signup did not return a user. Please try again.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          if (data.session.user?.email === "mmwajoseph@gmail.com") {
            navigate({ to: "/admin" });
          } else {
            navigate({ to: "/" });
          }
        }
      }
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!awaitingConfirm) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: awaitingConfirm,
        options: { emailRedirectTo: getCallbackURL() },
      });
      if (error) throw error;
      setFormSuccess("Confirmation email resent. Check your inbox.");
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setResending(false);
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

          {awaitingConfirm ? (
            <div className="mt-8">
              <div
                style={{
                  backgroundColor: "rgba(22, 163, 74, 0.1)",
                  border: "1px solid rgba(22, 163, 74, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                }}
              >
                <p
                  style={{
                    color: "#16a34a",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  ✓ Confirmation email sent
                </p>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Check your inbox
              </h2>
              <p className="mt-3 text-sm text-text-body font-serif">
                We have sent a confirmation link to{" "}
                <span className="text-gold">{awaitingConfirm}</span>. Click the
                link in the email to activate your account. If you do not see it
                within a few minutes, check your spam folder.
              </p>
              {formSuccess && (
                <div
                  style={{
                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                    border: "1px solid rgba(22, 163, 74, 0.3)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginTop: "12px",
                  }}
                >
                  <p style={{ color: "#16a34a", fontSize: "14px" }}>
                    ✓ {formSuccess}
                  </p>
                </div>
              )}
              {formError && (
                <div
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginTop: "12px",
                  }}
                >
                  <p style={{ color: "#dc2626", fontSize: "14px" }}>
                    ⚠ {formError}
                  </p>
                </div>
              )}
              <button
                onClick={resendConfirmation}
                disabled={resending}
                className="mt-6 w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend confirmation email"}
              </button>
              <button
                onClick={() => {
                  setAwaitingConfirm(null);
                  setMode("signin");
                  setFormError(null);
                  setFormSuccess(null);
                }}
                className="mt-3 w-full text-sm text-gold hover:text-gold-hover"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-2 bg-surface-2 rounded-md p-1 text-sm">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      clearMessages();
                    }}
                    className={`py-2 rounded-md font-medium transition-colors ${
                      mode === m
                        ? "bg-gold text-primary-foreground"
                        : "text-text-body"
                    }`}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              {/* Secure padding layout block separator */}
              <div className="pt-4" />

              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        clearMessages();
                      }}
                      placeholder="Full name"
                      className="w-full bg-surface-2 border border-border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                    }}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                    }}
                    placeholder="At least 6 characters"
                    className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mute hover:text-gold"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {mode === "signup" && (
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearMessages();
                      }}
                      placeholder="Confirm password"
                      className="w-full bg-surface-2 border border-border rounded-md pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mute hover:text-gold"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
                {mode === "signin" && (
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gold hover:text-gold-hover"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                )}

                {formError && (
                  <div
                    style={{
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                    }}
                  >
                    <p style={{ color: "#dc2626", fontSize: "14px" }}>
                      ⚠ {formError}
                    </p>
                  </div>
                )}

                {formSuccess && (
                  <div
                    style={{
                      backgroundColor: "rgba(22, 163, 74, 0.1)",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                    }}
                  >
                    <p style={{ color: "#16a34a", fontSize: "14px" }}>
                      ✓ {formSuccess}
                    </p>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
                >
                  {loading
                    ? "..."
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>

              <p className="mt-5 text-xs text-text-mute text-center">
                By continuing you agree to our terms and privacy policy.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
