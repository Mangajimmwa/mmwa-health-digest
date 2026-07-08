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
        console.error("Session lookup failure on new article view:", err);
      }
      setIsAuthenticated(false);
    }
    verifySession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="p-8 text-sm text-text-mute animate-pulse font-sans">
        Loading workspace environment...
      </div>
    );
  }

  // If unauthorized, show a safe internal warning rather than throwing a script crash
  if (isAuthenticated === false) {
    return (
      <div className="p-8 text-sm text-destructive font-sans">
        Access Denied. Please ensure you are logged into your administrator account.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wider text-gold uppercase font-mono">New Article</p>
        <h1 className="mt-1 font-display font-bold text-2xl sm:text-3xl text-foreground">Write a story</h1>
      </div>
      <ArticleEditor />
    </div>
  );
}
