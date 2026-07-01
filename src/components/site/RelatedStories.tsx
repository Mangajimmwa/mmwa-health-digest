import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  read_time_minutes: number;
  published_at: string | null;
  categories: { name: string } | null;
};

export function RelatedStories({
  currentId,
  categoryId,
  tags,
  region,
}: {
  currentId: string;
  categoryId: string | null;
  tags: string[];
  region: string | null;
}) {
  const { data: related } = useQuery({
    queryKey: ["related", currentId, categoryId, tags?.join(","), region],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const results: Article[] = [];
      const seen = new Set<string>([currentId]);

      const push = (rows: Article[] | null) => {
        for (const r of rows ?? []) {
          if (seen.has(r.id)) continue;
          seen.add(r.id);
          results.push(r);
          if (results.length >= 4) break;
        }
      };

      // 1. same category
      if (categoryId && results.length < 4) {
        const { data } = await supabase
          .from("articles")
          .select(
            "id,title,slug,excerpt,read_time_minutes,published_at,categories(name)",
          )
          .eq("is_published", true)
          .eq("category_id", categoryId)
          .neq("id", currentId)
          .order("published_at", { ascending: false })
          .limit(6);
        push(data as Article[] | null);
      }
      // 2. overlapping tags
      if (tags?.length && results.length < 4) {
        const { data } = await supabase
          .from("articles")
          .select(
            "id,title,slug,excerpt,read_time_minutes,published_at,categories(name)",
          )
          .eq("is_published", true)
          .overlaps("tags", tags)
          .neq("id", currentId)
          .order("published_at", { ascending: false })
          .limit(6);
        push(data as Article[] | null);
      }
      // 3. same region
      if (region && results.length < 4) {
        const { data } = await supabase
          .from("articles")
          .select(
            "id,title,slug,excerpt,read_time_minutes,published_at,categories(name)",
          )
          .eq("is_published", true)
          .eq("region", region)
          .neq("id", currentId)
          .order("published_at", { ascending: false })
          .limit(6);
        push(data as Article[] | null);
      }
      // 4. fallback: most recent
      if (results.length < 4) {
        const { data } = await supabase
          .from("articles")
          .select(
            "id,title,slug,excerpt,read_time_minutes,published_at,categories(name)",
          )
          .eq("is_published", true)
          .neq("id", currentId)
          .order("published_at", { ascending: false })
          .limit(6);
        push(data as Article[] | null);
      }
      return results.slice(0, 4);
    },
  });

  if (!related || related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gold/20">
      <p className="label-eyebrow">Related Stories</p>
      <h2 className="mt-2 font-display font-bold text-2xl sm:text-3xl">
        Continue reading
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((r) => (
          <Link
            key={r.id}
            to="/news/$slug"
            params={{ slug: r.slug }}
            className="group bg-card border border-border rounded-lg overflow-hidden card-lift block"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-surface-2 to-surface-1" />
            <div className="p-5">
              {r.categories?.name && (
                <span className="label-eyebrow">{r.categories.name}</span>
              )}
              <h3 className="mt-2 font-display font-bold text-lg leading-snug group-hover:text-gold transition-colors">
                {r.title}
              </h3>
              <div className="mt-4 flex items-center gap-3 text-xs text-text-mute">
                {r.published_at && (
                  <span>
                    {new Date(r.published_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {r.read_time_minutes} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
