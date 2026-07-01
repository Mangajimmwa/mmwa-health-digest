import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const STATIC_PATHS = [
  "/",
  "/news",
  "/videos",
  "/premium",
  "/categories",
  "/about",
  "/contact",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const now = new Date().toISOString();

        const [{ data: articles }, { data: cats }] = await Promise.all([
          supabase
            .from("articles")
            .select("slug,updated_at,published_at")
            .eq("is_published", true)
            .order("published_at", { ascending: false })
            .limit(5000),
          supabase.from("categories").select("slug").order("sort_order"),
        ]);

        const entries: string[] = [];
        for (const p of STATIC_PATHS) {
          entries.push(
            `  <url><loc>${origin}${p}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq></url>`,
          );
        }
        for (const c of cats ?? []) {
          entries.push(
            `  <url><loc>${origin}/category/${c.slug}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq></url>`,
          );
        }
        for (const a of articles ?? []) {
          const lm = a.updated_at ?? a.published_at ?? now;
          entries.push(
            `  <url><loc>${origin}/news/${a.slug}</loc><lastmod>${lm}</lastmod><changefreq>weekly</changefreq></url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
          "\n",
        )}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});
