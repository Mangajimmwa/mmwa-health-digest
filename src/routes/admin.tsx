import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — JOSEPH MMWA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // 👑 Master Admin Email Override
        if (user && user.email === "mmwajoseph@gmail.com") {
          setIsAdmin(true);
          return;
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
      setIsAdmin(false);
    }
    
    checkAdminAccess();
  }, []);

  // Show a clean loading state while your credentials verify
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-sans">
        Verifying admin access...
      </div>
    );
  }

  // If you match the master admin email, render the layout instantly
  if (isAdmin === true) {
    return <Outlet />;
  }

  // Fallback protection for any non-admin users
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
