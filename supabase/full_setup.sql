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
-- ==============================================================================
-- JANVANI NEWS (जनवाणी न्यूज) — E-PAPER SCHEMA & RLS MIGRATION
-- High-Performance Digital Newspaper Publishing with RLS, Indexes, & RPCs
-- ==============================================================================

-- 1. EPAPER EDITIONS TABLE
CREATE TABLE IF NOT EXISTS public.epaper_editions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  edition_date DATE NOT NULL,
  region TEXT NOT NULL DEFAULT 'Pune',
  total_pages INT NOT NULL DEFAULT 1,
  pdf_url TEXT,
  thumbnail_url TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count BIGINT NOT NULL DEFAULT 0,
  downloads_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. EPAPER PAGES TABLE
CREATE TABLE IF NOT EXISTS public.epaper_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  edition_id TEXT NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  image_url TEXT NOT NULL,
  page_title TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_edition_page UNIQUE (edition_id, page_number)
);

-- 3. INDEXES FOR HIGH-TRAFFIC SCALABILITY
CREATE INDEX IF NOT EXISTS idx_epaper_editions_date ON public.epaper_editions(edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_region ON public.epaper_editions(region);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_published ON public.epaper_editions(is_published, edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_pages_edition_num ON public.epaper_pages(edition_id, page_number ASC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.epaper_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epaper_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published editions
CREATE POLICY "Public Read Access for Published Epaper Editions"
  ON public.epaper_editions FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Staff can view all editions (including drafts)
CREATE POLICY "Staff Full Access for Epaper Editions"
  ON public.epaper_editions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Public can read pages of published editions
CREATE POLICY "Public Read Access for Published Epaper Pages"
  ON public.epaper_pages FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.epaper_editions e
      WHERE e.id = epaper_pages.edition_id AND e.is_published = true
    )
  );

-- Staff can manage all epaper pages
CREATE POLICY "Staff Full Access for Epaper Pages"
  ON public.epaper_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- 5. ATOMIC RPC COUNTERS FOR HIGH CONCURRENCY
CREATE OR REPLACE FUNCTION public.increment_epaper_views(edition_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.epaper_editions
  SET views_count = views_count + 1
  WHERE id = edition_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_epaper_downloads(edition_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.epaper_editions
  SET downloads_count = downloads_count + 1
  WHERE id = edition_id;
END;
$$;
-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा) — PHASE 0 SECURITY HARDENING
-- Timestamp: 20261028_01_security_hardening.sql
-- ==============================================================================

-- 1. CONTACT MESSAGES TABLE (Real form submissions)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can submit contact messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only staff (admin & editor) can read and manage contact messages
DROP POLICY IF EXISTS "Staff can read contact messages" ON public.contact_messages;
CREATE POLICY "Staff can read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Staff can update contact messages" ON public.contact_messages;
CREATE POLICY "Staff can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ------------------------------------------------------------------------------
-- 2. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP (LEAST PRIVILEGE: 'author')
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'author', -- Least privilege default: author, never admin
    NEW.raw_user_meta_data->>'avatar_url',
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. PREVENT PRIVILEGE ESCALATION
-- Non-admin users cannot alter their own or others' roles
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Security Violation: Only system administrators can modify user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC AUDIT LOGGING TRIGGER ON CORE ENTITIES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_entity_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
  v_entity_type TEXT := TG_TABLE_NAME;
  v_entity_id TEXT;
  v_meta JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_entity_id := NEW.id::TEXT;
    v_meta := jsonb_build_object('data', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'articles' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'published' THEN
      v_action := 'publish';
    ELSE
      v_action := 'update';
    END IF;
    v_entity_id := NEW.id::TEXT;
    v_meta := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_entity_id := OLD.id::TEXT;
    v_meta := jsonb_build_object('old', to_jsonb(OLD));
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata,
    created_at
  )
  VALUES (
    auth.uid(),
    v_action,
    v_entity_type,
    v_entity_id,
    v_meta,
    timezone('utc', now())
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit logging triggers
DROP TRIGGER IF EXISTS trigger_audit_articles ON public.articles;
CREATE TRIGGER trigger_audit_articles
  AFTER INSERT OR UPDATE OR DELETE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

DROP TRIGGER IF EXISTS trigger_audit_settings ON public.site_settings;
CREATE TRIGGER trigger_audit_settings
  AFTER UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

-- ------------------------------------------------------------------------------
-- 5. REINFORCE ARTICLE RLS POLICIES (Strict Public & Author boundaries)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    (status = 'published' AND published_at <= timezone('utc', now()))
    OR (
      auth.uid() IS NOT NULL AND (
        -- Staff can view all articles
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
        -- Authors can only view their own drafts / submissions
        OR author_id = auth.uid()
      )
    )
  );

-- Author can only update their own unapproved articles
DROP POLICY IF EXISTS "Authors can update own non-published articles" ON public.articles;
CREATE POLICY "Authors can update own non-published articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
    OR (
      author_id = auth.uid()
      AND status IN ('draft', 'submitted')
    )
  );

-- ------------------------------------------------------------------------------
-- 6. INITIAL ADMIN SETUP PROCEDURE (Idempotent Helper)
-- To create the first administrator safely without committing credentials:
-- Run in Supabase SQL editor:
-- SELECT public.setup_initial_admin('jagatsameeksha2014@gmail.com', 'YourStrongPasswordHere', 'अरुण तिवारी (मुख्य संपादक)');
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.setup_initial_admin(
  p_email TEXT,
  p_password TEXT,
  p_display_name TEXT DEFAULT 'मुख्य संपादक'
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = lower(p_email);

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      lower(p_email),
      crypt(p_password, gen_salt('bf')),
      timezone('utc', now()),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      jsonb_build_object('display_name', p_display_name),
      timezone('utc', now()),
      timezone('utc', now())
    );
  END IF;

  -- Ensure profile exists with 'admin' role
  INSERT INTO public.profiles (id, display_name, role, created_at, updated_at)
  VALUES (v_user_id, p_display_name, 'admin', timezone('utc', now()), timezone('utc', now()))
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    display_name = p_display_name,
    updated_at = timezone('utc', now());

  -- Record audit log
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  VALUES (v_user_id, 'create', 'initial_admin', v_user_id::TEXT, jsonb_build_object('email', lower(p_email)));

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा) — PHASE 1 MIGRATION
-- Timestamp: 20261028_02_categories_authors_homeblocks.sql
-- ==============================================================================

