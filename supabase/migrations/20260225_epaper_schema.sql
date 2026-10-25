-- ==============================================================================
-- JANVANI NEWS (जनवाणी न्यूज) — E-PAPER SCHEMA & RLS MIGRATION
-- High-Performance Digital Newspaper Publishing with RLS, Indexes, & RPCs
-- ==============================================================================

-- 1. EPAPER EDITIONS TABLE
CREATE TABLE IF NOT EXISTS public.epaper_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES public.epaper_editions(id) ON DELETE CASCADE,
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
