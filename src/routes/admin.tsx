import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminLayout";

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
  return (
    <AdminGate>
      <Outlet />
    </AdminGate>
  );
}
