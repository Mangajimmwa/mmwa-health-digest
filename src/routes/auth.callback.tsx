import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

// Supabase Auth → URL Configuration → Redirect URLs must include:
//   https://josephmmwa.com/auth/callback
//   https://www.josephmmwa.com/auth/callback
//
// Google Cloud Console → Authorized redirect URIs must include:
//   https://mjvpcfetbvvcnhdwwjrl.supabase.co/auth/v1/callback

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

    function goHome() {
      if (!cancelled) navigate({ to: "/" });
    }

    function goRecovery() {
      if (!cancelled) navigate({ to: "/reset-password" });
    }

    function goError() {
      if (!cancelled)
        navigate({ to: "/auth", search: { error: "session_failed" } });
    }

    async function run() {
      try {
        // Read URL params
        const search = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams(
          window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : window.location.hash,
        );

        const code = search.get("code");
        const queryType = search.get("type");
        const tokenHash = search.get("token_hash");
        const errorParam =
          search.get("error_description") ||
          search.get("error") ||
          hash.get("error_description");

        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        const hashType = hash.get("type");

        // If provider returned an error, bail immediately
        if (errorParam) {
          console.error("[callback] provider error:", errorParam);
          goError();
          return;
        }

        // ── Step 1: PKCE code exchange ──────────────────────────────────────
        // Pass ONLY the code string, never the full URL
        if (code) {
          console.log("[callback] exchanging code...");
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[callback] exchangeCodeForSession failed:", error.message);
          } else if (data.session) {
            console.log("[callback] PKCE exchange succeeded");
            if (queryType === "recovery") {
              goRecovery();
            } else {
              goHome();
            }
            return;
          }
        }

        // ── Step 2: Implicit flow — hash fragment tokens ─────────────────────
        if (accessToken && refreshToken) {
          console.log("[callback] setting session from hash tokens...");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error("[callback] setSession failed:", error.message);
          } else if (data.session) {
            console.log("[callback] implicit flow succeeded");
            window.history.replaceState(null, "", window.location.pathname);
            if (hashType === "recovery") {
              goRecovery();
            } else {
              goHome();
            }
            return;
          }
        }

        // ── Step 3: Email OTP verification ───────────────────────────────────
        if (tokenHash && isEmailOtpType(queryType)) {
          console.log("[callback] verifying OTP...");
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: queryType,
          });
          if (error) {
            console.error("[callback] verifyOtp failed:", error.message);
          } else if (data.session) {
            console.log("[callback] OTP verification succeeded");
            if (queryType === "recovery") {
              goRecovery();
            } else {
              goHome();
            }
            return;
          }
        }

        // ── Step 4: Poll — detectSessionInUrl may have handled it ────────────
        console.log("[callback] polling for session...");
        for (let i = 0; i < 20; i++) {
          if (cancelled) return;
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("[callback] session found on poll", i + 1);
            const isRecovery =
              hashType === "recovery" || queryType === "recovery";
            if (isRecovery) {
              goRecovery();
            } else {
              goHome();
            }
            return;
          }
          await new Promise((r) => setTimeout(r, 200));
        }

        // ── Step 5: Give up ──────────────────────────────────────────────────
        console.error("[callback] all methods exhausted");
        goError();
      } catch (err) {
        console.error("[callback] unexpected error:", err);
        goError();
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
