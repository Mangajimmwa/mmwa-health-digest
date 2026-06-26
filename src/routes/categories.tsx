import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — JOSEPH MMWA" },
      { name: "description", content: "Browse health and medical reporting by topic." },
      { property: "og:title", content: "Categories — JOSEPH MMWA" },
      { property: "og:description", content: "All topics covered by the global health desk." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data } = useQuery({
    queryKey: ["categories", "with-count"],
    queryFn: async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id,name,slug,description")
        .order("sort_order");
      return cats ?? [];
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Topics</p>
        <h1 className="mt-2 font-display font-bold text-4xl sm:text-5xl">Categories</h1>
        <p className="mt-4 max-w-2xl text-text-body font-serif">
          Every story published by the global health desk, organized by topic.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((c) => (
            <Link
              key={c.id}
              to="/news"
              className="block bg-card border border-border rounded-lg p-6 hover:border-gold/50 transition-colors"
            >
              <p className="label-eyebrow">{c.name}</p>
              <h3 className="mt-3 font-display font-bold text-xl text-foreground">
                {c.name}
              </h3>
              {c.description && (
                <p className="mt-2 text-sm text-text-body font-serif">{c.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
