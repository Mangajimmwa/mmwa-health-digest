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
        content:
          "Joseph Mmwa is an independent medical and health journalist covering global public health, disease outbreaks, vaccines, and medical research.",
      },
      { property: "og:title", content: "About — JOSEPH MMWA" },
      {
        property: "og:description",
        content:
          "Independent global health journalism. If it's health, it's here.",
      },
    ],
  }),
  component: AboutPage,
});

const COVERAGE = [
  "Breaking global health and medical news",
  "Disease outbreaks and public health emergencies",
  "Vaccine research, development and immunization programs",
  "Medical breakthroughs and emerging treatments",
  "Biotechnology and healthcare innovation",
  "Global health policy and healthcare systems",
  "Mental health, nutrition and preventive health",
  "Environmental health and emerging health threats",
  "Evidence-based medical explainers for everyday readers",
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
            <h1 className="mt-2 font-display font-extrabold text-5xl">
              Joseph Mmwa
            </h1>
            <p className="mt-2 text-gold font-medium">
              Medical &amp; Health Journalist
            </p>
            <p className="mt-3 font-display italic text-white">
              &ldquo;If it's health, it's here.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 pb-16">
        <h2 className="font-display font-bold text-3xl">About Joseph Mmwa</h2>
        <div className="mt-6 space-y-4 text-text-body text-lg leading-relaxed">
          <p>
            I am an independent medical and health journalist covering the
            stories that shape global public health. My reporting spans breaking
            health news, disease outbreaks, vaccine developments, medical
            research, biotechnology, healthcare policy, and scientific
            breakthroughs — delivered with accuracy, clarity, and a commitment
            to public trust.
          </p>
          <p>
            My work bridges the gap between complex medical science and everyday
            understanding. Every story I write is grounded in verified evidence
            and designed to help readers — whether healthcare professionals,
            policymakers, or curious individuals — understand not just what is
            happening, but why it matters.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 pb-16">
        <h2 className="font-display font-bold text-3xl">What I Cover</h2>
        <p className="mt-6 text-text-body text-lg">
          I provide comprehensive coverage of:
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {COVERAGE.map((c) => (
            <li key={c} className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
              <span className="text-text-body">{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 italic text-text-body text-lg">
          Every article I write is created with the goal of making reliable
          medical journalism understandable, relevant, and useful to a global
          audience.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 lg:px-6 pb-16">
        <div className="bg-card border border-border rounded-xl p-8 lg:p-10">
          <h2 className="font-display font-bold text-3xl">
            Our Editorial Standards
          </h2>
          <div className="mt-6 space-y-4 text-text-body text-lg leading-relaxed">
            <p>
              At Joseph Mmwa, accuracy, transparency, and editorial independence
              are non-negotiable.
            </p>
            <p>
              We develop every story from reputable sources — peer-reviewed
              scientific journals, recognized medical institutions, government
              health agencies, and international public health organizations. All
              scientific findings are carefully reviewed before publication to
              ensure they are presented in the correct context, without
              exaggeration or speculation.
            </p>
            <p>
              Our reporting is guided by verified evidence and the public
              interest, never by commercial, political, or ideological
              influence. Where research is still evolving, we clearly explain
              what is known, acknowledge what remains uncertain, and avoid
              overstating conclusions.
            </p>
            <p>
              Our mission is to make the world's most important health stories
              understandable, relevant, and trustworthy — for every reader,
              everywhere.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
