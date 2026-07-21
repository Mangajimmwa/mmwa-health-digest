Here is the updated **`Footer`** component inside **`src/components/site/Footer.tsx`** (or your relevant layout component path).

It updates the company branding to **Joseph Mmwa Media Group**, replaces the Gmail address with **`josephmmwamedia@outlook.com`**, removes the phone number for a cleaner corporate feel, and adds subtle gold highlights to give it a premium finish.

```tsx
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer
      className="border-t border-border mt-24 relative overflow-hidden"
      style={{ background: "linear-gradient(to top, #1E1200 0%, #0A0A0A 100%)" }}
    >
      {/* Top Accent Gold Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-14 grid gap-10 md:grid-cols-3">
        {/* Brand Summary Column */}
        <div>
          <Logo size="md" />
          <p className="mt-4 text-sm text-text-body max-w-xs font-serif leading-relaxed">
            <strong>Joseph Mmwa Media Group</strong> is an independent health and medical journalism organization delivering accurate, evidence-based reporting on global public health.
          </p>
        </div>

        {/* Sections Column */}
        <div>
          <h4 className="label-eyebrow mb-4 text-gold font-sans text-xs tracking-wider uppercase font-semibold">
            Sections
          </h4>
          <ul className="space-y-2 text-sm text-text-body font-serif">
            <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/news" className="hover:text-gold transition-colors">News</Link></li>
            <li><Link to="/videos" className="hover:text-gold transition-colors">Videos</Link></li>
            <li><Link to="/premium" className="hover:text-gold transition-colors">Premium</Link></li>
            <li><Link to="/categories" className="hover:text-gold transition-colors">Categories</Link></li>
          </ul>
        </div>

        {/* Company & Contact Column */}
        <div>
          <h4 className="label-eyebrow mb-4 text-gold font-sans text-xs tracking-wider uppercase font-semibold">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-text-body font-serif">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
          </ul>

          <ul className="mt-6 space-y-3 text-sm text-text-body font-mono">
            <li>
              <a 
                href="mailto:josephmmwamedia@outlook.com" 
                className="inline-flex items-center gap-3 text-gold hover:text-gold-hover transition-colors underline underline-offset-4"
              >
                <Mail className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                josephmmwamedia@outlook.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-gold/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-xs text-text-mute">
          <p className="font-mono">© 2026 Joseph Mmwa Media Group. All rights reserved.</p>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-serif">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <span aria-hidden="true" className="text-gold/40">·</span>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <span aria-hidden="true" className="text-gold/40">·</span>
            <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          </nav>
          
          <p className="font-serif italic text-gold font-medium tracking-wide">
            If it's health, it's here.
          </p>
        </div>
      </div>
    </footer>
  );
}

```
