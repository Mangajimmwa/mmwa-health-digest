import { Link } from "@tanstack/react-router";
import { Phone, Mail, Youtube, Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
        <div 
          className="relative overflow-hidden rounded-xl p-8 sm:p-10 border"
          style={{ 
            background: "radial-gradient(ellipse at top left, #3D2800 0%, #251800 45%, #0A0A0A 100%)", 
            borderColor: "rgba(245, 166, 35, 0.35)" 
          }}
        >
          {/* Accent Eyebrow Badge */}
          <span 
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-4" 
            style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}
          >
            Global Health Bureau
          </span>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight">
            Joseph Mmwa <span className="text-gold">Media Group</span>
          </h3>

          {/* Tagline in White + Yellow/Gold */}
          <p className="mt-2 text-sm font-serif italic font-medium tracking-wide">
            <span className="text-white">If it's health, </span>
            <span className="text-gold font-semibold">it's here.</span>
          </p>

          {/* Description */}
          <p className="mt-4 text-sm text-text-body font-serif max-w-3xl leading-relaxed">
            Advancing Public Health Through Trusted Journalism
          </p>

          {/* Direct Contact Details */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-text-body font-mono">
            <a 
              href="tel:+254729147765" 
              className="inline-flex items-center gap-2 text-gold hover:text-gold-hover transition-colors"
            >
              <Phone className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
              +254 729 147 765
            </a>
            <a 
              href="mailto:contact@josephmmwa.com" 
              className="inline-flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Mail className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
              contact@josephmmwa.com
            </a>
          </div>

          {/* Follow Us / Social Links */}
          <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                Follow Us:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-black transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-black transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter) Profile"
                  className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-black transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                  className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-black transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap gap-6 text-sm text-text-body">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <Link to="/about" className="hover:text-gold transition-colors">About</Link>
              <Link to="/contact" className="hover:text-gold transition-colors font-semibold text-gold">Contact</Link>
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="mt-6 pt-4 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-text-mute">
            <span>© 2026 Joseph Mmwa Media Group. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
