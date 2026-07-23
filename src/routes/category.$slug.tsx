import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Health Topics & Categories — JOSEPH MMWA" },
      { name: "description", content: "Explore verified global health journalism, clinical medical breakthroughs, AI healthcare, disease surveillance, and public health updates." },
    ],
  }),
  component: CategoriesIndexPage,
});

interface CategoryCard {
  slug: string;
  name: string;
  description: string;
  image: string;
}

const CATEGORIES_LIST: CategoryCard[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence in Healthcare",
    description: "Coverage of artificial intelligence in medicine, machine learning diagnostics, neural networks, predictive medical modeling, surgical robotics, and digital health technology.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "general-news",
    name: "General News",
    description: "General health dispatches, medical updates, press briefings, global health announcements, and breaking news across the healthcare sector.",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "disease-outbreaks",
    name: "Disease Outbreaks",
    description: "Authoritative reporting on outbreaks, epidemics, pandemics, and emerging infectious diseases—tracking threats, science, and public health responses.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "vaccines-immunization",
    name: "Vaccines and Immunization",
    description: "Vaccine research, approvals, immunization programmes, vaccination campaigns, vaccine policy, vaccine safety, immunology, and global vaccination initiatives.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "medical-research",
    name: "Medical Research",
    description: "Peer-reviewed studies, clinical trials, scientific discoveries, laboratory research, academic publications, biomedical science, and evidence-based findings.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "treatments-innovation",
    name: "Treatments and Innovations",
    description: "New medicines, breakthrough therapies, biotechnology, gene therapy, precision medicine, medical devices, diagnostics, and healthcare innovation.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "public-health",
    name: "Public Health",
    description: "Global health policy, healthcare systems, disease prevention, environmental health, One Health, health education, and international initiatives.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=90",
  },
  {
    slug: "healthcare",
    name: "Healthcare and Explainers",
    description: "Hospitals, healthcare delivery, pharmaceuticals, digital health, telemedicine, regulations, workforce, and clear breakdowns simplifying medical topics.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=90",
  },
];

export function CategoriesIndexPage() {
  // Query article counts per category dynamically
  const { data: categoryCounts } = useQuery({
    queryKey: ["all-category-counts"],
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("category")
        .eq("is_published", true);

      if (error) {
        console.error("Error fetching category counts:", error);
        return {};
      }

      const counts: Record<string, number> = {};
      data?.forEach((item) => {
        if (item.category) {
          const cat = item.category.trim();
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
      return counts;
    },
  });

  return (
    <SiteLayout>
      {/* HERO SECTION */}
      <section className="relative w-full bg-slate-950 border-b border-border py-16 sm:py-24 px-4 lg:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Newsroom Intelligence
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Explore Health Desks
          </h1>
          <p className="mt-4 max-w-2xl mx-auto font-serif text-base sm:text-lg text-neutral-300 leading-relaxed">
            Verified dispatches, clinical trial breakdowns, and global health journalism organized by specialized medical beats.
          </p>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES_LIST.map((cat) => {
            const count = categoryCounts?.[cat.name] || 0;

            return (
              <Link
                key={cat.slug}
                to="/category/$slug"
                params={{ slug: cat.slug }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-gold/50 transition-all duration-300 shadow-xl cursor-pointer min-h-[380px]"
              >
                {/* Background Image with Dark Vignette */}
                <div className="absolute inset-0 bg-slate-950">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700 filter brightness-90 contrast-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 p-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold bg-gold/15 border border-gold/30 px-3 py-1 rounded-full backdrop-blur-md">
                    TOPIC
                  </span>
                  {count > 0 && (
                    <span className="text-xs font-mono text-neutral-300 bg-black/60 px-2.5 py-1 rounded-full border border-border/50 backdrop-blur-md font-semibold">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  )}
                </div>

                {/* Bottom Text Content */}
                <div className="relative z-10 p-6 pt-0">
                  <h2 className="font-display font-black text-2xl text-white group-hover:text-gold transition-colors leading-tight">
                    {cat.name}
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm font-serif text-neutral-300 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-gold group-hover:translate-x-1.5 transition-transform duration-300">
                    <span>Explore Topic</span>
                    <ArrowRight className="w-4 h-4" />
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