-- 1. EXTEND CATEGORIES TABLE
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'news' CHECK (kind IN ('news', 'city', 'opinion', 'supplement', 'special')),
  ADD COLUMN IF NOT EXISTS show_in_nav BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nav_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS color_hex TEXT;

CREATE INDEX IF NOT EXISTS idx_categories_nav ON public.categories(show_in_nav, nav_order);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);

-- 2. EXTEND PROFILES TABLE (AUTHOR ATTRIBUTION & COLUMNISTS)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS bio_hi TEXT,
  ADD COLUMN IF NOT EXISTS bio_mr TEXT,
  ADD COLUMN IF NOT EXISTS bio_en TEXT,
  ADD COLUMN IF NOT EXISTS designation TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_columnist BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug) WHERE slug IS NOT NULL;

-- 3. EXTEND ARTICLES TABLE (PRINT STYLE, TOP NEWS & EPAPER LINKAGE)
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS dateline TEXT,
  ADD COLUMN IF NOT EXISTS credit_line TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'standard' CHECK (kind IN ('standard', 'lead', 'feature', 'opinion', 'brief')),
  ADD COLUMN IF NOT EXISTS is_top BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS top_rank INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS epaper_edition_id TEXT REFERENCES public.epaper_editions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS epaper_page_number INT;

CREATE INDEX IF NOT EXISTS idx_articles_top ON public.articles(is_top, top_rank ASC) WHERE is_top = true;
CREATE INDEX IF NOT EXISTS idx_articles_epaper ON public.articles(epaper_edition_id, epaper_page_number);

