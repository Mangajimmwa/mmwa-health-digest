
-- 1. Articles: add region field
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS region text;

-- 2. Breaking news: link to an article + updated_at
ALTER TABLE public.breaking_news ADD COLUMN IF NOT EXISTS linked_article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL;
ALTER TABLE public.breaking_news ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS breaking_news_updated_at ON public.breaking_news;
CREATE TRIGGER breaking_news_updated_at BEFORE UPDATE ON public.breaking_news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Site settings (single row, keyed by singleton pattern)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  contact_email text NOT NULL DEFAULT 'mmwajoseph@gmail.com',
  contact_phone text NOT NULL DEFAULT '+254 729 147 765',
  tagline text NOT NULL DEFAULT 'If it''s health, it''s here.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT UPDATE, INSERT ON public.site_settings TO authenticated;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Settings readable by all" ON public.site_settings;
CREATE POLICY "Settings readable by all" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;
DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Media library: track uploads and where they are used
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  filename text NOT NULL,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Media readable by all" ON public.media;
CREATE POLICY "Media readable by all" ON public.media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage media" ON public.media;
CREATE POLICY "Admins manage media" ON public.media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 5. Article page views (lightweight tracking)
CREATE TABLE IF NOT EXISTS public.article_views (
  id bigserial PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS article_views_article_idx ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS article_views_viewed_at_idx ON public.article_views(viewed_at DESC);
GRANT INSERT ON public.article_views TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.article_views_id_seq TO anon, authenticated;
GRANT SELECT ON public.article_views TO authenticated;
GRANT ALL ON public.article_views TO service_role;
GRANT ALL ON SEQUENCE public.article_views_id_seq TO service_role;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can log view" ON public.article_views;
CREATE POLICY "Anyone can log view" ON public.article_views FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins read views" ON public.article_views;
CREATE POLICY "Admins read views" ON public.article_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- 6. Storage RLS for article-media bucket (bucket itself created via tool)
DROP POLICY IF EXISTS "Article media public read" ON storage.objects;
CREATE POLICY "Article media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'article-media');
DROP POLICY IF EXISTS "Admins upload article media" ON storage.objects;
CREATE POLICY "Admins upload article media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-media' AND public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Admins update article media" ON storage.objects;
CREATE POLICY "Admins update article media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'article-media' AND public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Admins delete article media" ON storage.objects;
CREATE POLICY "Admins delete article media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'article-media' AND public.has_role(auth.uid(),'admin'));
