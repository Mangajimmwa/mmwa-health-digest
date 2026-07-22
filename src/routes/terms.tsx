import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const CANONICAL = "https://mmwa-health-digest.lovable.app/terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Joseph Mmwa Media Group" },
      {
        name: "description",
        content:
          "The terms that govern your use of josephmmwa.com, including acceptable use, medical disclaimer, intellectual property and limitation of liability.",
      },
      { property: "og:title", content: "Terms of Service — Joseph Mmwa Media Group" },
      {
        property: "og:description",
        content:
          "Terms governing use of josephmmwa.com — acceptable use, medical disclaimer, IP, and liability.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const updated = "July 22, 2026";
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        <header className="mb-10 pb-8 border-b border-border">
          <p className="label-eyebrow text-gold font-sans font-semibold text-xs tracking-widest uppercase">Legal Desk</p>
          <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-text-mute font-mono">Last Updated: {updated}</p>
        </header>

        <div className="space-y-8 text-text-body font-serif leading-relaxed">
          <p className="text-lg leading-relaxed">
            Welcome to <strong>Joseph Mmwa Media Group</strong> ("Joseph Mmwa Media Group," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of{" "}
            <a href="https://www.josephmmwa.com" className="text-gold hover:text-gold-hover underline transition-colors">
              https://www.josephmmwa.com
            </a>{" "}
            (the "Site"), including all articles, newsletters, premium content, services, and features offered through the Site.
          </p>
          <p className="text-lg leading-relaxed">
            By accessing or using the Site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the Site.
          </p>

          <Section title="1. About Our Services">
            <p>
              Joseph Mmwa Media Group is an independent global health news and medical journalism platform dedicated to publishing accurate, evidence-based reporting on medicine, public health, infectious diseases, scientific research, healthcare policy, and global health developments.
            </p>
            <p>Our content is intended for informational, educational, and journalistic purposes only.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>By using the Site, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are at least 18 years old or have permission from a parent or legal guardian.</li>
              <li>You have the legal capacity to enter into these Terms.</li>
              <li>You will use the Site in compliance with all applicable laws and regulations.</li>
            </ul>
          </Section>

          <Section title="3. User Responsibilities">
            <p>You agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Site only for lawful purposes.</li>
              <li>Provide accurate information when creating an account or contacting us.</li>
              <li>Keep your login credentials confidential.</li>
              <li>Be responsible for all activity under your account.</li>
              <li>Respect other users and our editorial staff.</li>
              <li>Comply with all applicable laws while using the Site.</li>
            </ul>

            <p className="mt-4 font-sans font-semibold text-foreground">You must not:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Copy or republish our content without permission.</li>
              <li>Scrape, harvest, or automatically extract content from the Site.</li>
              <li>Use AI systems, bots, or automated tools to reproduce or redistribute our articles without written authorization.</li>
              <li>Reverse engineer, hack, interfere with, or disrupt the Site or its infrastructure.</li>
              <li>Attempt unauthorized access to our systems.</li>
              <li>Upload malicious software, viruses, or harmful code.</li>
              <li>Post unlawful, abusive, defamatory, fraudulent, misleading, or infringing content.</li>
              <li>Impersonate another person or organization.</li>
            </ul>
            <p className="mt-2 text-sm italic text-text-mute">Violation of these Terms may result in suspension or permanent termination of your access.</p>
          </Section>

          <Section title="4. Editorial Independence">
            <p>Joseph Mmwa Media Group maintains full editorial independence.</p>
            <p>Our reporting is produced according to journalistic standards of accuracy, fairness, and evidence-based reporting.</p>
            <p>Opinion pieces and commentary represent the views of their respective authors unless expressly stated otherwise.</p>
          </Section>

          <Section title="5. Accuracy of Information">
            <p>We strive to ensure that all published information is accurate, reliable, and up to date.</p>
            <p>However:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>News develops rapidly.</li>
              <li>Scientific understanding evolves.</li>
              <li>Official guidance may change after publication.</li>
            </ul>
            <p>Accordingly, we do not guarantee that all content will always remain complete, accurate, or current. Articles may be updated, corrected, revised, or removed without prior notice.</p>
          </Section>

          <Section title="6. Medical Information Disclaimer">
            <div className="bg-surface-2 border-l-4 border-gold p-4 rounded-r-lg my-4">
              <p>
                The content published on this Site is provided solely for general informational, educational, and journalistic purposes. It is <strong>not</strong> intended to replace professional medical advice, diagnosis, or treatment.
              </p>
            </div>
            <p>Always seek advice from a qualified healthcare professional regarding any medical condition or health concern. Never ignore or delay seeking professional medical advice because of something you have read on this Site.</p>
            <p>Your reliance on any information provided by Joseph Mmwa Media Group is entirely at your own risk.</p>
          </Section>

          <Section title="7. Premium Membership and Subscriptions">
            <p>Certain content or services may require a paid subscription. By purchasing a subscription, you agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Pay all applicable subscription fees.</li>
              <li>Provide accurate payment information.</li>
              <li>Comply with any applicable subscription terms displayed during purchase.</li>
            </ul>
            <p className="mt-4">Unless otherwise stated:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Subscriptions automatically renew until cancelled.</li>
              <li>You may cancel your subscription at any time.</li>
              <li>Subscription fees already paid are generally non-refundable except where required by applicable law.</li>
            </ul>
            <p>We reserve the right to modify subscription pricing or benefits at any time with reasonable notice.</p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content on the Site, including but not limited to articles, investigations, graphics, photographs, videos, audio, logos, databases, website design, software, and source code is owned by Joseph Mmwa Media Group or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-sans text-sm">
              <div className="bg-surface-1 border border-border p-4 rounded-lg">
                <p className="font-bold text-gold mb-2">You May:</p>
                <ul className="list-disc pl-4 space-y-1 text-text-body">
                  <li>Read our content.</li>
                  <li>Share links to our articles.</li>
                  <li>Quote limited portions with proper attribution where permitted by law.</li>
                </ul>
              </div>
              <div className="bg-surface-1 border border-border p-4 rounded-lg">
                <p className="font-bold text-red-400 mb-2">You May Not:</p>
                <ul className="list-disc pl-4 space-y-1 text-text-body">
                  <li>Republish entire articles.</li>
                  <li>Sell or license our content.</li>
                  <li>Modify our content.</li>
                  <li>Reproduce our work for commercial purposes without written permission.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="9. User-Generated Content">
            <p>
              If you submit comments, messages, photographs, suggestions, or other materials to the Site, you grant Joseph Mmwa Media Group a non-exclusive, worldwide, royalty-free license to use, display, reproduce, publish, and distribute that content in connection with the operation and promotion of the Site.
            </p>
            <p>You represent that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You own the content or have permission to submit it.</li>
              <li>Your submission does not violate any law.</li>
              <li>Your submission does not infringe the rights of any third party.</li>
            </ul>
            <p>We reserve the right to remove or moderate user content at our sole discretion.</p>
          </Section>

          <Section title="10. Copyright Complaints">
            <p>
              Joseph Mmwa Media Group respects intellectual property rights. If you believe content published on the Site infringes your copyright, please contact us with sufficient information to identify the allegedly infringing material. We will investigate all legitimate claims and take appropriate action where necessary.
            </p>
          </Section>

          <Section title="11. External Links">
            <p>Our Site may contain links to third-party websites or resources. These links are provided solely for convenience.</p>
            <p>Joseph Mmwa Media Group does not endorse or assume responsibility for third-party content, privacy practices, security, accuracy, or availability of external websites. Your use of third-party websites is entirely at your own risk.</p>
          </Section>

          <Section title="12. Advertising and Sponsored Content">
            <p>The Site may display advertisements, affiliate links, or sponsored content. Sponsored content will be identified where appropriate.</p>
            <p>The presence of advertising does not influence our editorial independence or news reporting.</p>
          </Section>

          <Section title="13. Account Suspension and Termination">
            <p>We reserve the right to suspend, restrict, or permanently terminate your account or access to the Site, with or without notice, if you:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Violate these Terms;</li>
              <li>Engage in unlawful activity;</li>
              <li>Attempt to compromise Site security;</li>
              <li>Misuse Premium services;</li>
              <li>Engage in conduct harmful to the Site or its users.</li>
            </ul>
            <p>Termination does not affect any rights or obligations that accrued before termination.</p>
          </Section>

          <Section title="14. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, the Site and all content are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              Joseph Mmwa Media Group shall not be liable for any direct or indirect damages, loss of profits, loss of revenue, business interruption, data loss, goodwill loss, or consequential, incidental, punitive, or special damages arising from or relating to your use of, or inability to use, the Site or its content.
            </p>
          </Section>

          <Section title="15. Force Majeure">
            <p>
              Joseph Mmwa Media Group shall not be liable for delays or failures in performance caused by events beyond our reasonable control, including but not limited to natural disasters, internet outages, cyberattacks, power failures, government actions, public health emergencies, labor disputes, or telecommunications failures.
            </p>
          </Section>

          <Section title="16. Privacy">
            <p>Your use of the Site is also governed by our Privacy Policy and Cookie Policy (where applicable). Please review these policies to understand how we collect, use, and protect your information.</p>
          </Section>

          <Section title="17. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of Kenya.
            </p>
          </Section>

          <Section title="18. Changes to These Terms">
            <p>
              We may revise these Terms from time to time to reflect changes in our services, legal requirements, or business practices. When changes are made, we will update the "Last Updated" date at the top of this page. Your continued use of the Site after revised Terms become effective constitutes acceptance of those changes.
            </p>
          </Section>

          <Section title="19. Contact Us">
            <div className="bg-surface-1 border border-border p-6 rounded-xl font-sans text-sm space-y-2">
              <p className="font-bold text-lg text-foreground mb-1">Joseph Mmwa Media Group</p>
              <p className="text-text-body">
                Email:{" "}
                <a href="mailto:contact@josephmmwa.com" className="text-gold hover:text-gold-hover font-mono underline transition-colors">
                  contact@josephmmwa.com
                </a>
              </p>
              <p className="text-text-body">
                Phone / WhatsApp:{" "}
                <a href="tel:+254729147765" className="text-gold hover:text-gold-hover font-mono underline transition-colors">
                  +254 729 147 765
                </a>
              </p>
              <p className="text-text-body">
                Website:{" "}
                <a href="https://www.josephmmwa.com" className="text-gold hover:text-gold-hover font-mono underline transition-colors">
                  https://www.josephmmwa.com
                </a>
              </p>
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
