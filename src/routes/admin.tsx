import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { 
  LayoutDashboard, 
  FileText, 
  Radio, 
  LogOut 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminUniversalDashboard,
});

function AdminUniversalDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "write" | "breaking">("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyAdminSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === "mmwajoseph@gmail.com") {
          setIsAuthenticated(true);
          return;
        }
      } catch (err) {
        console.error("Dashboard security handshake failed:", err);
      }
      setIsAuthenticated(false);
    }
    verifyAdminSession();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Logged out of workspace");
    navigate({ to: "/auth" });
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-sm text-zinc-500 animate-pulse font-sans">
        Loading workspace console structure...
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-sm text-red-400 font-sans p-6 text-center">
        Access Denied. Please log in with your admin profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      
      {/* 🧭 Left Sidebar Panel */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase font-mono">Newsroom Center</p>
          <h2 className="text-sm font-semibold text-white mt-1">JOSEPH MMWA</h2>
        </div>

        {/* 🛠️ Dynamic Tab Switches bypassing file collisions */}
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeTab === "dashboard" 
                ? "bg-amber-500/10 text-amber-400 font-semibold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </button>
          
          <button 
            onClick={() => setActiveTab("write")} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeTab === "write" 
                ? "bg-amber-500/10 text-amber-400 font-semibold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <FileText className="w-4 h-4" /> Write Story
          </button>
          
          <button 
            onClick={() => setActiveTab("breaking")} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeTab === "breaking" 
                ? "bg-amber-500/10 text-amber-400 font-semibold" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Radio className="w-4 h-4" /> Live Breaking News
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleSignOut} 
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 📺 Direct UI Projection Canvas */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Workspace Overview</h1>
            <p className="text-sm text-zinc-400">Welcome back to your news desk dashboard system.</p>
            <div className="mt-6 p-12 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500 text-sm">
              Select an activity from the side panel layout to manage public assets.
            </div>
          </div>
        )}

        {activeTab === "write" && (
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase font-mono">New Entry</p>
              <h1 className="mt-1 font-bold text-2xl text-white">Write a story</h1>
            </div>
            {/* The Article Editor component renders right here */}
            <ArticleEditor />
          </div>
        )}

        {activeTab === "breaking" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Live Breaking News</h1>
            <p className="text-sm text-zinc-400 mb-6">Broadcast immediate alert banners straight onto your homepage tickers.</p>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg max-w-xl">
              <p className="text-xs text-zinc-500 mb-2">Ticker Content Script Input</p>
              <input 
                type="text" 
                placeholder="Type real-time alert headline..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs rounded transition-colors">
                Deploy Live Alert
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
