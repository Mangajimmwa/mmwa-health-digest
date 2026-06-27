import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X, Mail, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News" },
  { to: "/videos", label: "Videos" },
  { to: "/premium", label: "Premium" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  // Mount/unmount with animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/news" });
    setQ("");
  }

  function closeAndGo() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-6 h-16">
        <Logo size="md" />

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`nav-underline text-sm font-medium transition-colors ${
                  active ? "text-gold" : "text-text-body hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-text-body hover:text-gold transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            to="/auth"
            className="nav-underline text-sm font-medium text-text-body hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/premium"
            className="btn-glow text-sm font-semibold bg-gold text-primary-foreground px-4 py-2 rounded-md"
          >
            Subscribe
          </Link>
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-foreground"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground relative w-6 h-6"
          >
            <Menu
              className={`w-6 h-6 absolute inset-0 transition-all duration-200 ${
                open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
              }`}
            />
            <X
              className={`w-6 h-6 absolute inset-0 transition-all duration-200 ${
                open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
              }`}
            />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full bg-[#111111] border-b border-gold/30 slide-down">
          <form
            onSubmit={submitSearch}
            className="mx-auto max-w-7xl px-4 lg:px-6 py-5 flex items-center gap-3"
          >
            <Search className="w-5 h-5 text-gold shrink-0" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search stories, topics, outbreaks..."
              className="flex-1 bg-transparent border border-gold/60 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-text-mute focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="text-text-mute hover:text-foreground shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {mounted && (
        <div
          className={`fixed inset-0 z-50 lg:hidden bg-[#0A0A0A] flex flex-col transition-all duration-300 ease-in-out ${
            open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          }`}
          style={{ transitionDuration: open ? "300ms" : "250ms" }}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-gold/20 shrink-0">
            <Logo size="md" />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col px-6 py-6">
              {[
                ...NAV.map((n) => ({ ...n, kind: "nav" as const })),
                { to: "/auth", label: "Sign In", kind: "nav" as const },
              ].map((n, i) => {
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={closeAndGo}
                    style={{ animationDelay: open ? `${i * 50}ms` : "0ms" }}
                    className={`mobile-link-in py-3 text-lg font-medium border-b border-gold/10 ${
                      active ? "text-gold" : "text-white hover:text-gold"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-6 pb-4">
              <Link
                to="/premium"
                onClick={closeAndGo}
                style={{ animationDelay: open ? `${(NAV.length + 1) * 50}ms` : "0ms" }}
                className="mobile-link-in btn-glow block w-full text-center bg-gold text-primary-foreground font-bold py-4 rounded-md text-base"
              >
                Subscribe
              </Link>
            </div>

            <div className="border-t border-gold/20 mx-6" />

            <div
              className="px-6 py-6 space-y-4 mobile-link-in"
              style={{ animationDelay: open ? `${(NAV.length + 2) * 50}ms` : "0ms" }}
            >
              <p className="label-eyebrow">Contact</p>
              <a
                href="mailto:mmwajoseph@gmail.com"
                className="flex items-center gap-3 text-sm text-text-body hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold" />
                mmwajoseph@gmail.com
              </a>
              <a
                href="tel:+254729147765"
                className="flex items-center gap-3 text-sm text-text-body hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                +254 729 147 765
              </a>
              <p className="pt-4 font-display italic text-white text-sm">
                If it's health, it's here.
              </p>
              <p className="text-xs text-text-mute">
                © 2026 Joseph Mmwa. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
