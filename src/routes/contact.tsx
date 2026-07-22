import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

// 🔑 EmailJS Credentials
const SERVICE_ID = "service_ps4chm6";
const TEMPLATE_ID = "template_szgm35p";
const PUBLIC_KEY = "ok_WzsMOvdNEZIMDM";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — JOSEPH MMWA MEDIA GROUP" },
      {
        name: "description",
        content: "Reach out to Joseph Mmwa Media Group for news tips, press inquiries, and collaborations.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formRef.current) return;

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(
        () => {
          toast.success("Message transmitted successfully!");
          setLoading(false);
          setSubmitted(true);
        },
        (error) => {
          console.error("Transmission error:", error);
          toast.error("Failed to transmit message. Please try again.");
          setLoading(false);
        }
      );
  };

  return (
    <SiteLayout>
      <div className="bg-background text-foreground min-h-screen selection:bg-gold/30">
        
        {/* Luxury Hero Banner */}
        <section
          className="relative overflow-hidden border-b border-border/80 py-16 sm:py-24 text-center"
          style={{
            background: "radial-gradient(ellipse at top center, #3A2600 0%, #170E00 50%, #0A0A0A 100%)",
          }}
        >
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[220px] bg-gold/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 lg:px-6 relative z-10">
            <span 
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-gold mb-6 shadow-md"
              style={{ background: "rgba(245, 166, 35, 0.12)", border: "1px solid rgba(245, 166, 35, 0.35)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Get In Touch
            </span>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-foreground tracking-tight uppercase drop-shadow-md">
              CONTACT <span className="text-gold">JOSEPH MMWA MEDIA GROUP</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-text-body font-serif max-w-2xl mx-auto leading-relaxed opacity-90">
              Have a news tip, press inquiry, or collaboration request? Reach out directly using the details below or send a message through the contact form.
            </p>

            {/* Expected Response Time Banner */}
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-xs font-mono text-gold shadow-lg">
              <Clock className="w-4 h-4 shrink-0 text-gold" />
              <span>Standard Newsroom Response Time: <strong>24 – 48 Hours</strong></span>
            </div>
          </div>
        </section>

        {/* Contact Content Grid */}
        <section className="mx-auto max-w-7xl px-4 lg:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Column: Direct Channels & Desk Information */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div 
                className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm relative overflow-hidden flex-1"
                style={{
                  background: "radial-gradient(ellipse at top left, #1A1200 0%, #0D0D0D 100%)",
                }}
              >
                <div className="flex items-center justify-between border-b border-border/80 pb-5 mb-6">
                  <h2 className="font-display font-bold text-xl text-foreground tracking-tight">
                    Direct Desks
                  </h2>
                  <span className="text-[10px] font-mono text-gold uppercase tracking-widest border border-gold/30 px-2.5 py-1 rounded-full bg-gold/5">
                    Official
                  </span>
                </div>

                <div className="space-y-6 font-mono text-sm">
                  {/* Phone / WhatsApp */}
                  <a 
                    href="tel:+254729147765" 
                    className="group flex items-start gap-4 p-3.5 rounded-xl border border-transparent hover:border-gold/30 hover:bg-gold/5 transition-all"
                  >
                    <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-text-mute font-sans uppercase tracking-wider mb-0.5">Phone / WhatsApp</span>
                      <span className="text-foreground font-bold group-hover:text-gold transition-colors text-base">+254 729 147 765</span>
                      <span className="block text-[10px] text-text-mute/70 font-serif mt-1">Available for press calls &amp; urgent leads</span>
                    </div>
                  </a>

                  {/* Email Inquiries */}
                  <a 
                    href="mailto:contact@josephmmwa.com" 
                    className="group flex items-start gap-4 p-3.5 rounded-xl border border-transparent hover:border-gold/30 hover:bg-gold/5 transition-all"
                  >
                    <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-text-mute font-sans uppercase tracking-wider mb-0.5">Email Inquiries</span>
                      <span className="text-foreground font-bold group-hover:text-gold transition-colors text-base">contact@josephmmwa.com</span>
                      <span className="block text-[10px] text-text-mute/70 font-serif mt-1">General inquiries, syndication &amp; tips</span>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-3.5 rounded-xl border border-transparent">
                    <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-text-mute font-sans uppercase tracking-wider mb-0.5">Global Bureau</span>
                      <span className="text-foreground font-bold text-base">Nairobi, Kenya</span>
                      <span className="block text-[10px] text-text-mute/70 font-serif mt-1">Global Health &amp; Medical Reporting Desk</span>
                    </div>
                  </div>
                </div>

                {/* Newsroom Policy Callout */}
                <div className="mt-8 pt-6 border-t border-border/80 text-xs font-serif text-text-mute space-y-2">
                  <div className="flex items-center gap-2 text-gold font-mono text-[11px] uppercase tracking-wider font-bold">
                    <ShieldCheck className="w-4 h-4" /> Confidentiality Assured
                  </div>
                  <p className="leading-relaxed opacity-80">
                    All investigative leads and medical news tips sent to Joseph Mmwa Media Group are held with strict journalistic confidentiality.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Form */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card/80 p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-border/80 pb-4">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">
                    Send a Direct Message
                  </h2>
                  <p className="text-xs font-serif text-text-mute mt-1">
                    Fill out the form below for immediate route to the editorial desk.
                  </p>
                </div>
                <MessageSquare className="w-6 h-6 text-gold opacity-80 hidden sm:block" />
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 text-gold border border-gold/40 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground uppercase">Message Transmitted</h3>
                  <p className="text-sm font-serif text-text-body max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Joseph Mmwa Media Group. Our newsroom team has received your submission and will respond within <strong>24 to 48 hours</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-gold/40 text-xs font-mono text-gold uppercase tracking-wider hover:bg-gold/10 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-gold font-bold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="user_name"
                        required
                        placeholder="Your Name"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-mute/40 focus:border-gold focus:outline-none transition-colors font-serif"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gold font-bold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="user_email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-mute/40 focus:border-gold focus:outline-none transition-colors font-serif"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-gold font-bold mb-2">
                      Subject / Topic *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="News Tip / Media Inquiry / Partnership"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-mute/40 focus:border-gold focus:outline-none transition-colors font-serif"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-gold font-bold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Provide details about your inquiry or news tip..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-text-mute/40 focus:border-gold focus:outline-none transition-colors font-serif resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-mono text-text-mute">
                      * Expect response in 24-48 business hours.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-glow w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-xs font-black uppercase tracking-wider text-black hover:bg-gold-hover transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Transmitting..." : "Transmit Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
