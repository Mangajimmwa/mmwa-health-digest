import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

// Supabase Auth → URL Configuration → Redirect URLs must include:
//   https://josephmmwa.com/auth/callback
//   https://www.josephmmwa.com/auth/callback
//   http://localhost:8080/auth/callback (for local dev)
//
// Google Cloud Console → Authorized redirect URIs must point to Supabase's
// callback (e.g. https://<project-ref>.supabase.co/auth/v1/callback), NOT to
// josephmmwa.com. Supabase brokers the Google exchange, then redirects the
// browser back here with either a `?code=` (PKCE), `#access_token=` hash
// (implicit) or `?token_hash=&type=` (email verification link).

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: AuthCallback,
});

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email";

function isEmailOtpType(v: string | null): v is EmailOtpType {
  return (
    v === "signup" ||
    v === "invite" ||
    v === "magiclink" ||
    v === "recovery" ||
    v === "email_change" ||
    v === "email"
  );
}

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    function finish(session: unknown) {
      if (cancelled) return;
      if (!session) return;
      const intended =
        typeof window !== "undefined"
          ? sessionStorage.getItem("post_auth_redirect")
          : null;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("post_auth_redirect");
      }
      // Recovery links should route to the password reset page.
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      if (type === "recovery") {
        navigate({ to: "/reset-password" });
        return;
      }
      navigate({ to: intended || "/" });
    }

    async function run() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");
        const errorDescription =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error") ||
          // implicit hash errors
          new URLSearchParams(window.location.hash.replace(/^#/, "")).get(
            "error_description",
          );

        console.log("[auth/callback]", {
          hasCode: !!code,
          hasTokenHash: !!tokenHash,
          type,
          hash: window.location.hash ? "present" : "none",
        });

        if (errorDescription) {
          console.error("[auth/callback] provider error:", errorDescription);
          navigate({ to: "/auth", search: { error: "google_callback_failed" } });
          return;
        }

        // Subscribe first so we don't miss the SIGNED_IN event that the
        // client fires when it auto-detects the URL on init.
        const sub = supabase.auth.onAuthStateChange((event, session) => {
          console.log("[auth/callback] onAuthStateChange", event, !!session);
          if (session) finish(session);
        });
        unsub = () => sub.data.subscription.unsubscribe();

        // Email verification link: ?token_hash=...&type=signup|recovery|...
        if (tokenHash && isEmailOtpType(type)) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error) {
            console.error("[auth/callback] verifyOtp error:", error);
            navigate({ to: "/auth", search: { error: "google_callback_failed" } });
            return;
          }
          if (data.session) {
            finish(data.session);
            return;
          }
        } else if (code) {
          // PKCE OAuth: exchange ?code=... for a session. The client's
          // detectSessionInUrl may race with us; if it already consumed the
          // code, this call errors — treat that as non-fatal and fall through
          // to getSession() below.
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            window.location.href,
          );
          if (error) {
            console.warn("[auth/callback] exchangeCodeForSession:", error.message);
          } else if (data.session) {
            finish(data.session);
            return;
          }
        }

        // Implicit hash flow or already-consumed code: poll for a session.
        for (let i = 0; i < 20; i++) {
          if (cancelled) return;
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            finish(data.session);
            return;
          }
          await new Promise((r) => setTimeout(r, 150));
        }

        console.error("[auth/callback] no session after polling");
        navigate({ to: "/auth", search: { error: "no_session" } });
      } catch (err) {
        console.error("[auth/callback] unexpected:", err);
        navigate({ to: "/auth", search: { error: "google_callback_failed" } });
      }
    }

    run();
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Logo size="lg" />
      <p className="mt-6 text-sm text-text-mute font-serif">
        Finishing sign-in…
      </p>
    </div>
  );
}
