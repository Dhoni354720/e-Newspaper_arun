-- ==============================================================================
-- JANVANI NEWS (जनवाणी न्यूज) — PRODUCTION SUPABASE MIGRATION
-- Database Schema with Full Row Level Security (RLS), Triggers & Full-Text Search
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'editor', 'author')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  publication_name TEXT NOT NULL DEFAULT 'JANVANI NEWS',
  publication_name_mr TEXT NOT NULL DEFAULT 'जनवाणी न्यूज',
  publication_name_hi TEXT NOT NULL DEFAULT 'जनवाणी न्यूज़',
  tagline TEXT NOT NULL DEFAULT 'सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र',
  logo_path TEXT,
  default_language TEXT NOT NULL DEFAULT 'mr' CHECK (default_language IN ('mr', 'hi', 'en')),
  supported_languages TEXT[] NOT NULL DEFAULT ARRAY['mr', 'hi', 'en'],
  contact_email TEXT NOT NULL DEFAULT 'editorial@janvaninews.com',
  contact_phone TEXT NOT NULL DEFAULT '+91 20 2550 0000',
  office_address TEXT NOT NULL DEFAULT 'Janvani Bhavan, FC Road, Shivaji Nagar, Pune, Maharashtra 411005',
  social_links JSONB NOT NULL DEFAULT '{"twitter": "https://twitter.com/janvaninews", "facebook": "https://facebook.com/janvaninews", "youtube": "https://youtube.com/@janvaninews", "telegram": "https://t.me/janvaninews"}'::jsonb,
  theme_settings JSONB NOT NULL DEFAULT '{"accentColor": "#991b1b", "mastheadStyle": "classic", "enableBreakingTicker": true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. CATEGORY TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('mr', 'hi', 'en')),
  name TEXT NOT NULL,
  description TEXT,
  CONSTRAINT unique_category_language UNIQUE (category_id, language)
);

-- 5. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  language TEXT NOT NULL DEFAULT 'mr' CHECK (language IN ('mr', 'hi', 'en')),
  translation_group_id UUID NOT NULL DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  featured_image_path TEXT,
  image_alt TEXT,
  image_caption TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  reading_time_minutes INT NOT NULL DEFAULT 3,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. ARTICLE CATEGORIES (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.article_categories (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- 7. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'mr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_tag_slug_lang UNIQUE (slug, language)
);

-- 8. ARTICLE TAGS
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 9. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. BREAKING NEWS ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.breaking_news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'mr' CHECK (language IN ('mr', 'hi', 'en')),
  custom_headline TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & FULL TEXT SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_language ON public.articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_trans_group ON public.articles(translation_group_id);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled ON public.articles(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_article_categories_cat ON public.article_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_breaking_active ON public.breaking_news_items(is_active, language, display_order);

-- Full text search index (English, Marathi & Hindi unicode support)
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles USING gin(
  to_tsvector('simple', coalesce(headline, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
);

-- ==============================================================================
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_articles_timestamp
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_breaking_timestamp
  BEFORE UPDATE ON public.breaking_news_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_settings_timestamp
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SCHEDULED ARTICLE PUBLISHING CRON / FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.publish_due_scheduled_articles()
RETURNS INT AS $$
DECLARE
  v_count INT;
BEGIN
  WITH due_articles AS (
    UPDATE public.articles
    SET status = 'published',
        published_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    WHERE status = 'scheduled'
      AND scheduled_at IS NOT NULL
      AND scheduled_at <= timezone('utc', now())
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM due_articles;

  IF v_count > 0 THEN
    INSERT INTO public.audit_logs (action, entity_type, metadata)
    VALUES ('auto_publish', 'articles', jsonb_build_object('published_count', v_count, 'executed_at', timezone('utc', now())));
  END IF;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin/editor role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. Site Settings Policies
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_staff());

-- 3. Categories & Translations Policies
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Staff can modify categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Public can view category translations"
  ON public.category_translations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can modify category translations"
  ON public.category_translations FOR ALL
  TO authenticated
  USING (public.is_staff());

-- 4. Articles Policies
-- Anonymous & public readers: Only see published articles whose publication date is past
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published' AND published_at <= timezone('utc', now())
    OR public.is_staff()
  );

-- Staff can insert, update, delete articles
CREATE POLICY "Staff can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff can delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- 5. Article Categories & Tags Policies
CREATE POLICY "Public can view article categories"
  ON public.article_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage article categories"
  ON public.article_categories FOR ALL
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Public can view tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage tags"
  ON public.tags FOR ALL
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Public can view article tags"
  ON public.article_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage article tags"
  ON public.article_tags FOR ALL
  TO authenticated
  USING (public.is_staff());

-- 6. Media Assets Policies
CREATE POLICY "Public can view media assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can insert media assets"
  ON public.media_assets FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete media assets"
  ON public.media_assets FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- 7. Breaking News Items Policies
CREATE POLICY "Public can view active breaking news"
  ON public.breaking_news_items FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > timezone('utc', now()))
    OR public.is_staff()
  );

CREATE POLICY "Staff can manage breaking news"
  ON public.breaking_news_items FOR ALL
  TO authenticated
  USING (public.is_staff());

-- 8. Audit Logs Policies
CREATE POLICY "Only staff can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());
