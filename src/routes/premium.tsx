import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, ShieldCheck, Sparkles, Zap, Award } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium Membership — JOSEPH MMWA" },
      { name: "description", content: "Unlock premium global health and medical reporting from Joseph Mmwa." },
      { property: "og:title", content: "Premium Membership — JOSEPH MMWA" },
      { property: "og:description", content: "In-depth analysis, early access, and ad-free reading." },
    ],
  }),
  component: PremiumPage,
});

const MONTHLY_FEATURES = [
  "Unlimited premium articles",
  "Exclusive investigations",
  "Early access to breaking health stories",
  "Premium analysis and long-form features",
  "Video briefings and explainers",
  "The Mmwa Briefing subscriber newsletter",
  "Ad-free reading experience",
];

const ANNUAL_ADDITIONAL = [
  "The lowest annual price",
  "Uninterrupted access for 12 months",
  "Priority access to special reports and premium features",
  "Support independent, reader-funded journalism",
];

const ALL_INCLUDED = [
  "Unlimited access to premium reporting",
  "Exclusive investigations and original journalism",
  "In-depth coverage of medicine, science, and global health",
  "Early access to major health and medical stories",
  "Premium video updates and expert explainers",
  "The Mmwa Briefing subscriber-only newsletter",
  "Special reports and long-form features",
  "Completely ad-free reading across every article",
  "Directly support independent health journalism",
];

function PremiumPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden border-b border-border py-20 lg:py-24"
        style={{
          background: "radial-gradient(ellipse at top center, #2e1e00 0%, #171000 45%, #0a0a0a 100%)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 lg:px-6 text-center relative z-10">
          <span 
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-6 shadow-sm"
            style={{ background: "rgba(245, 166, 35, 0.12)", border: "1px solid rgba(245, 166, 35, 0.4)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Exclusive Membership
          </span>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-foreground tracking-tight leading-tight uppercase">
            WELCOME BACK!
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-display text-gold italic font-semibold">
            Unlock World-Class Global Health &amp; Medical Reporting.
          </p>

          <p className="mt-4 text-base text-text-body font-serif max-w-3xl mx-auto leading-relaxed">
            Go beyond the headlines with exclusive investigations, expert analysis, early access to breaking health news, and in-depth reporting on medicine, science, public health, outbreaks, and healthcare. Experience journalism produced with accuracy, independence, and depth—completely ad-free.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="mx-auto max-w-6xl px-4 lg:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
            Flexible Subscriptions
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground mt-2">
            Choose Your Plan
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* Monthly Plan */}
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 flex flex-col justify-between hover:border-gold/30 transition-all shadow-lg">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono uppercase tracking-wider text-text-mute font-bold">
                  Monthly
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display font-black text-4xl sm:text-5xl text-foreground">
                  US$6.99
                </span>
                <span className="text-sm text-text-mute font-serif">/month</span>
              </div>

              <p className="mt-3 text-sm text-text-body font-serif border-b border-border pb-6 leading-relaxed">
                Unlimited access to all premium content with the flexibility to cancel anytime.
              </p>

              <div className="mt-6">
                <p className="text-xs font-mono uppercase tracking-wider text-gold font-semibold mb-4">
                  Includes:
                </p>
                <ul className="space-y-3.5">
                  {MONTHLY_FEATURES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-serif text-text-body">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <Link
                to="/auth"
                className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl border border-gold text-gold hover:bg-gold/10 transition-colors"
              >
                Subscribe Monthly <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Annual Plan (Featured) */}
          <div 
            className="rounded-2xl border p-8 sm:p-10 flex flex-col justify-between relative shadow-2xl overflow-hidden"
            style={{ 
              background: "radial-gradient(ellipse at top left, #2e1e00 0%, #171000 60%, #0d0d0d 100%)", 
              borderColor: "#F5A623" 
            }}
          >
            {/* Best Value Badge */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold text-black px-3.5 py-1 text-xs font-sans font-bold uppercase tracking-wider shadow-md">
                <Zap className="w-3 h-3 fill-black" /> Best Value
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono uppercase tracking-wider text-gold font-bold">
                  Annual
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display font-black text-4xl sm:text-5xl text-foreground">
                  US$69.99
                </span>
                <span className="text-sm text-text-mute font-serif">/year</span>
              </div>

              <p className="mt-2 text-xs font-semibold text-gold font-mono uppercase tracking-wider">
                Save 17% compared with paying monthly.
              </p>

              <div className="mt-6 border-b border-gold/20 pb-6">
                <p className="text-xs font-mono uppercase tracking-wider text-gold font-semibold mb-3">
                  Everything in the Monthly plan, plus:
                </p>
                <ul className="space-y-2.5">
                  {ANNUAL_ADDITIONAL.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs font-serif text-white font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-xs font-mono uppercase tracking-wider text-gold/80 font-semibold mb-4">
                  All Monthly Features Included:
                </p>
                <ul className="space-y-3">
                  {MONTHLY_FEATURES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-serif text-text-body">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/20">
              <Link
                to="/auth"
                className="btn-glow w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-xl bg-gold text-black hover:bg-gold-hover transition-colors text-base"
              >
                Subscribe Annually <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Every Premium Membership Includes List */}
      <section className="border-t border-border bg-card/50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
              Complete Privileges
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground mt-2">
              Every Premium Membership Includes
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_INCLUDED.map((item) => (
              <div 
                key={item} 
                className="rounded-xl border border-border bg-background p-5 flex items-start gap-3.5 hover:border-gold/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-serif text-sm text-text-body leading-snug">{item}</span>
              </div>
            ))}
          </div>

          {/* Bottom Statement */}
          <div className="mt-16 rounded-2xl border border-gold/30 p-8 text-center bg-radial-gold-dark max-w-3xl mx-auto shadow-xl"
            style={{ 
              background: "radial-gradient(ellipse at center, #251800 0%, #0a0a0a 100%)",
            }}
          >
            <Award className="w-8 h-8 text-gold mx-auto mb-3" />
            <p className="font-serif italic text-base sm:text-lg text-foreground font-medium">
              Trusted. Independent. Reader-funded. Because the world's most important health stories deserve world-class journalism.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
