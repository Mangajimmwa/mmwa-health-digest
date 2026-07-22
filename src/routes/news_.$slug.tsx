import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowLeft, Copy, Loader2, AlertTriangle, Linkedin, Facebook, ExternalLink, LogIn, X, UserPlus } from "lucide-react";
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
    
    const cleanHeadline = meta?.title || "Global Health News";
    const browserTitle = meta?.title ? `${meta.title} — Joseph Mmwa` : "Global Health News — Joseph Mmwa";
    const description = meta?.excerpt || "Breaking medical news, verified health reporting, and evidence-based journalism from Joseph Mmwa.";
    
    const rawImage = meta?.featured_image || "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg";
    const image = rawImage.startsWith("http") ? rawImage : `https://josephmmwa.com${rawImage}`;
    const canonicalUrl = `https://josephmmwa.com/news/${meta?.slug || ""}`;

    return {
      meta: [
        { title: browserTitle },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: cleanHeadline },
        { name: "twitter:title", content: cleanHeadline },
        { property: "og:description", content: description },
        { name: "twitter:description", content: description },
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

function ArticleBodyWithMidBanner({ body }: { body: string }) {
  const navigate = useNavigate();

  if (!body || body.length < 400) {
    return <div dangerouslySetInnerHTML={{ __html: body }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />;
  }

  const paragraphs = body.split(/(?<=<\/p>|\n\n)/gi);
  const midpoint = Math.max(1, Math.floor(paragraphs.length / 2));

  const firstHalf = paragraphs.slice(0, midpoint).join("");
  const secondHalf = paragraphs.slice(midpoint).join("");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: firstHalf }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />

      {/* 🎯 INLINE MID-ARTICLE CALLOUT */}
      <div className="my-8 sm:my-10 p-4 sm:p-5 rounded-xl border border-gold/30 bg-surface-1/95 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg transition-all hover:border-gold/50">
        <div className="flex items-center gap-3.5 text-left">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center border border-gold/40 shadow-inner">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            {/* Bold, Standout Golden Heading */}
            <h3 className="text-base sm:text-lg font-display font-black text-gold tracking-tight leading-snug">
              Stay ahead on all health and medical news!
            </h3>
            <p className="text-xs text-text-mute font-sans mt-0.5 leading-relaxed">
              Join{" "}
              <Link 
                to="/about" 
                className="text-gold font-semibold hover:underline transition-colors"
              >
                Joseph Mmwa Media Group
              </Link>{" "}
              and be the first to know the world’s biggest health and medical news as they happen!
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/auth" })}
          className="w-full sm:w-auto shrink-0 bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-black px-6 py-2.5 rounded-full text-xs transition-transform transform hover:scale-[1.03] cursor-pointer shadow-md text-center tracking-wide"
        >
          Create free account
        </button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: secondHalf }} className="space-y-6 prose prose-invert max-w-none whitespace-pre-wrap" />
    </>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    toast.success("Comment submitted for moderation.");
    setCommentText("");
  };

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

        {/* Article Body with Mid-Article Callout */}
        <div className="mt-10 text-foreground font-sans text-base leading-relaxed space-y-6">
          {article.body ? (
            <ArticleBodyWithMidBanner body={article.body} />
          ) : (
            <p className="text-text-mute font-sans italic">No text content parsed in this document row.</p>
          )}
        </div>

        {/* SHARE THIS STORY */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-gold mb-4">
            SHARE THIS STORY
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

            {/* WhatsApp */}
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

            {/* X */}
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

        {/* COMMENTS SECTION */}
        <div className="mt-12 border-t border-border pt-10">
          <div className="mb-6">
            <h3 className="font-display font-bold text-xl text-foreground">
              Comments
            </h3>
            <p className="text-xs text-text-mute font-serif mt-1">
              Share your thoughts
            </p>
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-3 mb-8">
            <textarea 
              rows={3} 
              required 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts on this story..." 
              className="w-full bg-surface-2 border border-border rounded-lg p-3 text-sm font-sans text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-bold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>

        {/* AUTH MODAL INTERCEPT */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-1 border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-text-mute hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                <LogIn className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-foreground">
                  Sign in / Create Account to Comment
                </h3>
                <p className="text-xs text-text-mute font-sans leading-relaxed">
                  Join the conversation! A registered account with Joseph Mmwa Media Group is required to publish comments on health dispatches.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 bg-surface-2 border border-border hover:border-text-mute text-foreground font-sans font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => navigate({ to: "/auth" })}
                  className="flex-1 bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Continue <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREMIUM SUBSCRIPTION BANNER */}
        <div 
          className="mt-12 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden border transition-all duration-300"
          style={{ 
            background: "radial-gradient(ellipse at top, #241A02 0%, #120D02 50%, #0A0A0A 100%)", 
            borderColor: "rgba(245, 166, 35, 0.35)",
            boxShadow: "0 10px 30px -10px rgba(245, 166, 35, 0.15)"
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-widest text-gold bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30 shadow-inner">
              Exclusive Insights
            </span>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              Join Premium
            </h2>

            <p className="font-sans text-sm sm:text-base text-text-mute leading-relaxed font-normal max-w-lg mx-auto">
              The world’s biggest health and medical stories, <span className="text-foreground font-semibold">ad-free, uncompromised</span> — because they deserve world-class journalism.
            </p>

            <div className="pt-3">
              <Link 
                to="/premium" 
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-black px-8 py-3.5 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.03] shadow-lg cursor-pointer tracking-wide"
              >
                Subscribe to Premium
              </Link>
            </div>
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

        {/* CONTACT FORM */}
        <div 
          className="mt-14 rounded-2xl p-6 sm:p-8 border relative overflow-hidden"
          style={{ 
            background: "radial-gradient(ellipse at top right, #1F1700 0%, #0F0D0A 50%, #050505 100%)", 
            borderColor: "rgba(245, 166, 35, 0.3)" 
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-1 rounded bg-gold/10 border border-gold/20">
                Media Desk
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mt-2">
                Joseph Mmwa Media Group Inquiry
              </h3>
              <p className="text-xs text-text-mute font-serif mt-1">
                Direct editorial contact for press, surgical dispatches, and journalism inquiries.
              </p>
            </div>
            
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline shrink-0"
            >
              Full Contact Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message dispatched to Joseph Mmwa Media Group!");
              (e.target as HTMLFormElement).reset();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                required 
                placeholder="Full Name" 
                className="w-full bg-surface-2/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-all"
              />
              <input 
                type="email" 
                required 
                placeholder="Email Address" 
                className="w-full bg-surface-2/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-all"
              />
            </div>
            <textarea 
              rows={3} 
              required 
              placeholder="State your story tip, editorial feedback, or press inquiry..." 
              className="w-full bg-surface-2/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-all resize-none"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-text-mute">
                For major press credentials or extended partnerships, visit our <Link to="/contact" className="text-gold underline">main contact desk</Link>.
              </p>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-primary-foreground font-bold px-8 py-3 rounded-xl text-sm transition-all duration-200 transform hover:scale-[1.01] cursor-pointer shadow-md"
              >
                Dispatch Message
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-border pt-8 pb-4 text-center text-xs text-text-mute font-sans space-y-3">
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/editorial-policy" className="hover:text-gold transition-colors">Editorial Standards</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} Joseph Mmwa Media Group. All rights reserved.</p>
        </footer>

      </article>
    </SiteLayout>
  );
}
