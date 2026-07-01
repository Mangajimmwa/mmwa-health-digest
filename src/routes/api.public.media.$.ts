import { createFileRoute } from "@tanstack/react-router";

// Public proxy for the private article-media storage bucket.
// The workspace blocks public buckets, so we stream files through this
// route using the service role. URLs are permanent and CDN-cacheable.
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as { _splat?: string })._splat ?? "";
        if (!splat) return new Response("Not found", { status: 404 });
        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { data, error } = await supabaseAdmin.storage
            .from("article-media")
            .download(splat);
          if (error || !data) {
            return new Response("Not found", { status: 404 });
          }
          const buf = await data.arrayBuffer();
          return new Response(buf, {
            headers: {
              "Content-Type": data.type || "application/octet-stream",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          console.error("media proxy error", err);
          return new Response("Server error", { status: 500 });
        }
      },
    },
  },
});
