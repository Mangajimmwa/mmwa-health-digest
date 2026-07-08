import { createFileRoute } from "@tanstack/react-router";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/articles/new")({
  component: NewArticle,
});

function NewArticle() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function verifySession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === "mmwajoseph@gmail.com") {
          setIsAuthenticated(true);
          return;
        }
      } catch (err) {
        console.error("Session lookup failure:", err);
      }
      setIsAuthenticated(false);
    }
    verifySession();
  }, []);

  if (isAuthenticated === null) return <div className="p-8 text-zinc-500">Loading workspace...</div>;
  if (isAuthenticated === false) return <div className="p-8 text-red-400">Access Denied.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wider text-amber-500 uppercase font-mono">New Article</p>
        <h1 className="mt-1 font-bold text-2xl sm:text-3xl text-white">Write a story</h1>
      </div>
      <ArticleEditor />
    </div>
  );
}
