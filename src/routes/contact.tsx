import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JOSEPH MMWA" },
      { name: "description", content: "Contact Joseph Mmwa — medical and health journalist. Press, tips, and inquiries." },
      { property: "og:title", content: "Contact — JOSEPH MMWA" },
      { property: "og:description", content: "Reach the global health desk." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(10).max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the form");
      return;
    }
    setSending(true);
    // Open user's mail client as a reliable v1 delivery; real form submission can be wired to an edge function later.
    const body = `From: ${form.name} <${form.email}>\n\n${form.message}`;
    window.location.href = `mailto:mmwajoseph@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => setSending(false), 500);
  }

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <section className="mx-auto max-w-5xl px-4 lg:px-6 py-16">
        <p className="label-eyebrow">Contact</p>
        <h1 className="mt-2 font-display font-extrabold text-5xl">Get In Touch</h1>
        <p className="mt-6 max-w-2xl text-text-body font-serif">
          Have a story tip, press inquiry, correction request, or partnership
          proposal? We welcome all genuine correspondence from readers,
          healthcare professionals, researchers, and media organizations.
        </p>
        <p className="mt-4 max-w-2xl text-text-body font-serif">
          For general questions or feedback, use the form below. For urgent
          matters, reach us directly by email or phone.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4">
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
                maxLength={100}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                required
                maxLength={255}
              />
            </Field>
            <Field label="Subject">
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input"
                required
                maxLength={150}
              />
            </Field>
            <Field label="Message">
              <textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
                required
                maxLength={2000}
              />
            </Field>
            <button
              disabled={sending}
              className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-md hover:bg-gold-hover disabled:opacity-60"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>

          <aside className="space-y-4">
            <a
              href="mailto:mmwajoseph@gmail.com"
              className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 hover:border-gold/40"
            >
              <Mail className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-text-mute">Email</p>
                <p className="font-medium">mmwajoseph@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:+254729147765"
              className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 hover:border-gold/40"
            >
              <Phone className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-text-mute">Phone</p>
                <p className="font-medium">+254 729 147 765</p>
              </div>
            </a>
            <p className="text-sm text-text-body font-serif px-1">
              We aim to respond to all inquiries within 48 hours. For breaking
              health tips or confidential source contact, email is strongly
              preferred.
            </p>
          </aside>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          color: var(--foreground);
        }
        .input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 2px rgba(245,166,35,0.25); }
      `}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-text-mute mb-1.5">{label}</span>
      {children}
    </label>
  );
}
