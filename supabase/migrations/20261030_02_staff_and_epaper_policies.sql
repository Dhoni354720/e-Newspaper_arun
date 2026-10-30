-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा)
-- MIGRATION: 20261030_02_staff_and_epaper_policies.sql
-- DESCRIPTION: Tighten staff definitions, reconcile E-paper schema,
--              harden epaper_clips policies, and fix counter RPCs with text IDs.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ROLE HELPER FUNCTIONS (Explicit Granular Semantics & search_path = public)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_author_or_above()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor', 'author')
  );
$$;

-- Harmonize legacy helper functions so 'author' NEVER gets editor/admin access
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.is_editor_or_admin();
$$;

CREATE OR REPLACE FUNCTION public.is_staff_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT public.is_editor_or_admin();
$$;

-- Grant execute to authenticated and anon so RLS policies can evaluate them
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_author_or_above() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff_user() TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. E-PAPER SCHEMA RECONCILIATION
-- ------------------------------------------------------------------------------
-- Create epaper_editions if it does not exist
CREATE TABLE IF NOT EXISTS public.epaper_editions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  edition_date DATE NOT NULL,
  edition_region TEXT NOT NULL DEFAULT 'mumbai',
  total_pages INT NOT NULL DEFAULT 4,
  thumbnail_url TEXT NOT NULL,
  pdf_url TEXT,
  file_size_bytes BIGINT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count BIGINT NOT NULL DEFAULT 0,
  downloads_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Reconcile columns on existing table
ALTER TABLE public.epaper_editions
  ADD COLUMN IF NOT EXISTS edition_region TEXT NOT NULL DEFAULT 'mumbai',
  ADD COLUMN IF NOT EXISTS title_hi TEXT,
  ADD COLUMN IF NOT EXISTS title_mr TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;

-- If earlier migration created 'region' column, backfill edition_region and keep consistent
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'epaper_editions' AND column_name = 'region'
  ) THEN
    EXECUTE 'UPDATE public.epaper_editions SET edition_region = COALESCE(edition_region, region, ''mumbai'') WHERE edition_region IS NULL;';
  END IF;
END $$;

