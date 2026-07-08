import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { LayoutDashboard, FileText, Radio, Trash2, Edit, Eye, LogOut, Megaphone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminUniversalDashboard,
});

function AdminUniversalDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "write" | "breaking">("dashboard");
  const [articles, setArticles] = useState<any[]>([]);
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  
  // State aligned exactly to types.ts public.Tables.breaking_news.Insert schema layout
  const [newTicker, setNewTicker] = useState({ 
    headline: "", 
    link: "",
    linked_article_id: "" 
  });
  const [tickerLoading, setTickerLoading] = useState(false);
  const navigate = useNavigate();

  // Load live stories
  async function loadArticles() {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, is_published, created_at")
      .order("created_at", { ascending: false });
    if (data) setArticles(data);
  }

  // Load active and past breaking news tickers
  async function loadBreakingNews() {
    const { data } = await supabase
      .from("breaking_news")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBreakingNews(data);
  }

  useEffect(() => {
    async function verifyAdminSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === "mmwajoseph@gmail.com") {
        setIsAuthenticated(true);
        loadArticles();
        loadBreakingNews();
      } else {
        setIsAuthenticated(false);
      }
    }
    verifyAdminSession();
  }, [activeTab]);

  async function handleDelete(id: string) {
    if (!confirm("Are you absolutely sure you want to delete this story?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Story removed completely");
    loadArticles();
  }

  // 🚨 Repaired Live Ticker Submission matching exact database properties
  async function handleDeployTicker(e: React.FormEvent) {
    e.preventDefault();
    if (!newTicker.headline.trim()) return toast.error("Please enter an alert headline script.");
    
    setTickerLoading(true);
    try {
      // 1. Reset old tickers to false so only your newest broadcast takes center stage
      await supabase
        .from("breaking_news")
        .update({ is_active: false })
        .eq("is_active", true);

      // 2. Insert payload using your exact compiled database schema columns
      const payload = {
        headline: newTicker.headline.trim(),
        link: newTicker.link.trim() || null,
        linked_article_id: newTicker.linked_article_id || null,
        is_active: true
      };

      const { error } = await supabase
        .from("breaking_news")
        .insert(payload);

      if (error) throw error;
      
      toast.success("Breaking news banner deployed to frontpage ticker!");
      setNewTicker({ headline: "", link: "", linked_article_id: "" });
      loadBreakingNews();
    } catch (err: any) {
      console.error("Ticker save error caught:", err);
      toast.error(err.message || "Failed to broadcast alert ticker parameters.");
    } finally {
      setTickerLoading(false);
    }
  }

  // 🚨 Remove/Delete a breaking news alert row
  async function handleDeleteTicker(id: string) {
    if (!confirm("Remove this breaking news alert from history and live layout feeds?")) return;
    const { error } = await supabase.from("breaking_news").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Alert banner deleted from systems.");
    loadBreakingNews();
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
      
      {/* 🧭 Sidebar Menu Panels */}
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
          <button onClick={() => { setActiveTab("breaking"); setEditingId(undefined); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left ${activeTab === "breaking" ? "bg-amber-500/10 text-amber-400 font-semibold" : "text-zinc-400 hover:text-white"}`}>
            <Radio className="w-4 h-4" /> Live Breaking News
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      {/* 📺 Context Core Projection Views */}
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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Live Breaking News</h1>
              <p className="text-sm text-zinc-400">Broadcast immediate alert banners straight onto homepage ticker layers.</p>
            </div>

            {/* Form to deploy new live alert ticker item */}
            <form onSubmit={handleDeployTicker} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-400 uppercase">Alert Headline Text Content</label>
                <input 
                  type="text" 
                  value={newTicker.headline}
                  onChange={(e) => setNewTicker(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="Type real-time alert text..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Redirect URL Link (Optional)</label>
                  <input 
                    type="text" 
                    value={newTicker.link}
                    onChange={(e) => setNewTicker(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="e.g. /news/alert-slug..." 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Link To Live Article (Optional)</label>
                  <select
                    value={newTicker.linked_article_id}
                    onChange={(e) => setNewTicker(prev => ({ ...prev, linked_article_id: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 h-[38px]"
                  >
                    <option value="">Do not bind to an article</option>
                    {articles.map(art => (
                      <option key={art.id} value={art.id}>{art.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={tickerLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black font-semibold text-xs rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                {tickerLoading ? "Deploying Alert..." : "Deploy Live Alert Ticker"}
              </button>
            </form>

            {/* Real-time Ticker list history panel layout with delete switches */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 max-w-4xl">
              <div className="p-4 bg-zinc-900 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-white">Live System Ticker Deployments</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-xs font-mono">
                  <tr>
                    <th className="p-3">Alert Content Headline</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-white">
                  {breakingNews.map((tick) => (
                    <tr key={tick.id} className="hover:bg-zinc-900/30">
                      <td className="p-3 font-medium max-w-lg truncate">{tick.headline}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${tick.is_active ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20" : "bg-zinc-800 text-zinc-400"}`}>
                          {tick.is_active ? "Live Onsite Ticker" : "Archived Alert"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeleteTicker(tick.id)} 
                          className="p-1 text-zinc-500 hover:text-red-400 inline-flex transition-colors" 
                          title="Delete Alert Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {breakingNews.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-sm text-zinc-500 font-mono">No live breaking news alerts deployed yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
