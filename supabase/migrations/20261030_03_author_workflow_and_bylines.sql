-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा)
-- MIGRATION: 20261030_03_author_workflow_and_bylines.sql
-- DESCRIPTION: Author editorial submission workflow ('submitted' status),
--              safe public bylines view, public form insert hardening,
--              auto-set published_at trigger, and Dainik Jagat Sameeksha branding.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AUTHOR WORKFLOW & ARTICLE STATUS EXTENSION
-- ------------------------------------------------------------------------------
-- Update CHECK constraint on articles to support 'submitted' status
ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_status_check;
ALTER TABLE public.articles ADD CONSTRAINT articles_status_check
  CHECK (status IN ('draft', 'submitted', 'scheduled', 'published', 'archived'));

-- Drop older articles policies to recreate with author/editor boundaries
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can update articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can update own non-published articles" ON public.articles;
DROP POLICY IF EXISTS "Authors insert own articles" ON public.articles;
DROP POLICY IF EXISTS "Authors update own draft or submitted articles" ON public.articles;
DROP POLICY IF EXISTS "Editors manage all articles" ON public.articles;

-- SELECT Policy:
-- 1. Anyone (anonymous / reader) can read published articles whose publish date has arrived
-- 2. Authors can read their own articles in ANY status
-- 3. Editors & Admins can read ALL articles in ANY status
CREATE POLICY "Public and authors can view articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    (status = 'published' AND published_at <= timezone('utc', now()))
    OR (auth.uid() IS NOT NULL AND author_id = auth.uid())
    OR public.is_editor_or_admin()
  );

-- INSERT Policy:
-- 1. Authors can only insert articles under their own author_id and as 'draft' or 'submitted'
-- 2. Editors and Admins can insert articles for any author and in any status
CREATE POLICY "Authors and editors can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_editor_or_admin()
    OR (
      author_id = auth.uid()
      AND status IN ('draft', 'submitted')
    )
  );

-- UPDATE Policy:
-- 1. Authors can only update their own articles while currently in 'draft' or 'submitted',
--    and cannot transition them to 'published', 'scheduled', or 'archived'.
-- 2. Editors and Admins can update any article and transition to any status.
CREATE POLICY "Authors and editors can update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    public.is_editor_or_admin()
    OR (
      author_id = auth.uid()
      AND status IN ('draft', 'submitted')
    )
  )
  WITH CHECK (
    public.is_editor_or_admin()
    OR (
      author_id = auth.uid()
      AND status IN ('draft', 'submitted')
    )
  );

-- DELETE Policy:
-- Only Editors and Admins can delete articles
CREATE POLICY "Editors and admins can delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.is_editor_or_admin());

-- ------------------------------------------------------------------------------
-- 2. AUTO-SET published_at TRIGGER ON PUBLISHING
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_article_published_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := timezone('utc', now());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_article_published_at ON public.articles;
CREATE TRIGGER trigger_set_article_published_at
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_article_published_at();

-- ------------------------------------------------------------------------------
-- 3. PUBLIC BYLINES VIEW (Safe Author Attribution Without Exposing Roles)
-- ------------------------------------------------------------------------------
-- Create view exposing only public author metadata for active journalists and columnists
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  display_name,
  slug,
  designation,
  avatar_url,
  bio_hi,
  bio_mr,
  bio_en,
  social_links,
  is_columnist,
  is_active
FROM public.profiles
WHERE is_active = true;

-- Grant read permission on the view to public readers
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Restrict raw public.profiles table so private fields (e.g. role) are not readable by anonymous users
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or staff can view all" ON public.profiles;
CREATE POLICY "Users can view own profile or staff can view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR public.is_editor_or_admin()
  );

-- ------------------------------------------------------------------------------
-- 4. PUBLIC INSERT HARDENING (Contact Messages & News Tips)
-- ------------------------------------------------------------------------------
-- Contact Messages
ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS check_contact_status;
ALTER TABLE public.contact_messages ADD CONSTRAINT check_contact_status
  CHECK (status IN ('unread', 'read', 'replied', 'archived'));

ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS check_contact_lengths;
ALTER TABLE public.contact_messages ADD CONSTRAINT check_contact_lengths CHECK (
  char_length(name) >= 2 AND char_length(name) <= 120 AND
  char_length(message) >= 5 AND char_length(message) <= 5000 AND
  (phone IS NULL OR char_length(phone) <= 30) AND
  (subject IS NULL OR char_length(subject) <= 200)
);

DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'unread'
  );

-- News Tips
ALTER TABLE public.news_tips DROP CONSTRAINT IF EXISTS check_news_tips_lengths;
ALTER TABLE public.news_tips ADD CONSTRAINT check_news_tips_lengths CHECK (
  char_length(sender_name) >= 2 AND char_length(sender_name) <= 120 AND
  char_length(sender_phone) >= 10 AND char_length(sender_phone) <= 30 AND
  char_length(message) >= 10 AND char_length(message) <= 5000
);

DROP POLICY IF EXISTS "Public submit news tips" ON public.news_tips;
CREATE POLICY "Public submit news tips" ON public.news_tips
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
  );

-- ------------------------------------------------------------------------------
-- 5. DAINIK JAGAT SAMEEKSHA SITE SETTINGS DEFAULT VALUES
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_settings
  ALTER COLUMN publication_name SET DEFAULT 'दैनिक जगत समीक्षा',
  ALTER COLUMN publication_name_mr SET DEFAULT 'दैनिक जगत समीक्षा',
  ALTER COLUMN publication_name_hi SET DEFAULT 'दैनिक जगत समीक्षा',
  ALTER COLUMN contact_email SET DEFAULT 'jagatsameeksha2014@gmail.com',
  ALTER COLUMN contact_phone SET DEFAULT '+91 8369517611',
  ALTER COLUMN office_address SET DEFAULT 'भांडुप (पश्चिम), मुंबई, महाराष्ट्र 400078',
  ALTER COLUMN default_language SET DEFAULT 'hi';

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
)
VALUES (
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
  publication_name_hi = EXCLUDED.publication_name_hi,
  tagline = EXCLUDED.tagline,
  default_language = EXCLUDED.default_language,
  supported_languages = EXCLUDED.supported_languages,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  office_address = EXCLUDED.office_address,
  social_links = EXCLUDED.social_links,
  theme_settings = EXCLUDED.theme_settings,
  updated_at = timezone('utc', now());
