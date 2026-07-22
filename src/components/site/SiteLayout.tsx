import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-1/50 pt-12 pb-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* 🩺 SITE-WIDE MEDICAL DISCLAIMER BLOCK */}
        <div className="rounded-xl border border-border bg-surface-2/60 p-5 sm:p-6 mb-10 text-left space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-gold font-display font-bold text-sm uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
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

        {/* FOOTER NAVIGATION & COPYRIGHT */}
        <div className="text-center text-xs text-text-mute space-y-4 border-t border-border/50 pt-6">
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <Link to="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/disclaimer" className="hover:text-gold transition-colors">
              Disclaimer
            </Link>
            <Link to="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
          </div>
          <p>© {new Date().getFullYear()} Joseph Mmwa Media Group. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
