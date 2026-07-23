import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Newspaper, Search, Globe, Stethoscope, Filter, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const meta = resolveCategoryMeta(params.slug);
    const title = `${meta.name} — JOSEPH MMWA`;
    const description = meta.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

interface CategoryDetails {
  name: string;
  description: string;
  defaultBanner: string;
  groupType: "diseases" | "continents" | "standard";
}

const CATEGORY_META: Record<string, CategoryDetails> = {
  "artificial-intelligence": {
    name: "Artificial Intelligence",
    description: "Neural diagnostic models, machine learning in clinical medicine, surgical robotics, and predictive health.",
    defaultBanner: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "treatments-innovation": {
    name: "Treatments and Innovations",
    description: "Breakthrough pharmaceuticals, precision medicine, gene editing, and clinical therapies.",
    defaultBanner: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "disease-outbreaks": {
    name: "Disease Outbreaks",
    description: "Real-time surveillance, outbreak investigations, viral mutations, and emergency field responses.",
    defaultBanner: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000&q=90",
    groupType: "continents",
  },
  "vaccines-immunization": {
    name: "Vaccines and Immunization",
    description: "Vaccine trial results, mRNA platforms, global distribution channels, and immunization policy.",
    defaultBanner: "https://images.unsplash.com/photo-1618961734760-466979ce35b0?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "medical-research": {
    name: "Medical Research",
    description: "Peer-reviewed scientific findings, randomized clinical trial results, and journal dispatches.",
    defaultBanner: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "public-health": {
    name: "Public Health",
    description: "International health regulations, health infrastructure, environmental risks, and preventive care.",
    defaultBanner: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    groupType: "continents",
  },
  "general-news": {
    name: "General News",
    description: "Breaking global health updates, medical announcements, press briefings, and newsroom alerts.",
    defaultBanner: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
  "healthcare": {
    name: "Healthcare",
    description: "Hospital management, telemedicine, health economics, insurance, and workforce reporting.",
    defaultBanner: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
  "explainers": {
    name: "Explainers",
    description: "Clear, evidence-backed breakdowns simplifying complex medical research and physiological concepts.",
    defaultBanner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
};

// 🛡️ Bulletproof resolver: Decodes URI strings (%20, dashes, spaces) so NO category ever 404s
function resolveCategoryMeta(rawSlug: string): CategoryDetails {
  const decoded = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  const hyphenated = decoded.replace(/\s+/g, "-");
  
  if (CATEGORY_META[hyphenated]) {
    return CATEGORY_META[hyphenated];
  }

  const directMatch = Object.values(CATEGORY_META).find(
    (item) => item.name.toLowerCase() === decoded.replace(/-/g, " ")
  );

  if (directMatch) return directMatch;

  // Dynamic fallback name generator for any category name
  const formattedName = decoded
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    name: formattedName,
    description: `Verified dispatches and expert analysis under ${formattedName}.`,
    defaultBanner: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  };
}

function getDiseaseGroup(text: string): string {
  const content = text.toLowerCase();
  if (content.match(/cancer|tumor|oncology|chemo|leukemia|lymphoma|carcinoma|melanoma/)) return "Cancer";
  if (content.match(/hiv|aids|virus|viral|covid|mpox|influenza|ebola|hepatitis|tb|tuberculosis|malaria|dengue/)) return "HIV & Viral Infections";
  if (content.match(/diabetes|insulin|metabolism|kidney|renal|pancreas|thyroid/)) return "Diabetes & Metabolism";
  if (content.match(/heart|cardio|stroke|vascular|hypertension|cardiac|artery/)) return "Heart & Cardiovascular";
  if (content.match(/brain|neuro|alzheimer|parkinson|dementia|epilepsy|spinal/)) return "Brain & Neurological";
  if (content.match(/gene|crispr|dna|rna|biotech|genomic|mrna/)) return "Genetics & Gene Therapy";
  if (content.match(/immune|autoimmune|lupus|arthritis|allergy|inflammation/)) return "Immune Disorders";
  return "General Innovations";
}

function getContinentGroup(text: string): string {
  const content = text.toLowerCase();
  if (content.match(/africa|kenya|uganda|nigeria|congo|drc|rwanda|south africa|ethiopia|ghana/)) return "Africa";
  if (content.match(/asia|china|india|japan|vietnam|indonesia|thailand|korea/)) return "Asia & Pacific";
  if (content.match(/europe|uk|britain|germany|france|italy|spain/)) return "Europe";
  if (content.match(/america|usa|united states|canada|brazil|mexico/)) return "Americas";
  return "Global";
}

export function CategoryPage() {
  const { slug } = Route.useParams();
  const meta = resolveCategoryMeta(slug);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["category-articles", meta.name],
    staleTime: 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,category,featured_image,body")
        .eq("is_published", true)
        .ilike("category", `%${meta.name}%`)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Category fetch error:", error);
        return [];
      }

      return data ?? [];
    },
  });

  // 🖼️ Dynamic Header Image: Uses the featured image of the newest article in this category
  const activeHeaderImage = articles?.[0]?.featured_image || meta.defaultBanner;

  const filteredArticles = (articles || []).filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.body?.toLowerCase().includes(q)
    );
  });

  const groupedArticles = (() => {
    if (filteredArticles.length === 0) return {};

    const groups: Record<string, typeof filteredArticles> = {};

    if (meta.groupType === "continents") {
      filteredArticles.forEach((art) => {
        const fullText = `${art.title} ${art.excerpt || ""} ${art.body || ""}`;
        const group = getContinentGroup(fullText);
        if (!groups[group]) groups[group] = [];
        groups[group].push(art);
      });
    } else if (meta.groupType === "diseases") {
      filteredArticles.forEach((art) => {
        const fullText = `${art.title} ${art.excerpt || ""} ${art.body || ""}`;
        const group = getDiseaseGroup(fullText);
        if (!groups[group]) groups[group] = [];
        groups[group].push(art);
      });
    } else {
      groups["Latest Dispatches"] = filteredArticles;
    }

    return groups;
  })();

  const count = filteredArticles.length;

  return (
    <SiteLayout>
      {/* 🖼️ DYNAMIC CATEGORY BANNER HEADER */}
      <div className="relative w-full min-h-[360px] lg:min-h-[420px] flex items-end overflow-hidden border-b border-border bg-black">
        <img
          src={activeHeaderImage}
          alt={meta.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 filter brightness-90 contrast-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 pb-10 pt-24 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Topic Desk
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl">
            {meta.name}
          </h1>

          <p className="mt-3 max-w-3xl font-serif text-base sm:text-lg text-neutral-300 leading-relaxed">
            {meta.description}
          </p>

          <div className="mt-6 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gold absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search dispatches in ${meta.name}...`}
                className="w-full bg-surface-1/90 border border-gold/30 rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-text-mute focus:outline-none focus:border-gold backdrop-blur-md shadow-lg font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-mono text-text-mute hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
        {count === 0 && !isLoading ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-xl mx-auto shadow-2xl">
            <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/20 mb-4">
              <Newspaper className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              {searchQuery ? "No matching dispatches found" : `No articles in ${meta.name} yet`}
            </h3>
            <p className="mt-2 text-text-mute font-serif text-xs leading-relaxed">
              {searchQuery
                ? `Try searching for different keywords or clear the search filter.`
                : `Articles published under "${meta.name}" will automatically appear here.`}
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {Object.entries(groupedArticles).map(([groupTitle, groupArticles]) => (
              <div key={groupTitle} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/80 pb-3">
                  {meta.groupType === "continents" ? (
                    <Globe className="w-5 h-5 text-gold" />
                  ) : meta.groupType === "diseases" ? (
                    <Stethoscope className="w-5 h-5 text-gold" />
                  ) : (
                    <Filter className="w-5 h-5 text-gold" />
                  )}
                  <h2 className="font-display font-bold text-2xl text-foreground tracking-tight">
                    {groupTitle}
                  </h2>
                  <span className="text-xs font-mono text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20 ml-auto font-bold">
                    {groupArticles.length} {groupArticles.length === 1 ? "article" : "articles"}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupArticles.map((a) => (
                    <Link
                      key={a.id}
                      to="/news/$slug"
                      params={{ slug: a.slug }}
                      className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-surface-1 relative overflow-hidden border-b border-border">
                          {a.featured_image ? (
                            <img
                              src={a.featured_image}
                              alt={a.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
                              Joseph Mmwa Media Group
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2 py-0.5 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
                            {a.category || meta.name}
                          </span>
                          <h3 className="font-display font-bold text-lg leading-snug text-foreground group-hover:text-gold transition-colors">
                            {a.title}
                          </h3>
                          {a.excerpt && (
                            <p className="mt-2.5 text-xs text-text-mute font-serif line-clamp-3 leading-relaxed">
                              {a.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-6 pb-5 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-text-mute font-mono">
                        {a.published_at ? (
                          <span>
                            {new Date(a.published_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="flex items-center gap-1 text-gold font-bold">
                          <Clock className="w-3.5 h-3.5" /> {a.read_time_minutes || 3} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
