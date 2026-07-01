import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const { data } = useQuery({
    queryKey: ["admin", "categories-counts"],
    queryFn: async () => {
      const { data: cats } = await supabase.from("categories").select("id,name,slug,description").order("name");
      const { data: rows } = await supabase.from("articles").select("category_id").eq("is_published", true);
      const counts = new Map<string, number>();
      (rows ?? []).forEach((r) => {
        if (r.category_id) counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + 1);
      });
      return (cats ?? []).map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
    },
  });

  return (
    <div className="max-w-4xl">
      <p className="label-eyebrow">Categories</p>
      <h1 className="mt-2 font-display font-bold text-3xl">Coverage areas</h1>
      <p className="mt-2 text-sm text-text-mute">
        The seven fixed editorial categories. The structure is intentional and not editable — assign
        articles here from the editor.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(data ?? []).map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-bold text-lg">{c.name}</h3>
              <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded">{c.count} published</span>
            </div>
            {c.description && <p className="mt-2 text-sm text-text-body">{c.description}</p>}
            <p className="mt-3 text-xs text-text-mute">/category/{c.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
