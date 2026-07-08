import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify, estimateReadTime } from "@/lib/utils/slug";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { Image as ImageIcon, Save, Send, Eye } from "lucide-react";

interface Draft {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category_id: string | null;
  tags: string[];
  featured_image: string | null;
  region: string | null;
  author: string;
  is_premium: boolean;
  is_breaking: boolean;
  is_published: boolean;
  published_at: string | null;
}

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  category_id: null,
  tags: [],
  featured_image: null,
  region: null,
  author: "Joseph Mmwa",
  is_premium: false,
  is_breaking: false,
  is_published: false,
  published_at: null,
};

export function ArticleEditor({ articleId }: { articleId?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [d, setD] = useState<Draft>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!articleId);

  // 🛡️ Query Protection Fix: Catches RLS database errors to prevent interface crashes
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("categories").select("id,name").order("name");
        if (error) {
          console.warn("Categories query limited by RLS configuration:", error.message);
          return [];
        }
        return data ?? [];
      } catch (e) {
        console.error("Failed to safely resolve categories query:", e);
        return [];
      }
    },
  });

  const { data: loaded } = useQuery({
    queryKey: ["admin", "article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      try {
        const { data, error } = await supabase.from("articles").select("*").eq("id", articleId).maybeSingle();
        if (error) {
          console.warn("Articles query limited by RLS configuration:", error.message);
          return null;
        }
        return data;
      } catch (e) {
        console.error("Failed to safely resolve loaded article query:", e);
        return null;
      }
    },
    enabled: !!articleId,
  });

  useEffect(() => {
    if (loaded) {
      setD({
        id: loaded.id,
        title: loaded.title ?? "",
        slug: loaded.slug ?? "",
        excerpt: loaded.excerpt ?? "",
        body: loaded.body ?? "",
        category_id: loaded.category_id,
        tags: loaded.tags ?? [],
        featured_image: loaded.featured_image,
        region: (loaded as { region?: string | null }).region ?? null,
        author: loaded.author ?? "Joseph Mmwa",
        is_premium: loaded.is_premium,
        is_breaking: loaded.is_breaking,
        is_published: loaded.is_published,
        published_at: loaded.published_at,
      });
      setSlugTouched(true);
    }
  }, [loaded]);

  const readTime = useMemo(() => {
    const cleanText = d.body ? stripHtml(d.body) : "";
    if (!cleanText.trim()) return 1;
    try {
      return estimateReadTime(cleanText) || 1;
    } catch (e) {
      return 1;
    }
  }, [d.body]);

  function update<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  function onTitle(v: string) {
    update("title", v);
    if (!slugTouched) update("slug", slugify(v));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!d.tags.includes(t)) update("tags", [...d.tags, t]);
    setTagInput("");
  }
  function removeTag(t: string) {
    update(
      "tags",
      d.tags.filter((x) => x !== t),
    );
  }

  async function uploadFeatured(f: File) {
    try {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `featured/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("article-media").upload(path, f, {
        contentType: f.type,
      });
      if (error) throw error;
      const url = `/api/public/media/${path}`;
      await supabase.from("media").insert({
        path,
        url,
        filename: f.name,
        mime_type: f.type,
        size_bytes: f.size,
      });
      update("featured_image", url);
      toast.success("Featured image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  }

  async function save(action: "draft" | "publish") {
    if (!d.title.trim()) return toast.error("Add a headline first");
    if (!d.slug.trim()) return toast.error("Slug is required");
    setSaving(true);
    const payload = {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt || null,
      body: d.body,
      category_id: d.category_id,
      tags: d.tags,
      featured_image: d.featured_image,
      region: d.region,
      author: d.author || "Joseph Mmwa",
      is_premium: d.is_premium,
      is_breaking: d.is_breaking,
      read_time_minutes: readTime,
      is_published: action === "publish" ? true : d.is_published,
      published_at:
        action === "publish"
          ? d.published_at ?? new Date().toISOString()
          : d.published_at,
    };
    let error;
    let newId = d.id;
    if (d.id) {
      const r = await supabase.from("articles").update(payload).eq("id", d.id);
      error = r.error;
    } else {
      const r = await supabase.from("articles").insert(payload).select("id").maybeSingle();
      error = r.error;
      newId = r.data?.id;
    }
    setSaving(false);
    if (error) {
      console.error(error);
      if (error.code === "23505") toast.error("Slug already exists — pick another");
      else toast.error(error.message);
      return;
    }
    toast.success(action === "publish" ? "Published" : "Draft saved");
    qc.invalidateQueries({ queryKey: ["admin", "articles"] });
    if (!d.id && newId) {
      navigate({ to: "/admin/articles/$id/edit", params: { id: newId } });
    }
  }

  function preview() {
    if (!d.slug) return toast.error("Save the article first");
    window.open(`/news/${d.slug}?preview=1`, "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <input
          value={d.title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="Headline"
          className="w-full bg-transparent font-display font-bold text-3xl sm:text-4xl leading-tight focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-text-mute">
          <span>/news/</span>
          <input
            value={d.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            className="flex-1 bg-transparent border-b border-border focus:outline-none focus:border-gold text-gold"
          />
        </div>

        <div className="mt-4">
          <textarea
            value={d.excerpt}
            onChange={(e) => update("excerpt", e.target.value.slice(0, 300))}
            placeholder="Excerpt / summary (shown in cards, previews, and search results)"
            rows={2}
            className="w-full bg-surface-1 border border-border rounded-md p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <div className="text-xs text-text-mute text-right mt-1">{d.excerpt.length}/300</div>
        </div>

        <div className="mt-6">
          <RichTextEditor value={d.body} onChange={(html) => update("body", html)} />
        </div>
      </div>

      <aside className="space-y-6">
        <Card title="Publishing">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={saving}
              className="inline-flex items-center gap-2 border border-border hover:border-gold text-foreground px-4 py-2 rounded-md text-sm"
            >
              <Save className="w-4 h-4" /> Save draft
            </button>
            <button
              type="button"
              onClick={() => save("publish")}
              disabled={saving}
              className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-4 py-2 rounded-md text-sm"
            >
              <Send className="w-4 h-4" /> {d.is_published ? "Update" : "Publish"}
            </button>
            <button
              type="button"
              onClick={preview}
              className="inline-flex items-center gap-2 border border-border text-foreground px-3 py-2 rounded-md text-sm"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Toggle
              label="Premium"
              checked={d.is_premium}
              onChange={(v) => update("is_premium", v)}
            />
            <Toggle
              label="Breaking News"
              checked={d.is_breaking}
              onChange={(v) => update("is_breaking", v)}
            />
          </div>
          <div className="mt-4">
            <Label>Publish date</Label>
            <input
              type="datetime-local"
              value={d.published_at ? toLocalInput(d.published_at) : ""}
              onChange={(e) =>
                update("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              className={fieldCls}
            />
          </div>
        </Card>

        <Card title="Featured image">
          {d.featured_image ? (
            <div className="space-y-2">
              <img src={d.featured_image} alt="" className="w-full rounded-md border border-border" />
              <button
                type="button"
                onClick={() => update("featured_image", null)}
                className="text-xs text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-8 cursor-pointer hover:border-gold text-sm text-text-mute">
              <ImageIcon className="w-4 h-4" /> Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadFeatured(f);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </Card>

        <Card title="Category">
          <select
            value={d.category_id ?? ""}
            onChange={(e) => update("category_id", e.target.value || null)}
            className={fieldCls}
          >
            <option value="">— Choose —</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Card>

        <Card title="Tags">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {d.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 bg-gold/15 text-gold text-xs px-2 py-0.5 rounded"
              >
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:text-white">
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag + Enter"
              className={fieldCls}
            />
            <button
              type="button"
              onClick={addTag}
              className="text-xs border border-border rounded px-3 hover:border-gold"
            >
              Add
            </button>
          </div>
        </Card>

        <Card title="Region / Location">
          <input
            value={d.region ?? ""}
            onChange={(e) => update("region", e.target.value || null)}
            placeholder="e.g. East Africa, Kenya, Global"
            className={fieldCls}
          />
        </Card>

        <Card title="Author">
          <input
            value={d.author}
            onChange={(e) => update("author", e.target.value)}
            className={fieldCls}
          />
        </Card>
      </aside>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="label-eyebrow !mt-0">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-text-mute mb-1">{children}</p>;
}
const fieldCls =
  "w-full bg-surface-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-gold" : "bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
