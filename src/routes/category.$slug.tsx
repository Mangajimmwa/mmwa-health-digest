import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Newspaper } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const meta = getCategoryMeta(slug);
    const title = `${meta.name} — JOSEPH MMWA`;
    const description = meta.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  "disease-outbreaks": { name: "Disease Outbreaks", description: "Coverage of infectious diseases, epidemics, pandemics, disease surveillance, public health emergencies, outbreak response, emerging pathogens, and global disease alerts." },
  "vaccines-immunization": { name: "Vaccines and Immunization", description: "Vaccine research, approvals, immunization programmes, vaccination campaigns, vaccine policy, vaccine safety, immunology, and global vaccination initiatives." },
  "medical-research": { name: "Medical Research", description: "Peer-reviewed studies, clinical trials, scientific discoveries, laboratory research, academic publications, biomedical science, and evidence-based medical findings." },
  "treatments-innovation": { name: "Treatments and Innovations", description: "New medicines, breakthrough therapies, biotechnology, gene therapy, precision medicine, medical devices, diagnostics, artificial intelligence in healthcare, and healthcare innovation." },
  "public-health": { name: "Public Health", description: "Global health policy, healthcare systems, disease prevention, environmental health, One Health, mental health, health education, health campaigns, humanitarian health, and international public health initiatives." },
  "artificial-intelligence": { name: "Artificial Intelligence", description: "Coverage of artificial intelligence in medicine, machine learning diagnostics, neural networks in healthcare, predictive medical modeling, and digital health technology." },
  "general-news": { name: "General News", description: "General health dispatches, medical updates, press briefings, global health announcements, and breaking news across the healthcare sector." },
  "healthcare": { name: "Healthcare", description: "Hospitals, healthcare delivery, pharmaceuticals, digital health, telemedicine, healthcare regulation, healthcare workforce, insurance, medical infrastructure, and health industry developments." },
  "explainers": { name: "Explainers", description: "Clear, evidence-based articles that simplify complex medical topics, research findings, health myths, medical terminology, and important health issues for everyday readers." },
};

// 🛡️ Fallback generator so NO valid category link ever 404s
function getCategoryMeta(slug: string) {
  const normalizedSlug = slug.toLowerCase().trim();
  if (CATEGORY_META[normalizedSlug]) {
    return CATEGORY_META[normalizedSlug];
  }

  // Convert slug to Title Case (e.g. "artificial-intelligence" -> "Artificial Intelligence")
  const formattedName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    name: formattedName,
    description: `Reporting and verified dispatches under ${formattedName}.`,
  };
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const meta = getCategoryMeta(slug);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["category-articles", slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      // Create a search term with wildcards for flexible matching (e.g., %Artificial Intelligence%)
      const searchTerm = `%${meta.name}%`;

      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,category,featured_image")
        .eq("is_published", true)
        .ilike("category", searchTerm)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Category query error:", error);
        return [];
      }

      return data ?? [];
    },
  });

  const count = articles?.length ?? 0;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Topic</p>
        <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl text-white">
          {meta.name}
        </h1>
        <p className="mt-4 max-w-3xl font-serif" style={{ color: "#D4D4D4" }}>
          {meta.description}
        </p>
        <p className="mt-3 text-sm text-gold font-semibold">
          {count} {count === 1 ? "article" : "articles"}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {count === 0 && !isLoading ? (
            <div className="col-span-full bg-card border border-border rounded-xl p-12 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-display font-bold text-2xl">
                No articles in this category yet
              </h3>
              <p className="mt-3 text-text-body font-serif max-w-xl mx-auto">
                Check back soon for verified reporting on {meta.name.toLowerCase()}.
              </p>
              <Link
                to="/news"
                className="mt-6 inline-flex items-center gap-2 border border-gold text-gold font-semibold px-5 py-2.5 rounded-full hover:bg-gold/10"
              >
                Browse all news
              </Link>
            </div>
          ) : (
            articles?.map((a) => (
              <Link
                key={a.id}
                to="/news/$slug"
                params={{ slug: a.slug }}
                className="group block bg-card border border-border rounded-lg overflow-hidden card-lift cursor-pointer"
              >
                <div className="aspect-[16/10] bg-surface-1 relative overflow-hidden border-b border-border">
                  {a.featured_image ? (
                    <img 
                      src={a.featured_image} 
                      alt={a.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-1 flex items-center justify-center text-text-mute font-mono text-xs">
                      Mmwa Health Digest
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="label-eyebrow">{a.category || meta.name}</span>
                  <h3 className="mt-3 font-display font-bold text-xl leading-snug group-hover:text-gold transition-colors">{a.title}</h3>
                  {a.excerpt && (
                    <p className="mt-3 text-sm text-text-body font-serif line-clamp-3">{a.excerpt}</p>
                  )}
                  <div className="mt-5 flex items-center gap-4 text-xs text-text-mute">
                    {a.published_at && (
                      <span>{new Date(a.published_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {a.read_time_minutes} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
