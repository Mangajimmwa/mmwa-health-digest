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
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

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
                className={`text-sm font-medium transition-colors ${
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
            className="text-sm font-medium text-text-body hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/premium"
            className="text-sm font-semibold bg-gold text-primary-foreground px-4 py-2 rounded-md hover:bg-gold-hover transition-colors"
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
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-foreground"
          >
            <Menu className="w-6 h-6" />
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

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <Logo size="md" />
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-md text-lg font-medium ${
                    active ? "text-gold" : "text-text-body hover:bg-surface-1"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-md text-lg font-medium text-text-body hover:bg-surface-1"
            >
              Sign In
            </Link>
            <Link
              to="/premium"
              onClick={() => setOpen(false)}
              className="mt-4 mx-4 text-center bg-gold text-primary-foreground font-semibold py-3 rounded-md"
            >
              Subscribe
            </Link>
          </nav>
          <div className="border-t border-border px-6 py-6 space-y-3 text-sm">
            <a
              href="mailto:mmwajoseph@gmail.com"
              className="flex items-center gap-3 text-text-body"
            >
              <Mail className="w-4 h-4 text-gold" />
              mmwajoseph@gmail.com
            </a>
            <a
              href="tel:+254729147765"
              className="flex items-center gap-3 text-text-body"
            >
              <Phone className="w-4 h-4 text-gold" />
              +254 729 147 765
            </a>
            <p className="text-xs text-text-mute pt-3">
              © 2026 Joseph Mmwa. All rights reserved.
            </p>
            <p className="text-xs font-display italic text-white">
              If it's health, it's here.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