-- 4. CREATE HOME_BLOCKS TABLE (DYNAMIC HOMEPAGE LAYOUT MANAGER)
CREATE TABLE IF NOT EXISTS public.home_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL CHECK (block_type IN (
    'hero',
    'ticker',
    'top_news',
    'latest',
    'city',
    'opinion',
    'crime',
    'sports',
    'entertainment',
    'lifestyle',
    'photo_strip',
    'video_strip',
    'rashifal',
    'weather',
    'epaper_promo',
    'ad_slot'
  )),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title_override_hi TEXT,
  title_override_mr TEXT,
  title_override_en TEXT,
  item_count INT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.home_blocks ENABLE ROW LEVEL SECURITY;

-- Home blocks RLS: Public can read active blocks
DROP POLICY IF EXISTS "Public can view active home blocks" ON public.home_blocks;
CREATE POLICY "Public can view active home blocks"
  ON public.home_blocks FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  ));

-- Staff can modify home blocks
DROP POLICY IF EXISTS "Staff can manage home blocks" ON public.home_blocks;
CREATE POLICY "Staff can manage home blocks"
  ON public.home_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

CREATE TRIGGER trigger_update_home_blocks_timestamp
  BEFORE UPDATE ON public.home_blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. ARTICLE REVISIONS TABLE (EDITORIAL AUDIT TRAIL & RESTORE)
CREATE TABLE IF NOT EXISTS public.article_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view article revisions" ON public.article_revisions;
CREATE POLICY "Staff can view article revisions"
  ON public.article_revisions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Staff can insert article revisions" ON public.article_revisions;
CREATE POLICY "Staff can insert article revisions"
  ON public.article_revisions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
    )
  );
-- ==============================================================================
-- MIGRATION: 20261028_03_content_types.sql
-- Dainik Jagat Sameeksha - New Editorial Content Subsystems (Phase 2)
-- Tables: galleries, gallery_images, videos, briefs (flash news), horoscopes,
--         supplements, news_tips, pages
-- ==============================================================================

-- 1. PHOTO GALLERIES & IMAGES
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_hi TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    credit TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption_hi TEXT,
    caption_mr TEXT,
    caption_en TEXT,
    credit TEXT,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_galleries_slug ON public.galleries(slug);
CREATE INDEX IF NOT EXISTS idx_galleries_published ON public.galleries(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery ON public.gallery_images(gallery_id, sort_order ASC);

-- 2. VIDEOS HUB
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL DEFAULT 'youtube' CHECK (provider IN ('youtube', 'vimeo', 'custom')),
    video_id_or_url TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_hi TEXT,
    description_mr TEXT,
    description_en TEXT,
    thumbnail_url TEXT NOT NULL,
    duration_seconds INT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON public.videos(slug);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published, published_at DESC);

-- 3. BRIEFS / FLASH NEWS (फटाफट खबरें)
CREATE TABLE IF NOT EXISTS public.briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT NOT NULL DEFAULT 'hi' CHECK (language IN ('hi', 'mr', 'en')),
    content TEXT NOT NULL,
    image_url TEXT,
    target_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefs_pub ON public.briefs(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_lang ON public.briefs(language);

-- 4. HOROSCOPES (दैनिक राशिफल)
CREATE TABLE IF NOT EXISTS public.horoscopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period TEXT NOT NULL DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly')),
    date_for DATE NOT NULL DEFAULT CURRENT_DATE,
    sign TEXT NOT NULL CHECK (sign IN (
        'aries', 'taurus', 'gemini', 'cancer',
        'leo', 'virgo', 'libra', 'scorpio',
        'sagittarius', 'capricorn', 'aquarius', 'pisces'
    )),
    content_hi TEXT NOT NULL,
    content_mr TEXT,
    content_en TEXT,
    lucky_number INT,
    lucky_color TEXT,
    author_credit TEXT DEFAULT 'दैनिक जगत समीक्षा ज्योतिष केंद्र',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_horoscope_period_date_sign UNIQUE (period, date_for, sign)
);

CREATE INDEX IF NOT EXISTS idx_horoscopes_lookup ON public.horoscopes(date_for DESC, period, sign);

