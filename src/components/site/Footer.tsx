import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer
      className="border-t border-border mt-24"
      style={{ background: "linear-gradient(to top, #1E1200 0%, #0A0A0A 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Logo size="md" />
          <p className="mt-4 text-sm text-text-body max-w-xs">
            Joseph Mmwa is an independent medical and health journalist
            delivering accurate, evidence-based reporting on the stories shaping
            global public health.
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
          </ul>
        </div>
        <div>
          <h4 className="label-eyebrow mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-text-body">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
          </ul>
          <ul className="mt-5 space-y-3 text-sm text-text-body">
            <li>
              <a href="mailto:mmwajoseph@gmail.com" className="flex items-center gap-3 hover:text-foreground">
                <Mail className="w-4 h-4 text-gold" aria-hidden="true" />
                mmwajoseph@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+254729147765" className="flex items-center gap-3 hover:text-foreground">
                <Phone className="w-4 h-4 text-gold" aria-hidden="true" />
                +254 729 147 765
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-text-mute">
          <p>© 2026 Joseph Mmwa. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
          <p className="font-display italic text-white">If it's health, it's here.</p>
        </div>
      </div>
    </footer>
  );
}
