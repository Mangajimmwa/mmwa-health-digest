import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const CANONICAL = "https://mmwa-health-digest.lovable.app/privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Joseph Mmwa Media Group" },
      {
        name: "description",
        content:
          "The Privacy Policy of Joseph Mmwa Media Group. Learn how we collect, use, protect, and manage information when you access our health and medical journalism.",
      },
      { property: "og:title", content: "Privacy Policy — Joseph Mmwa Media Group" },
      {
        property: "og:description",
        content:
          "Privacy practices for josephmmwa.com — data collection, cookies, subscriptions, and editorial standards.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const updated = "July 22, 2026";
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        <header className="mb-10 pb-8 border-b border-border">
          <p className="label-eyebrow text-gold font-sans font-semibold text-xs tracking-widest uppercase">Legal Desk</p>
          <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-text-mute font-mono">Last updated: {updated}</p>
        </header>

        <div className="prose-legal space-y-8 text-text-body font-serif leading-relaxed">
          <Section title="1. Introduction">
            <p>
              Welcome to Joseph Mmwa Media Group (“we,” “our,” or “us”).
            </p>
            <p>
              Joseph Mmwa Media Group is an independent health and medical journalism organization dedicated to reporting, analyzing, and explaining the most important developments in healthcare, medicine, science, public health, and global health policy.
            </p>
            <p>
              Through our digital platforms, including{" "}
              <a
                href="https://www.josephmmwa.com"
                className="text-gold hover:text-gold-hover underline transition-colors font-mono text-sm"
              >
                https://www.josephmmwa.com
              </a>
              , we provide evidence-informed journalism designed to help audiences better understand medical breakthroughs, disease prevention, healthcare challenges, scientific discoveries, and issues affecting public health worldwide.
            </p>
            <p>
              This Privacy Policy explains how Joseph Mmwa Media Group collects, uses, protects, and manages information when you access our journalism, interact with our platforms, subscribe to our services, or communicate with our team.
            </p>
            <p>
              We are committed to protecting user privacy while maintaining the highest standards of responsible journalism, transparency, and digital security.
            </p>
          </Section>

          <Section title="2. About Joseph Mmwa Media Group">
            <p>
              Joseph Mmwa Media Group operates as a health and medical journalism organization focused on producing accessible, accurate, and responsible reporting on issues that affect human health.
            </p>
            <p>Our journalism covers areas including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Medical research and scientific discoveries</li>
              <li>Disease outbreaks and global health emergencies</li>
              <li>Vaccines, treatments, and healthcare innovations</li>
              <li>Public health policies and healthcare systems</li>
              <li>Health inequalities and access to care</li>
              <li>Expert perspectives and evidence-based health information</li>
            </ul>
            <p className="mt-4">
              Our mission is to bridge the gap between complex medical science and the public by transforming reliable scientific information into clear, understandable journalism.
            </p>
            <p>
              We aim to support informed health decisions by providing accurate reporting while maintaining editorial independence and journalistic integrity.
            </p>
          </Section>

          <Section title="3. Information We Collect">
            <p>
              Joseph Mmwa Media Group may collect information from users through interactions with our digital platforms, including:
            </p>

            <div className="bg-surface-1 border border-border p-5 rounded-lg mt-4 space-y-4 font-sans">
              <div>
                <p className="font-bold text-foreground text-base mb-2 font-display">Information You Provide</p>
                <p className="text-xs text-text-mute mb-2">This may include:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-body font-serif">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Subscription information</li>
                  <li>Messages submitted through communication channels</li>
                  <li>Feedback, inquiries, or correspondence with our editorial team</li>
                  <li>Payment details processed securely through authorized third-party providers</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-bold text-foreground text-base mb-2 font-display">Information Collected Automatically</p>
                <p className="text-xs text-text-mute mb-2">When users access our platforms, we may collect technical information including:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-body font-serif">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Pages viewed</li>
                  <li>Reading activity</li>
                  <li>Website interaction patterns</li>
                  <li>General geographic information</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm text-text-mute">
              This information helps us improve our journalism, understand audience needs, enhance website performance, and maintain platform security.
            </p>
          </Section>

          <Section title="4. How We Use Information">
            <p>Joseph Mmwa Media Group may use collected information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deliver health and medical journalism to our audiences</li>
              <li>Improve editorial content and reader experience</li>
              <li>Provide newsletters and updates</li>
              <li>Manage subscriptions and premium services</li>
              <li>Understand how audiences engage with health information</li>
              <li>Improve website security and reliability</li>
              <li>Communicate with readers</li>
              <li>Prevent misuse, fraud, or unauthorized access</li>
              <li>Meet legal obligations</li>
            </ul>
          </Section>

          <Section title="5. Health Information and Medical Privacy">
            <p>
              Joseph Mmwa Media Group publishes health journalism intended for public education and awareness.
            </p>
            <p>
              We do not collect personal health records, medical histories, diagnoses, or patient information through normal website use.
            </p>
            <p>
              Readers should not submit confidential medical information through general communication channels unless specifically requested through an appropriate process.
            </p>
            <p>
              Any health-related information voluntarily shared with us will be handled responsibly and protected in accordance with applicable privacy standards.
            </p>
            <div className="bg-surface-2 border-l-4 border-gold p-4 rounded-r-lg my-4 text-sm">
              <p>
                Our journalism is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </Section>

          <Section title="6. Editorial Integrity and Responsible Health Reporting">
            <p>
              As a health and medical journalism organization, Joseph Mmwa Media Group is committed to responsible reporting practices, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Relying on credible scientific research and authoritative health sources</li>
              <li>Clearly distinguishing news reporting from opinion or commentary</li>
              <li>Avoiding misleading medical claims</li>
              <li>Presenting health information accurately and responsibly</li>
            </ul>
            <p className="mt-3">
              Privacy protections apply alongside our commitment to serving the public interest through journalism.
            </p>
          </Section>

          <Section title="7. Cookies, Analytics, and Digital Technologies">
            <p>
              We use cookies and similar technologies to improve the performance and accessibility of our platforms.
            </p>
            <p>These technologies help us:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Understand reader engagement</li>
              <li>Improve content delivery</li>
              <li>Analyze website performance</li>
              <li>Maintain platform security</li>
              <li>Improve user experience</li>
            </ul>
          </Section>

          <Section title="8. Third-Party Services">
            <p>Joseph Mmwa Media Group may use trusted third-party providers for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Website hosting</li>
              <li>Analytics</li>
              <li>Security services</li>
              <li>Payment processing</li>
              <li>Email communication</li>
              <li>Advertising services</li>
            </ul>
            <p className="mt-3">
              These providers process information according to their own privacy policies and security practices. We do not sell personal information.
            </p>
          </Section>

          <Section title="9. Data Protection">
            <p>
              We use reasonable technical and organizational safeguards to protect information from unauthorized access, misuse, loss, or disclosure. However, no internet-based service can guarantee complete security.
            </p>
          </Section>

          <Section title="10. Contact Information">
            <div className="bg-surface-1 border border-border p-6 rounded-xl font-sans text-sm space-y-2">
              <p className="font-bold text-lg text-foreground mb-1">Joseph Mmwa Media Group</p>
              <p className="text-text-mute text-xs italic font-serif">If it's health, it's here.</p>
              <div className="pt-2 space-y-1">
                <p className="text-text-body">
                  Email:{" "}
                  <a
                    href="mailto:contact@josephmmwa.com"
                    className="text-gold hover:text-gold-hover font-mono underline transition-colors"
                  >
                    contact@josephmmwa.com
                  </a>
                </p>
                <p className="text-text-body">
                  Phone / WhatsApp:{" "}
                  <a
                    href="tel:+254729147765"
                    className="text-gold hover:text-gold-hover font-mono underline transition-colors"
                  >
                    +254 729 147 765
                  </a>
                </p>
                <p className="text-text-body">
                  Website:{" "}
                  <a
                    href="https://www.josephmmwa.com"
                    className="text-gold hover:text-gold-hover font-mono underline transition-colors"
                  >
                    https://www.josephmmwa.com
                  </a>
                </p>
              </div>
              <p className="pt-4 text-xs text-text-mute font-mono border-t border-border mt-4">
                © 2026 Joseph Mmwa Media Group. All rights reserved.
              </p>
            </div>
          </Section>
        </div>
      </article>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-2">
      <h2 className="font-display font-bold text-2xl text-foreground mb-3 text-gold">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
