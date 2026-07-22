import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Sparkles, Zap, Crown, Award } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium Membership — JOSEPH MMWA MEDIA GROUP" },
      { 
        name: "description", 
        content: "Access the Joseph Mmwa Media Group newsroom for 100% ad-free, reader-funded, and uncompromised health journalism." 
      },
      { property: "og:title", content: "Premium Membership — JOSEPH MMWA MEDIA GROUP" },
      { property: "og:description", content: "In-depth medical investigations, early access, and ad-free reporting from Joseph Mmwa Media Group." },
    ],
  }),
  component: PremiumPage,
});

const MONTHLY_FEATURES = [
  "Unlimited premium investigative reports",
  "Exclusive outbreak analysis & science deep-dives",
  "Early access to breaking global health stories",
  "Premium long-form journalism & explainers",
  "Full video briefings & expert video updates",
  "The Mmwa Briefing subscriber newsletter",
  "100% ad-free reading experience across all devices",
];

const ANNUAL_ADDITIONAL = [
  "Lowest effective monthly rate (Save 17%)",
  "Priority Q&A access during global health desk briefings",
  "Uninterrupted 12-month access to all newsroom archives",
  "Directly fund independent, uncompromised journalism",
];

const ALL_INCLUDED = [
  "Unlimited access to premium reporting",
  "Exclusive investigations & original journalism",
  "In-depth coverage of medicine, science & public health",
  "Early access to major medical research breakdowns",
  "Premium video updates & expert explainers",
  "The Mmwa Briefing subscriber-only newsletter",
  "Special reports & downloadable briefings",
  "Completely ad-free reading across every article",
  "Directly support independent health journalism",
];

