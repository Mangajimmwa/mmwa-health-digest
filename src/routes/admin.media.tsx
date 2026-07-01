import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, Search } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: items } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function upload(f: File) {
    try {
      const ext = f.name.split(".").pop() || "bin";
      const path = `library/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("article-media")
        .upload(path, f, { contentType: f.type });
      if (error) throw error;
      const url = `/api/public/media/${path}`;
      await supabase.from("media").insert({
        path,
        url,
        filename: f.name,
        mime_type: f.type,
        size_bytes: f.size,
      });
      toast.success("Uploaded");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  }

  async function remove(id: string, path: string) {
    if (!confirm("Delete this file?")) return;
    await supabase.storage.from("article-media").remove([path]);
    await supabase.from("media").delete().eq("id", id);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "media"] });
  }

  const filtered = (items ?? []).filter((m) =>
    q ? m.filename.toLowerCase().includes(q.toLowerCase()) : true,
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Media library</p>
          <h1 className="mt-2 font-display font-bold text-3xl">All uploads</h1>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-md"
        >
          <Upload className="w-4 h-4" /> Upload media
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search filenames"
          className="w-full bg-surface-1 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-text-mute p-6 text-center">
            No media uploaded yet.
          </p>
        )}
        {filtered.map((m) => (
          <div key={m.id} className="group rounded-lg border border-border overflow-hidden bg-card">
            <div className="aspect-square bg-surface-2">
              {m.mime_type?.startsWith("image/") ? (
                <img src={m.url} alt={m.alt_text ?? m.filename} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-text-mute p-2 text-center">
                  {m.filename}
                </div>
              )}
            </div>
            <div className="p-2 text-xs">
              <p className="truncate font-medium">{m.filename}</p>
              <div className="mt-1 flex items-center justify-between text-text-mute">
                <a href={m.url} target="_blank" rel="noreferrer" className="hover:text-gold truncate">
                  Open
                </a>
                <button onClick={() => remove(m.id, m.path)} title="Delete" className="hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
