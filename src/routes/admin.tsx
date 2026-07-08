import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { LayoutDashboard, FileText, Radio, Trash2, Edit, Eye, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminUniversalDashboard,
});

function AdminUniversalDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "write" | "breaking">("dashboard");
  const [articles, setArticles] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Load live stories to allow editing or deletion
  async function loadArticles() {
    const { data } = await supabase.from("articles").select("id, title, slug, is_published, created_at").order("created_at", { ascending: false });
    if (data) setArticles(data);
  }

  useEffect(() => {
    async function verifyAdminSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === "mmwajoseph@gmail.com") {
        setIsAuthenticated(true);
        loadArticles();
      } else {
        setIsAuthenticated(false);
      }
    }
    verifyAdminSession();
  }, [activeTab]);

  async function handleDelete(id: string) {
    if (!confirm("Are you absolute sure you want to delete this story?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Story removed completely");
    loadArticles();
  }

  function startEdit(id: string) {
    setEditingId(id);
    setActiveTab("write");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAuthenticated === null) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 animate-pulse">Loading Workspace...</div>;
  if (isAuthenticated === false) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500">Access Denied.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase font-mono">Newsroom Center</p>
          <h2 className="text-sm font-semibold text-white mt-1">JOSEPH MMWA</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => { setActiveTab("dashboard"); setEditingId(undefined); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left ${activeTab === "dashboard" ? "bg-amber-500/10 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"}`}>
            <LayoutDashboard className="w-4 h-4" /> Manage Stories
          </button>
          <button onClick={() => { setActiveTab("write"); setEditingId(undefined); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left ${activeTab === "write" && !editingId ? "bg-amber-500/10 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"}`}>
            <FileText className="w-4 h-4" /> Write Story
          </button>
          <button onClick={() => setActiveTab("breaking")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left ${activeTab === "breaking" ? "bg-amber-500/10 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"}`}>
            <Radio className="w-4 h-4" /> Live Breaking News
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Newsroom Desk Articles</h1>
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-xs font-mono">
                  <tr>
                    <th className="p-3">Headline</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-white">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-zinc-900/30">
                      <td className="p-3 font-medium max-w-md truncate">{art.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${art.is_published ? "bg-green-500/15 text-green-400" : "bg-zinc-700 text-zinc-300"}`}>{art.is_published ? "Live" : "Draft"}</span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => window.open(`/news/${art.slug}`, "_blank")} className="p-1 hover:text-amber-400 inline-flex" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => startEdit(art.id)} className="p-1 hover:text-blue-400 inline-flex" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(art.id)} className="p-1 hover:text-red-400 inline-flex" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "write" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">{editingId ? "Edit Article" : "Write a story"}</h1>
            <ArticleEditor articleId={editingId} />
          </div>
        )}

        {activeTab === "breaking" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Live Breaking News</h1>
            {/* Ticker settings */}
          </div>
        )}
      </main>
    </div>
  );
}