function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <SiteLayout>
      <div className="bg-background text-foreground min-h-screen selection:bg-gold/30">
        
        {/* Luxury Hero Banner */}
        <section
          className="relative overflow-hidden border-b border-border/80 py-20 lg:py-28 text-center"
          style={{
            background: "radial-gradient(ellipse at top center, #3A2600 0%, #170E00 50%, #0A0A0A 100%)",
          }}
        >
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gold/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 lg:px-6 relative z-10">
            <span 
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-6 shadow-md"
              style={{ background: "rgba(245, 166, 35, 0.12)", border: "1px solid rgba(245, 166, 35, 0.35)" }}
            >
              <Crown className="w-3.5 h-3.5 text-gold" />
              Joseph Mmwa Media Group
            </span>

            {/* BOLD HIGH-IMPACT HEADLINE (Full stop removed) */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-foreground tracking-tight leading-[1.08] uppercase drop-shadow-md">
              ACCESS THE <br />
              <span className="text-gold">MMWA NEWSROOM</span>
            </h1>

            <p className="mt-5 text-lg sm:text-2xl font-display text-gold/90 italic font-semibold max-w-2xl mx-auto">
              100% Ad-Free. Reader-Funded. Uncompromised Health Truth.
            </p>

            <p className="mt-5 text-sm sm:text-base text-text-body font-serif max-w-3xl mx-auto leading-relaxed opacity-90">
              No sponsored fluff, no pop-up ads, and zero corporate influence. Step inside the global desk at Joseph Mmwa Media Group for direct access to unvarnished medical investigations, real-time outbreak tracking, peer-reviewed scientific breakdowns, and exclusive briefing intelligence.
            </p>

            {/* Micro Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-gold/15 grid grid-cols-3 gap-2 max-w-lg mx-auto text-center font-mono">
              <div>
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">0%</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Ads &amp; Clutter</span>
              </div>
              <div className="border-x border-border/60 px-2">
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">100%</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Reader-Funded</span>
              </div>
              <div>
                <span className="block text-gold font-extrabold text-lg sm:text-2xl">Daily</span>
                <span className="text-text-mute uppercase text-[9px] sm:text-[10px] tracking-wider">Expert Insights</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Plan Section */}
        <section className="mx-auto max-w-6xl px-4 lg:px-6 py-16 sm:py-24">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold font-bold">
              Membership Privileges
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground mt-2">
              Select Your Access Tier
            </h2>

            {/* Interactive Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-card/80 border border-border p-1.5 rounded-full">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  billingCycle === "monthly" ? "bg-gold text-black font-extrabold shadow-md" : "text-text-mute hover:text-foreground"
                }`}
              >
                Monthly Billed
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === "yearly" ? "bg-gold text-black font-extrabold shadow-md" : "text-text-mute hover:text-foreground"
                }`}
              >
                Annual Billed
                <span className="bg-black/20 text-black text-[9px] px-2 py-0.5 rounded-full font-extrabold">
                  SAVE 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-stretch max-w-5xl mx-auto">
            
            {/* Monthly Card */}
            <div className="rounded-2xl border border-border bg-card/70 p-8 sm:p-10 flex flex-col justify-between hover:border-gold/40 transition-all shadow-xl backdrop-blur-sm">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-text-mute font-bold">
                    Flex Tier
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display font-black text-4xl sm:text-5xl text-foreground">
                    US$6.99
                  </span>
                  <span className="text-xs text-text-mute font-mono">/ month</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-text-body font-serif border-b border-border pb-6 leading-relaxed">
                  Full access to all premium articles, investigations, and briefings with complete monthly flexibility.
                </p>

                <div className="mt-6">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold mb-4">
                    Privileges Included:
                  </p>
                  <ul className="space-y-3.5">
                    {MONTHLY_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-xs sm:text-sm font-serif text-text-body">
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
                  className="w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-xl border border-gold/60 text-gold hover:bg-gold/10 transition-colors text-xs uppercase tracking-wider"
                >
                  Subscribe Monthly <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Annual Platinum Card */}
            <div 
              className="rounded-2xl border p-8 sm:p-10 flex flex-col justify-between relative shadow-2xl overflow-hidden"
              style={{ 
                background: "radial-gradient(ellipse at top left, #332200 0%, #1A1100 65%, #0A0A0A 100%)", 
                borderColor: "#F5A623" 
              }}
            >
              {/* Top Badge */}
              <div className="absolute top-5 right-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-gold text-black px-3.5 py-1 text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md">
                  <Zap className="w-3 h-3 fill-black" /> Preferred Choice
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold font-extrabold">
                    Annual Platinum Pass
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display font-black text-4xl sm:text-5xl text-gold">
                    US$69.99
                  </span>
                  <span className="text-xs text-text-mute font-mono">/ year</span>
                </div>

                <p className="mt-1 text-xs font-bold text-gold font-mono uppercase tracking-wider">
                  Equivalent to US$5.83 / month (Save 17%)
                </p>

                <div className="mt-6 border-b border-gold/20 pb-6">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gold font-bold mb-3">
                    Exclusive Annual Additions:
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
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gold/80 font-bold mb-4">
                    All Core Privileges Included:
                  </p>
                  <ul className="space-y-3">
                    {MONTHLY_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-xs sm:text-sm font-serif text-text-body">
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
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 font-black px-6 py-4 rounded-xl bg-gold text-black hover:bg-gold-hover transition-colors text-xs uppercase tracking-wider shadow-lg"
                >
                  Subscribe Annually <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Privileges Grid */}
        <section className="border-t border-border bg-card/40 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 lg:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
                Uncompromising Standards
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground mt-2">
                What Every Member Receives
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_INCLUDED.map((item) => (
                <div 
                  key={item} 
                  className="rounded-xl border border-border/80 bg-background/80 p-5 flex items-start gap-3.5 hover:border-gold/40 transition-colors shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-gold/10 text-gold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-xs sm:text-sm text-text-body leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* Credo / Mission Guarantee */}
            <div className="mt-16 rounded-2xl border border-gold/30 p-8 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
              style={{ 
                background: "radial-gradient(ellipse at center, #261A00 0%, #0A0A0A 100%)",
              }}
            >
              <Award className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="font-serif italic text-base sm:text-lg text-foreground font-medium leading-relaxed">
                "Trusted. Independent. Reader-funded. Because the world's most critical health stories deserve uncompromised journalism."
              </p>
              <p className="mt-3 text-xs font-mono text-gold font-bold uppercase tracking-widest">
                — Joseph Mmwa Media Group
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
