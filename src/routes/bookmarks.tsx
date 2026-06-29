import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [{ title: "Bookmarks — JOSEPH MMWA" }],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        navigate({ to: "/auth" });
        return;
      }
      setReady(true);
    })();
  }, [navigate]);

  if (!ready) return <SiteLayout><div className="min-h-[60vh]" /></SiteLayout>;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 lg:px-6 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Bookmark className="w-7 h-7" />
        </div>
        <p className="label-eyebrow mt-6">Saved</p>
        <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl">Bookmarks</h1>
        <p className="mt-4 text-text-body font-serif text-lg">
          Save articles to read later — Coming Soon.
        </p>
        <Link to="/news" className="mt-8 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-full">
          Browse news
        </Link>
      </section>
    </SiteLayout>
  );
}
