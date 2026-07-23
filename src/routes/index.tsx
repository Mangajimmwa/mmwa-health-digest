import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOSEPH MMWA — Global Health News You Can Trust" },
      {
        name: "description",
        content: "The official health and medical journalism platform of Joseph Mmwa Media Group. Real-time medical news, outbreak updates, and evidence-based reporting.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <Hero />
      <SectionDivider />
      <Latest />
      <SectionDivider />
      <Newsletter />
      <SectionDivider />
      <PremiumUpsell />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative bg-background overflow-hidden min-h-[90vh] flex items-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img src="/world-map.svg" alt="" className="w-[120%] max-w-none opacity-[0.10] [filter:blur(3px)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 lg:px-6 pt-28 pb-32 lg:pt-40 lg:pb-44">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold" style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}>
          Joseph Mmwa Media Group • Global Desk
        </span>
        <h1 className="mt-6 font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-4xl">
          <span style={{ color: "#FFFFFF" }}>GLOBAL HEALTH NEWS</span>
          <br />
          <span style={{ color: "#F5A623" }}>YOU CAN TRUST</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-body font-serif">
          The world's biggest health and medical stories, verified, fact-checked, and explained with clarity
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/news" className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-bold px-7 py-3.5 rounded-full hover:bg-gold-hover transition-colors cursor-pointer">
            Read Latest News <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Latest() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", "latest-home-feed"],
    staleTime: 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,is_published,featured_image,author,category")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Home feed fetch error:", error);
        return [];
      }

      return data ?? [];
    },
  });

  const items = (articles ?? []).map((a) => ({
    slug: a.slug,
    category: a.category || "News",
    title: a.title,
    excerpt: a.excerpt ?? "",
    featured_image: a.featured_image,
    author: a.author || "Joseph Mmwa",
    date: a.published_at
      ? new Date(a.published_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    read: `${a.read_time_minutes || 3} min read`,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-eyebrow">Latest Stories</p>
          <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl">From the newsroom</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h3 className="font-display font-bold text-2xl animate-pulse">Loading latest dispatches...</h3>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h3 className="font-display font-bold text-2xl">No stories published yet</h3>
          <p className="mt-2 text-text-mute font-serif text-sm">Check back soon for newsroom updates.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleCard(props: {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  featured_image?: string | null;
  author: string;
  date: string;
  read: string;
}) {
  // Convert category string to url-friendly slug for tag clicks
  const categorySlug = props.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="group block bg-card border border-border rounded-lg overflow-hidden card-lift cursor-pointer flex flex-col justify-between">
      <Link to="/news/$slug" params={{ slug: props.slug }} className="block">
        <div className="aspect-[16/10] bg-surface-1 relative overflow-hidden border-b border-border">
          {props.featured_image ? (
            <img 
              src={props.featured_image} 
              alt={props.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
              Joseph Mmwa Media Group
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-between text-xs text-text-mute mb-2">
          <Link 
            to="/category/$slug" 
            params={{ slug: categorySlug }}
            className="label-eyebrow hover:text-gold transition-colors"
          >
            {props.category}
          </Link>
          <span className="font-semibold text-gold">By {props.author}</span>
        </div>

        <Link to="/news/$slug" params={{ slug: props.slug }}>
          <h3 className="font-display font-bold text-xl leading-snug text-foreground group-hover:text-gold transition-colors">
            {props.title}
          </h3>
          <p className="mt-3 text-sm text-text-body line-clamp-3 font-serif">
            {props.excerpt}
          </p>
        </Link>
      </div>

      <div className="px-6 pb-6 pt-2 flex items-center gap-4 text-xs text-text-mute font-mono border-t border-border/40">
        <span>{props.date}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gold" /> {props.read}
        </span>
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      <div className="h-px w-full bg-[linear-gradient(to_right,transparent,rgba(245,166,35,0.45),transparent)]" />
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email });
    setLoading(false);
    if (error) {
      toast.error("Could not subscribe.");
      return;
    }
    setEmail("");
    toast.success("Subscribed successfully.");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div className="rounded-xl p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:items-center" style={{ background: "radial-gradient(ellipse at top right, #3D2800 0%, #251800 45%, #0A0A0A 100%)", border: "1px solid rgba(245, 166, 35, 0.35)" }}>
        <div className="flex-1">
          <h2 className="font-display font-bold text-3xl">The Mmwa Briefing</h2>
          <p className="mt-2 text-text-body font-serif">The day's most important global health and medical news, verified and delivered directly to your inbox</p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-surface-2 border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
          <button disabled={loading} className="bg-gold text-primary-foreground font-semibold px-5 py-3 rounded-md hover:bg-gold-hover">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function PremiumUpsell() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div className="relative overflow-hidden rounded-xl p-8 sm:p-10 lg:p-14" style={{ background: "radial-gradient(ellipse at top left, #3D2800 0%, #251800 45%, #0A0A0A 100%)", border: "1px solid rgba(245, 166, 35, 0.35)" }}>
        <p className="label-eyebrow">Members Only</p>
        <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl">Unlock <span className="text-gold">Premium</span></h2>
        <p className="mt-5 max-w-xl text-text-body font-serif text-lg">
          Unlock exclusive journalism, in-depth investigations, and expert analysis that explains what the headlines really mean
        </p>
        <Link to="/premium" className="mt-8 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-md cursor-pointer">
          Go Premium <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