-- 5. SUPPLEMENTS (विशेषांक एवं पुरवणी)
CREATE TABLE IF NOT EXISTS public.supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_hi TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    pdf_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplements_date ON public.supplements(issue_date DESC, is_published);

-- 6. NEWS TIPS / CITIZEN JOURNALISM (समाचार भेजें)
CREATE TABLE IF NOT EXISTS public.news_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    sender_city TEXT NOT NULL,
    message TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'used', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_tips_status ON public.news_tips(status, created_at DESC);

-- 7. CMS EDITABLE PAGES (डायनामिक वेब पृष्ठ व शिकायत निवारण)
CREATE TABLE IF NOT EXISTS public.pages (
    slug TEXT PRIMARY KEY,
    title_hi TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    body_hi TEXT NOT NULL,
    body_mr TEXT NOT NULL,
    body_en TEXT NOT NULL,
    meta_description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Helpers for role checking
CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'editor', 'author')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies for published content
CREATE POLICY "Public read published galleries" ON public.galleries
    FOR SELECT USING (is_published = true AND published_at <= NOW());

CREATE POLICY "Staff manage all galleries" ON public.galleries
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read gallery images" ON public.gallery_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.galleries g
            WHERE g.id = gallery_images.gallery_id
            AND g.is_published = true
            AND g.published_at <= NOW()
        )
    );

CREATE POLICY "Staff manage gallery images" ON public.gallery_images
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read published videos" ON public.videos
    FOR SELECT USING (is_published = true AND published_at <= NOW());

CREATE POLICY "Staff manage all videos" ON public.videos
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read published briefs" ON public.briefs
    FOR SELECT USING (is_published = true);

CREATE POLICY "Staff manage all briefs" ON public.briefs
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read horoscopes" ON public.horoscopes
    FOR SELECT USING (true);

CREATE POLICY "Staff manage horoscopes" ON public.horoscopes
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read published supplements" ON public.supplements
    FOR SELECT USING (is_published = true);

CREATE POLICY "Staff manage supplements" ON public.supplements
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public submit news tips" ON public.news_tips
    FOR INSERT WITH CHECK (
        length(sender_name) >= 2 AND
        length(sender_phone) >= 10 AND
        length(message) >= 10
    );

CREATE POLICY "Staff manage news tips" ON public.news_tips
    FOR ALL USING (public.is_staff_user());

CREATE POLICY "Public read published pages" ON public.pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Staff manage pages" ON public.pages
    FOR ALL USING (public.is_staff_user());
-- Migration: 20261028_04_epaper_pipeline.sql
-- Description: E-Paper digital pipeline, broadsheet pages, and interactive article clipping

-- 1. Create or enhance epaper_editions table
CREATE TABLE IF NOT EXISTS public.epaper_editions (
    id TEXT PRIMARY KEY,
    edition_date DATE NOT NULL,
    edition_region TEXT NOT NULL DEFAULT 'mumbai',
    title TEXT NOT NULL,
    title_hi TEXT,
    title_mr TEXT,
    title_en TEXT,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    pdf_url TEXT,
    file_size_bytes BIGINT,
    total_pages INTEGER NOT NULL DEFAULT 4,
    is_published BOOLEAN NOT NULL DEFAULT true,
    views_count BIGINT NOT NULL DEFAULT 0,
    downloads_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create epaper_pages table
CREATE TABLE IF NOT EXISTS public.epaper_pages (
    id TEXT PRIMARY KEY,
    edition_id TEXT NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    page_title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    zoom_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_epaper_page UNIQUE (edition_id, page_number)
);

-- 3. Create epaper_clips table (for saved/shared newspaper article crops)
CREATE TABLE IF NOT EXISTS public.epaper_clips (
    id TEXT PRIMARY KEY,
    edition_id TEXT NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    title TEXT,
    clip_url TEXT NOT NULL,
    share_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_epaper_editions_date ON public.epaper_editions (edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_region ON public.epaper_editions (edition_region);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_published ON public.epaper_editions (is_published, edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_pages_edition ON public.epaper_pages (edition_id, page_number ASC);
CREATE INDEX IF NOT EXISTS idx_epaper_clips_edition ON public.epaper_clips (edition_id);

-- 5. Row Level Security Policies
ALTER TABLE public.epaper_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epaper_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epaper_clips ENABLE ROW LEVEL SECURITY;

-- Public can view published editions and their pages
CREATE POLICY "Public can view published epaper editions"
    ON public.epaper_editions FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Public can view epaper pages"
    ON public.epaper_pages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.epaper_editions e
        WHERE e.id = epaper_pages.edition_id AND (e.is_published = true OR auth.role() = 'authenticated')
    ));

CREATE POLICY "Public can view and insert epaper clips"
    ON public.epaper_clips FOR ALL
    USING (true)
    WITH CHECK (true);

-- Staff can manage epaper editions and pages
CREATE POLICY "Staff can manage epaper editions"
    ON public.epaper_editions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('editor', 'admin')
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('editor', 'admin')
    ));

