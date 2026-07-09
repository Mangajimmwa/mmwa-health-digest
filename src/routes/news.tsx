import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, Search, Newspaper } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — JOSEPH MMWA" },
      { name: "description", content: "All the latest medical and global health news, reported by Joseph Mmwa." },
      { property: "og:title", content: "News — JOSEPH MMWA" },
      { property: "og:description", content: "Latest medical and global health stories." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("sort_order");
      return data ?? [];
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["articles", "all", activeSlug],
    queryFn: async () => {
      // 1. Dynamic authentication check to allow admin previews of drafts on the feed
      const { data: session } = await supabase.auth.getUser();
      const isAdmin = session?.user?.email === "mmwajoseph@gmail.com";

      // 2. Changed !inner to !left so articles without a category don't vanish
      let query = supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,categories!left(name,slug)")
        .order("published_at", { ascending: false });

      // 3. Keep drafts safely hidden from standard readers
      if (!isAdmin) {
        query = query.eq("is_published", true);
      }

      if (activeSlug) query = query.eq("categories.slug", activeSlug);
      
      const { data } = await query;
      return data ?? [];
    },
  });

  const filtered = (articles ?? []).filter((a) =>
    q ? a.title.toLowerCase().includes(q.toLowerCase()) : true,
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Newsroom</p>
        <h1 className="mt-2 font-display font-bold text-4xl sm:text-5xl">
          Latest health & medical news
        </h1>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveSlug(null)}
              className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full border ${
                !activeSlug
                  ? "pill-active"
                  : "border-border text-text-mute hover:text-foreground"
              }`}
            >
              All
            </button>
            {(categories ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveSlug(c.slug)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full border ${
                  activeSlug === c.slug
                    ? "pill-active"
                    : "border-border text-text-mute hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
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

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((a) => (
              <Link
                key={a.id}
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="group block bg-card border border-border rounded-lg overflow-hidden card-lift"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-surface-2 to-surface-1" />
                <div className="p-6">
                  <span className="label-eyebrow">{a.categories?.name || "Uncategorized"}</span>
                  <h3 className="mt-3 font-display font-bold text-xl leading-snug group-hover:text-gold transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-3 text-sm text-text-body font-serif line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}
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
                      <Clock className="w-3 h-3" /> {a.read_time_minutes} min read
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
      <h3 className="mt-5 font-display font-bold text-2xl text-foreground">
        No stories published yet
      </h3>
      <p className="mt-3 text-text-body font-serif max-w-xl mx-auto">
        The newsroom is preparing its first verified reports. Check back soon.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 border border-gold text-gold font-semibold px-5 py-2.5 rounded-full hover:bg-gold/10"
      >
        Back to home
      </Link>
    </div>
  );
}
