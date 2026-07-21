import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — JOSEPH MMWA MEDIA GROUP" },
      { name: "description", content: "Browse verified health and medical reporting by topic from Joseph Mmwa Media Group." },
      { property: "og:title", content: "Categories — JOSEPH MMWA MEDIA GROUP" },
      { property: "og:description", content: "All global health topics covered by Joseph Mmwa Media Group." },
    ],
  }),
  component: CategoriesPage,
});

// ============================================================================
// 🖼️ CATEGORY IMAGES — REPLACE OR UPDATE YOUR CATEGORY IMAGE URLS HERE EASY!
// ============================================================================
const CATEGORY_IMAGES: Record<string, string> = {
  "disease-outbreaks": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800",
  "vaccines-immunization": "https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&q=80&w=800",
  "medical-research": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800",
  "treatments-innovation": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  "public-health": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
  "healthcare": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
  "explainers": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
};

// Fallback image if a category isn't in the list
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800";

// Updated category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "disease-outbreaks": "Authoritative reporting on outbreaks, epidemics, pandemics, and emerging infectious diseases—tracking the threats, science, and public health responses shaping lives around the world.",
  "vaccines-immunization": "Comprehensive coverage of vaccine research, approvals, safety, immunization policies, and the scientific breakthroughs protecting millions from preventable diseases.",
  "medical-research": "The latest peer-reviewed discoveries, clinical trials, and scientific breakthroughs driving the future of medicine, healthcare, and life-saving innovation.",
  "treatments-innovation": "Breaking news and expert reporting on breakthrough therapies, new medicines, biotechnology, precision medicine, artificial intelligence, and the innovations transforming patient care.",
  "public-health": "In-depth coverage of global health policy, disease prevention, environmental health, emergency preparedness, and the public health decisions that affect billions of people.",
  "healthcare": "Reporting on hospitals, healthcare systems, pharmaceuticals, digital health, regulation, workforce challenges, and the policies shaping access to quality care worldwide.",
  "explainers": "Clear, evidence-based journalism that breaks down complex diseases, medical research, health policies, and scientific discoveries into reporting everyone can understand.",
};

function CategoriesPage() {
  const { data } = useQuery({
    queryKey: ["categories", "with-images"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, slug, description, featured_image, image_url")
        .order("sort_order");
      return cats ?? [];
    },
  });

  return (
    <SiteLayout>
      {/* Header Banner */}
      <section 
        className="border-b border-border py-16 relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at top center, #2e1e00 0%, #171000 45%, #0a0a0a 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <span 
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-4"
            style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Topic Hubs
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground tracking-tight">
            Explore By <span className="text-gold">Category</span>
          </h1>
          <p className="mt-4 text-lg text-text-body font-serif max-w-2xl leading-relaxed">
            Every story published by the Joseph Mmwa Media Group global health desk, organized by topic.
          </p>
        </div>
      </section>

      {/* Grid of Categories */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data ?? []).map((c: any) => {
            // Priority Check: 
            // 1. Database featured_image / image_url (if set in Supabase)
            // 2. CATEGORY_IMAGES map (for easy manual editing)
            // 3. DEFAULT_IMAGE fallback
            const categoryImage = 
              c.featured_image || 
              c.image_url || 
              CATEGORY_IMAGES[c.slug] || 
              DEFAULT_IMAGE;

            const descriptionText = CATEGORY_DESCRIPTIONS[c.slug] || c.description;

            return (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(245,166,35,0.2)] flex flex-col justify-between min-h-[360px]"
              >
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={categoryImage}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Dark Gradient Overlay for High Text Readability */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                    style={{
                      background: "linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.85) 50%, rgba(10,10,10,0.4) 100%)",
                    }}
                  />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 p-6 flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold font-bold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30">
                    Topic
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="relative z-10 p-6 pt-0 mt-auto">
                  <h2 className="font-display font-extrabold text-2xl text-foreground group-hover:text-gold transition-colors">
                    {c.name}
                  </h2>

                  {descriptionText && (
                    <p className="mt-3 text-xs text-text-body font-serif leading-relaxed line-clamp-3">
                      {descriptionText}
                    </p>
                  )}

                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-mono font-semibold text-gold group-hover:translate-x-1 transition-transform">
                    <span>Explore Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
