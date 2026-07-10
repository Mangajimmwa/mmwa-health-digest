import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2, Bold, Italic, Heading2, Heading3, List, Link2, Image as ImageIcon } from "lucide-react";

interface ArticleFormProps {
  articleId?: string;
  onSaveSuccess?: () => void;
}

export function ArticleEditor({ articleId, onSaveSuccess }: ArticleFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  // 📤 Dynamic client-side media uploader pointed strictly to your "media" bucket
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isInline = false) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const cleanFileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    setUploadingImage(true);
    try {
      // FIXED: Pointing directly to your "media" storage bucket
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      if (isInline) {
        insertFormatting(`<img src="${publicUrl}" alt="${file.name}" className="w-full rounded-lg my-6" />`);
        toast.success("Image embedded into your story body!");
      } else {
        setFormData((prev) => ({ ...prev, featured_image: publicUrl }));
        toast.success("Featured photo uploaded and linked beautifully!");
      }
    } catch (err: any) {
      console.error("Storage upload block caught:", err);
      toast.error(err.message || "Failed to save file asset to 'media' bucket.");
    } finally {
      setUploadingImage(false);
    }
  }

  // 📝 Helper function to insert styling tags exactly where your cursor is typing
  const insertFormatting = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    const replacement = before + selected + after;
    const newBody = text.substring(0, start) + replacement + text.substring(end);
    
    setFormData({ ...formData, body: newBody });
    
    // Reset focus and cursor position smoothly
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

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
      toast.error(err.message || "Database sync failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePublish} className="space-y-6 max-w-4xl bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Article Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., Kenyan Man Becomes First to Survive..." required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">URL Slug (Dashes only)</label>
        <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })} className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 font-mono text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="kenyan-man-becomes-first..." required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Short Excerpt Summary</label>
        <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm h-20 outline-none focus:ring-2 focus:ring-amber-500 text-white" placeholder="Brief opening description..." />
      </div>

      {/* 🛠️ RICH TEXT FORMATTING TOOLBAR PANEL */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Main Report Body Content</label>
        <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950 focus-within:ring-2 focus-within:ring-amber-500">
          <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex flex-wrap gap-1 items-center">
            <button type="button" onClick={() => insertFormatting("<strong>", "</strong>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting("<em>", "</em>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Italic"><Italic className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
            <button type="button" onClick={() => insertFormatting("<h2 className='text-2xl font-bold font-display mt-6 mb-2 text-white'>", "</h2>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting("<h3 className='text-xl font-bold font-display mt-4 mb-2 text-white'>", "</h3>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Heading 3"><Heading3 className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
            <button type="button" onClick={() => insertFormatting("<ul className='list-disc pl-5 space-y-1 my-4'>\n  <li>", "</li>\n</ul>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Bullet List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting("<a href='#' className='text-gold underline hover:text-gold-hover'>", "</a>")} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Insert Link"><Link2 className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
            
            {/* Inline story media injector button */}
            <label className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer flex items-center" title="Embed body image asset">
              <ImageIcon className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" disabled={uploadingImage} />
            </label>
          </div>
          
          <textarea 
            ref={textareaRef}
            value={formData.body} 
            onChange={(e) => setFormData({ ...formData, body: e.target.value })} 
            className="w-full bg-transparent p-3 font-mono text-sm h-80 outline-none text-white resize-y" 
            placeholder="Write your beautiful reporting narrative layout here..." 
          />
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-1">💡 Pro Tip: Highlight any text and press a toolbar button to apply editorial styles instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Featured Image Banner</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="text" value={formData.featured_image} onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-xs font-mono outline-none text-white" placeholder="https://... or upload auto-link" />
              <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors select-none">
                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingImage ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={uploadingImage} className="hidden" />
              </label>
            </div>
            {formData.featured_image && (
              <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-zinc-800 bg-zinc-950 mt-2">
                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Estimated Read Time (Minutes)</label>
          <input type="number" value={formData.read_time_minutes} onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) || 3 })} className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-sm outline-none text-white" />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 accent-amber-500 cursor-pointer" />
        <label htmlFor="is_published" className="text-sm font-medium cursor-pointer select-none text-zinc-300">
          Ready to Go Live (Checking this applies the current timestamp)
        </label>
      </div>

      <button type="submit" disabled={loading || uploadingImage} className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-md transition-colors disabled:opacity-50 text-sm cursor-pointer">
        {loading ? "Saving Workspace Changes..." : "Save News Dispatch"}
      </button>
    </form>
  );
}
