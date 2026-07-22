import { createClient } from "@supabase/supabase-js";

// Ensure environment variables match your Supabase project configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: any, res: any) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send("Missing slug");
  }

  const targetSlug = String(slug).toLowerCase().trim();

  // Query Supabase for the article metadata
  const { data: meta } = await supabase
    .from("articles")
    .select("title, excerpt, featured_image, slug")
    .ilike("slug", targetSlug)
    .maybeSingle();

  // Fallback defaults if article is not found
  const cleanHeadline = meta?.title || "Global Health News";
  const browserTitle = meta?.title ? `${meta.title} — Joseph Mmwa` : "Global Health News — Joseph Mmwa";
  const description = meta?.excerpt || "Breaking medical news, verified health reporting, and evidence-based journalism from Joseph Mmwa.";
  
  const rawImage = meta?.featured_image || "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/avatars/joseph.jpeg.jpeg";
  const image = rawImage.startsWith("http") ? rawImage : `https://josephmmwa.com${rawImage}`;
  const articleUrl = `https://josephmmwa.com/news/${meta?.slug || targetSlug}`;

  // Return static HTML head elements directly to the social media crawler
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${browserTitle}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${articleUrl}">

  <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${cleanHeadline}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${cleanHeadline}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${cleanHeadline}</h1>
  <p>${description}</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  return res.status(200).send(html);
}
