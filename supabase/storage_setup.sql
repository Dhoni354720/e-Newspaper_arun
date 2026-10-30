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
DROP POLICY IF EXISTS "Public Read Access for Article Media" ON storage.objects;
CREATE POLICY "Public Read Access for Article Media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'article-media');

-- 2. Only authenticated staff can upload images
DROP POLICY IF EXISTS "Staff Upload Access for Article Media" ON storage.objects;
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
DROP POLICY IF EXISTS "Staff Delete Access for Article Media" ON storage.objects;
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
DROP POLICY IF EXISTS "Public Read Access for Epaper Objects" ON storage.objects;
CREATE POLICY "Public Read Access for Epaper Objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'epaper-editions');

-- 2. Only authenticated staff can upload epapers
DROP POLICY IF EXISTS "Staff Upload Access for Epaper Objects" ON storage.objects;
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
DROP POLICY IF EXISTS "Staff Delete Access for Epaper Objects" ON storage.objects;
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
