import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X, Mail, Phone, Search, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [session, setSession] = useState<any>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  // Handle Dynamic Auth State Checks
  useEffect(() => {
    // Check current active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth adjustments globally
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate({ to: "/" });
    }
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ESC closes search
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
    const term = q.trim();
    setSearchOpen(false);
    setQ("");
    if (term) navigate({ to: "/search", search: { q: term } });
    else navigate({ to: "/search", search: { q: "" } });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-6 h-16">
          <Logo size="md" />

          {/* Desktop nav */}
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

            {/* Dynamic Session Handling for Desktop */}
            {session ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm font-medium text-text-body hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="nav-underline text-sm font-medium text-text-body hover:text-foreground"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/premium"
              className="btn-glow text-sm font-semibold bg-gold text-primary-foreground px-4 py-2 rounded-md"
            >
              Subscribe
            </Link>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center justify-center w-11 h-11 text-foreground"
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative inline-flex items-center justify-center w-12 h-12 text-foreground cursor-pointer bg-transparent border-0"
              style={{
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                zIndex: 10000,
              }}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-[#111111] border-b border-gold/30 z-40">
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
                className="inline-flex items-center justify-center w-11 h-11 text-text-mute hover:text-foreground shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={`lg:hidden fixed inset-0 bg-[#0A0A0A] flex flex-col transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gold/20 shrink-0">
          <Logo size="md" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center w-12 h-12 text-foreground bg-transparent border-0"
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
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-[18px] font-medium border-b border-gold/10 min-h-[48px] flex items-center ${
                    active ? "text-gold" : "text-white hover:text-gold"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}

            {/* Dynamic Session Handling for Mobile */}
            {session ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="py-3 text-[18px] font-medium border-b border-gold/10 min-h-[48px] flex items-center text-left text-red-400 bg-transparent border-0 cursor-pointer w-full"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-[18px] font-medium border-b border-gold/10 min-h-[48px] flex items-center text-white hover:text-gold"
              >
                Sign In
              </Link>
            )}
          </nav>

          <div className="px-6 pt-2 pb-4">
            <Link
              to="/premium"
              onClick={() => setMenuOpen(false)}
              className="btn-glow flex items-center justify-center w-full text-center bg-gold text-primary-foreground font-bold rounded-full text-base h-[52px]"
            >
              Subscribe
            </Link>
          </div>

          <div className="border-t border-gold/20 mx-6" />

          <div className="px-6 py-6 space-y-4">
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
    </>
  );
}
