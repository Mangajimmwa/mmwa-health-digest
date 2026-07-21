import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
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
      { title: "Welcome Back — JOSEPH MMWA" },
      {
        name: "description",
        content: "Access independent reporting on medicine, healthcare, science, and global health stories.",
      },
    ],
  }),
  component: AuthPage,
});

function describeError(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { message?: string; msg?: string; error_description?: string; status?: number };
    if (e.message && e.message.trim()) return e.message;
    if (e.msg && e.msg.trim()) return e.msg;
    if (e.error_description && e.error_description.trim()) return e.error_description;
    if (e.status) return `Request failed (status ${e.status}). Please try again.`;
  }
  if (typeof err === "string" && err.trim()) return err;
  return "Something went wrong. Please try again.";
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === "mmwajoseph@gmail.com" && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/admin" });
      }
    });

    return () => subscription.unsubscribe();
  }, [search.error, navigate]);

  function clearMessages() {
    setFormError(null);
  }

  function getCallbackURL() {
    return typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://josephmmwa.com/auth/callback";
  }

  async function handleOAuth(provider: "google" | "apple") {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: getCallbackURL() },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(describeError(err));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

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
          toast.success("Welcome to Joseph Mmwa — your trusted source for global health news.");
          navigate({ to: data.session.user?.email === "mmwajoseph@gmail.com" ? "/admin" : "/" });
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          navigate({ to: data.session.user?.email === "mmwajoseph@gmail.com" ? "/admin" : "/" });
        }
      }
    } catch (err) {
      setFormError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Toaster theme="dark" position="top-right" />

      {/* Navigation Header */}
      <header className="px-6 py-6 mx-auto max-w-7xl w-full flex justify-between items-center border-b border-border">
        <Link to="/" className="inline-block">
          <Logo size="md" />
        </Link>
        <Link 
          to="/" 
          className="text-xs font-mono text-text-mute hover:text-gold transition-colors"
        >
          ← Back to Newsroom
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 lg:px-6 py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full">
          
          {/* Left Column: Sign In / Sign Up Form */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="max-w-xl mx-auto lg:mx-0 w-full">
              
              {/* Header Titles */}
              <div className="mb-8">
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-4"
                  style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}
                >
                  Subscriber Portal
                </span>

                <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight">
                  {mode === "signin" ? "Welcome back." : "Create Your Account"}
                </h1>

                <p className="mt-3 text-base font-serif text-text-body leading-relaxed">
                  Trusted global health journalism starts here. Access independent reporting on medicine, healthcare, science, and the global health stories shaping lives around the world.
                </p>

                {/* Micro Statistics */}
                <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="border-r border-border pr-2">
                    <span className="block text-gold font-bold text-sm">100+</span>
                    <span className="text-text-mute text-[10px]">Countries Covered</span>
                  </div>
                  <div className="border-r border-border px-2">
                    <span className="block text-gold font-bold text-sm">Daily</span>
                    <span className="text-text-mute text-[10px]">Global Coverage</span>
                  </div>
                  <div>
                    <span className="block text-gold font-bold text-sm">100%</span>
                    <span className="text-text-mute text-[10px]">Reader-Funded</span>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
                
                {/* Mode Switcher */}
                <div className="grid grid-cols-2 rounded-xl bg-background p-1 text-xs font-mono uppercase tracking-wider border border-border mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); clearMessages(); }}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      mode === "signin" ? "bg-gold text-black shadow-md" : "text-text-mute hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("signup"); clearMessages(); }}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      mode === "signup" ? "bg-gold text-black shadow-md" : "text-text-mute hover:text-foreground"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Joseph Mmwa"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-mute">
                        Password
                      </label>
                      {mode === "signin" && (
                        <Link to="/forgot-password" className="text-xs text-gold hover:underline font-mono">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-mute hover:text-gold"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {formError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                    </div>
                  )}

                  {/* Trust Callout Above Button */}
                  <div className="pt-2 text-center">
                    <p className="text-[11px] font-serif italic text-text-mute">
                      Trusted by readers following the world's most important health stories.
                    </p>
                  </div>

                  {/* Main Action Button */}
                  <button
                    disabled={loading}
                    type="submit"
                    className="btn-glow w-full bg-gold hover:bg-gold-hover text-black font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {loading ? "Accessing..." : mode === "signin" ? "Access Newsroom" : "Continue to Newsroom"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* OAuth Provider Section */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-xs font-mono uppercase tracking-wider text-text-mute mb-4">
                    Or continue with
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuth("google")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 px-4 text-xs font-semibold text-foreground hover:border-gold/50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z" />
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuth("apple")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 px-4 text-xs font-semibold text-foreground hover:border-gold/50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current text-foreground" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.36-6.08-3.32-2.73-7.23-7.44-11.73-14.13-6.66-9.88-12.01-21.2-16.05-33.95-4.04-12.75-6.06-24.62-6.06-35.62 0-14.75 3.73-26.88 11.19-36.38 7.46-9.5 16.89-14.35 28.3-14.56 4.34 0 9.27 1.13 14.78 3.39 5.51 2.26 9.4 3.4 11.67 3.4 2.11 0 6.07-1.18 11.87-3.53 5.8-2.35 10.82-3.44 15.06-3.26 12.08.68 21.6 5.43 28.56 14.25-10.74 6.5-16.02 15.54-15.83 27.13.19 9.07 3.58 16.65 10.18 22.75 6.6 6.1 14.5 9.68 23.68 10.74-2.35 7.14-5.32 14.34-8.91 21.6zM119.22 31.81c0-7.22 2.62-14.07 7.86-20.55 5.24-6.48 11.73-10.3 19.47-11.46.22 1.3.33 2.39.33 3.26 0 7.12-2.65 14.12-7.95 21-5.3 6.88-11.81 10.7-19.53 11.46-.06-.88-.18-2.12-.18-3.71z" />
                      </svg>
                      Apple
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-[11px] text-text-mute text-center font-serif">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated "Unlock Premium" Card (Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div 
              className="rounded-2xl border p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full"
              style={{
                background: "radial-gradient(ellipse at top left, #3D2800 0%, #1A1100 50%, #0A0A0A 100%)",
                borderColor: "rgba(245, 166, 35, 0.4)"
              }}
            >
              {/* Subtle Light Glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold text-black px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider mb-6 shadow-md">
                  <Sparkles className="w-3 h-3 fill-black" /> Reader Funded
                </span>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight">
                  Unlock <span className="text-gold">Premium</span>
                </h2>

                <p className="mt-2 text-xs font-serif italic text-foreground/90">
                  World-class health journalism. Reader-funded. Ad-free.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-background/80 border border-gold/20">
                  <p className="text-xs text-text-body font-serif">
                    Become a Premium Member for{" "}
                    <span className="text-foreground font-bold">US$6.99/month</span> or{" "}
                    <span className="text-gold font-bold">US$69.99/year</span>{" "}
                    <span className="text-xs font-mono text-gold">(Save 17%)</span>.
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited premium articles",
                    "Exclusive investigations",
                    "Early access to major health stories",
                    "Premium video briefings",
                    "The Mmwa Briefing newsletter",
                    "Ad-free reading across every device",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-xs font-serif text-foreground/90">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gold/20">
                <Link
                  to="/premium"
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl bg-gold text-black hover:bg-gold-hover transition-colors text-xs uppercase tracking-wider shadow-lg"
                >
                  Become a Member <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-xs font-mono text-text-mute space-y-2">
        <p className="text-gold font-semibold tracking-widest uppercase">
          Independent. Accurate. Reader-funded.
        </p>
        <p>© 2026 Joseph Mmwa Media Group. All rights reserved.</p>
      </footer>
    </div>
  );
}
