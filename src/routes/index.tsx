import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Lock,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react";
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
        content:
          "Real-time medical news, outbreak updates, and global health reporting from Joseph Mmwa. If it's health, it's here.",
      },
      { property: "og:title", content: "JOSEPH MMWA — Global Health News" },
      {
        property: "og:description",
        content: "Independent medical journalism — outbreaks, vaccines, research, policy.",
      },
    ],
  }),
  component: Home,
});




const PLACEHOLDER_ARTICLES = [
  {
    category: "Outbreaks",
    title: "WHO tracks new respiratory cluster across three continents",
    excerpt:
      "Surveillance teams in Asia, Europe and Africa are coordinating data on an unexplained cluster of respiratory infections in adults.",
    date: "Jun 26, 2026",
    read: "5 min read",
  },
  {
    category: "Vaccines",
    title: "Universal flu candidate enters phase III in five countries",
    excerpt:
      "A nanoparticle-based universal influenza vaccine has cleared phase II safety review and begins large-scale efficacy testing.",
    date: "Jun 25, 2026",
    read: "7 min read",
  },
  {
    category: "Medical Research",
    title: "CRISPR-edited T cells show durable remission in late-stage trial",
    excerpt:
      "Three-year follow-up data points to lasting response in patients with refractory leukemia, researchers report this week.",
    date: "Jun 24, 2026",
    read: "6 min read",
  },
];

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
      <SectionDivider />
      <CategoriesStrip />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative bg-background overflow-hidden min-h-[90vh] flex items-center">
      {/* Flat world map background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <img
          src="/world-map.svg"
          alt=""
          className="w-[120%] max-w-none opacity-[0.10] md:opacity-[0.12] [filter:blur(3px)] max-md:opacity-[0.06]"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 lg:px-6 pt-28 pb-32 lg:pt-40 lg:pb-44">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold">
          Global Health Desk
        </span>
        <h1 className="mt-6 font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-4xl">
          <span className="text-foreground">GLOBAL HEALTH NEWS</span>
          <br />
          <span className="text-gold">YOU CAN TRUST</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-body font-serif">
          Real-time medical news, outbreak updates, and global health reporting
          from Joseph Mmwa.
        </p>
        <p className="mt-3 font-display italic text-white text-lg">If it's health, it's here.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-bold px-7 py-3.5 rounded-full hover:bg-gold-hover transition-colors"
          >
            Read Latest News <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 border border-gold text-gold font-semibold px-7 py-3.5 rounded-full hover:bg-gold/10 transition-colors"
          >
            <Lock className="w-4 h-4" /> Go Premium
          </Link>
        </div>
      </div>
    </section>
  );
}

function Latest() {
  const { data: articles } = useQuery({
    queryKey: ["articles", "latest"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,featured_image,read_time_minutes,published_at,categories(name)")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const items =
    articles && articles.length > 0
      ? articles.map((a) => ({
          category: (a.categories as { name?: string } | null)?.name ?? "News",
          title: a.title,
          excerpt: a.excerpt ?? "",
          date: a.published_at
            ? new Date(a.published_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          read: `${a.read_time_minutes} min read`,
        }))
      : PLACEHOLDER_ARTICLES;

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-eyebrow">Latest Stories</p>
          <h2 className="mt-2 font-display font-bold text-3xl sm:text-4xl">
            From the newsroom
          </h2>
        </div>
        <Link
          to="/news"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-gold hover:text-gold-hover"
        >
          All stories <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a, i) => (
          <ArticleCard key={i} {...a} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 border border-gold text-gold font-semibold px-6 py-3 rounded-md hover:bg-gold/10"
        >
          Load More
        </Link>
      </div>
    </section>
  );
}

function ArticleCard(props: {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
}) {
  return (
    <article className="group bg-card border border-border rounded-lg overflow-hidden card-lift">
      <div className="aspect-[16/10] bg-gradient-to-br from-surface-2 to-surface-1 relative">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(245,166,35,0.15),transparent_60%)]" />
      </div>
      <div className="p-6">
        <span className="label-eyebrow">{props.category}</span>
        <h3 className="mt-3 font-display font-bold text-xl leading-snug text-foreground group-hover:text-gold transition-colors">
          {props.title}
        </h3>
        <p className="mt-3 text-sm text-text-body line-clamp-3 font-serif">
          {props.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-4 text-xs text-text-mute">
          <span>{props.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {props.read}
          </span>
        </div>
      </div>
    </article>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      <div className="h-px w-full bg-gold/20" />
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
      if (error.code === "23505") toast.success("You're already subscribed.");
      else toast.error("Could not subscribe. Try again.");
      return;
    }
    setEmail("");
    toast.success("Subscribed. Watch your inbox tomorrow morning.");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div
        className="border border-gold/30 rounded-xl p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:items-center"
        style={{ background: "var(--gradient-newsletter)" }}
      >
        <div className="shrink-0 w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-3xl">The Mmwa Briefing</h2>
          <p className="mt-2 text-text-body font-serif">
            One concise email each morning. Outbreaks, breakthroughs, and the global
            health stories that matter — written by Joseph Mmwa.
          </p>
          <p className="mt-1 text-xs text-text-mute">Join 4,200+ readers. No spam. Unsubscribe anytime.</p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-surface-2 border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-text-mute focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-72"
          />
          <button
            disabled={loading}
            className="bg-gold text-primary-foreground font-semibold px-5 py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
          >
            {loading ? "..." : "Subscribe Free"}
          </button>
        </form>
      </div>
    </section>
  );
}

function PremiumUpsell() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <div
        className="rounded-xl border border-gold/30 p-10 lg:p-14"
        style={{ background: "var(--gradient-premium-radial)" }}
      >
        <p className="label-eyebrow">Members Only</p>
        <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl">
          Unlock <span className="text-gold">Premium</span>
        </h2>
        <p className="mt-5 max-w-2xl text-text-body font-serif text-lg">
          Exclusive global health and medical reporting, in-depth outbreak
          analysis, early access to major health stories, premium video updates,
          and detailed coverage of the medical developments shaping the world.
        </p>
        <Link
          to="/premium"
          className="mt-8 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-md hover:bg-gold-hover"
        >
          Go Premium <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function CategoriesStrip() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("sort_order");
      return data ?? [];
    },
  });
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
      <p className="label-eyebrow">Explore</p>
      <h2 className="mt-2 font-display font-bold text-3xl">Browse by topic</h2>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {(data ?? []).map((c) => (
          <Link
            key={c.id}
            to="/categories"
            className="shrink-0 bg-card border border-border rounded-lg px-5 py-3 text-sm font-medium text-text-body hover:text-gold hover:border-gold/40 transition-colors whitespace-nowrap"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
