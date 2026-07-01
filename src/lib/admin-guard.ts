import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "mmwajoseph@gmail.com";

export async function isCurrentUserAdmin(): Promise<{
  ok: boolean;
  email: string | null;
  userId: string | null;
}> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return { ok: false, email: null, userId: null };
  if ((user.email ?? "").toLowerCase() === ADMIN_EMAIL) {
    return { ok: true, email: user.email!, userId: user.id };
  }
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  const ok = !!roles?.some((r) => r.role === "admin");
  return { ok, email: user.email ?? null, userId: user.id };
}
