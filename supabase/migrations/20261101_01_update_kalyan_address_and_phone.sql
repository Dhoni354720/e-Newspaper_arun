-- ==============================================================================
-- UPDATE SITE SETTINGS: KALYAN ADDRESS AND 8828812282 CONTACT NUMBER
-- Ensures existing database rows are migrated from Bhandup to Kalyan
-- ==============================================================================

UPDATE public.site_settings
SET
  office_address = 'कल्याण, महाराष्ट्र 421301',
  contact_phone = '+91 8828812282, +91 8369517611, +91 7448193748',
  updated_at = timezone('utc', now())
WHERE id = 'default';

ALTER TABLE public.site_settings
  ALTER COLUMN contact_phone SET DEFAULT '+91 8828812282, +91 8369517611, +91 7448193748',
  ALTER COLUMN office_address SET DEFAULT 'कल्याण, महाराष्ट्र 421301';
