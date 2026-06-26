import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos & Reels — JOSEPH MMWA" },
      { name: "description", content: "Video reporting and explainers on global health by Joseph Mmwa." },
      { property: "og:title", content: "Videos — JOSEPH MMWA" },
      { property: "og:description", content: "Visual reporting on outbreaks, vaccines, and global health." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-14">
        <p className="label-eyebrow">Videos & Reels</p>
        <h1 className="mt-2 font-display font-bold text-4xl sm:text-5xl">Visual reporting</h1>
        <p className="mt-4 max-w-2xl text-text-body font-serif">
          Field reports, explainers, and short-form video from the global health desk.
        </p>

        <div className="mt-12 bg-card border border-border rounded-xl p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center">
            <Play className="w-6 h-6" />
          </div>
          <h2 className="mt-5 font-display font-bold text-2xl">
            The newsroom is just getting started
          </h2>
          <p className="mt-3 text-text-body font-serif max-w-xl mx-auto">
            Check back soon for verified global health video reporting.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
