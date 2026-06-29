import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/podcasts")({
  head: () => ({
    meta: [
      { title: "Podcast — JOSEPH MMWA" },
      { name: "description", content: "Joseph Mmwa Podcast — Health journalism in audio form. Coming soon." },
    ],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 lg:px-6 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Mic className="w-7 h-7" />
        </div>
        <p className="label-eyebrow mt-6">Audio</p>
        <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl">
          Joseph Mmwa Podcast
        </h1>
        <p className="mt-4 text-text-body font-serif text-lg">
          Coming Soon. Health journalism in audio form.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-full"
        >
          Back to home
        </Link>
      </section>
    </SiteLayout>
  );
}
