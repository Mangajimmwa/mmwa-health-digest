import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowLeft, Copy, Loader2, AlertTriangle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const targetSlug = String(params.slug).toLowerCase().trim();
    const { data } = await supabase
      .from("articles")
      .select("title, excerpt, featured_image, slug")
      .ilike("slug", targetSlug)
      .maybeSingle();
    return { articleMeta: data };
  },
  head: ({ loaderData }) => {
    const meta = loaderData?.articleMeta;
    const title = meta?.title ? `${meta.title} — Joseph Mmwa` : "Global Health News — Joseph Mmwa";
    const description = meta?.excerpt || "Breaking medical news, verified health reporting, and evidence-based journalism from Joseph Mmwa.";
    const image = meta?.featured_image || "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg";

    // 🎯 THE CANONICAL FIX: Dynamically maps the clean non-www link path for Google
    const canonicalUrl = `https://josephmmwa.com/news/${meta?.slug || ""}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        
        /* 🎯 THE CARD FIX: Explicit dimensions forcing social media cards into a large, full-length landscape layout */
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      // 🎯 INJECT THE LINK LAYOUT ELEMENT GOOGLE SEARCH CONSOLE IS LOOKING FOR:
      links: [
        { rel: "canonical", href: canonicalUrl }
      ]
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  const isScannerPath = slug.includes("_profiler") || slug.includes("phpinfo") || slug.includes(".env") || slug.includes("wp-admin");

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      if (isScannerPath) return null;

      const targetSlug = String(slug).toLowerCase().trim();
      
      const { data, error: fetchError } = await supabase
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
          is_published
        `)
        .ilike("slug", targetSlug)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Database query failure:", fetchError);
        throw fetchError;
      }
      
      return data;
    },
    enabled: !isScannerPath,
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="text-text-mute text-sm mt-4 font-mono">Loading report...</p>
        </div>
      </SiteLayout>
    );
  }

  if (error || !article || isScannerPath) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-black text-foreground mb-3">Report Not Found</h1>
          <p className="text-text-mute font-serif mb-8 text-sm leading-relaxed">
            The requested health news dispatch or surgical reporting document cannot be retrieved from our database records.
          </p>
          <Link to="/news" className="inline-flex items-center justify-center bg-gold text-primary-foreground font-bold px-6 py-3 rounded-full hover:bg-gold-hover text-sm transition-colors w-full cursor-pointer">
            Return to Newsroom
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const hasHtmlTags = article.body && (
    article.body.includes("<p>") || 
    article.body.includes("</div>") || 
    article.body.includes("<img") || 
    article.body.includes("<strong>") ||
    article.body.includes("<h2")
  );

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <ReadingProgress />

      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        
        {!article.is_published && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md text-xs font-mono font-bold uppercase text-center tracking-wide">
            ⚠️ Workspace Mode: Previewing Unpublished Draft
          </div>
        )}

        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-gold transition-colors mb-8 cursor-pointer">
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
          <span className="font-semibold text-foreground">By {article.author || "Joseph Mmwa"}</span>
          {publishedDate && <span>{publishedDate}</span>}
          {article.read_time_minutes > 0 && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.read_time_minutes} min read</span>
          )}
        </div>

        {article.featured_image && (
          <figure className="mt-8 -mx-4 lg:-mx-6">
            <img src={article.featured_image} alt={article.title} className="w-full aspect-[16/9] object-cover rounded-lg" />
            {article.image_caption && <figcaption className="mt-2 px-4 text-xs text-text-mute italic font-serif text-center">{article.image_caption}</figcaption>}
          </figure>
        )}

        {/* Universal HTML & Text Content Rendering Layer */}
        <div className="mt-10 text-foreground font-serif text-base leading-relaxed space-y-6">
          {article.body ? (
            hasHtmlTags ? (
              /* 🎯 THE SPACE FIX: Added whitespace-pre-wrap to guarantee custom spacing handles paragraph separation properly */
              <div dangerouslySetInnerHTML={{ __html: article.body }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />
            ) : (
              <div className="whitespace-pre-wrap">{article.body}</div>
            )
          ) : (
            <p className="text-text-mute font-serif italic">No text content parsed in this document row.</p>
          )}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => { 
                if (typeof window !== "undefined") { 
                  navigator.clipboard.writeText(articleUrl); 
                  toast.success("Link copied!"); 
                } 
              }} 
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" /> Copy link
            </button>
          </div>
        </div>

        {/* 🎯 FIXED: Wrapped the comment safely so it will never leak onto your web page screen */}
        {/* Author Biography Section */}
        <div className="mt-10 rounded-xl p-6 flex gap-5 items-start" style={{ background: "radial-gradient(ellipse at top left, #2A1F00 0%, #1A1200 40%, #0A0A0A 100%)", border: "1px solid rgba(245, 166, 35, 0.15)" }}>
          <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border border-gold/30 bg-surface-1 relative flex items-center justify-center">
            <img 
              src="https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg" 
              alt="Joseph Mmwa" 
              className="w-full h-full object-cover relative z-10"
            />
          </div>
          <div>
            <p className="font-semibold text-foreground">{article.author || "Joseph Mmwa"}</p>
            <p className="text-xs text-gold mt-0.5">Medical &amp; Health Journalist</p>
            <p className="mt-2 text-sm text-text-body font-serif leading-relaxed">
              Joseph Mmwa is an independent medical and health journalist delivering accurate, evidence-based reporting on the stories shaping global public health — with clarity, accuracy, and editorial independence.
            </p>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
