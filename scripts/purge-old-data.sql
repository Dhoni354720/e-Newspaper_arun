-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA — DATA RETENTION PURGE SCRIPT (India DPDP Act 2023)
-- ==============================================================================
-- Recommended Retention Window: 180 Days (6 Months) for public messages and tips
-- Run manually in Supabase SQL Editor as needed, or schedule via pg_cron.

BEGIN;

-- 1. Purge citizen news tips older than 180 days
DELETE FROM public.news_tips
WHERE created_at < NOW() - INTERVAL '180 days';

-- 2. Purge public contact messages older than 180 days
DELETE FROM public.contact_messages
WHERE created_at < NOW() - INTERVAL '180 days';

-- 3. Optional: Purge audit logs older than 365 days (1 year)
DELETE FROM public.audit_logs
WHERE created_at < NOW() - INTERVAL '365 days';

COMMIT;
