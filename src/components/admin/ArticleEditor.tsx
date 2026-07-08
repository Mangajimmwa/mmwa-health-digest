import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Image, Loader2, Save } from "lucide-react";

interface ArticleEditorProps {
  articleId?: string; // Passed automatically when editing an article
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    is_published: false,
    category_id: ""
  });

  const [categories, setCategories] = useState<any[]>([]);

  // 1. Fetch categories and existing article data if editingId is present
  useEffect(() => {
    async function loadEditorBasics() {
      setFetching(true);
      try {
        // Fetch Categories
        const { data: cats } = await supabase.from("categories").select("id, name");
        if (cats) setCategories(cats);

        // If we are editing an existing article, pull its current data
        if (articleId) {
          const { data: art, error } = await supabase
            .from("articles")
            .select("*")
            .eq("id", articleId)
            .single();

          if (error) throw error;
          if (art) {
            setFormData({
              title: art.title || "",
              slug: art.slug || "",
              excerpt: art.excerpt || "",
              content: art.content || "",
              featured_image: art.featured_image || "",
              is_published: art.is_published || false,
              category_id: art.category_id || ""
            });
          }
        }
      } catch (err: any) {
        console.error("Error loading editor data:", err);
        toast.error("Failed to load article details.");
      } finally {
        setFetching(false);
      }
    }
    loadEditorBasics();
  }, [articleId]);

  // Helper to sync form state updates
  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate clean slug from title if user is typing headline
      if (field === "title" && !articleId) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
      }
      return updated;
    });
  };

  // 2. Repaired Direct Image Upload Function (Bypasses the buggy media table)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `featured/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      // Upload binary straight to public bucket storage
      const { error: uploadError } = await supabase.storage
        .from("article-media")
        .upload(fileName, file, { 
          contentType: file.type,
          cacheControl: "3600" 
        });

      if (uploadError) throw uploadError;

      // Request direct secure public URL link asset
      const { data: { publicUrl } } = supabase.storage
        .from("article-media")
        .getPublicUrl(fileName);

      updateField("featured_image", publicUrl);
      toast.success("Image uploaded successfully and ready!");
    } catch (err: any) {
      console.error("Storage upload crash caught:", err);
      toast.error(err.message || "Upload failed. Verify storage bucket settings.");
    } finally {
      setUploading(false);
    }
  }

  // 3. Save / Update Article Content Function
  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      return toast.error("Please fill out the headline title field.");
    }

    setLoading(true);
    try {
      if (articleId) {
        // UPDATE existing article record
        const { error } = await supabase
          .from("articles")
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            featured_image: formData.featured_image,
            is_published: formData.is_published,
            category_id: formData.category_id || null,
            updated_at: new Date().toISOString()
          })
          .eq("id", articleId);

        if (error) throw error;
        toast.success("Article updated smoothly!");
      } else {
        // INSERT brand new article entry
        const { error } = await supabase
          .from("articles")
          .insert([
            {
              title: formData.title,
              slug: formData.slug,
              excerpt: formData.excerpt,
              content: formData.content,
              featured_image: formData.featured_image,
              is_published: formData.is_published,
              category_id: formData.category_id || null
            }
          ]);

        if (error) throw error;
        toast.success("Article published and live!");
        
        // Reset form if it's a new post creation
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featured_image: "",
          is_published: false,
          category_id: ""
        });
      }
    } catch (err: any) {
      console.error("Database submission error:", err);
      toast.error(err.message || "Failed to submit story payload data.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="p-12 text-center text-sm text-zinc-500 animate-pulse font-mono">
        Retrieving workspace component parameters...
      </div>
    );
  }

  return (
    <form onSubmit={handlePublish} className="space-y-6 max-w-4xl bg-zinc-900/40 p-6 rounded-lg border border-zinc-800">
      
      {/* Title & Slug Generation Layout */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Headline Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Enter article breaking title..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-lg font-medium"
        />
        <p className="text-xs text-zinc-500 font-mono mt-1">
          Target URL: <span className="text-amber-500/80">/news/{formData.slug || "your-headline-slug"}</span>
        </p>
      </div>

      {/* Category Dropdown & Toggle Switch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Category Sector</label>
          <select
            value={formData.category_id}
            onChange={(e) => updateField("category_id", e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Uncategorized General News</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-md mt-6">
          <span className="text-sm font-medium text-zinc-300">Publish immediately to live feeds</span>
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => updateField("is_published", e.target.checked)}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Excerpt Summary Layout */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Excerpt Summary</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => updateField("excerpt", e.target.value)}
          placeholder="Write a brief single-sentence summary description..."
          rows={2}
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Featured Media Image Upload Area */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Featured Cover Image</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
          <label className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium cursor-pointer flex items-center gap-2 transition-colors shrink-0">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Image className="w-3.5 h-3.5" />}
            {uploading ? "Processing Asset..." : "Choose Image file"}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
          </label>
          
          <input
            type="text"
            value={formData.featured_image}
            onChange={(e) => updateField("featured_image", e.target.value)}
            placeholder="Or paste an absolute graphic image asset URL directly..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
          />
        </div>
        {formData.featured_image && (
          <div className="mt-2 relative rounded overflow-hidden border border-zinc-800 w-48 h-28 bg-zinc-950">
            <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Main Core Body Context Space */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Article Content Body Script</label>
        <textarea
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
          placeholder="Draft the core story payload context script markup right here..."
          rows={12}
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
        />
      </div>

      {/* Form Submission Button Layout */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full md:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black font-semibold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4" />}
        {loading ? "Processing News Database Entry..." : articleId ? "Save Story Updates" : "Publish Story Live"}
      </button>

    </form>
  );
}
