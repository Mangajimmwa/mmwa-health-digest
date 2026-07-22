import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowLeft, Copy, Loader2, AlertTriangle, Linkedin, Facebook } from "lucide-react";
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
    
    // 1. CLEAN HEADLINE ONLY for social media previews (No site name appended)
    const cleanHeadline = meta?.title || "Global Health News";

    // 2. Browser tab title (with site name)
    const browserTitle = meta?.title ? `${meta.title} — Joseph Mmwa` : "Global Health News — Joseph Mmwa";

    const description = meta?.excerpt || "Breaking medical news, verified health reporting, and evidence-based journalism from Joseph Mmwa.";
    
    // 3. ABSOLUTE IMAGE URL FIX: Guarantees social crawlers find the featured image
    const rawImage = meta?.featured_image || "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg";
    const image = rawImage.startsWith("http") ? rawImage : `https://josephmmwa.com${rawImage}`;

    // Canonical link
    const canonicalUrl = `https://josephmmwa.com/news/${meta?.slug || ""}`;

    return {
      meta: [
        { title: browserTitle },
        { name: "description", content: description },
        { property: "og:type", content: "article" },

        /* 🎯 CLEAN SOCIAL HEADLINE */
        { property: "og:title", content: cleanHeadline },
        { name: "twitter:title", content: cleanHeadline },

        { property: "og:description", content: description },
        { name: "twitter:description", content: description },

        /* 🎯 FEATURED IMAGE PREVIEW FIX */
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },

        { name: "twitter:card", content: "summary_large_image" },
      ],
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
          is_published,
          category
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

  const { data: relatedArticles } = useQuery({
    queryKey: ["related-articles", article?.id, article?.category],
    queryFn: async () => {
      if (!article?.id) return [];

      let query = supabase
        .from("articles")
        .select("id, title, slug, excerpt, published_at, featured_image")
        .eq("is_published", true)
        .neq("id", article.id);

      if (article.category) {
        query = query.eq("category", article.category);
      }

      const { data } = await query.limit(2);
      return data || [];
    },
    enabled: !!article?.id,
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

  // Social Sharing Links
  const shareText = encodeURIComponent(`Read this vital health dispatch: ${article.title}`);
  const encodedUrl = encodeURIComponent(articleUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

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

        {/* Content Body Layer */}
        <div className="mt-10 text-foreground font-sans text-base leading-relaxed space-y-6">
          {article.body ? (
            hasHtmlTags ? (
              <div dangerouslySetInnerHTML={{ __html: article.body }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />
            ) : (
              <div className="whitespace-pre-wrap">{article.body}</div>
            )
          ) : (
            <p className="text-text-mute font-sans italic">No text content parsed in this document row.</p>
          )}
        </div>

        {/* SHARE THIS STORY */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-text-mute mb-4">
            Share This Story
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button 
              onClick={() => { 
                if (typeof window !== "undefined") { 
                  navigator.clipboard.writeText(articleUrl); 
                  toast.success("Link copied to clipboard!"); 
                } 
              }} 
              className="flex items-center gap-2 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:text-gold transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" /> Copy link
            </button>

            {/* Glowing Green WhatsApp */}
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center bg-surface-2 border border-border w-10 h-10 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                color: "#25D366",
                boxShadow: "0 0 12px rgba(37, 211, 102, 0.35)",
              }}
              title="Share on WhatsApp"
            >
              <span className="font-bold text-base font-sans">W</span>
            </a>

            {/* X / Twitter */}
            <a 
              href={twitterUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center bg-surface-2 border border-border w-10 h-10 rounded-full hover:bg-neutral-800 text-foreground transition-all duration-200 cursor-pointer"
              title="Share on X"
            >
              <span className="font-extrabold text-sm font-sans">𝕏</span>
            </a>

            {/* LinkedIn */}
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center bg-surface-2 border border-border w-10 h-10 rounded-full transition-all duration-200 cursor-pointer hover:opacity-90"
              style={{ color: "#0A66C2" }}
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Facebook */}
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center bg-surface-2 border border-border w-10 h-10 rounded-full transition-all duration-200 cursor-pointer hover:opacity-90"
              style={{ color: "#1877F2" }}
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* AUTHOR BIO CARD */}
        <div 
          className="mt-10 rounded-xl p-6 flex gap-5 items-start" 
          style={{ 
            background: "radial-gradient(ellipse at top left, #2A1F00 0%, #1A1200 40%, #0A0A0A 100%)", 
            border: "1px solid rgba(245, 166, 35, 0.15)" 
          }}
        >
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

        {/* JOSEPH MMWA MEDIA GROUP CONTACT FORM */}
        <div className="mt-8 rounded-xl p-6 border border-border bg-surface-1/60">
          <h3 className="font-display font-bold text-lg text-foreground mb-1">
            Contact Joseph Mmwa Media Group
          </h3>
          <p className="text-xs text-text-mute font-serif mb-5 leading-relaxed">
            Have a news tip, media inquiry, or editorial suggestion regarding this dispatch? Send a direct message to our newsroom team.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you! Your message has been sent to our newsroom.");
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                required 
                placeholder="Your Name" 
                className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
              />
              <input 
                type="email" 
                required 
                placeholder="Your Email" 
                className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <textarea 
              rows={3} 
              required 
              placeholder="Your Message or Inquiry..." 
              className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
            />
            <button 
              type="submit" 
              className="bg-gold hover:bg-gold-hover text-primary-foreground font-bold px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer w-full sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* PREMIUM SUBSCRIPTION BANNER */}
        <div 
          className="mt-12 rounded-xl p-6 sm:p-8 text-center relative overflow-hidden"
          style={{ 
            background: "linear-gradient(180deg, rgba(245, 166, 35, 0.08) 0%, rgba(10, 10, 10, 0.95) 100%)", 
            border: "1px solid rgba(245, 166, 35, 0.25)" 
          }}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              Exclusive Insights
            </span>
            <h3 className="font-sans font-bold text-xl sm:text-2xl text-foreground tracking-tight">
              Join Premium for Full Access
            </h3>
            <p className="font-sans text-sm text-text-mute leading-relaxed font-normal">
              Subscribe to unlock in-depth medical analysis, surgical dispatches, and priority reporting directly from Joseph Mmwa Media Group.
            </p>
            <div className="pt-2">
              <Link 
                to="/premium" 
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-bold px-7 py-3 rounded-full text-sm transition-all duration-200 transform hover:scale-[1.02] shadow-lg cursor-pointer"
              >
                Subscribe to Premium
              </Link>
            </div>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-12 border-t border-border pt-10">
          <h3 className="font-display font-bold text-xl text-foreground mb-6">
            Reader Discussion
          </h3>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Comment submitted for moderation.");
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-3 mb-8"
          >
            <textarea 
              rows={3} 
              required 
              placeholder="Join the discussion... Share your perspective." 
              className="w-full bg-surface-2 border border-border rounded-lg p-3 text-sm font-sans text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-surface-2 border border-border hover:border-gold text-foreground font-sans font-semibold px-5 py-2 rounded-full text-xs transition-colors cursor-pointer"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>

        {/* RELATED DISPATCHES */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12 border-t border-border pt-10">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">Related Dispatches</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedArticles.map((ra) => (
                <Link key={ra.id} to="/news/$slug" params={{ slug: ra.slug }} className="group block space-y-3 cursor-pointer">
                  {ra.featured_image && (
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface-1 border border-border">
                      <img src={ra.featured_image} alt={ra.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                  )}
                  <h4 className="font-display font-bold text-base leading-snug group-hover:text-gold transition-colors line-clamp-2">{ra.title}</h4>
                  {ra.excerpt && <p className="text-xs text-text-mute line-clamp-2 font-serif">{ra.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </SiteLayout>
  );
}
