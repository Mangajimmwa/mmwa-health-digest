import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Newspaper } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const meta = CATEGORY_META[slug];
    const title = meta ? `${meta.name} — JOSEPH MMWA` : "Category — JOSEPH MMWA";
    const description = meta?.description ?? "Health and medical reporting by topic.";
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
  "vaccines-immunization": { name: "Vaccines & Immunization", description: "Vaccine research, approvals, immunization programmes, vaccination campaigns, vaccine policy, vaccine safety, immunology, and global vaccination initiatives." },
  "medical-research": { name: "Medical Research", description: "Peer-reviewed studies, clinical trials, scientific discoveries, laboratory research, academic publications, biomedical science, and evidence-based medical findings." },
  "treatments-innovation": { name: "Treatments & Innovation", description: "New medicines, breakthrough therapies, biotechnology, gene therapy, precision medicine, medical devices, diagnostics, artificial intelligence in healthcare, and healthcare innovation." },
  "public-health": { name: "Public Health", description: "Global health policy, healthcare systems, disease prevention, environmental health, One Health, mental health, health education, health campaigns, humanitarian health, and international public health initiatives." },
  "healthcare": { name: "Healthcare", description: "Hospitals, healthcare delivery, pharmaceuticals, digital health, telemedicine, healthcare regulation, healthcare workforce, insurance, medical infrastructure, and health industry developments." },
  "explainers": { name: "Explainers", description: "Clear, evidence-based articles that simplify complex medical topics, research findings, health myths, medical terminology, and important health issues for everyday readers." },
};

function CategoryPage() {
  const { slug } = Route.useParams();
  const meta = CATEGORY_META[slug];
  if (!meta) throw notFound();

  const { data: articles } = useQuery({
    queryKey: ["category-articles", slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,read_time_minutes,published_at,categories!inner(name,slug)")
        .eq("is_published", true)
        .eq("categories.slug", slug)
        .order("published_at", { ascending: false });
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
          {count === 0 ? (
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
            articles!.map((a) => (
              <article key={a.id} className="bg-card border border-border rounded-lg overflow-hidden card-lift">
                <div className="aspect-[16/10] bg-gradient-to-br from-surface-2 to-surface-1" />
                <div className="p-6">
                  <span className="label-eyebrow">{meta.name}</span>
                  <h3 className="mt-3 font-display font-bold text-xl leading-snug">{a.title}</h3>
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
              </article>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
