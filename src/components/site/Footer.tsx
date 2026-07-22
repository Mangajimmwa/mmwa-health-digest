import { Link } from "@tanstack/react-router";
import { Phone, Mail, Youtube, Linkedin, Facebook, Instagram, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12 space-y-8">
        
        {/* Main Bureau Card */}
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
          <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                Follow Us:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* YouTube */}
                <a
                  href="https://youtube.com/@josephmmwa?si=tBbHCSLP-zTMbZ-J"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2.5 rounded-xl bg-card border border-border text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all shadow-sm"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/joseph-mmwa-08177a2a0?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-xl bg-card border border-border text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {/* X Logo */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="p-2.5 rounded-xl bg-card border border-border text-white hover:bg-white hover:text-black transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1EoghPzjKD/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2.5 rounded-xl bg-card border border-border text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/josephmmwa_mediagroup?igsh=ZmVqdHl4d2ZrcTlv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2.5 rounded-xl bg-card border border-border text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@mmwajoseph?_r=1&_t=ZS-98BfsKjMwVA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="p-2.5 rounded-xl bg-card border border-border text-[#25F4EE] hover:bg-white hover:text-black transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.65a6.34 6.34 0 0010.86 4.5 6.26 6.26 0 001.8-4.5V9.11a8.28 8.28 0 004.93 1.59V7.26a4.83 4.83 0 01-1-.57z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap gap-6 text-sm text-text-body">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <Link to="/about" className="hover:text-gold transition-colors">About</Link>
              <Link to="/contact" className="hover:text-gold transition-colors font-semibold text-gold">Contact</Link>
              <Link to="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link>
              <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="mt-6 pt-4 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-text-mute">
            <span>© 2026 Joseph Mmwa Media Group. All rights reserved.</span>
          </div>
        </div>

        {/* 🩺 SITE-WIDE MEDICAL DISCLAIMER BLOCK */}
        <div className="rounded-xl border border-border bg-card/60 p-5 sm:p-6 text-left space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-gold font-display font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>DISCLAIMER</span>
          </div>
          
          <div className="text-xs text-text-mute font-sans leading-relaxed space-y-2.5">
            <p>
              The information published by <strong className="text-foreground">Joseph Mmwa Media Group</strong> is provided for news, educational, and informational purposes only. We are committed to delivering accurate, evidence-based health journalism by relying on reputable scientific research, recognized health organizations, peer-reviewed journals, and qualified expert sources. However, medical knowledge is constantly evolving, and information may change over time.
            </p>
            <p>
              The content on this website is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the guidance of a qualified healthcare professional regarding any medical concerns, symptoms, or treatment decisions. Never disregard professional medical advice or delay seeking care because of information you have read on this website.
            </p>
            <p>
              Joseph Mmwa Media Group does not endorse or promote any specific medication, treatment, healthcare provider, or commercial product unless explicitly stated. References to medical research, clinical studies, medicines, or emerging treatments are provided solely for journalistic, educational, and informational purposes.
            </p>
            <p>
              While every reasonable effort is made to ensure the accuracy and reliability of our content, Joseph Mmwa Media Group makes no representations or warranties regarding the completeness, accuracy, timeliness, or suitability of the information published. Any reliance you place on the information provided on this website is strictly at your own risk.
            </p>
            <p className="italic text-[11px] text-text-mute/80 pt-1">
              By accessing and using this website, you acknowledge that you have read, understood, and agreed to this disclaimer.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