CREATE POLICY "Staff can manage epaper pages"
    ON public.epaper_pages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('editor', 'admin')
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role IN ('editor', 'admin')
    ));
-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION & POLICIES
-- ==============================================================================

-- 1. Create article-media public storage bucket (Images up to 10MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-media',
  'article-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

-- 2. Create epaper-editions public storage bucket (PDFs & High-Res Page Previews up to 100MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'epaper-editions',
  'epaper-editions',
  true,
  104857600, -- 100MB limit for high-res e-paper PDFs
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Storage Policies for article-media:
-- 1. Anyone can view/download public images
CREATE POLICY "Public Read Access for Article Media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'article-media');

-- 2. Only authenticated staff can upload images
CREATE POLICY "Staff Upload Access for Article Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-media'
  AND (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  ))
);

-- 3. Only staff can delete images
CREATE POLICY "Staff Delete Access for Article Media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-media'
  AND (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  ))
);

-- Storage Policies for epaper-editions:
-- 1. Anyone can read epaper PDFs and page images
CREATE POLICY "Public Read Access for Epaper Objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'epaper-editions');

-- 2. Only authenticated staff can upload epapers
CREATE POLICY "Staff Upload Access for Epaper Objects"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'epaper-editions'
  AND (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  ))
);

-- 3. Only staff can delete epaper files
CREATE POLICY "Staff Delete Access for Epaper Objects"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'epaper-editions'
  AND (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  ))
);
-- ==============================================================================
-- JANVANI NEWS (जनवाणी न्यूज) — SEED DATA
-- Default Categories, Translations, Initial Site Settings & Demo Editorial Content
-- ==============================================================================

