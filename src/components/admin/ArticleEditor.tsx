import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface ArticleFormProps {
  articleId?: string;
  onSaveSuccess?: () => void;
}

export function ArticleEditor({ articleId, onSaveSuccess }: ArticleFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    featured_image: "",
    is_published: false,
    author: "Joseph Mmwa",
    read_time_minutes: 3,
  });

  useEffect(() => {
    if (articleId) {
      loadArticleData();
    }
  }, [articleId]);

  async function loadArticleData() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load article draft data.");
      return;
    }
    if (data) {
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        body: data.body || "",
        featured_image: data.featured_image || "",
        is_published: data.is_published || false,
        author: data.author || "Joseph Mmwa",
        read_time_minutes: data.read_time_minutes || 3,
      });
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const cleanFileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    setUploadingImage(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, featured_image: publicUrl }));
      toast.success("Featured photo uploaded and linked beautifully!");
    } catch (err: any) {
      console.error("Storage upload block caught:", err);
      toast.error(err.message || "Failed to save file asset to bucket storage.");
    } finally {
      setUploadingImage(false);
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and URL Slug are strictly required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().trim(),
      excerpt: formData.excerpt || null,
      body: formData.body || null,
      featured_image: formData.featured_image || null,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      author: formData.author,
      read_time_minutes: Number(formData.read_time_minutes) || 3,
    };

    let responseError;

    try {
      if (articleId) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", articleId);
        responseError = error;
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([payload]);
        responseError = error;
      }

      if (responseError) throw responseError;

      toast.success(formData.is_published ? "Article is now live worldwide!" : "Draft updated successfully.");
      
      if (!articleId) {
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          body: "",
          featured_image: "",
          is_published: false,
          author: "Joseph Mmwa",
          read_time_minutes: 3,
        });
      }

      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Database sync failed. Check your constraint layouts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePublish} className="space-y-6 max-w-4xl bg-card border border-border p-6 rounded-xl">
      <div>
        <label className="block text-sm font-medium mb-2">Article Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-surface-1 border border-border rounded-md p-2.5 text-foreground focus:ring-2 focus:ring-gold outline-none" placeholder="e.g., Kenyan Man Becomes First to Survive..." required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">URL Slug (Dashes only)</label>
        <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })} className="w-full bg-surface-1 border border-border rounded-md p-2.5 font-mono text-xs focus:ring-2 focus:ring-gold outline-none" placeholder="kenyan-man-becomes-first..." required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Short Excerpt Summary</label>
        <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-surface-1 border border-border rounded-md p-2.5 text-sm h-20 outline-none focus:ring-2 focus:ring-gold" placeholder="Brief opening description..." />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Main Report Body Content (HTML or Plain Text)</label>
        <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full bg-surface-1 border border-border rounded-md p-2.5 font-mono text-sm h-80 outline-none focus:ring-2 focus:ring-gold" placeholder="<p>Write your article body here...</p>" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="text" value={formData.featured_image} onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })} className="flex-1 bg-surface-1 border border-border rounded-md p-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-gold" placeholder="https://... or upload local file" />
              <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors select-none">
                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingImage ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
              </label>
            </div>
            {formData.featured_image && (
              <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-border bg-surface-1 mt-2">
                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estimated Read Time (Minutes)</label>
          <input type="number" value={formData.read_time_minutes} onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) || 3 })} className="w-full bg-surface-1 border border-border rounded-md p-2.5 text-sm outline-none focus:ring-2 focus:ring-gold" />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-surface-2 p-4 rounded-lg border border-border">
        <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 accent-gold cursor-pointer" />
        <label htmlFor="is_published" className="text-sm font-medium cursor-pointer select-none">
          Ready to Go Live (Checking this applies the current timestamp)
        </label>
      </div>

      <button type="submit" disabled={loading || uploadingImage} className="bg-gold hover:bg-gold-hover text-primary-foreground font-bold px-6 py-3 rounded-md transition-colors disabled:opacity-50 cursor-pointer">
        {loading ? "Saving Workspace Changes..." : "Save News Dispatch"}
      </button>
    </form>
  );
}
