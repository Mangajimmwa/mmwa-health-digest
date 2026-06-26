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
        .select("headline")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data?.headline ?? null;
    },
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <BreakingTicker headline={breaking} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
