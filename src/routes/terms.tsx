import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const CANONICAL = "https://mmwa-health-digest.lovable.app/terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Joseph Mmwa" },
      {
        name: "description",
        content:
          "The terms that govern your use of josephmmwa.com, including acceptable use, medical disclaimer, intellectual property and limitation of liability.",
      },
      { property: "og:title", content: "Terms of Service — Joseph Mmwa" },
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
  const updated = "July 4, 2026";
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        <header className="mb-10">
          <p className="label-eyebrow">Legal</p>
          <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-text-mute">Last updated: {updated}</p>
        </header>

        <div className="space-y-8 text-text-body font-serif leading-relaxed">
          <Section title="1. Acceptance of Terms">
            <p>
              These Terms of Service ("Terms") govern your access to and use
              of{" "}
              <a
                href="https://www.josephmmwa.com"
                className="text-gold hover:text-gold-hover"
              >
                https://www.josephmmwa.com
              </a>{" "}
              (the "Site"), operated by Joseph Mmwa ("we", "our", or "us"). By
              accessing or using the Site, you agree to be bound by these
              Terms and by our Privacy Policy. If you do not agree, do not use
              the Site.
            </p>
          </Section>

          <Section title="2. Purpose of the Site">
            <p>
              The Site is an independent editorial publication providing
              medical, health and public-health news, analysis and
              commentary. Content is produced for general informational and
              educational purposes only.
            </p>
          </Section>

          <Section title="3. User Responsibilities">
            <p>You agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Site only for lawful purposes.</li>
              <li>
                Provide accurate information when creating an account or
                submitting the contact form.
              </li>
              <li>Keep your account credentials confidential.</li>
              <li>
                Not attempt to interfere with, disrupt, reverse-engineer, or
                gain unauthorized access to the Site or its underlying
                systems.
              </li>
              <li>
                Not use the Site to transmit unlawful, defamatory, harassing,
                infringing or otherwise objectionable content.
              </li>
            </ul>
          </Section>

          <Section title="4. Intellectual Property">
            <p>
              All content on the Site — including articles, photographs,
              graphics, logos, videos, audio, and the underlying design and
              code — is owned by Joseph Mmwa or its licensors and is protected
              by copyright, trademark and other laws. You may view and share
              links to our content for personal, non-commercial use. Any other
              reproduction, distribution, republication or commercial use
              requires prior written permission.
            </p>
          </Section>

          <Section title="5. External Links">
            <p>
              The Site may contain links to third-party websites or resources.
              We provide those links for convenience only and do not endorse
              or assume responsibility for the content, policies or practices
              of any third party. Your use of third-party sites is at your own
              risk and subject to their terms.
            </p>
          </Section>

          <Section title="6. Medical Information Disclaimer">
            <p>
              Content on the Site is provided for general informational and
              educational purposes only and is <strong>not</strong> medical
              advice, diagnosis or treatment. Always seek the advice of a
              qualified healthcare provider with any questions you may have
              regarding a medical condition. Never disregard professional
              medical advice or delay in seeking it because of something you
              have read on the Site. Reliance on any information provided by
              the Site is solely at your own risk.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, the Site and its content
              are provided "as is" and "as available" without warranties of
              any kind, whether express or implied. Joseph Mmwa shall not be
              liable for any indirect, incidental, special, consequential or
              punitive damages, or any loss of profits, revenue, data or
              goodwill, arising out of or in connection with your use of, or
              inability to use, the Site.
            </p>
          </Section>

          <Section title="8. User-Generated Content">
            <p>
              If you submit comments, messages or other materials to the Site,
              you grant us a non-exclusive, worldwide, royalty-free license to
              use, display, reproduce and distribute that content in
              connection with the Site. You represent that you have the right
              to submit such content and that it does not violate any law or
              third-party rights. We reserve the right to remove any content
              at our discretion.
            </p>
          </Section>

          <Section title="9. Account Usage">
            <p>
              You are responsible for all activity that occurs under your
              account. We may suspend or terminate your account at any time,
              with or without notice, if we believe you have violated these
              Terms or engaged in conduct that is harmful to the Site or
              other users. You may close your account at any time by
              contacting us.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the Republic of Kenya, without regard to its
              conflict-of-laws principles. You agree to submit to the
              exclusive jurisdiction of the courts located in Kenya to
              resolve any dispute arising out of these Terms or your use of
              the Site.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may modify these Terms from time to time. When we do, we
              will update the "Last updated" date above. Continued use of the
              Site after changes take effect constitutes acceptance of the
              updated Terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about these Terms should be directed to:
              <br />
              Joseph Mmwa
              <br />
              Email:{" "}
              <a
                href="mailto:mmwajoseph@gmail.com"
                className="text-gold hover:text-gold-hover"
              >
                mmwajoseph@gmail.com
              </a>
              <br />
              Website:{" "}
              <a
                href="https://www.josephmmwa.com"
                className="text-gold hover:text-gold-hover"
              >
                https://www.josephmmwa.com
              </a>
            </p>
          </Section>
        </div>
      </article>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
