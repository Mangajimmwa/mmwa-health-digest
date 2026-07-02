import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

// IMPORTANT: Supabase Auth → URL Configuration → Redirect URLs must include:
//   https://josephmmwa.com/auth/callback
//   https://www.josephmmwa.com/auth/callback
//   http://localhost:8080/auth/callback (for local dev)
//
// Google Cloud Console → Authorized redirect URIs should point to Supabase's
// callback (e.g. https://<project-ref>.supabase.co/auth/v1/callback), NOT to
// josephmmwa.com. Supabase brokers the Google exchange, then redirects the
// browser back here with either a `?code=` (PKCE) or a `#access_token=` hash.

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorDescription =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error");

        if (errorDescription) {
          navigate({
            to: "/auth",
            search: { error: errorDescription } as never,
          });
          return;
        }

        // PKCE flow: exchange the ?code=... for a session.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href,
          );
          if (error) throw error;
        }

        // Implicit flow leaves tokens in the URL hash; the supabase-js client
        // parses them automatically via detectSessionInUrl. Give it a tick,
        // then verify a session exists.
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (data.session) {
          const intended = sessionStorage.getItem("post_auth_redirect");
          sessionStorage.removeItem("post_auth_redirect");
          navigate({ to: intended || "/" });
        } else {
          navigate({
            to: "/auth",
            search: { error: "no_session" } as never,
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        navigate({ to: "/auth", search: { error: message } as never });
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
