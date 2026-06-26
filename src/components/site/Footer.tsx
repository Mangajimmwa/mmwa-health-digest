import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1 mt-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Logo size="md" />
          <p className="mt-4 text-sm text-text-body max-w-xs">
            Independent global health and medical journalism by Joseph Mmwa —
            accurate, evidence-based, and globally relevant.
          </p>
        </div>
        <div>
          <h4 className="label-eyebrow mb-4">Sections</h4>
          <ul className="space-y-2 text-sm text-text-body">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/news" className="hover:text-foreground">News</Link></li>
            <li><Link to="/videos" className="hover:text-foreground">Videos</Link></li>
            <li><Link to="/premium" className="hover:text-foreground">Premium</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="label-eyebrow mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-text-body">
            <li>
              <a href="mailto:mmwajoseph@gmail.com" className="flex items-center gap-3 hover:text-foreground">
                <Mail className="w-4 h-4 text-gold" />
                mmwajoseph@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+254729147765" className="flex items-center gap-3 hover:text-foreground">
                <Phone className="w-4 h-4 text-gold" />
                +254 729 147 765
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-text-mute">
          <p>© 2026 Joseph Mmwa. All rights reserved.</p>
          <p className="italic font-serif">If it's health, it's here.</p>
        </div>
      </div>
    </footer>
  );
}
