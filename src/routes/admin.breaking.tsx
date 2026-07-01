import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/breaking")({
  component: BreakingAdmin,
});

function BreakingAdmin() {
  const qc = useQueryClient();
  const [headline, setHeadline] = useState("");
  const [articleId, setArticleId] = useState<string>("");
  const [link, setLink] = useState("");
  const [active, setActive] = useState(true);

  const { data: articles } = useQuery({
    queryKey: ["admin", "published-articles-short"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id,title,slug")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const { data: items } = useQuery({
    queryKey: ["admin", "breaking"],
    queryFn: async () => {
      const { data } = await supabase
        .from("breaking_news")
        .select("id,headline,link,linked_article_id,is_active,created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!headline.trim()) return;
    const { error } = await supabase.from("breaking_news").insert({
      headline: headline.trim(),
      linked_article_id: articleId || null,
      link: link.trim() || null,
      is_active: active,
    });
    if (error) return toast.error(error.message);
    toast.success("Ticker added");
    setHeadline("");
    setArticleId("");
    setLink("");
    setActive(true);
    qc.invalidateQueries({ queryKey: ["admin", "breaking"] });
    qc.invalidateQueries({ queryKey: ["breaking"] });
  }

  async function toggle(id: string, cur: boolean) {
    await supabase.from("breaking_news").update({ is_active: !cur }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "breaking"] });
    qc.invalidateQueries({ queryKey: ["breaking"] });
  }
  async function remove(id: string) {
    if (!confirm("Remove this ticker message?")) return;
    await supabase.from("breaking_news").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "breaking"] });
    qc.invalidateQueries({ queryKey: ["breaking"] });
  }

  return (
    <div className="max-w-4xl">
      <p className="label-eyebrow">Breaking News Ticker</p>
      <h1 className="mt-2 font-display font-bold text-3xl">Live ticker management</h1>

      <form onSubmit={add} className="mt-6 rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <label className="text-xs text-text-mute">Ticker headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="BREAKING: …"
            className="mt-1 w-full bg-surface-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-mute">Link to published article (optional)</label>
            <select
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="mt-1 w-full bg-surface-1 border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {(articles ?? []).map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-mute">Or external URL (optional)</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full bg-surface-1 border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active immediately
          </label>
          <button className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-4 py-2 rounded-md text-sm">
            <Plus className="w-4 h-4" /> Add ticker
          </button>
        </div>
      </form>

      <h2 className="mt-8 font-display font-bold text-xl">Recent tickers</h2>
      <div className="mt-3 rounded-lg border border-border bg-card divide-y divide-border">
        {(items ?? []).length === 0 && (
          <p className="p-6 text-sm text-text-mute">No ticker messages yet.</p>
        )}
        {(items ?? []).map((t) => {
          const linked = (articles ?? []).find((a) => a.id === t.linked_article_id);
          return (
            <div key={t.id} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{t.headline}</p>
                <p className="text-xs text-text-mute mt-1">
                  {t.is_active ? "Active" : "Inactive"} ·{" "}
                  {linked
                    ? `→ ${linked.title}`
                    : t.link
                      ? `→ ${t.link}`
                      : "no link"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggle(t.id, t.is_active)}
                  className="text-xs border border-border rounded px-3 py-1 hover:border-gold"
                >
                  {t.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => remove(t.id)} className="text-destructive p-1.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
