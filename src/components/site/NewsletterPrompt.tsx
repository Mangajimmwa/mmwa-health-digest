import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Mid-article + standalone newsletter signup.
 *
 * INTEGRATION POINT — third-party email marketing:
 * After a successful DB insert, if `NEWSLETTER_WEBHOOK_URL` env var is
 * configured, the browser will POST { email } to it (or you can wire it
 * from a server function). To connect Mailchimp, ConvertKit, Beehiiv,
 * or Substack later:
 *   1. Add the platform API key as a secret and expose a small server
 *      function `subscribeToProvider({ email })` that calls the provider.
 *   2. Call it below where marked "// EXTERNAL PROVIDER HOOK".
 */
export function NewsletterPrompt({
  variant = "inline",
}: {
  variant?: "inline" | "card";
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.success("You're already subscribed — thank you.");
        setEmail("");
        return;
      }
      toast.error("Could not subscribe. Try again.");
      return;
    }
    // EXTERNAL PROVIDER HOOK — see file header comment.
    setEmail("");
    toast.success("Subscribed. Watch your inbox tomorrow morning.");
  }

  return (
    <aside
      className={
        variant === "card"
          ? "rounded-xl p-8"
          : "my-10 rounded-xl p-6 sm:p-8 not-prose"
      }
      style={{
        background:
          "radial-gradient(ellipse at top left, #2A1F00 0%, #150F00 55%, #0A0A0A 100%)",
        border: "1px solid rgba(245, 166, 35, 0.35)",
        boxShadow: "inset 0 0 60px rgba(245, 166, 35, 0.06)",
      }}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="label-eyebrow">The Mmwa Briefing</p>
          <h3 className="mt-2 font-display font-bold text-2xl text-foreground">
            Get daily, evidence-based health journalism
          </h3>
          <p className="mt-2 text-sm sm:text-base text-text-body font-serif">
            Joseph Mmwa personally writes and curates one concise email each
            morning — outbreaks, breakthroughs, and the medical stories that
            matter. Delivered directly to your inbox.
          </p>
          <form
            onSubmit={submit}
            className="mt-5 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-surface-2 border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-text-mute focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              disabled={loading}
              className="btn-glow bg-gold text-primary-foreground font-semibold px-5 py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-2 text-xs text-text-mute">
            Free. No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </aside>
  );
}