-- Reconcile ID types: If earlier migration 20260225 created epaper_editions.id as UUID,
-- safely convert id and foreign keys to TEXT to support textual pipeline IDs ('ep-djs-...')
DO $$
DECLARE
  pol RECORD;
  fk RECORD;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'epaper_editions' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    -- 1. Drop any RLS policies depending on epaper columns before altering types
    FOR pol IN (
      SELECT schemaname, tablename, policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename IN ('epaper_pages', 'epaper_editions', 'epaper_clips')
    ) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;

    -- 2. Drop all foreign key constraints referencing epaper_editions(id)
    FOR fk IN (
      SELECT tc.table_schema, tc.table_name, tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.referential_constraints rc 
        ON tc.constraint_name = rc.constraint_name
      JOIN information_schema.table_constraints tc_pk 
        ON rc.unique_constraint_name = tc_pk.constraint_name
      WHERE tc_pk.table_schema = 'public' 
        AND tc_pk.table_name = 'epaper_editions' 
        AND tc.constraint_type = 'FOREIGN KEY'
    ) LOOP
      EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I', fk.table_schema, fk.table_name, fk.constraint_name);
    END LOOP;

    -- 3. Alter referencing columns to TEXT first
    ALTER TABLE public.epaper_pages ALTER COLUMN id TYPE TEXT;
    ALTER TABLE public.epaper_pages ALTER COLUMN edition_id TYPE TEXT;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'epaper_edition_id'
    ) THEN
      ALTER TABLE public.articles ALTER COLUMN epaper_edition_id TYPE TEXT;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'epaper_clips' AND column_name = 'edition_id'
    ) THEN
      ALTER TABLE public.epaper_clips ALTER COLUMN id TYPE TEXT;
      ALTER TABLE public.epaper_clips ALTER COLUMN edition_id TYPE TEXT;
    END IF;

    -- 4. Alter epaper_editions primary key to TEXT
    ALTER TABLE public.epaper_editions ALTER COLUMN id TYPE TEXT;

    -- 5. Re-add foreign key constraints with matching TEXT types
    ALTER TABLE public.epaper_pages ADD CONSTRAINT epaper_pages_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.epaper_editions(id) ON DELETE CASCADE;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'epaper_edition_id'
    ) THEN
      ALTER TABLE public.articles ADD CONSTRAINT articles_epaper_edition_id_fkey FOREIGN KEY (epaper_edition_id) REFERENCES public.epaper_editions(id) ON DELETE SET NULL;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'epaper_clips'
    ) THEN
      ALTER TABLE public.epaper_clips ADD CONSTRAINT epaper_clips_edition_id_fkey FOREIGN KEY (edition_id) REFERENCES public.epaper_editions(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create epaper_pages if not exists
CREATE TABLE IF NOT EXISTS public.epaper_pages (
  id TEXT PRIMARY KEY,
  edition_id TEXT NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  page_title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  zoom_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_epaper_edition_page UNIQUE (edition_id, page_number)
);

ALTER TABLE public.epaper_pages
  ADD COLUMN IF NOT EXISTS zoom_image_url TEXT;

-- Create epaper_clips if not exists (matching epaper_editions.id data type: UUID or TEXT)
DO $$
DECLARE
  v_id_type TEXT;
BEGIN
  SELECT data_type INTO v_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'epaper_editions' AND column_name = 'id';

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'epaper_clips') THEN
    IF v_id_type = 'uuid' THEN
      CREATE TABLE public.epaper_clips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        edition_id UUID NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
        page_number INT NOT NULL,
        title TEXT,
        clip_url TEXT NOT NULL,
        share_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
      );
    ELSE
      CREATE TABLE public.epaper_clips (
        id TEXT PRIMARY KEY,
        edition_id TEXT NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
        page_number INT NOT NULL,
        title TEXT,
        clip_url TEXT NOT NULL,
        share_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
      );
    END IF;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_epaper_editions_date ON public.epaper_editions (edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_region ON public.epaper_editions (edition_region);
CREATE INDEX IF NOT EXISTS idx_epaper_editions_published ON public.epaper_editions (is_published, edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_epaper_pages_edition ON public.epaper_pages (edition_id, page_number ASC);
CREATE INDEX IF NOT EXISTS idx_epaper_clips_edition ON public.epaper_clips (edition_id);

-- ------------------------------------------------------------------------------
-- 3. EPAPER RLS POLICIES (Drafts restricted to Editor/Admin only)
-- ------------------------------------------------------------------------------
ALTER TABLE public.epaper_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epaper_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epaper_clips ENABLE ROW LEVEL SECURITY;

-- Epaper Editions
DROP POLICY IF EXISTS "Public Read Access for Published Epaper Editions" ON public.epaper_editions;
DROP POLICY IF EXISTS "Staff Full Access for Epaper Editions" ON public.epaper_editions;
DROP POLICY IF EXISTS "Public can view published epaper editions" ON public.epaper_editions;
DROP POLICY IF EXISTS "Staff can manage epaper editions" ON public.epaper_editions;

-- Public can only view published editions. Drafts require editor or admin.
CREATE POLICY "Public can view published epaper editions"
  ON public.epaper_editions FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_editor_or_admin());

CREATE POLICY "Staff can manage epaper editions"
  ON public.epaper_editions FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Epaper Pages
DROP POLICY IF EXISTS "Public Read Access for Published Epaper Pages" ON public.epaper_pages;
DROP POLICY IF EXISTS "Staff Full Access for Epaper Pages" ON public.epaper_pages;
DROP POLICY IF EXISTS "Public can view epaper pages" ON public.epaper_pages;
DROP POLICY IF EXISTS "Staff can manage epaper pages" ON public.epaper_pages;

CREATE POLICY "Public can view epaper pages"
  ON public.epaper_pages FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.epaper_editions e
      WHERE e.id = epaper_pages.edition_id
        AND (e.is_published = true OR public.is_editor_or_admin())
    )
  );

