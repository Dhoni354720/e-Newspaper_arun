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
DROP POLICY IF EXISTS "Public read published galleries" ON public.galleries;
CREATE POLICY "Public read published galleries" ON public.galleries
    FOR SELECT USING (is_published = true AND published_at <= NOW());

DROP POLICY IF EXISTS "Staff manage all galleries" ON public.galleries;
CREATE POLICY "Staff manage all galleries" ON public.galleries
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read gallery images" ON public.gallery_images;
CREATE POLICY "Public read gallery images" ON public.gallery_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.galleries g
            WHERE g.id = gallery_images.gallery_id
            AND g.is_published = true
            AND g.published_at <= NOW()
        )
    );

DROP POLICY IF EXISTS "Staff manage gallery images" ON public.gallery_images;
CREATE POLICY "Staff manage gallery images" ON public.gallery_images
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read published videos" ON public.videos;
CREATE POLICY "Public read published videos" ON public.videos
    FOR SELECT USING (is_published = true AND published_at <= NOW());

DROP POLICY IF EXISTS "Staff manage all videos" ON public.videos;
CREATE POLICY "Staff manage all videos" ON public.videos
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read published briefs" ON public.briefs;
CREATE POLICY "Public read published briefs" ON public.briefs
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Staff manage all briefs" ON public.briefs;
CREATE POLICY "Staff manage all briefs" ON public.briefs
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read horoscopes" ON public.horoscopes;
CREATE POLICY "Public read horoscopes" ON public.horoscopes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff manage horoscopes" ON public.horoscopes;
CREATE POLICY "Staff manage horoscopes" ON public.horoscopes
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read published supplements" ON public.supplements;
CREATE POLICY "Public read published supplements" ON public.supplements
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Staff manage supplements" ON public.supplements;
CREATE POLICY "Staff manage supplements" ON public.supplements
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public submit news tips" ON public.news_tips;
CREATE POLICY "Public submit news tips" ON public.news_tips
    FOR INSERT WITH CHECK (
        length(sender_name) >= 2 AND
        length(sender_phone) >= 10 AND
        length(message) >= 10
    );

DROP POLICY IF EXISTS "Staff manage news tips" ON public.news_tips;
CREATE POLICY "Staff manage news tips" ON public.news_tips
    FOR ALL USING (public.is_staff_user());

DROP POLICY IF EXISTS "Public read published pages" ON public.pages;
CREATE POLICY "Public read published pages" ON public.pages
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Staff manage pages" ON public.pages;
CREATE POLICY "Staff manage pages" ON public.pages
    FOR ALL USING (public.is_staff_user());
