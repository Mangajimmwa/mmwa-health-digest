import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const CANONICAL = "https://mmwa-health-digest.lovable.app/privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Joseph Mmwa" },
      {
        name: "description",
        content:
          "How Joseph Mmwa collects, uses and protects your information when you use josephmmwa.com, including Google Sign-In, cookies, subscriptions and your data rights.",
      },
      { property: "og:title", content: "Privacy Policy — Joseph Mmwa" },
      {
        property: "og:description",
        content:
          "Privacy practices for josephmmwa.com — data collection, Google Sign-In, cookies, retention and your rights.",
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
  const updated = "July 4, 2026";
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 lg:px-6 py-14">
        <header className="mb-10">
          <p className="label-eyebrow">Legal</p>
          <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-text-mute">Last updated: {updated}</p>
        </header>

        <div className="prose-legal space-y-8 text-text-body font-serif leading-relaxed">
          <Section title="1. Introduction">
            <p>
              This Privacy Policy explains how Joseph Mmwa ("we", "our", or
              "us") collects, uses, and safeguards information when you visit{" "}
              <a
                href="https://www.josephmmwa.com"
                className="text-gold hover:text-gold-hover"
              >
                https://www.josephmmwa.com
              </a>{" "}
              (the "Site"). By using the Site you agree to the practices
              described here. If you do not agree, please do not use the Site.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect only information necessary to operate the Site:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account information</strong> — name, email address and
                profile photo (when provided by Google Sign-In or account
                signup).
              </li>
              <li>
                <strong>Content you submit</strong> — comments, bookmarks,
                messages sent through the contact form, and newsletter
                subscription details.
              </li>
              <li>
                <strong>Technical data</strong> — device type, browser, IP
                address, referring URL, and pages viewed, collected via server
                logs and cookies.
              </li>
            </ul>
          </Section>

          <Section title="3. Google Sign-In Data">
            <p>
              When you choose to sign in with Google, Google shares a limited
              set of profile information with us: your name, email address,
              Google account ID, profile picture, and email verification
              status. We use this information solely to create and maintain
              your reader account on the Site.
            </p>
            <p>
              We do not access your Gmail, Google Drive, contacts, calendar or
              any other Google service. We do not sell, rent or share your
              Google account data with third parties for advertising. Our use
              of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer noopener"
                className="text-gold hover:text-gold-hover"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </Section>

          <Section title="4. Cookies and Analytics">
            <p>
              The Site uses cookies and similar technologies to keep you signed
              in, remember preferences, and understand how the Site is used.
              You may block or delete cookies in your browser settings, but
              some features (such as staying signed in) may not work properly.
            </p>
            <p>
              We may use privacy-respecting analytics to measure aggregate
              traffic and improve editorial coverage. Analytics data does not
              include the content of any personal messages.
            </p>
          </Section>

          <Section title="5. Email Subscriptions">
            <p>
              If you subscribe to our newsletter, we store your email address
              solely to deliver the newsletter and related editorial updates.
              Every email includes an unsubscribe link, and you can also
              request removal by contacting us at the address below.
            </p>
          </Section>

          <Section title="6. Comments and User Accounts">
            <p>
              Comments and other content you post publicly are visible to
              other readers along with your display name and avatar. You are
              responsible for the content you publish. We may remove content
              that violates our Terms of Service.
            </p>
          </Section>

          <Section title="7. How We Use Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To create and secure your account and authenticate sign-in.</li>
              <li>To deliver newsletters, notifications and requested content.</li>
              <li>To respond to inquiries submitted through the contact form.</li>
              <li>To monitor, maintain and improve the Site.</li>
              <li>To detect, prevent and address fraud, abuse or security issues.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="8. Data Security">
            <p>
              We implement reasonable technical and organizational safeguards
              to protect your information, including encrypted connections
              (HTTPS), secure managed database hosting, and role-based access
              controls. No method of transmission or storage is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Third-Party Services">
            <p>
              The Site relies on trusted service providers to operate,
              including authentication (Google Sign-In), database and hosting
              infrastructure, email delivery, and content delivery networks.
              These providers process data on our behalf under their own
              privacy terms. We do not sell your personal information.
            </p>
          </Section>

          <Section title="10. Your Rights">
            <p>
              Depending on your location, you may have the right to access,
              correct, export or delete your personal information, to object
              to or restrict certain processing, and to withdraw consent. To
              exercise any of these rights, contact us using the details
              below.
            </p>
          </Section>

          <Section title="11. Data Deletion Requests">
            <p>
              You can delete your account and associated personal data at any
              time by emailing{" "}
              <a
                href="mailto:mmwajoseph@gmail.com"
                className="text-gold hover:text-gold-hover"
              >
                mmwajoseph@gmail.com
              </a>{" "}
              with the subject line "Delete my account". We will confirm your
              identity and remove your personal information from active
              systems within 30 days, except where retention is required by
              law.
            </p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>
              The Site is not directed to children under 13, and we do not
              knowingly collect personal information from children. If you
              believe a child has provided us with personal information,
              please contact us and we will delete it.
            </p>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be reflected by updating the "Last updated" date
              above and, where appropriate, by notice on the Site. Continued
              use of the Site after changes take effect constitutes acceptance
              of the revised policy.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              For privacy questions or requests, contact:
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
