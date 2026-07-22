import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards & Policy — Joseph Mmwa" },
      { name: "description", content: "Our commitment to accuracy, independence, and verified global health journalism." },
    ],
  }),
  component: EditorialStandardsPage,
});

function EditorialStandardsPage() {
  return (
    <SiteLayout>
      <main className="mx-auto max-w-3xl px-4 lg:px-6 py-14 text-foreground">
        
        {/* Navigation Back */}
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-gold transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Return to Newsroom
        </Link>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
            Journalistic Policy
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground mb-6">
          Editorial Standards & Guidelines
        </h1>

        <p className="text-base text-text-mute font-serif leading-relaxed italic border-l-4 border-gold pl-4 mb-8">
          Joseph Mmwa Media Group is dedicated to rigorous, evidence-based reporting on global public health, clinical breakthroughs, and medical policy.
        </p>

        {/* Editorial Pillars */}
        <div className="space-y-6 font-sans text-sm sm:text-base leading-relaxed text-text-body">
          
          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-2">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" /> 1. Fact Verification & Sources
            </h2>
            <p className="text-text-mute text-sm">
              Every medical news dispatch undergoes verification against peer-reviewed clinical research journals, accredited health organizations (WHO, CDC), and direct statements from medical experts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-2">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" /> 2. Independence & Integrity
            </h2>
            <p className="text-text-mute text-sm">
              Our reporting is independent of pharmaceutical, commercial, or political influence. Sponsored analysis or premium dispatches are strictly labeled to preserve reader trust.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-2 border border-border space-y-2">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" /> 3. Transparent Corrections
            </h2>
            <p className="text-text-mute text-sm">
              If a factual oversight occurs, corrections are issued promptly and transparently at the bottom of the affected article with an explanatory note.
            </p>
          </div>

        </div>

      </main>
    </SiteLayout>
  );
}
