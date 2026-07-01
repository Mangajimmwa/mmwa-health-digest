import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Clock, User, MapPin, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArticleContent } from "@/components/site/ArticleContent";
import { RelatedStories } from "@/components/site/RelatedStories";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("articles")
      .select(
        "id,title,slug,excerpt,body,featured_image,author,region,tags,category_id,is_premium,is_published,read_time_minutes,published_at,updated_at,categories(name,slug)",
      )
      .eq("slug", params.slug)
      .maybeSingle();
    if (!data || !data.is_published) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = `${loaderData.title} — JOSEPH MMWA`;
    const description = loaderData.excerpt ?? "Health and medical journalism from Joseph Mmwa.";
    const image = loaderData.featured_image ?? "/world-map.svg";
    const publishedAt = loaderData.published_at ?? undefined;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: loaderData.title,
      description,
      image: image ? [image] : undefined,
      datePublished: publishedAt,
      dateModified: loaderData.updated_at,
      author: [{ "@type": "Person", name: loaderData.author ?? "Joseph Mmwa" }],
      publisher: {
        "@type": "Organization",
        name: "JOSEPH MMWA",
      },
      articleSection:
        (loaderData.categories as { name?: string } | null)?.name ?? undefined,
      keywords: (loaderData.tags ?? []).join(", "),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "article:published_time", content: publishedAt ?? "" },
        { property: "article:author", content: loaderData.author ?? "Joseph Mmwa" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const a = Route.useLoaderData();

  // Log a view (fire-and-forget, dedupe per session per article)
  useEffect(() => {
    try {
      const key = `viewed:${a.id}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        void supabase.from("article_views").insert({ article_id: a.id });
      }
    } catch {
      /* noop */
    }
  }, [a.id]);

  const canonical = typeof window !== "undefined" ? window.location.href : "";
  const cat = a.categories as { name?: string; slug?: string } | null;

  return (
    <SiteLayout>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        {cat?.slug && (
          <Link
            to="/category/$slug"
            params={{ slug: cat.slug }}
            className="label-eyebrow !text-gold hover:opacity-80"
          >
            {cat.name}
          </Link>
        )}
        <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.1] text-white">
          {a.title}
        </h1>
        {a.excerpt && (
          <p className="mt-5 text-lg sm:text-xl text-text-body font-serif leading-relaxed">
            {a.excerpt}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-mute">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-4 h-4 text-gold" /> {a.author ?? "Joseph Mmwa"}
          </span>
          {a.published_at && (
            <span>
              {new Date(a.published_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold" /> {a.read_time_minutes} min read
          </span>
          {a.region && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold" /> {a.region}
            </span>
          )}
        </div>

        {a.featured_image && (
          <figure className="mt-10 -mx-4 sm:mx-0">
            <img
              src={a.featured_image}
              alt={a.title}
              loading="eager"
              className="w-full rounded-lg border border-border"
            />
          </figure>
        )}

        <div className="mt-10">
          <ArticleContent html={a.body ?? ""} />
        </div>

        {a.tags && a.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {a.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs bg-gold/10 text-gold border border-gold/25 px-3 py-1 rounded-full uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <ShareRow title={a.title} url={canonical} />
      </article>

      <div className="mx-auto max-w-6xl px-4 lg:px-6 pb-20">
        <RelatedStories
          currentId={a.id}
          categoryId={a.category_id}
          tags={a.tags ?? []}
          region={a.region ?? null}
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
    <div className="mt-12 pt-6 border-t border-border flex items-center gap-3 text-sm text-text-mute">
      <span className="inline-flex items-center gap-2"><Share2 className="w-4 h-4 text-gold" /> Share</span>
      <a href={share.twitter} target="_blank" rel="noreferrer" className="p-2 hover:text-gold"><Twitter className="w-4 h-4" /></a>
      <a href={share.facebook} target="_blank" rel="noreferrer" className="p-2 hover:text-gold"><Facebook className="w-4 h-4" /></a>
      <a href={share.linkedin} target="_blank" rel="noreferrer" className="p-2 hover:text-gold"><Linkedin className="w-4 h-4" /></a>
      <button onClick={copy} className="p-2 hover:text-gold" aria-label="Copy link"><LinkIcon className="w-4 h-4" /></button>
    </div>
  );
}
