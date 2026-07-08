import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  FileText, 
  Radio, 
  FolderKanban, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminMasterLayout,
});

function AdminMasterLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
        console.error("Master dashboard access error:", err);
      }
      setIsAuthenticated(false);
    }
    verifyAdminSession();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out of newsroom workspace");
    navigate({ to: "/auth" });
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-sm text-zinc-500 animate-pulse font-sans">
        Opening newsroom console...
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-sm text-red-400 font-sans p-6 text-center">
        Access Denied.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      {/* 🧭 Sidebar Menu Navigation */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <p className="text-xs font-bold tracking-widest text-amber-500 uppercase font-mono">Newsroom Center</p>
          <h2 className="text-sm font-semibold text-white mt-1">JOSEPH MMWA</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 [&.active]:bg-amber-500/10 [&.active]:text-amber-400" activeOptions={{ exact: true }}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </Link>
          <Link to="/admin/articles/new" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 [&.active]:bg-amber-500/10 [&.active]:text-amber-400">
            <FileText className="w-4 h-4" /> Write Story
          </Link>
          <Link to="/admin/breaking" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 [&.active]:bg-amber-500/10 [&.active]:text-amber-400">
            <Radio className="w-4 h-4" /> Live Breaking News
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 📥 Sub-pages mount right here via the Outlet */}
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
}
