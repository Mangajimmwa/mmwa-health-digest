import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
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
      {
        title: `${params.slug.replace(/-/g, " ")} — JOSEPH MMWA`,
      },
      {
        name: "robots",
        content: "index, follow",
      },
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
      // 1. Check if you are logged in as admin to allow draft previews
      const { data: session } = await supabase.auth.getUser();
      const isAdmin = session?.user?.email === "mmwajoseph@gmail.com";

      // 2. Query articles table with an optional left join on categories
      let articleQuery = supabase
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
          category_id,
          tags,
          region,
          categories!left(id, name, slug)
        `,
        )
        .ilike("slug", slug.toLowerCase());

      // 3. Keep drafts hidden from the public, but visible to you
      if (!isAdmin) {
        articleQuery = articleQuery.eq("is_published", true);
      }

      const { data, error } = await articleQuery.maybeSingle();

      if (error) {
        console.error("[ArticlePage] Supabase error:", JSON.stringify(error));
        throw error;
      }

      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-text-mute font-serif text-sm">
              Loading story…
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !article) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="label-eyebrow">404</p>
            <h1 className="mt-3 font-display font-bold text-3xl">
              Story not found
            </h1>
            <p className="mt-3 text-text-body font-serif">
              This article may have been removed, is set to draft mode, or the link may be incorrect.
            </p>
            <Link
              to="/news"
              className="mt-6 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" /> Back to news
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const category = article.categories as {
    id: string;
    name: string;
    slug: string;
  } | null;

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://josephmmwa.com/news/${slug}`;

  function copyLink() {
    navigator.clipboard
      .writeText(articleUrl)
      .then(() => toast.success("Link copied to clipboard"));
  }

  function shareTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        article.title,
      )}&url=${encodeURIComponent(articleUrl)}`,
      "_blank",
    );
  }

  // Distribution triggers mapped to current location configurations
  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        articleUrl,
      )}`,
      "_blank",
    );
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        articleUrl,
      )}`,
      "_blank",
    );
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        article.title + " " + articleUrl,
      )}`,
      "_blank",
    );
  }

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <ReadingProgress />

      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        
        {/* Dynamic Admin Notification Header Tag Elements */}
        {!article.is_published && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md text-xs font-mono font-bold uppercase text-center tracking-wide">
            ⚠️ Workspace Mode: Previewing Unpublished Draft
          </div>
        )}

        {/* Back link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All stories
        </Link>

        {/* Category tag */}
        {category && (
          <div className="mb-4">
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="label-eyebrow hover:text-gold-hover transition-colors"
            >
              {category.name}
            </Link>
          </div>
        )}

        {/* Headline */}
        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-foreground">
          {article.title}
        </h1>

        {/* Excerpt standfirst */}
        {article.excerpt && (
          <p className="mt-5 text-lg text-text-body font-serif leading-relaxed border-l-4 border-gold pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Meta row */}
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
          {article.is_premium && (
            <span className="label-eyebrow !text-gold border border-gold/40 px-2 py-0.5 rounded">
              Premium
            </span>
          )}
        </div>

        {/* Featured image */}
        {article.featured_image && (
          <figure className="mt-8 -mx-4 lg:-mx-6">
            <img
              src={article.featured_image}
              alt={article.title}
              loading="eager"
              decoding="async"
              className="w-full aspect-[16/9] object-cover rounded-lg"
            />
            {article.image_caption && (
              <figcaption className="mt-2 px-4 text-xs text-text-mute italic font-serif text-center">
                {article.image_caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article body */}
        <div className="mt-10">
          {article.body ? (
            <ArticleContent html={article.body} />
          ) : (
            <p className="text-text-mute font-serif italic">
              No content available for this article.
            </p>
          )}
        </div>

        {/* Share section */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="label-eyebrow mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share this story
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareTwitter}
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
            >
              <Twitter className="w-4 h-4" /> Twitter / X
            </button>
            <button
              onClick={shareFacebook}
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold hover:border-gold/40 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy link
            </button>
          </div>
        </div>

        {/* Author bio */}
        <div
          className="mt-10 rounded-xl p-6 flex gap-5 items-start"
          style={{
            background:
              "radial-gradient(ellipse at top left, #2A1F00 0%, #1A1200 40%, #0A0A0A 100%)",
            border: "1px solid rgba(245, 166, 35, 0.15)",
          }}
        >
          <div className="shrink-0 w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl font-display select-none">
            JM
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {article.author || "Joseph Mmwa"}
            </p>
            <p className="text-xs text-gold mt-0.5">
              Medical &amp; Health Journalist
            </p>
            <p className="mt-2 text-sm text-text-body font-serif leading-relaxed">
              Joseph Mmwa is an independent medical and health journalist
              delivering accurate, evidence-based reporting on the stories
              shaping global public health — with clarity, accuracy, and
              editorial independence.
            </p>
          </div>
        </div>
      </article>

      {/* Related stories — only shown when category exists */}
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
