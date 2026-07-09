import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, ArrowLeft, Share2, Copy } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ArticleContent } from "@/components/site/ArticleContent";
import { RelatedStories } from "@/components/site/RelatedStories";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/news/$slug")({
  // ✅ REMOVED PARSEPARAMS TO PREVENT ROUTER TRANSITION FREEZES
  loader: async ({ params }) => {
    // Directly query using the exact parameter from the URL path
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
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
        is_published,
        tags,
        region
      `,
      )
      .ilike("slug", params.slug)
      .maybeSingle();

    if (error) {
      console.error("[Loader Error]:", error);
      throw error;
    }

    if (!data) {
      throw notFound();
    }

    return { article: data };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  if (!article) return null;

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  // Pure array fallback check
  const processedTags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <ReadingProgress />

      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All stories
        </Link>

        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-foreground">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-5 text-lg text-text-body font-serif leading-relaxed border-l-4 border-gold pl-4 italic">
            {article.excerpt}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-mute border-y border-border py-4">
          <span className="font-semibold text-foreground">
            By {article.author || "Joseph Mmwa"}
          </span>
          {publishedDate && <span>{publishedDate}</span>}
          {article.read_time_minutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time_minutes} min read
            </span>
          )}
        </div>

        {article.featured_image && (
          <figure className="mt-8 -mx-4 lg:-mx-6">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full aspect-[16/9] object-cover rounded-lg"
            />
            {article.image_caption && (
              <figcaption className="mt-2 px-4 text-xs text-text-mute italic font-serif text-center">
                {article.image_caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-10">
          {article.body ? (
            <ArticleContent html={article.body} />
          ) : (
            <p className="text-text-mute font-serif italic">
              No content available for this article.
            </p>
          )}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="label-eyebrow mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share this story
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(articleUrl);
                toast.success("Link copied!");
              }
            }}
            className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy link
          </button>
        </div>
      </article>

      <div className="mx-auto max-w-7xl px-4 lg:px-6 pb-20">
        <RelatedStories
          currentId={article.id}
          categoryId={null}
          tags={processedTags}
          region={article.region ?? null}
        />
      </div>
    </SiteLayout>
  );
}
