import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, Search, Newspaper, TrendingUp, Sparkles, Eye } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — JOSEPH MMWA" },
      { name: "description", content: "All the latest medical and global health news, reported by Joseph Mmwa." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Synchronized with all 9 newsroom categories
  const categories = [
    "Artificial Intelligence in Healthcare",
    "General News",
    "Disease Outbreaks",
    "Vaccines and Immunization",
    "Medical Research",
    "Treatment and Innovations",
    "Public Health",
    "Healthcare",
    "Explainers",
  ];

  const { data: articles = [] } = useQuery({
    queryKey: ["articles", "all-feed-v5"],
    queryFn: async () => {
      // Safe SELECT query that won't break if 'views' is missing
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Fetch articles error:", error);
        return [];
      }

      return data ?? [];
    },
  });

  // 1️⃣ LATEST SECTION: Top 3 newest articles
  const latestArticles = articles.slice(0, 3);

  // 2️⃣ MOST READ SECTION: Sorted by views if available, else recent fallback
  const mostReadArticles = [...articles]
    .sort((a, b) => ((b.views || 0) - (a.views || 0)))
    .slice(0, 4);

  // 3️⃣ FILTERED MAIN FEED
  const filtered = articles.filter((a) => {
    const matchesSearch = q ? a.title?.toLowerCase().includes(q.toLowerCase()) : true;

    const matchesCategory = selectedCategory
      ? a.category?.toLowerCase().trim().includes(selectedCategory.toLowerCase().trim()) ||
        selectedCategory.toLowerCase().trim().includes(a.category?.toLowerCase().trim() || "")
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Newsroom</p>
        <h1 className="mt-2 font-display font-bold text-4xl sm:text-5xl">Latest health & medical news</h1>

        {/* ------------------------------------------------------------------- */}
        {/* 🔥 HERO SECTION: LATEST DISPATCHES & MOST READ SIDEBAR */}
        {/* ------------------------------------------------------------------- */}
        {!selectedCategory && !q && articles.length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-12 border-b border-border pb-14">
            {/* LATEST SECTION (Left 8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 text-gold font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Latest Dispatches</span>
              </div>

              {/* Featured Main Story */}
              {latestArticles[0] && (
                <Link
                  to="/news/$slug"
                  params={{ slug: latestArticles[0].slug }}
                  className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300 shadow-xl"
                >
                  <div className="aspect-[16/9] w-full bg-surface-1 relative overflow-hidden border-b border-border">
                    {latestArticles[0].featured_image ? (
                      <img
                        src={latestArticles[0].featured_image}
                        alt={latestArticles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
                        Mmwa Health Digest
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-gold text-slate-950 font-mono text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      LATEST STORY
                    </span>
                  </div>

                  <div className="p-6 sm:p-8">
                    <span className="label-eyebrow">{latestArticles[0].category || "News"}</span>
                    <h2 className="mt-2 font-display font-bold text-2xl sm:text-3xl leading-snug group-hover:text-gold transition-colors">
                      {latestArticles[0].title}
                    </h2>
                    {latestArticles[0].excerpt && (
                      <p className="mt-3 text-sm text-text-body font-serif line-clamp-3 leading-relaxed">
                        {latestArticles[0].excerpt}
                      </p>
                    )}
                    <div className="mt-6 flex items-center gap-4 text-xs text-text-mute font-mono">
                      <span>
                        {latestArticles[0].published_at &&
                          new Date(latestArticles[0].published_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" /> {latestArticles[0].read_time_minutes || 3} min read
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Secondary Latest Grid */}
              {latestArticles.length > 1 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {latestArticles.slice(1, 3).map((a) => (
                    <Link
                      key={a.id}
                      to="/news/$slug"
                      params={{ slug: a.slug }}
                      className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300"
                    >
                      <div className="aspect-[16/10] w-full bg-surface-1 relative overflow-hidden border-b border-border">
                        {a.featured_image ? (
                          <img
                            src={a.featured_image}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
                            Mmwa Health Digest
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="label-eyebrow">{a.category || "News"}</span>
                        <h3 className="mt-2 font-display font-bold text-lg leading-snug group-hover:text-gold transition-colors line-clamp-2">
                          {a.title}
                        </h3>
                        <div className="mt-4 flex items-center gap-3 text-xs text-text-mute font-mono">
                          <span>
                            {a.published_at &&
                              new Date(a.published_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold" /> {a.read_time_minutes || 3} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* MOST READ SIDEBAR (Right 4 Cols) */}
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 h-fit space-y-6">
              <div className="flex items-center gap-2 text-gold font-mono text-xs font-bold uppercase tracking-widest border-b border-border pb-4">
                <TrendingUp className="w-4 h-4" />
                <span>Most Read</span>
              </div>

              <div className="space-y-6 divide-y divide-border/60">
                {mostReadArticles.map((item, idx) => (
                  <Link
                    key={item.id}
                    to="/news/$slug"
                    params={{ slug: item.slug }}
                    className="group flex gap-4 pt-4 first:pt-0 items-start"
                  >
                    <span className="font-display font-black text-3xl text-gold/40 group-hover:text-gold transition-colors leading-none">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-text-mute uppercase tracking-wider block">
                        {item.category || "General"}
                      </span>
                      <h4 className="font-display font-bold text-sm leading-snug group-hover:text-gold transition-colors text-foreground line-clamp-2">
                        {item.title}
                      </h4>
                      {item.views !== undefined && item.views > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-text-mute pt-1">
                          <Eye className="w-3 h-3 text-gold" /> {item.views.toLocaleString()} reads
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* 🏷️ CATEGORY FILTER PILLS & SEARCH BAR */}
        {/* ------------------------------------------------------------------- */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors ${
              !selectedCategory
                ? "bg-gold text-primary-foreground font-bold shadow-md"
                : "bg-surface-2 border border-border text-text-mute hover:text-foreground"
            }`}
          >
            All Stories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors ${
                selectedCategory === cat
                  ? "bg-gold text-primary-foreground font-bold shadow-md"
                  : "bg-surface-2 border border-border text-text-mute hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stories"
              className="w-full bg-surface-1 border border-border rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* 📰 MAIN ARTICLES FEED GRID */}
        {/* ------------------------------------------------------------------- */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((a) => (
              <Link
                key={a.id}
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="group block bg-card border border-border rounded-lg overflow-hidden card-lift cursor-pointer"
              >
                <div className="aspect-[16/10] w-full bg-surface-1 relative overflow-hidden border-b border-border">
                  {a.featured_image ? (
                    <img
                      src={a.featured_image}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
                      Mmwa Health Digest
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="label-eyebrow">{a.category || "News"}</span>
                  <h3 className="mt-3 font-display font-bold text-xl leading-snug group-hover:text-gold transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && <p className="mt-3 text-sm text-text-body font-serif line-clamp-3">{a.excerpt}</p>}
                  <div className="mt-5 flex items-center gap-4 text-xs text-text-mute">
                    <span>
                      {a.published_at &&
                        new Date(a.published_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" /> {a.read_time_minutes || 3} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full bg-card border border-border rounded-xl p-12 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center">
        <Newspaper className="w-6 h-6" />
      </div>
      <h3 className="mt-5 font-display font-bold text-2xl text-foreground">No stories published yet</h3>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 border border-gold text-gold font-semibold px-5 py-2.5 rounded-full hover:bg-gold/10"
      >
        Back to home
      </Link>
    </div>
  );
}
