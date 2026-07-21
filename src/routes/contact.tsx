import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Mail, Send, Paperclip, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Joseph Mmwa Media Group" },
      { name: "description", content: "Contact Joseph Mmwa Media Group — Health & Medical Journalism Organization. Press tips, editorial questions, and partnership inquiries." },
      { property: "og:title", content: "Contact Us — Joseph Mmwa Media Group" },
      { property: "og:description", content: "Reach our global health newsroom, submit story tips, or connect for media partnerships." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  organization: z.string().trim().max(150).optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "Story Tip",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFile(selectedFile);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the required fields");
      return;
    }
    setSending(true);

    const attachmentNote = file ? `\n\n[Attached File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)]` : "";
    const orgNote = form.organization ? `Organization: ${form.organization}\n` : "";
    
    const body = `From: ${form.name} <${form.email}>\n${orgNote}Inquiry Type: ${form.inquiryType}\n\n${form.message}${attachmentNote}`;
    
    window.location.href = `mailto:josephmmwamedia@outlook.com?subject=${encodeURIComponent(`[${form.inquiryType}] ${form.subject}`)}&body=${encodeURIComponent(body)}`;
    
    setTimeout(() => {
      setSending(false);
      toast.success("Opening email client to send message...");
    }, 500);
  }

  return (
    <SiteLayout>
      <Toaster theme="dark" position="top-right" />
      <section className="mx-auto max-w-6xl px-4 lg:px-6 py-16">
        
        {/* Header Section */}
        <header className="max-w-3xl border-b border-border pb-10 mb-12">
          <p className="label-eyebrow text-gold font-sans font-semibold text-xs tracking-widest uppercase">Global Newsroom Desk</p>
          <h1 className="mt-2 font-display font-black text-4xl sm:text-5xl text-foreground">Contact Us</h1>
          <p className="mt-4 text-lg text-text-body font-serif font-medium leading-relaxed">
            We welcome inquiries from readers, healthcare professionals, researchers, organizations, and media partners.
          </p>
          <p className="mt-3 text-sm text-text-body font-serif leading-relaxed">
            Have a story tip, press inquiry, correction request, expert contribution, partnership proposal, or feedback about our health and medical journalism? Our team welcomes thoughtful correspondence from individuals and organizations interested in advancing accurate health information.
          </p>
          <p className="mt-3 text-sm text-text-mute font-serif italic">
            For general inquiries, please use the contact form below. For urgent matters, confidential source communication, or media requests, contact our team directly.
          </p>
        </header>

        {/* Main Grid Section */}
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          
          {/* Left Form Column */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl text-foreground">Contact Form</h2>
              <span className="text-xs text-text-mute font-mono">* Required fields</span>
            </div>

            <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
              
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your Name *">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="input"
                    required
                    maxLength={100}
                  />
                </Field>

                <Field label="Email Address *">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="input"
                    required
                    maxLength={255}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Organization (Optional)">
                  <input
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="Institution, media, or affiliation"
                    className="input"
                    maxLength={150}
                  />
                </Field>

                <Field label="Inquiry Type *">
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="input cursor-pointer"
                    required
                  >
                    <option value="Story Tip">Story Tip</option>
                    <option value="Press Inquiry">Press Inquiry</option>
                    <option value="Editorial Question">Editorial Question</option>
                    <option value="Correction Request">Correction Request</option>
                    <option value="Partnership Proposal">Partnership Proposal</option>
                    <option value="Advertising & Sponsorship">Advertising & Sponsorship</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Subject *">
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Enter subject"
                  className="input"
                  required
                  maxLength={150}
                />
              </Field>

              <Field label="Message *">
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help"
                  className="input resize-none"
                  required
                  maxLength={2000}
                />
              </Field>

              {/* Attach File Section */}
              <div className="pt-1">
                <span className="block text-xs uppercase tracking-wider text-text-mute mb-2 font-semibold">
                  Attach File (Optional)
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-surface-2 border border-border px-4 py-2.5 rounded-md text-xs font-mono text-foreground hover:border-gold/50 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-gold" />
                    {file ? "Change File" : "Choose File"}
                  </button>
                  {file ? (
                    <span className="text-xs text-gold font-mono truncate max-w-[200px]">
                      {file.name}
                    </span>
                  ) : (
                    <span className="text-xs text-text-mute font-mono">
                      Docs, research papers, images (Max 10MB)
                    </span>
                  )}
                </div>
              </div>

              <button
                disabled={sending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground font-bold px-8 py-3.5 rounded-md hover:bg-gold-hover disabled:opacity-60 cursor-pointer transition-colors mt-2"
              >
                <Send className="w-4 h-4" /> Submit Message
              </button>
            </form>
          </div>

          {/* Right Sidebar Column */}
          <aside className="space-y-6">
            
            {/* Card 1: Editorial & General */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 text-gold">
                <Mail className="w-5 h-5 shrink-0" />
                <h3 className="font-display font-bold text-lg text-foreground">Editorial & General Inquiries</h3>
              </div>
              <a
                href="mailto:josephmmwamedia@outlook.com"
                className="block text-gold hover:text-gold-hover font-mono text-sm underline transition-colors break-all"
              >
                josephmmwamedia@outlook.com
              </a>
              <p className="text-xs text-text-body font-serif leading-relaxed">
                For questions about our reporting, health coverage, editorial content, and reader support.
              </p>
            </div>

            {/* Card 2: Media & Partnerships */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <h3 className="font-display font-bold text-lg text-foreground">Media & Partnerships</h3>
              <p className="text-xs text-text-body font-serif leading-relaxed">
                For press inquiries, collaborations, expert interviews, and institutional partnerships, please contact our team via the contact form or directly through email.
              </p>
            </div>

            {/* Card 3: Response Time */}
            <div className="bg-surface-1 border border-border rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-text-mute text-xs uppercase tracking-wider font-semibold">
                <Clock className="w-4 h-4 text-gold" /> Response Time
              </div>
              <p className="text-xs text-text-body font-serif leading-relaxed">
                We aim to respond to genuine inquiries within <strong>48 hours</strong>.
              </p>
            </div>

            {/* Card 4: Confidential Source Notice */}
            <div className="bg-surface-2 border border-gold/30 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-gold font-display font-bold text-sm">
                <ShieldCheck className="w-5 h-5" /> Confidential Sources
              </div>
              <p className="text-xs text-text-body font-serif leading-relaxed">
                For confidential health sources, sensitive research leaks, or urgent newsroom matters, direct email communication is strongly recommended to protect information integrity.
              </p>
            </div>

          </aside>
        </div>

        {/* Footer Note */}
        <footer className="mt-20 pt-8 border-t border-border">
          <div className="bg-surface-1 border border-border p-6 rounded-xl font-sans text-sm space-y-2">
            <p className="font-bold text-lg text-foreground">Joseph Mmwa Media Group</p>
            <p className="text-text-mute text-xs italic font-serif">If it's health, it's here.</p>
            <p className="text-xs text-text-body font-serif pt-1 max-w-3xl leading-relaxed">
              Committed to delivering accurate, accessible, and responsible reporting on health, medicine, science, and global health developments.
            </p>
            <p className="pt-4 text-xs text-text-mute font-mono border-t border-border mt-4">
              © 2026 Joseph Mmwa Media Group. All rights reserved.
            </p>
          </div>
        </footer>

      </section>

      <style>{`
        .input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.75rem 0.9rem;
          font-size: 0.9rem;
          color: var(--foreground);
        }
        .input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 2px rgba(245,166,35,0.25); }
        select.input option {
          background-color: #121212;
          color: #ffffff;
        }
      `}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-text-mute mb-1.5 font-semibold">{label}</span>
      {children}
    </label>
  );
}
