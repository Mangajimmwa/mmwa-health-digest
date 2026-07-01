import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Star,
  Zap,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin/articles")({
  component: ArticlesList,
});

type Row = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  is_premium: boolean;
  is_breaking: boolean;
  category_id: string | null;
  published_at: string | null;
  updated_at: string;
  view_count: number;
  categories: { name: string } | null;
};

function ArticlesList() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft" | "premium" | "breaking">("all");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"updated" | "views" | "az">("updated");
  const [sel, setSel] = useState<Set<string>>(new Set());

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id,name,slug").order("name");
      return data ?? [];
    },
  });

  const { data: rows } = useQuery({
    queryKey: ["admin", "articles", { status, cat, sort }],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("id,title,slug,is_published,is_premium,is_breaking,category_id,published_at,updated_at,view_count,categories(name)");
      if (status === "published") query = query.eq("is_published", true);
      if (status === "draft") query = query.eq("is_published", false);
      if (status === "premium") query = query.eq("is_premium", true);
      if (status === "breaking") query = query.eq("is_breaking", true);
      if (cat !== "all") query = query.eq("category_id", cat);
      if (sort === "updated") query = query.order("updated_at", { ascending: false });
      if (sort === "views") query = query.order("view_count", { ascending: false });
      if (sort === "az") query = query.order("title", { ascending: true });
      const { data } = await query;
      return (data ?? []) as unknown as Row[];
    },
  });

  const filtered = useMemo(
    () => (rows ?? []).filter((r) => (q ? r.title.toLowerCase().includes(q.toLowerCase()) : true)),
    [rows, q],
  );

  function toggleAll(v: boolean) {
    setSel(v ? new Set(filtered.map((r) => r.id)) : new Set());
  }
  function toggleOne(id: string) {
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function togglePremium(r: Row) {
    const { error } = await supabase
      .from("articles")
      .update({ is_premium: !r.is_premium })
      .eq("id", r.id);
    if (error) return toast.error("Update failed");
    toast.success(!r.is_premium ? "Marked Premium" : "Removed Premium");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }
  async function toggleBreaking(r: Row) {
    const { error } = await supabase
      .from("articles")
      .update({ is_breaking: !r.is_breaking })
      .eq("id", r.id);
    if (error) return toast.error("Update failed");
    toast.success(!r.is_breaking ? "Marked Breaking" : "Removed Breaking");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }
  async function duplicate(r: Row) {
    const { data: full } = await supabase.from("articles").select("*").eq("id", r.id).maybeSingle();
    if (!full) return;
    const newSlug = `${full.slug}-copy-${Date.now().toString(36).slice(-4)}`;
    const {
      id: _id,
      created_at: _c,
      updated_at: _u,
      published_at: _p,
      view_count: _v,
      ...rest
    } = full;
    void _id; void _c; void _u; void _p; void _v;
    const { error } = await supabase
      .from("articles")
      .insert({ ...rest, title: `${full.title} (Copy)`, slug: newSlug, is_published: false });
    if (error) return toast.error("Duplicate failed");
    toast.success("Duplicated as draft");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this article? This can't be undone.")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Article deleted");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }
  async function bulkDelete() {
    if (sel.size === 0) return;
    if (!confirm(`Delete ${sel.size} article(s)?`)) return;
    const { error } = await supabase.from("articles").delete().in("id", Array.from(sel));
    if (error) return toast.error("Bulk delete failed");
    toast.success("Deleted");
    setSel(new Set());
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }
  async function bulkCategory(id: string) {
    if (sel.size === 0) return;
    const { error } = await supabase.from("articles").update({ category_id: id }).in("id", Array.from(sel));
    if (error) return toast.error("Bulk update failed");
    toast.success("Category updated");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Articles</p>
          <h1 className="mt-2 font-display font-bold text-3xl">All stories</h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-md"
        >
          <Plus className="w-4 h-4" /> New article
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by headline"
            className="w-full bg-surface-1 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={sel_input}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="premium">Premium</option>
          <option value="breaking">Breaking</option>
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={sel_input}>
          <option value="all">All categories</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={sel_input}>
          <option value="updated">Most recent</option>
          <option value="views">Most viewed</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      {sel.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 bg-gold/10 border border-gold/40 rounded-md px-4 py-3 text-sm">
          <span>{sel.size} selected</span>
          <select
            onChange={(e) => e.target.value && bulkCategory(e.target.value)}
            className={sel_input}
            defaultValue=""
          >
            <option value="">Move to category…</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={bulkDelete}
            className="inline-flex items-center gap-2 bg-destructive/80 hover:bg-destructive text-white px-3 py-1.5 rounded"
          >
            <Trash2 className="w-4 h-4" /> Delete selected
          </button>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0F0F0F] text-text-mute text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={sel.size > 0 && sel.size === filtered.length}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Views</th>
                <th className="p-3">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-mute">
                    No articles match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-surface-2/50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={sel.has(r.id)}
                      onChange={() => toggleOne(r.id)}
                    />
                  </td>
                  <td className="p-3">
                    <Link to="/admin/articles/$id/edit" params={{ id: r.id }} className="font-medium hover:text-gold">
                      {r.title || "Untitled"}
                    </Link>
                    <div className="text-xs text-text-mute mt-0.5">/{r.slug}</div>
                  </td>
                  <td className="p-3 text-text-body">{r.categories?.name ?? "—"}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <Badge tone={r.is_published ? "gold" : "mute"}>
                        {r.is_published ? "Published" : "Draft"}
                      </Badge>
                      {r.is_premium && <Badge tone="gold">Premium</Badge>}
                      {r.is_breaking && <Badge tone="red">Breaking</Badge>}
                    </div>
                  </td>
                  <td className="p-3 text-center">{r.view_count}</td>
                  <td className="p-3 text-text-mute whitespace-nowrap">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn title="Toggle Premium" onClick={() => togglePremium(r)}>
                        <Star className={`w-4 h-4 ${r.is_premium ? "text-gold fill-gold" : ""}`} />
                      </IconBtn>
                      <IconBtn title="Toggle Breaking" onClick={() => toggleBreaking(r)}>
                        <Zap className={`w-4 h-4 ${r.is_breaking ? "text-destructive fill-destructive" : ""}`} />
                      </IconBtn>
                      <a
                        href={`/news/${r.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Preview"
                        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gold/15 hover:text-gold"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <IconBtn title="Duplicate" onClick={() => duplicate(r)}>
                        <Copy className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn title="Delete" onClick={() => remove(r.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const sel_input =
  "bg-surface-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold";

function IconBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gold/15 hover:text-gold"
    >
      {children}
    </button>
  );
}
function Badge({ children, tone }: { children: React.ReactNode; tone: "gold" | "red" | "mute" }) {
  const styles: Record<string, string> = {
    gold: "bg-gold/15 text-gold border-gold/40",
    red: "bg-destructive/15 text-destructive border-destructive/40",
    mute: "bg-surface-2 text-text-mute border-border",
  };
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
