// Admin email: mmwajoseph@gmail.com — update in environment config if changed
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, FileText, Tag, Megaphone } from "lucide-react";

const ADMIN_EMAIL = "mmwajoseph@gmail.com";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — JOSEPH MMWA" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok">("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }
      // Verify admin via either email match or user_roles entry.
      const isAdminEmail = user.email?.toLowerCase() === ADMIN_EMAIL;
      let isAdmin = isAdminEmail;
      if (!isAdmin) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        isAdmin = !!roles?.some((r) => r.role === "admin");
      }
      if (cancelled) return;
      if (!isAdmin) {
        navigate({ to: "/" });
        return;
      }
      setEmail(user.email ?? "");
      setStatus("ok");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (status === "loading") {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-text-mute">
          Verifying access…
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
        <div
          className="rounded-xl p-8 lg:p-10"
          style={{
            background:
              "radial-gradient(ellipse at top left, #2A1F00 0%, #1A1200 40%, #0A0A0A 100%)",
            border: "1px solid rgba(245, 166, 35, 0.15)",
            boxShadow: "inset 0 0 60px rgba(245, 166, 35, 0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <p className="label-eyebrow !mt-0">Admin</p>
          </div>
          <h1 className="mt-3 font-display font-extrabold text-4xl sm:text-5xl">
            Newsroom Dashboard
          </h1>
          <p className="mt-3 text-text-body font-serif">
            Signed in as <span className="text-gold">{email}</span>.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            icon={<FileText className="w-5 h-5 text-gold" />}
            title="Articles"
            description="Create, edit, and publish medical news articles."
          />
          <AdminCard
            icon={<Tag className="w-5 h-5 text-gold" />}
            title="Categories"
            description="Manage coverage areas and editorial tags."
          />
          <AdminCard
            icon={<Megaphone className="w-5 h-5 text-gold" />}
            title="Breaking News"
            description="Update the live ticker with active health alerts."
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function AdminCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background:
          "linear-gradient(135deg, #150F00 0%, #0A0A0A 100%)",
        border: "1px solid rgba(245, 166, 35, 0.15)",
      }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-display font-bold text-xl">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-text-body font-serif">{description}</p>
    </div>
  );
}
