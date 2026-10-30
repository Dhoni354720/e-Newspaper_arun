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