-- 1. Site Settings Default Record
INSERT INTO public.site_settings (
  id,
  publication_name,
  publication_name_mr,
  publication_name_hi,
  tagline,
  default_language,
  supported_languages,
  contact_email,
  contact_phone,
  office_address,
  social_links,
  theme_settings
) VALUES (
  'default',
  'दैनिक जगत समीक्षा',
  'दैनिक जगत समीक्षा',
  'दैनिक जगत समीक्षा',
  'सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र',
  'hi',
  ARRAY['hi', 'mr', 'en'],
  'jagatsameeksha2014@gmail.com',
  '+91 8369517611',
  'भांडुप (पश्चिम), मुंबई, महाराष्ट्र 400078',
  '{"twitter": "https://twitter.com/jagatsameeksha", "facebook": "https://facebook.com/jagatsameeksha", "youtube": "https://youtube.com/@jagatsameeksha"}'::jsonb,
  '{"accentColor": "#ed1c24", "mastheadStyle": "classic", "enableBreakingTicker": true}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  publication_name = EXCLUDED.publication_name,
  publication_name_mr = EXCLUDED.publication_name_mr,
  publication_name_hi = EXCLUDED.publication_name_hi;

-- 2. Initial Categories (UUIDs explicitly specified for clean relational linking)
INSERT INTO public.categories (id, slug, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'maharashtra', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'mumbai', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'pune', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'india', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'politics', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'business', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'technology', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'education', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'sports', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'entertainment', 10, true),
  ('c1000000-0000-0000-0000-000000000011', 'health', 11, true),
  ('c1000000-0000-0000-0000-000000000012', 'agriculture', 12, true),
  ('c1000000-0000-0000-0000-000000000013', 'breaking-news', 13, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Category Translations (Marathi, Hindi, English)
INSERT INTO public.category_translations (category_id, language, name, description) VALUES
  -- Maharashtra
  ('c1000000-0000-0000-0000-000000000001', 'mr', 'महाराष्ट्र', 'महाराष्ट्रातील ताज्या घडामोडी, विकासकामे आणि प्रादेशिक वृत्त'),
  ('c1000000-0000-0000-0000-000000000001', 'hi', 'महाराष्ट्र', 'महाराष्ट्र की ताज़ा खबरें, विकास कार्य और प्रादेशिक समाचार'),
  ('c1000000-0000-0000-0000-000000000001', 'en', 'Maharashtra', 'Latest news, developments and regional reporting from Maharashtra'),

  -- Mumbai
  ('c1000000-0000-0000-0000-000000000002', 'mr', 'मुंबई', 'मुंबई महानगर, स्थानिक प्रश्न आणि घडामोडी'),
  ('c1000000-0000-0000-0000-000000000002', 'hi', 'मुंबई', 'मुंबई महानगर, स्थानीय मुद्दे और शहर की हलचल'),
  ('c1000000-0000-0000-0000-000000000002', 'en', 'Mumbai', 'Mumbai metropolitan news, civic issues, and city developments'),

  -- Pune
  ('c1000000-0000-0000-0000-000000000003', 'mr', 'पुणे', 'पुणे शहर, पिंपरी चिंचवड आणि जिल्ह्यातील महत्त्वाच्या घडामोडी'),
  ('c1000000-0000-0000-0000-000000000003', 'hi', 'पुणे', 'पुणे शहर, पिंपरी चिंचवड और जिले के प्रमुख समाचार'),
  ('c1000000-0000-0000-0000-000000000003', 'en', 'Pune', 'Pune city, PCMC and district news and events'),

  -- India
  ('c1000000-0000-0000-0000-000000000004', 'mr', 'देश', 'राष्ट्रीय घडामोडी आणि देशभरातील बातम्या'),
  ('c1000000-0000-0000-0000-000000000004', 'hi', 'देश', 'राष्ट्रीय घटनाक्रम और देश भर के समाचार'),
  ('c1000000-0000-0000-0000-000000000004', 'en', 'India', 'National news, central policies, and nationwide coverage'),

  -- Politics
  ('c1000000-0000-0000-0000-000000000005', 'mr', 'राजकारण', 'राजकीय विश्लेषण, निवडणुका आणि सत्ताकारणातील घडामोडी'),
  ('c1000000-0000-0000-0000-000000000005', 'hi', 'राजनीति', 'राजनीतिक विश्लेषण, चुनाव और सत्ता गलियारों की हलचल'),
  ('c1000000-0000-0000-0000-000000000005', 'en', 'Politics', 'Political analysis, governance, elections and policy decisions'),

  -- Business
  ('c1000000-0000-0000-0000-000000000006', 'mr', 'अर्थकारण', 'शेअर बाजार, उद्योग, अर्थव्यवस्था आणि अर्थसंकल्प'),
  ('c1000000-0000-0000-0000-000000000006', 'hi', 'व्यापार', 'शेयर बाजार, उद्योग, व्यापार और अर्थव्यवस्था'),
  ('c1000000-0000-0000-0000-000000000006', 'en', 'Business', 'Markets, economy, enterprise, startups and personal finance'),

  -- Technology
  ('c1000000-0000-0000-0000-000000000007', 'mr', 'तंत्रज्ञान', 'टेक जगतातील क्रांती, सायबर सुरक्षा आणि नवनवीन गॅजेट्स'),
  ('c1000000-0000-0000-0000-000000000007', 'hi', 'तकनीक', 'तकनीकी दुनिया, एआई, गैजेट्स और डिजिटल बदलाव'),
  ('c1000000-0000-0000-0000-000000000007', 'en', 'Technology', 'AI advancements, digital innovation, cybersecurity and gadgets'),

  -- Education
  ('c1000000-0000-0000-0000-000000000008', 'mr', 'शिक्षण', 'शालेय व उच्च शिक्षण, परीक्षा निकाल आणि करिअर मार्गदर्शन'),
  ('c1000000-0000-0000-0000-000000000008', 'hi', 'शिक्षा', 'शिक्षा, बोर्ड परीक्षाएं, परिणाम और करियर मार्गदर्शन'),
  ('c1000000-0000-0000-0000-000000000008', 'en', 'Education', 'School and higher education, exam results and career guidance'),

  -- Sports
  ('c1000000-0000-0000-0000-000000000009', 'mr', 'क्रीडा', 'क्रिकेट, फुटबॉल, कुस्ती आणि ऑलिम्पिक क्रीडा वार्ता'),
  ('c1000000-0000-0000-0000-000000000009', 'hi', 'खेल', 'क्रिकेट, फुटबॉल और प्रमुख राष्ट्रीय व अंतरराष्ट्रीय खेल'),
  ('c1000000-0000-0000-0000-000000000009', 'en', 'Sports', 'Cricket, football, athletics, wrestling and sporting tournaments'),

  -- Entertainment
  ('c1000000-0000-0000-0000-000000000010', 'mr', 'मनोरंजन', 'मराठी चित्रपट, बॉलिवूड, नाटक आणि ओटीटी समीक्षा'),
  ('c1000000-0000-0000-0000-000000000010', 'hi', 'मनोरंजन', 'बॉलीवुड, सिनेमा, वेब सीरीज और मनोरंजन जगत की खबरें'),
  ('c1000000-0000-0000-0000-000000000010', 'en', 'Entertainment', 'Regional cinema, Bollywood, theater, and OTT streaming reviews'),

  -- Health
  ('c1000000-0000-0000-0000-000000000011', 'mr', 'आरोग्य', 'आरोग्य सल्ला, वैद्यकीय संशोधन आणि निरोगी जीवनशैली'),
  ('c1000000-0000-0000-0000-000000000011', 'hi', 'स्वास्थ्य', 'स्वास्थ्य परामर्श, मेडिकल रिसर्च और सेहतमंद जीवनशैली'),
  ('c1000000-0000-0000-0000-000000000011', 'en', 'Health', 'Wellness, medical research, public healthcare and nutrition'),

  -- Agriculture
  ('c1000000-0000-0000-0000-000000000012', 'mr', 'कृषी', 'शेती तंत्रज्ञान, बाजारभाव, हवामान अंदाज आणि शेतकरी योजना'),
  ('c1000000-0000-0000-0000-000000000012', 'hi', 'कृषि', 'कृषि तकनीक, मंडी भाव, मौसम पूर्वानुमान और किसान कल्याण'),
  ('c1000000-0000-0000-0000-000000000012', 'en', 'Agriculture', 'Agritech, mandi rates, monsoon updates and farmer policies'),

  -- Breaking News
  ('c1000000-0000-0000-0000-000000000013', 'mr', 'महत्त्वाच्या घडामोडी', 'अति-महत्त्वाच्या आणि ब्रेकिंग घडामोडींचे तात्काळ कव्हरेज'),
  ('c1000000-0000-0000-0000-000000000013', 'hi', 'ब्रेकिंग न्यूज़', 'तात्कालिक एवं अत्यंत महत्वपूर्ण राष्ट्रीय व प्रादेशिक समाचार'),
  ('c1000000-0000-0000-0000-000000000013', 'en', 'Breaking News', 'Live alerts, high-priority developments and breaking bulletins')
ON CONFLICT (category_id, language) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ==============================================================================
-- INITIAL ADMIN ACCOUNT PROVISIONING
-- ==============================================================================
SELECT public.setup_initial_admin(
  'jagatsameeksha2014@gmail.com',
  'Admin@12345',
  'अरुण रमाकांत तिवारी (मुख्य संपादक)'
);

