import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Users, Eye, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [pub, draft, subs, views, recent] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_published", false),
        supabase.from("subscribers").select("id", { count: "exact", head: true }),
        supabase.from("article_views").select("id", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("id,title,slug,is_published,updated_at")
          .order("updated_at", { ascending: false })
          .limit(6),
      ]);
      return {
        published: pub.count ?? 0,
        drafts: draft.count ?? 0,
        subscribers: subs.count ?? 0,
        views: views.count ?? 0,
        recent: recent.data ?? [],
      };
    },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Overview</p>
          <h1 className="mt-2 font-display font-bold text-3xl sm:text-4xl">
            Newsroom Dashboard
          </h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-md"
        >
          <Plus className="w-4 h-4" /> New article
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Published" value={stats?.published ?? 0} icon={<FileText className="w-4 h-4" />} />
        <Stat label="Drafts" value={stats?.drafts ?? 0} icon={<FileText className="w-4 h-4" />} />
        <Stat label="Subscribers" value={stats?.subscribers ?? 0} icon={<Users className="w-4 h-4" />} />
        <Stat label="Total views" value={stats?.views ?? 0} icon={<Eye className="w-4 h-4" />} />
      </div>

      <div className="mt-10">
        <h2 className="font-display font-bold text-xl">Recent activity</h2>
        <div className="mt-4 rounded-lg border border-border bg-card divide-y divide-border">
          {(stats?.recent ?? []).length === 0 && (
            <p className="p-6 text-sm text-text-mute">
              No articles yet. Start with your first story.
            </p>
          )}
          {(stats?.recent ?? []).map((a) => (
            <Link
              key={a.id}
              to="/admin/articles/$id/edit"
              params={{ id: a.id }}
              className="flex items-center justify-between gap-4 p-4 hover:bg-surface-2 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{a.title || "Untitled"}</p>
                <p className="text-xs text-text-mute mt-1">
                  {a.is_published ? "Published" : "Draft"} · Updated {new Date(a.updated_at).toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-gold">Edit →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border border-border p-5"
      style={{ background: "linear-gradient(135deg, #150F00 0%, #0A0A0A 100%)" }}
    >
      <div className="flex items-center gap-2 text-gold">
        {icon}
        <p className="label-eyebrow !mt-0">{label}</p>
      </div>
      <p className="mt-3 font-display font-bold text-3xl">{value.toLocaleString()}</p>
    </div>
  );
}
