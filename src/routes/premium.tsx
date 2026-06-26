import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — JOSEPH MMWA" },
      { name: "description", content: "Unlock premium global health and medical reporting from Joseph Mmwa." },
      { property: "og:title", content: "Premium — JOSEPH MMWA" },
      { property: "og:description", content: "In-depth analysis, early access, ad-free reading." },
    ],
  }),
  component: PremiumPage,
});

const BENEFITS = [
  "Exclusive in-depth outbreak analysis",
  "Early access to major health stories before public release",
  "Premium investigative reporting and long-form features",
  "Video updates and explainers",
  "Ad-free reading experience",
  "Direct access to The Mmwa Briefing newsletter",
];

const TIERS = [
  {
    name: "Monthly",
    price: "$9",
    period: "/ month",
    cta: "Subscribe Monthly",
    note: "Cancel anytime",
  },
  {
    name: "Annual",
    price: "$72",
    period: "/ year",
    cta: "Subscribe Annually",
    note: "Save 33% — best value",
    highlight: true,
  },
];

function PremiumPage() {
  return (
    <SiteLayout>
      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-premium)" }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
          <span className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Members Only
          </span>
          <h1 className="mt-6 font-display font-extrabold text-5xl sm:text-6xl">
            Unlock <span className="text-gold">Premium</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-text-body font-serif">
            The medical and global health reporting that shapes how the world
            understands disease, treatment, and care — without ads, without delay.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-16">
        <h2 className="font-display font-bold text-3xl">What's included</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3 bg-card border border-border rounded-lg p-5">
              <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
              <span className="font-serif text-text-body">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center">Choose your plan</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-8 ${
                t.highlight
                  ? "border-gold bg-gold/5 shadow-[var(--shadow-gold)]"
                  : "border-border bg-card"
              }`}
            >
              <p className="label-eyebrow">{t.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display font-bold text-5xl">{t.price}</span>
                <span className="text-text-mute">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-text-mute">{t.note}</p>
              <Link
                to="/auth"
                className={`mt-8 w-full inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-md ${
                  t.highlight
                    ? "bg-gold text-primary-foreground hover:bg-gold-hover"
                    : "border border-gold text-gold hover:bg-gold/10"
                }`}
              >
                {t.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
