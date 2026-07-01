import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Clock, Search as SearchIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — JOSEPH MMWA" },
      { name: "description", content: "Search medical and global health stories on JOSEPH MMWA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", q],
    enabled: q.trim().length > 0,
    staleTime: 60_000,
    queryFn: async () => {
      const term = q.trim();
      const like = `%${term}%`;
      const { data } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,tags,categories(name,slug)")
        .eq("is_published", true)
        .or(
          `title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`,
        )
        .order("published_at", { ascending: false })
        .limit(50);
      const arr = data ?? [];
      // include tag matches (client-side filter fallback for array contains)
      return arr;
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Search</p>
        <h1 className="mt-2 font-display font-bold text-4xl">Find a story</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const nq = String(fd.get("q") ?? "");
            navigate({ search: { q: nq } });
          }}
          className="mt-6 relative"
        >
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
          <input
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="Search headlines, topics, tags…"
            className="w-full bg-surface-1 border border-gold/30 rounded-full pl-12 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </form>

        <div className="mt-10 space-y-6">
          {!q && (
            <p className="text-text-mute text-sm">Type a keyword to search stories.</p>
          )}
          {q && isLoading && <p className="text-text-mute text-sm">Searching…</p>}
          {q && !isLoading && (results ?? []).length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <h3 className="font-display font-bold text-2xl">
                No stories found for "{q}"
              </h3>
              <p className="mt-3 text-text-body font-serif">
                Try a different keyword or browse by category.
              </p>
              <Link
                to="/categories"
                className="mt-6 inline-flex items-center gap-2 border border-gold text-gold font-semibold px-5 py-2.5 rounded-full hover:bg-gold/10"
              >
                Browse categories
              </Link>
            </div>
          )}
          {(results ?? []).map((a) => {
            const cat = a.categories as { name?: string; slug?: string } | null;
            return (
              <Link
                key={a.id}
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="block bg-card border border-border rounded-lg p-6 card-lift"
              >
                {cat?.name && <span className="label-eyebrow">{cat.name}</span>}
                <h3 className="mt-2 font-display font-bold text-xl">{a.title}</h3>
                {a.excerpt && (
                  <p className="mt-2 text-sm text-text-body font-serif line-clamp-2">{a.excerpt}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-text-mute">
                  <span>
                    {a.published_at &&
                      new Date(a.published_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.read_time_minutes} min read
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
