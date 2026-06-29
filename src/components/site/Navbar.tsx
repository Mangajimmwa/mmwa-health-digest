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

  const closeAndGo = () => setOpen(false);

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
                  active ? "text-gold is-active" : "text-text-body hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <button
            type="button"
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

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-foreground inline-flex items-center justify-center w-11 h-11"
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="text-foreground inline-flex items-center justify-center w-11 h-11 cursor-pointer"
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              zIndex: 9999,
              position: "relative",
            }}
          >
            <span className="relative block w-6 h-6">
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
            </span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full bg-[#111111] border-b border-gold/30 slide-down z-40">
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
              className="text-text-mute hover:text-foreground shrink-0 inline-flex items-center justify-center w-11 h-11"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {mounted && (
        <div
          id="mobile-menu"
          className={`fixed inset-0 lg:hidden bg-[#0A0A0A] flex flex-col transition-all duration-300 ease-in-out ${
            open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          }`}
          style={{ zIndex: 9998 }}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-gold/20 shrink-0">
            <Logo size="md" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-foreground inline-flex items-center justify-center w-11 h-11"
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 pt-4">
            <p className="font-display italic text-white text-sm tagline-glow">
              If it's health, it's here.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col px-6 py-4">
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
                    style={{ animationDelay: open ? `${i * 40}ms` : "0ms" }}
                    className={`mobile-link-in py-3 text-[18px] font-medium border-b border-gold/10 min-h-[48px] flex items-center ${
                      active ? "text-gold" : "text-white hover:text-gold"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-6 pt-2 pb-4">
              <Link
                to="/premium"
                onClick={closeAndGo}
                style={{ animationDelay: open ? `${(NAV.length + 1) * 40}ms` : "0ms" }}
                className="mobile-link-in btn-glow flex items-center justify-center w-full text-center bg-gold text-primary-foreground font-bold rounded-full text-base"
                rel="noopener"
              >
                <span className="inline-flex h-[52px] items-center">Subscribe</span>
              </Link>
            </div>

            <div className="border-t border-gold/20 mx-6" />

            <div
              className="px-6 py-6 space-y-4 mobile-link-in"
              style={{ animationDelay: open ? `${(NAV.length + 2) * 40}ms` : "0ms" }}
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
            </div>

            <div className="border-t border-gold/20 mx-6" />

            <div className="px-6 py-6 text-center">
              <p className="font-display italic text-white text-sm tagline-glow">
                If it's health, it's here.
              </p>
              <p className="mt-2 text-xs text-text-mute">
                © 2026 Joseph Mmwa. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
