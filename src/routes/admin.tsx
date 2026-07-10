// 🧭 Sidebar Menu Panels
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

    {/* 🌍 NEW ESCAPE ROUTE: Takes you out of the dashboard directly to the frontend news catalog */}
    <div className="pt-4 border-t border-zinc-800/60 mt-4">
      <button 
        onClick={() => { window.location.href = "/news"; }} 
        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-amber-400 rounded-md text-left transition-colors cursor-pointer"
      >
        <Eye className="w-4 h-4" /> Go to Live Website
      </button>
    </div>
  </nav>
  
  <div className="p-4 border-t border-zinc-800">
    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
  </div>
</aside>
