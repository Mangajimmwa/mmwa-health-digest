import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import josephImg from "@/assets/joseph.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Joseph Mmwa — Medical & Health Journalist" },
      {
        name: "description",
        content: "Joseph Mmwa is an independent medical and health journalist based in Kenya, reporting on global health.",
      },
      { property: "og:title", content: "About — JOSEPH MMWA" },
      {
        property: "og:description",
        content: "Independent global health journalism from Kenya. If it's health, it's here.",
      },
    ],
  }),
  component: AboutPage,
});

const COVERAGE = [
  "Breaking health and medical news from around the world",
  "Outbreak alerts and public health emergencies",
  "Vaccine development and immunization programs",
  "Medical breakthroughs and clinical trials",
  "Public health policy and global health systems",
  "Evidence-based health explainers",
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[260px_1fr] md:items-start">
          <div>
            <img
              src={josephImg}
              alt="Joseph Mmwa, medical and health journalist"
              className="w-full rounded-xl border border-border object-cover"
              width={1024}
              height={1280}
              loading="lazy"
            />
          </div>
          <div>
            <p className="label-eyebrow">About</p>
            <h1 className="mt-2 font-display font-extrabold text-5xl">Joseph Mmwa</h1>
            <p className="mt-2 text-gold font-medium">Medical & Health Journalist</p>
            <p className="mt-3 italic font-serif text-text-mute">If it's health, it's here.</p>

            <div className="mt-8 space-y-4 font-serif text-text-body text-lg leading-relaxed">
              <p>
                Joseph Mmwa is a medical and health journalist based in Kenya,
                reporting on the global stories that shape how the world prevents,
                diagnoses, and treats disease.
              </p>
              <p>
                His work covers outbreak response, vaccine science, clinical
                research, and the policy decisions that determine who has access to
                care. Joseph reports for an international audience and pairs
                front-line context with the rigor of peer-reviewed evidence.
              </p>
              <p>
                JOSEPH MMWA is an independent publication. It exists to make global
                health news clear, accurate, and useful — not sensational, not
                sponsored, and not delayed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12">
        <div className="bg-card border border-border rounded-xl p-8 lg:p-10">
          <p className="label-eyebrow">What We Cover</p>
          <h2 className="mt-3 font-display font-bold text-3xl">Areas of reporting</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {COVERAGE.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                <span className="font-serif text-text-body">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 lg:px-6 py-16 text-center">
        <p className="label-eyebrow">Editorial Standards</p>
        <h2 className="mt-3 font-display font-bold text-3xl">
          Accurate, evidence-based, globally relevant
        </h2>
        <p className="mt-6 font-serif text-text-body text-lg">
          Every story is grounded in primary sources — peer-reviewed research,
          public health agencies, and named experts. We verify before we publish
          and correct openly when we get something wrong.
        </p>
        <p className="mt-4 font-serif text-text-body text-lg">
          JOSEPH MMWA is independent. We don't run sponsored content disguised as
          reporting and we don't promote treatments without trial data.
        </p>
      </section>
    </SiteLayout>
  );
}
