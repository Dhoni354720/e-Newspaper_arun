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

-- Ensure edition_region exists even if table was previously created with region
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'epaper_editions' AND column_name = 'region'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'epaper_editions' AND column_name = 'edition_region'
  ) THEN
    ALTER TABLE public.epaper_editions RENAME COLUMN region TO edition_region;
  END IF;
END $$;

ALTER TABLE public.epaper_editions
  ADD COLUMN IF NOT EXISTS edition_region TEXT NOT NULL DEFAULT 'mumbai',
  ADD COLUMN IF NOT EXISTS title_hi TEXT,
  ADD COLUMN IF NOT EXISTS title_mr TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT;

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
DROP POLICY IF EXISTS "Public can view published epaper editions" ON public.epaper_editions;
CREATE POLICY "Public can view published epaper editions"
    ON public.epaper_editions FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view epaper pages" ON public.epaper_pages;
CREATE POLICY "Public can view epaper pages"
    ON public.epaper_pages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.epaper_editions e
        WHERE e.id = epaper_pages.edition_id AND (e.is_published = true OR auth.role() = 'authenticated')
    ));

DROP POLICY IF EXISTS "Public can view and insert epaper clips" ON public.epaper_clips;
CREATE POLICY "Public can view and insert epaper clips"
    ON public.epaper_clips FOR ALL
    USING (true)
    WITH CHECK (true);

-- Staff can manage epaper editions and pages
DROP POLICY IF EXISTS "Staff can manage epaper editions" ON public.epaper_editions;
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

DROP POLICY IF EXISTS "Staff can manage epaper pages" ON public.epaper_pages;
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
