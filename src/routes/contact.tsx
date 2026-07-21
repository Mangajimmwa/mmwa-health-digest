import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Footer } from "../components/site/Footer";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <main className="mx-auto max-w-7xl px-4 lg:px-6 py-12 w-full">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span 
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-4" 
            style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}
          >
            Get In Touch
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-foreground tracking-tight">
            Contact <span className="text-gold">Joseph Mmwa Media Group</span>
          </h1>
          <p className="mt-4 text-base text-text-body font-serif leading-relaxed">
            Have a news tip, press inquiry, or collaboration request? Reach out directly using the details below or send a message through the contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 rounded-xl p-8 border border-border bg-card space-y-6">
            <h2 className="font-display font-bold text-xl text-foreground border-b border-border pb-4">
              Direct Channels
            </h2>

            <div className="space-y-5 font-mono text-sm">
              <a 
                href="tel:+254729147765" 
                className="flex items-center gap-4 text-text-body hover:text-gold transition-colors"
              >
                <div className="p-3 rounded-lg bg-gold/10 text-gold border border-gold/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-text-mute font-sans">Phone / WhatsApp</span>
                  <span className="text-foreground font-semibold">+254 7 291 477 65</span>
                </div>
              </a>

              <a 
                href="mailto:josephmmwamedia@outlook.com" 
                className="flex items-center gap-4 text-text-body hover:text-gold transition-colors"
              >
                <div className="p-3 rounded-lg bg-gold/10 text-gold border border-gold/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-text-mute font-sans">Email Inquiries</span>
                  <span className="text-foreground font-semibold">josephmmwamedia@outlook.com</span>
                </div>
              </a>

              <div className="flex items-center gap-4 text-text-body">
                <div className="p-3 rounded-lg bg-gold/10 text-gold border border-gold/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-text-mute font-sans">Location</span>
                  <span className="text-foreground font-semibold">Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-xl p-8 border border-border bg-card">
            <h2 className="font-display font-bold text-xl text-foreground mb-6">
              Send a Direct Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  placeholder="News Tip / Media Inquiry / Partnership"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-text-mute mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Type your message here..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black hover:bg-gold-hover transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
