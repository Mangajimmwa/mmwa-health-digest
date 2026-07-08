import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, User, MapPin, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleContent } from "@/components/site/ArticleContent";
import { RelatedStories } from "@/components/site/RelatedStories";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/news/$slug")({
  // The loader now just passes down the slug parameter safely to prevent client-side initialization panic loops
  loader: ({ params }) => ({ slug: params.slug }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);

  useEffect(() => {
    async function initializePageData() {
      try {
        // 1. Check if viewer is the master admin
        const { data: session } = await supabase.auth.getUser();
        if (session?.user && session.user.email === "mmwajoseph@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // 2. Fetch the article based on your exact column schema keys
        const { data: art, error } = await supabase
          .from("articles")
          .select("id,title,slug,excerpt,body,featured_image,author,region,tags,category_id,is_premium,is_published,read_time_minutes,published_at,updated_at")
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw error;
        
        if (art) {
          setArticle(art);
          
          // 3. Fetch category details inline if present
          if (art.category_id) {
            const { data: cat } = await supabase
              .from("categories")
              .select("name, slug")
              .eq("id", art.category_id)
              .maybeSingle();
            if (cat) setCategory(cat);
          }

          // 4. Log view counts seamlessly
          const viewKey = `viewed:${art.id}`;
          if (!sessionStorage.getItem(viewKey)) {
            sessionStorage.setItem(viewKey, "1");
            void supabase.from("article_views").insert({ article_id: art.id });
          }
        }
      } catch (err) {
        console.error("News context retrieval crash:", err);
      } finally {
        setLoading(false);
      }
    }

    initializePageData();
  }, [slug]);

  const canonical = typeof window !== "undefined" ? window.location.href : "";

  // 1. Loading State Screen
  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] bg-zinc-950 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-zinc-500 animate-pulse">
          <div>RETRIEVING NEWS PAYLOAD...</div>
        </div>
      </SiteLayout>
    );
  }

  // 2. Not Found Safe Screen (Prevents route flash loops)
  if (!article || (!article.is_published && isAdmin === false)) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] bg-zinc-950 flex flex-col items-center justify-center space-y-4 p-4 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500/60" />
          <h2 className="text-xl font-bold text-white">Story Not Found</h2>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            The article link you requested might be a draft, moved, or deleted from our news feeds.
          </p>
          <Link to="/" className="text-xs font-mono px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-amber-400 hover:bg-zinc-800 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </SiteLayout>
    );
  }

  // 3. Render Article Layout Space
  return (
    <SiteLayout>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        
        {!article.is_published && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-xs font-mono font-bold uppercase text-center tracking-wide">
            ⚠️ Workspace Mode: Previewing Unpublished Story Draft
          </div>
        )}

        {category && (
          <Link
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="text-amber-500 text-xs font-bold tracking-wider uppercase hover:opacity-80 font-mono"
          >
            {category.name}
          </Link>
        )}
        
        <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.1] text-white">
          {article.title}
        </h1>
        
        {article.excerpt && (
          <p className="mt-5 text-lg sm:text-xl text-zinc-300 font-serif leading-relaxed">
            {article.excerpt}
          </p>
        )}
        
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-500" /> {article.author ?? "Joseph Mmwa"}
          </span>
          {article.published_at && (
            <span>
              {new Date(article.published_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" /> {article.read_time_minutes} min read
          </span>
          {article.region && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> {article.region}
            </span>
          )}
        </div>

        {article.featured_image && (
          <figure className="mt-10 -mx-4 sm:mx-0">
            <img
              src={article.featured_image}
              alt={article.title}
              loading="eager"
              className="w-full rounded-lg border border-zinc-800 object-cover max-h-[450px]"
            />
          </figure>
        )}

        <div className="mt-10">
          <ArticleContent html={article.body || ""} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1 rounded-full uppercase tracking-wider font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <ShareRow title={article.title} url={canonical} />
      </article>

      <div className="mx-auto max-w-6xl px-4 lg:px-6 pb-20">
        <RelatedStories
          currentId={article.id}
          categoryId={article.category_id}
          tags={article.tags ?? []}
          region={article.region ?? null}
        />
      </div>
    </SiteLayout>
  );
}

function ShareRow({ title, url }: { title: string; url: string }) {
  const enc = (s: string) => encodeURIComponent(s);
  const share = {
    twitter: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  }
  return (
    <div className="mt-12 pt-6 border-t border-zinc-800 flex items-center gap-3 text-sm text-zinc-500">
      <span className="inline-flex items-center gap-2"><Share2 className="w-4 h-4 text-amber-500" /> Share</span>
      <a href={share.twitter} target="_blank" rel="noreferrer" className="p-2 hover:text-amber-500"><Twitter className="w-4 h-4" /></a>
      <a href={share.facebook} target="_blank" rel="noreferrer" className="p-2 hover:text-amber-500"><Facebook className="w-4 h-4" /></a>
      <a href={share.linkedin} target="_blank" rel="noreferrer" className="p-2 hover:text-amber-500"><Linkedin className="w-4 h-4" /></a>
      <button onClick={copy} className="p-2 hover:text-amber-500" aria-label="Copy link"><LinkIcon className="w-4 h-4" /></button>
    </div>
  );
}
