import { createFileRoute } from "@tanstack/react-router";
import { Check, Target, Eye, Award, Phone, Mail, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Joseph Mmwa Media Group" },
      {
        name: "description",
        content:
          "Joseph Mmwa Media Group is a health and medical journalism organization dedicated to reporting on the health stories shaping lives around the world.",
      },
      { property: "og:title", content: "About — Joseph Mmwa Media Group" },
      {
        property: "og:description",
        content:
          "Health & Medical Journalism. If it's health, it's here.",
      },
    ],
  }),
  component: AboutPage,
});

const COVERAGE = [
  "Breaking health and medical news",
  "Medical research and scientific discoveries",
  "Disease outbreaks and global public health emergencies",
  "Vaccines, immunization, and infectious diseases",
  "Healthcare systems and public health policy",
  "Biotechnology and healthcare innovation",
  "Medical breakthroughs and emerging treatments",
  "Mental health, nutrition, and preventive healthcare",
  "Environmental and climate-related health issues",
  "Evidence-based medical explainers for everyday readers",
];

const VALUES = [
  {
    title: "Accuracy",
    desc: "Every story is grounded in verified scientific evidence.",
  },
  {
    title: "Integrity",
    desc: "We uphold the highest standards of ethical and responsible journalism.",
  },
  {
    title: "Transparency",
    desc: "We provide context, explain evidence, and acknowledge uncertainty where it exists.",
  },
  {
    title: "Public Service",
    desc: "We produce journalism that contributes to healthier, better-informed communities.",
  },
  {
    title: "Excellence",
    desc: "We are committed to delivering high-quality reporting that meets the highest editorial standards.",
  },
];

function AboutPage() {
  const profileImageUrl =
    "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg";

  return (
    <SiteLayout>
      {/* Hero Header / Profile Section */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-center">
          <div className="w-full max-w-[260px] aspect-[4/5] rounded-xl overflow-hidden border border-border bg-zinc-900 shadow-md">
            <img
              src={profileImageUrl}
              alt="Joseph Mmwa, Health and Medical Journalist"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground tracking-tight">
              Joseph Mmwa
            </h1>
            <p className="mt-2 text-xl font-bold text-gold font-sans">
              Health &amp; Medical Journalist
            </p>
            <p className="mt-3 font-serif italic text-lg text-foreground/90">
              &ldquo;If it&apos;s health, it&apos;s here.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* About Joseph Mmwa */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <h2 className="font-display font-bold text-3xl text-foreground">
          About Joseph Mmwa
        </h2>
        <div className="mt-6 space-y-4 text-text-body text-lg font-serif leading-relaxed">
          <p>
            I am a health and medical journalist reporting on health and medical news, scientific research, healthcare, medicine, public health, and the health stories shaping lives around the world.
          </p>
          <p>
            My work focuses on delivering accurate, evidence-based journalism that helps readers understand the latest developments in medicine, healthcare, and science. From breaking medical news and disease outbreaks to vaccine research, healthcare policy, biotechnology, and scientific breakthroughs, I strive to present complex health topics with clarity, context, and accuracy.
          </p>
          <p>
            I believe quality health journalism should do more than report events—it should explain the science behind the headlines, challenge misinformation, and empower people to make informed decisions about their health. Every story I publish is developed using credible sources and trusted scientific evidence to ensure readers receive reliable, accessible, and meaningful information.
          </p>
          <p>
            My reporting serves healthcare professionals, researchers, policymakers, educators, students, and everyday readers seeking trustworthy journalism on the issues shaping human health.
          </p>
        </div>
      </section>

      {/* About Joseph Mmwa Media Group */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <h2 className="font-display font-bold text-3xl text-foreground">
          About Joseph Mmwa Media Group
        </h2>
        <div className="mt-6 space-y-4 text-text-body text-lg font-serif leading-relaxed">
          <p>
            Joseph Mmwa Media Group is a health and medical journalism organization dedicated to reporting on the health stories shaping lives around the world.
          </p>
          <p>
            We deliver trusted journalism covering health and medical news, scientific research, medicine, healthcare, public health, and global health developments. Our reporting provides readers with accurate, evidence-based coverage of the discoveries, policies, innovations, and public health challenges influencing communities worldwide.
          </p>
          <p>
            We believe health journalism plays an essential role in helping people understand complex medical issues, scientific research, and healthcare developments. Our mission is to transform trusted evidence into clear, accessible journalism that informs public understanding, supports informed decision-making, and promotes scientific literacy.
          </p>
          <p>
            Whether covering breaking medical news, emerging infectious diseases, vaccine developments, healthcare policy, medical research, biotechnology, or public health emergencies, we are committed to delivering journalism that is accurate, responsible, and relevant to a global audience.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 text-gold mb-4">
              <Target className="w-6 h-6" />
              <h3 className="font-display font-bold text-2xl text-foreground">Our Mission</h3>
            </div>
            <p className="text-text-body font-serif text-base leading-relaxed">
              Our mission is to deliver trusted, evidence-based health and medical journalism that informs, educates, and empowers people everywhere. We are committed to making complex medical science understandable and accessible through accurate reporting that strengthens public understanding of health and healthcare.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 text-gold mb-4">
              <Eye className="w-6 h-6" />
              <h3 className="font-display font-bold text-2xl text-foreground">Our Vision</h3>
            </div>
            <p className="text-text-body font-serif text-base leading-relaxed">
              Our vision is to become a trusted global destination for health and medical journalism, recognized for delivering reliable reporting that advances public understanding of medicine, science, and global health.
            </p>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <h2 className="font-display font-bold text-3xl text-foreground">What We Cover</h2>
        <p className="mt-3 text-text-body text-lg font-serif">
          Our newsroom provides comprehensive coverage of:
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {COVERAGE.map((c) => (
            <li key={c} className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-text-body font-serif text-base">{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 italic text-text-body font-serif text-base">
          Every story we publish is designed to help readers understand not only what is happening, but why it matters.
        </p>
      </section>

      {/* Our Core Values */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12 border-b border-border">
        <h2 className="font-display font-bold text-3xl text-foreground mb-3">Our Values</h2>
        <p className="text-text-body text-lg font-serif mb-8">
          Our work is guided by five core principles:
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 text-gold font-bold font-sans text-lg mb-2">
                <Award className="w-5 h-5" />
                {v.title}
              </div>
              <p className="text-text-body font-serif text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Media Desk Section */}
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-12">
        <div className="rounded-2xl border border-gold/30 p-8 sm:p-10 bg-card relative overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at top left, #261A00 0%, #0A0A0A 100%)",
          }}
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
            Media Desk &amp; Direct Inquiries
          </h2>
          <p className="mt-2 text-sm font-serif text-text-body">
            For news tips, press requests, syndication, or media inquiries, contact our newsroom desk directly:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 font-mono text-xs sm:text-sm">
            <a
              href="tel:+254729147765"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background/80 hover:border-gold/40 transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-gold/10 text-gold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-text-mute font-sans uppercase">Phone / WhatsApp</span>
                <span className="text-foreground font-bold">+254 729 147 765</span>
              </div>
            </a>

            <a
              href="mailto:contact@josephmmwa.com"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background/80 hover:border-gold/40 transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-gold/10 text-gold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-text-mute font-sans uppercase">Email Inquiries</span>
                <span className="text-foreground font-bold">contact@josephmmwa.com</span>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background/80">
              <div className="p-2.5 rounded-lg bg-gold/10 text-gold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-text-mute font-sans uppercase">Bureau Location</span>
                <span className="text-foreground font-bold">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