CREATE POLICY "Staff can manage epaper pages"
  ON public.epaper_pages FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Epaper Clips: Public SELECT, validated INSERT, Staff ALL, no public UPDATE/DELETE
DROP POLICY IF EXISTS "Public can view and insert epaper clips" ON public.epaper_clips;
DROP POLICY IF EXISTS "Public can view epaper clips" ON public.epaper_clips;
DROP POLICY IF EXISTS "Public can insert epaper clips" ON public.epaper_clips;
DROP POLICY IF EXISTS "Staff can manage epaper clips" ON public.epaper_clips;

CREATE POLICY "Public can view epaper clips"
  ON public.epaper_clips FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert epaper clips"
  ON public.epaper_clips FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.epaper_editions e
      WHERE e.id = edition_id AND e.is_published = true
    )
  );

CREATE POLICY "Staff can manage epaper clips"
  ON public.epaper_clips FOR ALL
  TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 4. TIGHTEN CONTENT SUBSYSTEM POLICIES (Editor/Admin Only)
-- ------------------------------------------------------------------------------
-- Galleries & Images
DROP POLICY IF EXISTS "Staff manage all galleries" ON public.galleries;
CREATE POLICY "Staff manage all galleries" ON public.galleries
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Staff manage gallery images" ON public.gallery_images;
CREATE POLICY "Staff manage gallery images" ON public.gallery_images
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Videos
DROP POLICY IF EXISTS "Staff manage all videos" ON public.videos;
CREATE POLICY "Staff manage all videos" ON public.videos
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Briefs
DROP POLICY IF EXISTS "Staff manage all briefs" ON public.briefs;
CREATE POLICY "Staff manage all briefs" ON public.briefs
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Horoscopes
DROP POLICY IF EXISTS "Staff manage horoscopes" ON public.horoscopes;
CREATE POLICY "Staff manage horoscopes" ON public.horoscopes
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Supplements
DROP POLICY IF EXISTS "Staff manage supplements" ON public.supplements;
CREATE POLICY "Staff manage supplements" ON public.supplements
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Pages Manager
DROP POLICY IF EXISTS "Staff manage pages" ON public.pages;
CREATE POLICY "Staff manage pages" ON public.pages
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- News Tips Management: Public INSERT, only Editor/Admin can SELECT and UPDATE
DROP POLICY IF EXISTS "Staff manage news tips" ON public.news_tips;
CREATE POLICY "Staff manage news tips" ON public.news_tips
  FOR ALL TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- Contact Messages Management: Public INSERT, only Editor/Admin can SELECT and UPDATE
DROP POLICY IF EXISTS "Staff can read contact messages" ON public.contact_messages;
CREATE POLICY "Staff can read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.is_editor_or_admin());

DROP POLICY IF EXISTS "Staff can update contact messages" ON public.contact_messages;
CREATE POLICY "Staff can update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 5. COUNTER RPC RECREATION (TEXT IDs, Search Path & Published Guard)
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.increment_epaper_views(UUID);
DROP FUNCTION IF EXISTS public.increment_epaper_downloads(UUID);
DROP FUNCTION IF EXISTS public.increment_epaper_views(TEXT);
DROP FUNCTION IF EXISTS public.increment_epaper_downloads(TEXT);

CREATE OR REPLACE FUNCTION public.increment_epaper_views(edition_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment views only for published broadsheet editions
  UPDATE public.epaper_editions
  SET views_count = views_count + 1
  WHERE id = edition_id AND is_published = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_epaper_downloads(edition_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment downloads only for published broadsheet editions
  UPDATE public.epaper_editions
  SET downloads_count = downloads_count + 1
  WHERE id = edition_id AND is_published = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_epaper_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_epaper_downloads(TEXT) TO anon, authenticated;
