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
  bannerImage: string;
  groupType: "diseases" | "continents" | "standard";
}

const CATEGORY_META: Record<string, CategoryDetails> = {
  "disease-outbreaks": {
    name: "Disease Outbreaks",
    description: "Authoritative reporting on outbreaks, epidemics, pandemics, and emerging infectious diseases—tracking threats, science, and public health responses.",
    bannerImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000&q=90",
    groupType: "continents",
  },
  "vaccines-immunization": {
    name: "Vaccines and Immunization",
    description: "Vaccine research, approvals, immunization programmes, vaccination campaigns, vaccine policy, vaccine safety, immunology, and global vaccination initiatives.",
    bannerImage: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "medical-research": {
    name: "Medical Research",
    description: "Peer-reviewed studies, clinical trials, scientific discoveries, laboratory research, academic publications, biomedical science, and evidence-based medical findings.",
    bannerImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "treatments-innovation": {
    name: "Treatments and Innovations",
    description: "New medicines, breakthrough therapies, biotechnology, gene therapy, precision medicine, medical devices, diagnostics, and healthcare innovation.",
    bannerImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "artificial-intelligence": {
    name: "Artificial Intelligence in Healthcare",
    description: "As artificial intelligence transforms healthcare at unprecedented speed, we bring you trusted reporting on breakthrough innovations, emerging trends, telemedicine, and surgical robotics.",
    bannerImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "ai-in-healthcare": {
    name: "Artificial Intelligence in Healthcare",
    description: "As artificial intelligence transforms healthcare at unprecedented speed, we bring you trusted reporting on breakthrough innovations, emerging trends, telemedicine, and surgical robotics.",
    bannerImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=90",
    groupType: "diseases",
  },
  "public-health": {
    name: "Public Health",
    description: "Global health policy, healthcare systems, disease prevention, environmental health, One Health, mental health, health education, health campaigns, humanitarian health, and international public health initiatives.",
    bannerImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    groupType: "continents",
  },
  "healthcare": {
    name: "Healthcare and Explainers",
    description: "Hospitals, healthcare delivery, pharmaceuticals, digital health, telemedicine, healthcare regulation, healthcare workforce, insurance, medical infrastructure, and health industry developments.",
    bannerImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
  "explainers": {
    name: "Healthcare and Explainers",
    description: "Clear, evidence-based articles that simplify complex medical topics, research findings, health myths, medical terminology, and important health issues for everyday readers.",
    bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
  "general-news": {
    name: "General News",
    description: "Timely, comprehensive coverage of major global developments, healthcare headlines, policy updates, and pressing news stories shaping public health worldwide.",
    bannerImage: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  },
};

function resolveCategoryMeta(rawSlug: string): CategoryDetails {
  const decoded = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  const hyphenated = decoded.replace(/\s+/g, "-");

  if (hyphenated.includes("ai") || hyphenated.includes("artificial-intelligence") || hyphenated.includes("ai-in-healthcare")) {
    return CATEGORY_META["artificial-intelligence"];
  }

  if (hyphenated.includes("outbreak") || hyphenated.includes("disease-outbreaks")) {
    return CATEGORY_META["disease-outbreaks"];
  }

  if (CATEGORY_META[hyphenated]) {
    return CATEGORY_META[hyphenated];
  }

  const directMatch = Object.values(CATEGORY_META).find(
    (item) => item.name.toLowerCase() === decoded.replace(/-/g, " ")
  );

  if (directMatch) return directMatch;

  const formattedName = decoded
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    name: formattedName,
    description: `Reporting and verified dispatches under ${formattedName}.`,
    bannerImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=2000&q=90",
    groupType: "standard",
  };
}

function getDiseaseGroup(text: string): string {
  const content = text.toLowerCase();
  if (content.match(/\b(cancer|tumor|oncology|chemo|leukemia|lymphoma|carcinoma|melanoma)\b/)) return "Cancer & Oncology";
  if (content.match(/\b(hiv|aids|virus|viral|covid|mpox|influenza|ebola|hepatitis|tb|tuberculosis|malaria|dengue)\b/)) return "Virology & Infectious Diseases";
  if (content.match(/\b(diabetes|insulin|metabolism|kidney|renal|pancreas|thyroid)\b/)) return "Metabolic & Renal Health";
  if (content.match(/\b(heart|cardio|stroke|vascular|hypertension|cardiac|artery)\b/)) return "Cardiovascular Health";
  if (content.match(/\b(brain|neuro|alzheimer|parkinson|dementia|epilepsy|spinal)\b/)) return "Neurology & Brain Sciences";
  if (content.match(/\b(gene|crispr|dna|rna|biotech|genomic|mrna)\b/)) return "Genetics & Bio-Technology";
  if (content.match(/\b(immune|autoimmune|lupus|arthritis|allergy|inflammation)\b/)) return "Immunology Disorders";
  return "General Innovations";
}

function getContinentGroup(text: string): string {
  const content = text.toLowerCase();

  if (
    content.match(/\b(who|world health organization|un|united nations|geneva|global|international|multilateral|worldwide|pandemic agreement|pandemic treaty|global health|world)\b/)
  ) {
    return "Global / World News";
  }

  if (content.match(/\b(africa|kenya|uganda|nigeria|congo|drc|rwanda|south africa|ethiopia|ghana|tanzania|zambia|egypt|morocco|senegal)\b/)) {
    return "Africa";
  }
  if (content.match(/\b(united states|usa|us|canada|brazil|mexico|colombia|argentina|caribbean|latin america|americas)\b/)) {
    return "Americas";
  }
  if (content.match(/\b(asia|china|india|japan|vietnam|indonesia|thailand|korea|singapore|malaysia|pakistan|philippines)\b/)) {
    return "Asia";
  }
  if (content.match(/\b(europe|uk|britain|germany|france|italy|spain|switzerland|poland|netherlands)\b/)) {
    return "Europe";
  }
  if (content.match(/\b(australia|new zealand|fiji|oceania|pacific|papua new guinea)\b/)) {
    return "Oceania";
  }

  return "Global / World News";
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
      const orderedKeys = ["Global / World News", "Africa", "Americas", "Asia", "Europe", "Oceania"];
      
      orderedKeys.forEach((key) => {
        groups[key] = [];
      });

      filteredArticles.forEach((art) => {
        const fullText = `${art.title} ${art.excerpt || ""} ${art.body || ""}`;
        const group = getContinentGroup(fullText);
        if (!groups[group]) groups[group] = [];
        groups[group].push(art);
      });

      Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) {
          delete groups[key];
        }
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
      {/* 🖼️ Topic Banner */}
      <div className="relative w-full min-h-[380px] lg:min-h-[460px] flex items-end overflow-hidden border-b border-border bg-slate-950">
        <img
          src={meta.bannerImage}
          alt={meta.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 filter brightness-95 contrast-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6 pb-12 pt-28 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Topic Desk
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {meta.name}
          </h1>

          <p className="mt-4 max-w-3xl font-serif text-base sm:text-lg text-neutral-200 leading-relaxed drop-shadow">
            {meta.description}
          </p>

          <div className="mt-7 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gold absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search dispatches in ${meta.name}...`}
                className="w-full bg-surface-1/90 border border-gold/30 rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-text-mute focus:outline-none focus:border-gold backdrop-blur-md shadow-lg font-sans transition-all"
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
