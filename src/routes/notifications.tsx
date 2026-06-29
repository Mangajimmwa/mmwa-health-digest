import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [{ title: "Notifications — JOSEPH MMWA" }],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        navigate({ to: "/auth" });
        return;
      }
      setReady(true);
    })();
  }, [navigate]);

  if (!ready) return <SiteLayout><div className="min-h-[60vh]" /></SiteLayout>;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 lg:px-6 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center">
          <Bell className="w-7 h-7" />
        </div>
        <p className="label-eyebrow mt-6">Alerts</p>
        <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl">Notifications</h1>
        <p className="mt-4 text-text-body font-serif text-lg">
          Health alerts and updates — Coming Soon.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-full">
          Back to home
        </Link>
      </section>
    </SiteLayout>
  );
}
