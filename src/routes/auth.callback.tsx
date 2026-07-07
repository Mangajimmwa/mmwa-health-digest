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
// josephmmwa.com.

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

    function goHomeOrIntended(recovery = false) {
      if (cancelled) return;
      if (recovery) {
        navigate({ to: "/reset-password" });
        return;
      }
      const intended =
        typeof window !== "undefined"
          ? sessionStorage.getItem("post_auth_redirect")
          : null;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("post_auth_redirect");
      }
      navigate({ to: intended || "/" });
    }

    async function run() {
      try {
        const url = new URL(window.location.href);
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashType = hashParams.get("type");
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const queryType = url.searchParams.get("type");
        const errorDescription =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error") ||
          hashParams.get("error_description");

        if (errorDescription) {
          console.error("[auth/callback] provider error:", errorDescription);
          navigate({ to: "/auth", search: { error: "google_callback_failed" } });
          return;
        }

        // Step 1: implicit flow — tokens in hash fragment
        if (accessToken && refreshToken) {
          console.log("[auth/callback] hash tokens found, calling setSession");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error && data.session) {
            console.log("[auth/callback] setSession succeeded");
            window.history.replaceState(null, "", window.location.pathname);
            goHomeOrIntended(hashType === "recovery");
            return;
          }
          console.error("[auth/callback] setSession failed:", error);
        }

        // Step 2: PKCE code exchange — pass only the code string, not the full URL
        if (code) {
          console.log("[auth/callback] code found, calling exchangeCodeForSession");
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data.session) {
            console.log("[auth/callback] exchangeCodeForSession succeeded");
            goHomeOrIntended(queryType === "recovery");
            return;
          }
          if (error) console.warn("[auth/callback] exchangeCodeForSession failed:", error.message);
        }

        // Step 3: email verification token
        if (tokenHash && isEmailOtpType(queryType)) {
          console.log("[auth/callback] token_hash found, calling verifyOtp");
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: queryType,
          });
          if (!error && data.session) {
            console.log("[auth/callback] verifyOtp succeeded");
            goHomeOrIntended(queryType === "recovery");
            return;
          }
          if (error) console.error("[auth/callback] verifyOtp failed:", error);
        }

        // Step 4: poll for session set by detectSessionInUrl
        console.log("[auth/callback] polling for session...");
        for (let i = 0; i < 20; i++) {
          if (cancelled) return;
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("[auth/callback] session found on poll attempt", i + 1);
            goHomeOrIntended(hashType === "recovery" || queryType === "recovery");
            return;
          }
          await new Promise((r) => setTimeout(r, 150));
        }

        // Step 5: all methods failed
        console.error("[auth/callback] all methods exhausted, redirecting to /auth");
        navigate({ to: "/auth", search: { error: "session_failed" } });
      } catch (err) {
        console.error("[auth/callback] unexpected error:", err);
        navigate({ to: "/auth", search: { error: "session_failed" } });
      }
    }

    run();
    return () => {
      cancelled = true;
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
