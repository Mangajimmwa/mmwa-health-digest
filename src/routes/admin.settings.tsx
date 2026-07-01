import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const [f, setF] = useState({ contact_email: "", contact_phone: "", tagline: "" });
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setF({
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        tagline: data.tagline,
      });
    }
  }, [data]);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(f).eq("id", true);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  }

  return (
    <div className="max-w-2xl">
      <p className="label-eyebrow">Site settings</p>
      <h1 className="mt-2 font-display font-bold text-3xl">Site information</h1>
      <p className="mt-2 text-sm text-text-mute">
        These appear in the footer, contact page, and mobile menu across the site.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Contact email">
          <input
            type="email"
            value={f.contact_email}
            onChange={(e) => setF((p) => ({ ...p, contact_email: e.target.value }))}
            className={cls}
          />
        </Field>
        <Field label="Contact phone">
          <input
            type="tel"
            value={f.contact_phone}
            onChange={(e) => setF((p) => ({ ...p, contact_phone: e.target.value }))}
            className={cls}
          />
        </Field>
        <Field label="Tagline">
          <input
            value={f.tagline}
            onChange={(e) => setF((p) => ({ ...p, tagline: e.target.value }))}
            className={cls}
          />
        </Field>
        <div>
          <button
            onClick={save}
            disabled={saving}
            className="btn-glow bg-gold text-primary-foreground font-semibold px-5 py-2.5 rounded-md text-sm disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-text-mute">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
const cls =
  "w-full bg-surface-1 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold";
