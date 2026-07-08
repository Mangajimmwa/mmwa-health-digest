import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  ImagePlus,
  Tag,
  Megaphone,
  Mail,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/site/Logo";

// Hardcoded admin email — this account always has full access
const ADMIN_EMAIL = "mmwajoseph@gmail.com";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/articles", label: "Articles", icon: FileText },
  { to: "/admin/media", label: "Media", icon: ImagePlus },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/breaking", label: "Breaking Ticker", icon: Megaphone },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;

        if (cancelled) return;

        // No session at all — redirect to sign in
        if (!user) {
          navigate({ to: "/auth" });
          setState("denied");
          return;
        }

        const userEmail = (user.email ?? "").toLowerCase().trim();

        // Hardcoded admin check — mmwajoseph@gmail.com always gets access
        if (userEmail === ADMIN_EMAIL.toLowerCase()) {
          setEmail(user.email!);
          setState("ok");
          return;
        }

        // Check user_roles table for other potential admins
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (cancelled) return;

        const isAdmin = !!roles?.some((r) => r.role === "admin");

        if (isAdmin) {
          setEmail(user.email ?? "");
          setState("ok");
          return;
        }

        // Signed in but not admin — send to homepage
        navigate({ to: "/" });
        setState("denied");
      } catch (err) {
        console.error("[AdminGate] error checking admin status:", err);
        if (!cancelled) {
          navigate({ to: "/auth" });
          setState("denied");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-mute">
        Verifying access…
      </div>
    );
  }

  if (state === "denied") {
    return null;
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}

function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Toaster theme="dark" position="top-right" />
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-[#0F0F0F]">
        <div className="p-5 border-b border-border">
          <Logo size="sm" />
          <p className="mt-2 label-eyebrow !text-[10px]">Newsroom CMS</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as never}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-text-body hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/admin/articles/new"
            className="btn-glow flex items-center justify-center gap-2 w-full bg-gold text-primary-foreground font-semibold text-sm py-2.5 rounded-md"
          >
            <Plus className="w-4 h-4" /> New article
          </Link>
          <div className="mt-3 flex items-center justify-between text-xs text-text-mute">
            <span className="truncate">{email}</span>
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 hover:text-gold"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-[#0F0F0F] border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Logo size="sm" />
          <Link
            to="/admin/articles/new"
            className="text-xs bg-gold text-primary-foreground font-semibold px-3 py-1.5 rounded-md"
          >
            + New
          </Link>
        </div>
        <nav className="flex overflow-x-auto gap-1 px-2 pb-2">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as never}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
                  active ? "bg-gold/15 text-gold" : "text-text-body"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 min-w-0 pt-28 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export function AdminLayoutRoute() {
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
