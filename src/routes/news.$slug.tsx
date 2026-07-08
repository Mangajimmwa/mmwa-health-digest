import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowLeft, Share2, Copy, Facebook, Twitter, Linkedin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ArticleContent } from "@/components/site/ArticleContent";
import { RelatedStories } from "@/components/site/RelatedStories";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — JOSEPH MMWA` },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          body,
          featured_image,
          image_caption,
          author,
          published_at,
          read_time_minutes,
          is_premium,
          category_id,
          tags,
          region,
          categories(id, name, slug)
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error("[ArticlePage] Supabase error:", error);
        throw error;
      }

      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-zinc-500 font-serif text-sm animate-pulse">Loading story…</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !article) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-xs font-mono tracking-wider uppercase text-amber-500">404</p>
            <h1 className="mt-3 font-display font-bold text-3xl text-white">Story not found</h1>
            <p className="mt-3 text-zinc-400 font-serif">
              This article may have been removed or the link may be incorrect.
            </p>
            <Link
              to="/news"
              className="mt-6 inline-flex items-center gap-2 bg-amber-500 text-black font-semibold px-5 py-2.5 rounded-md text-sm transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="w-4 h-4" /> Back to news
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const category = article.categories as { id: string; name: string; slug: string } | null;
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const articleUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://josephmmwa.com/news/${slug}`;

  function copyLink() {
    navigator.clipboard.writeText(articleUrl).then(() => {
      toast.success("Link copied to clipboard");
    });
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`, "_blank");
  }

  // Distribution triggers mapped to current location configurations
  function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, "_blank");
  }

  // LinkedIn link engine parameters configuration
  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, "_blank");
  }

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <ReadingProgress />

      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">

        {/* Home navigation feed layout wrapper elements */}
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All stories
        </Link>

        {/* Dynamic Category display badge link setup component */}
        {category && (
          <Link
            to="/category/$slug"
            params={{ slug: category.slug }}
            className="text-xs font-mono tracking-wider uppercase text-amber-500 hover:text-amber-400"
          >
            {category.name}
          </Link>
        )}

        {/* Editorial Title block heading elements container */}
        <h1 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
          {article.title}
        </h1>

        {/* Story Standfirst panel text block component wrapper */}
        {article.excerpt && (
          <p className="mt-5 text-lg text-zinc-300 font-serif leading-relaxed border-l-4 border-amber-500 pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Meta layout section layout element space borders */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400 border-y border-zinc-800 py-4">
          <span className="font-semibold text-zinc-200">
            By {article.author || "Joseph Mmwa"}
          </span>
          {publishedDate && <span>{publishedDate}</span>}
          {article.read_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {article.read_time_minutes} min read
            </span>
          )}
          {article.is_premium && (
            <span className="text-xs font-mono uppercase text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
              Premium
            </span>
          )}
        </div>

        {/* Story Media featured cover element layout rendering space */}
        {article.featured_image && (
          <figure className="mt-8 -mx-4 lg:-mx-6">
            <img
              src={article.featured_image}
              alt={article.title}
              loading="eager"
              decoding="async"
              className="w-full aspect-[16/9] object-cover rounded-lg border border-zinc-800"
            />
            {article.image_caption && (
              <figcaption className="mt-2 px-4 text-xs text-zinc-500 italic font-serif text-center">
                {article.image_caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Text core rendering module logic parsing entry layout container */}
        <div className="mt-10">
          {article.body ? (
            <ArticleContent html={article.body} />
          ) : (
            <p className="text-zinc-500 font-serif italic">
              No content available for this article.
            </p>
          )}
        </div>

        {/* Distribution channels social links layout tray setup elements wrapper */}
        <div className="mt-14 border-t border-zinc-800 pt-8">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500" /> Share this story
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareTwitter}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-amber-500 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4" /> Twitter / X
            </button>
            <button
              onClick={shareFacebook}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-amber-500 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-amber-500 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 hover:text-amber-500 hover:border-amber-500/40 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" /> Copy link
            </button>
          </div>
        </div>

        {/* Signature Editorial signature block elements wrap component styling layout */}
        <div
          className="mt-10 rounded-xl p-6 flex gap-5 items-start"
          style={{
            background: "radial-gradient(ellipse at top left, #1c1503 0%, #0c0800 40%, #09090b 100%)",
            border: "1px solid rgba(245, 166, 35, 0.15)",
          }}
        >
          <div className="shrink-0 w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xl font-display border border-amber-500/20">
            JM
          </div>
          <div>
            <p className="font-semibold text-white">
              {article.author || "Joseph Mmwa"}
            </p>
            <p className="text-xs text-amber-500 mt-0.5 font-mono">Medical & Health Journalist</p>
            <p className="mt-2 text-sm text-zinc-400 font-serif leading-relaxed">
              Joseph Mmwa is an independent medical and health journalist delivering
              accurate, evidence-based reporting on the stories shaping global
              public health — with clarity, accuracy, and editorial independence.
            </p>
          </div>
        </div>
      </article>

      {/* Relational stories carousel context components layout parameters mapping block */}
      {category && (
        <div className="mx-auto max-w-7xl px-4 lg:px-6 pb-20">
          <RelatedStories
            currentId={article.id}
            categoryId={category.id}
            tags={article.tags ?? []}
            region={article.region ?? null}
          />
        </div>
      )}
    </SiteLayout>
  );
}
