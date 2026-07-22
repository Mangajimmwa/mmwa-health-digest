import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards & Guidelines — Joseph Mmwa Media Group" },
      {
        name: "description",
        content:
          "Joseph Mmwa Media Group is committed to delivering trusted, evidence-based health journalism through accuracy, integrity, and scientific evidence.",
      },
    ],
  }),
  component: EditorialStandardsPage,
});

const STANDARDS = [
  {
    num: "01",
    title: "Fact Verification & Sources",
    text: "Every story undergoes a rigorous editorial review before publication. We rely on peer-reviewed medical research, official public health agencies, reputable academic institutions, and qualified medical experts to ensure information is accurate, current, and responsibly presented.",
  },
  {
    num: "02",
    title: "Scientific Integrity",
    text: "Health and medical reporting must be grounded in credible scientific evidence. We distinguish established scientific consensus from emerging research and clearly communicate uncertainty where evidence is still evolving.",
  },
  {
    num: "03",
    title: "Editorial Independence",
    text: "Our editorial decisions are made independently and are never influenced by advertisers, sponsors, political interests, or commercial partnerships. Our first responsibility is always to our readers.",
  },
  {
    num: "04",
    title: "Fairness & Balance",
    text: "We strive to present health stories with context, accuracy, and impartiality. When reporting on medical debates or public health issues, we fairly represent credible evidence and relevant expert perspectives.",
  },
  {
    num: "05",
    title: "Transparency",
    text: "We identify the sources of our information whenever possible and clearly distinguish verified facts from analysis, commentary, or opinion. Sponsored or promotional content is always clearly labeled.",
  },
  {
    num: "06",
    title: "Corrections & Updates",
    text: "Accuracy is an ongoing commitment. If an error is identified, we promptly investigate, correct the information, and update the article to reflect the most accurate and current evidence available.",
  },
  {
    num: "07",
    title: "Responsible Health Reporting",
    text: "Medical reporting can influence important personal decisions. We avoid sensationalism, misleading headlines, exaggerated claims, and unsupported health advice. Our reporting prioritizes clarity, context, and responsible communication.",
  },
  {
    num: "08",
    title: "Medical Disclaimer",
    text: "Joseph Mmwa Media Group provides news and educational content only. Our reporting is not intended to diagnose, treat, cure, or prevent any medical condition and should not replace professional medical advice. Readers should always consult qualified healthcare professionals regarding personal health decisions.",
  },
  {
    num: "09",
    title: "Reader Trust & Accountability",
    text: "Trust is the foundation of our newsroom. We welcome constructive feedback, encourage readers to report potential errors, and remain committed to continuous improvement, transparency, and the highest standards of public-interest journalism.",
  },
];

function EditorialStandardsPage() {
  return (
    <SiteLayout>
      <main className="mx-auto max-w-3xl px-4 lg:px-6 py-12 text-foreground">
        
        {/* Navigation Link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-mute hover:text-gold transition-colors mb-10 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gold" />
          <span>Return to Newsroom</span>
        </Link>

        {/* Headline */}
        <h1 className="font-display font-black text-3xl sm:text-5xl text-foreground tracking-tight leading-tight mb-8">
          Editorial Standards &amp; Guidelines
        </h1>

        {/* Lead Quote Banner */}
        <div 
          className="rounded-2xl p-6 sm:p-8 border relative overflow-hidden mb-8 shadow-xl"
          style={{
            background: "radial-gradient(ellipse at top left, #281C02 0%, #120D02 55%, #080808 100%)",
            borderColor: "rgba(245, 166, 35, 0.3)"
          }}
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
          <p className="text-base sm:text-lg font-serif italic text-foreground leading-relaxed pl-2">
            Joseph Mmwa Media Group is committed to upholding the highest standards of health journalism. Our editorial principles ensure every report is produced with accuracy, fairness, scientific integrity, and respect for our readers.
          </p>
        </div>

        {/* Intro Body */}
        <div className="p-6 rounded-2xl bg-surface-2/60 border border-border/80 mb-10 backdrop-blur-sm shadow-sm">
          <p className="text-sm sm:text-base text-text-body font-sans leading-relaxed">
            Joseph Mmwa Media Group is committed to delivering trusted, evidence-based health journalism that informs, empowers, and serves the public interest. These Editorial Standards outline the principles that guide every stage of our reporting—from story selection and fact verification to publication, corrections, and accountability. Our mission is to ensure readers can rely on every report for accuracy, fairness, and scientific integrity.
          </p>
        </div>

        {/* Standards Cards */}
        <div className="space-y-4">
          {STANDARDS.map((item) => (
            <div
              key={item.num}
              className="group p-6 rounded-2xl bg-surface-1 border border-border hover:border-gold/40 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/20 shrink-0 font-mono text-xs font-bold">
                    {item.num}
                  </div>
                  <h2 className="text-base sm:text-lg font-display font-bold text-foreground group-hover:text-gold transition-colors">
                    {item.title}
                  </h2>
                </div>
                <CheckCircle2 className="w-5 h-5 text-gold/60 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="text-xs sm:text-sm text-text-mute font-sans leading-relaxed pt-2 pl-11">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial Promise Card */}
        <div 
          className="mt-14 rounded-2xl p-8 sm:p-10 border text-center space-y-4 relative overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at top, #3A2600 0%, #181001 60%, #070707 100%)",
            borderColor: "rgba(245, 166, 35, 0.4)",
            boxShadow: "0 15px 35px -10px rgba(245, 166, 35, 0.2)"
          }}
        >
          <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center border border-gold/30 mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gold font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Editorial Promise</span>
          </div>

          <p className="text-base sm:text-lg font-serif italic text-foreground max-w-xl mx-auto leading-relaxed">
            Every story published by Joseph Mmwa Media Group is guided by one principle: deliver accurate, evidence-based health journalism that readers can trust—today and in the future.
          </p>
        </div>

      </main>
    </SiteLayout>
  );
}
