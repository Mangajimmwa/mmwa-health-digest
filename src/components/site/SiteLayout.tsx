import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BreakingTicker } from "./BreakingTicker";
import { BackToTop } from "./BackToTop";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data: breaking } = useQuery({
    queryKey: ["breaking"],
    queryFn: async () => {
      const { data } = await supabase
        .from("breaking_news")
        .select("headline,link,linked_article_id,articles:linked_article_id(slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!data) return null;
      const slug = (data.articles as { slug?: string } | null)?.slug ?? null;
      return { headline: data.headline, slug, link: data.link };
    },
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <BreakingTicker item={breaking} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
