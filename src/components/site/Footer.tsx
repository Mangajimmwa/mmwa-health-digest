import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Mail, Youtube, Linkedin, Facebook, Instagram, AlertCircle, X, ShieldAlert, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10">
        
        {/* Main Footer Card */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10 border shadow-2xl"
          style={{ 
            background: "radial-gradient(ellipse at top left, #3D2800 0%, #251800 45%, #0A0A0A 100%)", 
            borderColor: "rgba(245, 166, 35, 0.35)" 
          }}
        >
          {/* Eyebrow Badge */}
          <span 
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-gold mb-4" 
            style={{ background: "rgba(245, 166, 35, 0.15)", border: "1px solid #F5A623" }}
          >
            GLOBAL HEALTH BUREAU
          </span>

          <h3 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight">
            Joseph Mmwa <span className="text-gold">Media Group</span>
          </h3>

          {/* Clean Main Tagline */}
          <p className="mt-2 text-base sm:text-lg font-serif italic font-medium tracking-wide">
            <span className="text-white">If it's health, </span>
            <span className="text-gold font-bold">it's here.</span>
          </p>

          {/* Direct Contact Details */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-text-body font-mono">
            <a 
              href="tel:+254729147765" 
              className="inline-flex items-center gap-2 text-gold hover:text-gold-hover transition-colors font-bold"
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

          {/* Socials & Primary Navigation */}
          <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                Follow Us:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a href="https://youtube.com/@josephmmwa?si=tBbHCSLP-zTMbZ-J" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2.5 rounded-xl bg-card border border-border text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all shadow-sm">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/joseph-mmwa-08177a2a0?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-card border border-border text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="p-2.5 rounded-xl bg-card border border-border text-white hover:bg-white hover:text-black transition-all shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1EoghPzjKD/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 rounded-xl bg-card border border-border text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/josephmmwa_mediagroup?igsh=ZmVqdHl4d2ZrcTlv" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 rounded-xl bg-card border border-border text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.tiktok.com/@mmwajoseph?_r=1&_t=ZS-98BfsKjMwVA" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2.5 rounded-xl bg-card border border-border text-[#25F4EE] hover:bg-white hover:text-black transition-all shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.65a6.34 6.34 0 0010.86 4.5 6.26 6.26 0 001.8-4.5V9.11a8.28 8.28 0 004.93 1.59V7.26a4.83 4.83 0 01-1-.57z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Clean Section Navigation */}
            <div className="flex flex-wrap gap-6 text-sm font-sans font-medium text-text-body">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <Link to="/about" className="hover:text-gold transition-colors">About</Link>
              <Link to="/contact" className="text-gold font-bold hover:underline transition-colors">Contact</Link>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono text-text-mute">
            
            {/* Copyright Statement */}
            <span>© {new Date().getFullYear()} Joseph Mmwa Media Group. All rights reserved.</span>

            {/* Legal Links & Modal Trigger */}
            <div className="flex flex-wrap items-center gap-5 font-sans">
              <Link to="/terms" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/editorial-standards" className="hover:text-gold transition-colors">
                Editorial Standards
              </Link>
              
              <button
                onClick={() => setShowDisclaimer(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 transition-all font-sans font-bold cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Medical Disclaimer
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 🛑 PREMIUM MEDICAL DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-1 border border-gold/30 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-5 right-5 text-text-mute hover:text-foreground transition-colors p-1 rounded-full bg-surface-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/30 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-foreground uppercase tracking-wider">
                  Medical Disclaimer
                </h3>
                <p className="text-xs text-gold font-mono">Joseph Mmwa Media Group</p>
              </div>
            </div>

            <div className="space-y-4 text-sm font-sans text-text-body leading-relaxed">
              <div className="flex items-start gap-3 p-3 bg-surface-2/60 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Informational Purpose Only:</strong> The information published by Joseph Mmwa Media Group is for news, educational, and informational purposes only. We deliver evidence-based health journalism relying on scientific research, health organizations, and peer-reviewed journals.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface-2/60 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Not Professional Medical Advice:</strong> Content on this website is not intended to replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider regarding medical concerns or symptoms.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface-2/60 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">No Commercial Endorsement:</strong> Joseph Mmwa Media Group does not endorse or promote specific medications, treatments, or healthcare providers unless explicitly stated. References to medical studies or products are strictly for journalism.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-surface-2/60 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Accuracy &amp; Evolving Science:</strong> Medical knowledge evolves rapidly. While reasonable effort is made to ensure reliability, any reliance on information published on this website is at your own risk.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="bg-gold hover:bg-gold-hover text-primary-foreground font-sans font-bold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer"
              >
                I Understand
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
