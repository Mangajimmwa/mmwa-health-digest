import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search } from "lucide-react";

export const Route = createFileRoute("/admin/subscribers")({
  component: Subscribers,
});

function Subscribers() {
  const [q, setQ] = useState("");

  const { data: subs } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscribers")
        .select("id,email,created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(
    () => (subs ?? []).filter((s) => (q ? s.email.toLowerCase().includes(q.toLowerCase()) : true)),
    [subs, q],
  );

  const last7 = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
    return (subs ?? []).filter((s) => new Date(s.created_at).getTime() > cutoff).length;
  }, [subs]);

  function exportCsv() {
    const csv =
      "email,created_at\n" +
      (subs ?? []).map((s) => `${s.email},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Newsletter</p>
          <h1 className="mt-2 font-display font-bold text-3xl">Subscribers</h1>
        </div>
        <button
          onClick={exportCsv}
          className="btn-glow inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-4 py-2 rounded-md text-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-5" style={{ background: "linear-gradient(135deg, #150F00 0%, #0A0A0A 100%)" }}>
          <p className="label-eyebrow !mt-0">Total</p>
          <p className="mt-3 font-display font-bold text-3xl">{(subs ?? []).length}</p>
        </div>
        <div className="rounded-lg border border-border p-5" style={{ background: "linear-gradient(135deg, #150F00 0%, #0A0A0A 100%)" }}>
          <p className="label-eyebrow !mt-0">Last 7 days</p>
          <p className="mt-3 font-display font-bold text-3xl">+{last7}</p>
        </div>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-mute" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email"
          className="w-full bg-surface-1 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0F0F0F] text-text-mute text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-text-mute">No subscribers yet.</td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-text-mute">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
