
-- Add author column to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT 'Joseph Mmwa';

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO anon;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads approved comments" ON public.comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Replace categories: clear and seed the canonical 7
DELETE FROM public.categories;
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Disease Outbreaks', 'disease-outbreaks', 'Coverage of infectious diseases, epidemics, pandemics, disease surveillance, public health emergencies, outbreak response, emerging pathogens, and global disease alerts.', 1),
  ('Vaccines & Immunization', 'vaccines-immunization', 'Vaccine research, approvals, immunization programmes, vaccination campaigns, vaccine policy, vaccine safety, immunology, and global vaccination initiatives.', 2),
  ('Medical Research', 'medical-research', 'Peer-reviewed studies, clinical trials, scientific discoveries, laboratory research, academic publications, biomedical science, and evidence-based medical findings.', 3),
  ('Treatments & Innovation', 'treatments-innovation', 'New medicines, breakthrough therapies, biotechnology, gene therapy, precision medicine, medical devices, diagnostics, artificial intelligence in healthcare, and healthcare innovation.', 4),
  ('Public Health', 'public-health', 'Global health policy, healthcare systems, disease prevention, environmental health, One Health, mental health, health education, health campaigns, humanitarian health, and international public health initiatives.', 5),
  ('Healthcare', 'healthcare', 'Hospitals, healthcare delivery, pharmaceuticals, digital health, telemedicine, healthcare regulation, healthcare workforce, insurance, medical infrastructure, and health industry developments.', 6),
  ('Explainers', 'explainers', 'Clear, evidence-based articles that simplify complex medical topics, research findings, health myths, medical terminology, and important health issues for everyday readers.', 7);
