-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा)
-- TEST SUITE: supabase/tests/rls_smoke.sql
-- DESCRIPTION: RLS, Security & Privileges Automated Smoke Tests
-- Can be executed directly in Supabase SQL Editor or via psql / pgTAP.
-- ==============================================================================

BEGIN;

-- Helper notice banner
DO $$
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'RUNNING DAINIK JAGAT SAMEEKSHA RLS SMOKE TESTS...';
  RAISE NOTICE '==================================================';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 1: anon & authenticated cannot call setup_initial_admin via RPC
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_anon_exec BOOLEAN;
  v_auth_exec BOOLEAN;
BEGIN
  SELECT has_function_privilege('anon', 'public.setup_initial_admin(text, text, text)', 'EXECUTE')
  INTO v_anon_exec;

  SELECT has_function_privilege('authenticated', 'public.setup_initial_admin(text, text, text)', 'EXECUTE')
  INTO v_auth_exec;

  IF v_anon_exec THEN
    RAISE EXCEPTION 'TEST 1 FAILED: anon has EXECUTE on setup_initial_admin!';
  END IF;

  IF v_auth_exec THEN
    RAISE EXCEPTION 'TEST 1 FAILED: authenticated has EXECUTE on setup_initial_admin!';
  END IF;

  RAISE NOTICE 'PASS [Test 1]: setup_initial_admin execution successfully revoked from anon & authenticated.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST FIXTURES: Setup isolated test users and data
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_author_id UUID := '00000000-0000-0000-0000-0000000000aa';
  v_admin_id UUID  := '00000000-0000-0000-0000-0000000000bb';
BEGIN
  -- Insert mock test profiles
  INSERT INTO public.profiles (id, display_name, role, created_at, updated_at)
  VALUES
    (v_author_id, 'चाचणी लेखक (Author)', 'author', now(), now()),
    (v_admin_id, 'चाचणी संपादक (Admin)', 'admin', now(), now())
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

  -- Insert test articles (one published, one draft)
  INSERT INTO public.articles (id, author_id, status, headline, body, published_at, created_at, updated_at)
  VALUES
    ('00000000-0000-0000-0000-000000000001', v_author_id, 'published', 'Published Test News', '<p>Test</p>', now() - interval '1 hour', now(), now()),
    ('00000000-0000-0000-0000-000000000002', v_author_id, 'draft', 'Draft Test News', '<p>Test</p>', null, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- Insert test news tip
  INSERT INTO public.news_tips (id, sender_name, sender_phone, message, status, created_at)
  VALUES ('00000000-0000-0000-0000-000000000001', 'नागरिक', '9876543210', 'महत्त्वाची बातमी टिप संदेश', 'new', now())
  ON CONFLICT (id) DO NOTHING;

  -- Insert test epaper edition
  INSERT INTO public.epaper_editions (id, title, edition_date, edition_region, is_published, views_count, downloads_count, thumbnail_url, total_pages)
  VALUES
    ('test-pub-edition', 'चाचणी प्रकाशित आवृत्ती', CURRENT_DATE, 'mumbai', true, 10, 5, 'https://example.com/thumb.jpg', 4),
    ('test-draft-edition', 'चाचणी मसुदा आवृत्ती', CURRENT_DATE, 'mumbai', false, 0, 0, 'https://example.com/thumb.jpg', 4)
  ON CONFLICT (id) DO NOTHING;

  -- Insert test epaper clip
  INSERT INTO public.epaper_clips (id, edition_id, page_number, title, clip_url, share_count)
  VALUES ('test-clip-1', 'test-pub-edition', 1, 'Test Clip', 'https://example.com/clip.png', 0)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ------------------------------------------------------------------------------
-- TEST 2: anon can read published articles but NOT drafts
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_draft_count INT;
  v_pub_count INT;
BEGIN
  -- Simulate anonymous user session
  PERFORM set_config('role', 'anon', true);

  SELECT count(*) INTO v_draft_count FROM public.articles WHERE id = '00000000-0000-0000-0000-000000000002';
  SELECT count(*) INTO v_pub_count FROM public.articles WHERE id = '00000000-0000-0000-0000-000000000001';

  IF v_draft_count > 0 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: anon was able to read draft articles!';
  END IF;

  IF v_pub_count = 0 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: anon could not read published articles!';
  END IF;

  RAISE NOTICE 'PASS [Test 2]: anon can read published articles, but drafts remain private.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 3: author cannot read news_tips or edit pages
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_tips_count INT;
  v_author_id UUID := '00000000-0000-0000-0000-0000000000aa';
  v_page_updated INT;
BEGIN
  -- Simulate authenticated author session
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_author_id::text, 'role', 'authenticated')::text, true);

  -- Author attempts to read news tips
  SELECT count(*) INTO v_tips_count FROM public.news_tips;
  IF v_tips_count > 0 THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Author was able to read staff news tips!';
  END IF;

  -- Author attempts to update pages
  UPDATE public.pages SET title_hi = 'Hacked' WHERE slug = 'privacy-policy';
  GET DIAGNOSTICS v_page_updated = ROW_COUNT;

  IF v_page_updated > 0 THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Author was able to update CMS pages!';
  END IF;

  RAISE NOTICE 'PASS [Test 3]: Author cannot read news_tips or modify CMS pages.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 4: author cannot self-promote to admin
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_author_id UUID := '00000000-0000-0000-0000-0000000000aa';
  v_escalation_blocked BOOLEAN := false;
BEGIN
  -- Simulate authenticated author session
  PERFORM set_config('role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_author_id::text, 'role', 'authenticated')::text, true);

  BEGIN
    UPDATE public.profiles SET role = 'admin' WHERE id = v_author_id;
  EXCEPTION WHEN OTHERS THEN
    v_escalation_blocked := true;
  END IF;

  IF NOT v_escalation_blocked THEN
    RAISE EXCEPTION 'TEST 4 FAILED: Author was able to elevate own role to admin!';
  END IF;

  -- Reset to service-role / superuser and verify role change succeeds when auth.uid() IS NULL
  PERFORM set_config('role', 'postgres', true);
  PERFORM set_config('request.jwt.claims', '', true);

  UPDATE public.profiles SET role = 'editor' WHERE id = v_author_id;
  IF (SELECT role FROM public.profiles WHERE id = v_author_id) != 'editor' THEN
    RAISE EXCEPTION 'TEST 4 FAILED: Service role / SQL Editor could not update role!';
  END IF;

  -- Restore back to author
  UPDATE public.profiles SET role = 'author' WHERE id = v_author_id;

  RAISE NOTICE 'PASS [Test 4]: Author self-promotion is blocked, while SQL editor/service-role can assign roles.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 5: anon cannot UPDATE or DELETE epaper_clips
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_updated INT;
  v_deleted INT;
BEGIN
  -- Simulate anonymous user session
  PERFORM set_config('role', 'anon', true);

  UPDATE public.epaper_clips SET title = 'Hacked Clip' WHERE id = 'test-clip-1';
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  DELETE FROM public.epaper_clips WHERE id = 'test-clip-1';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  IF v_updated > 0 THEN
    RAISE EXCEPTION 'TEST 5 FAILED: anon was able to UPDATE epaper clips!';
  END IF;

  IF v_deleted > 0 THEN
    RAISE EXCEPTION 'TEST 5 FAILED: anon was able to DELETE epaper clips!';
  END IF;

  RAISE NOTICE 'PASS [Test 5]: anon cannot UPDATE or DELETE epaper clips.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 6: UPDATE on site_settings succeeds and logs an audit row
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_audit_count_before INT;
  v_audit_count_after INT;
BEGIN
  -- Reset to postgres / service role
  PERFORM set_config('role', 'postgres', true);
  PERFORM set_config('request.jwt.claims', '', true);

  SELECT count(*) INTO v_audit_count_before FROM public.audit_logs WHERE entity_type = 'site_settings';

  UPDATE public.site_settings
  SET tagline = 'सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र (Audit Test)'
  WHERE id = 'default';

  SELECT count(*) INTO v_audit_count_after FROM public.audit_logs WHERE entity_type = 'site_settings';

  IF v_audit_count_after <= v_audit_count_before THEN
    RAISE EXCEPTION 'TEST 6 FAILED: Audit log row was not generated on site_settings update!';
  END IF;

  RAISE NOTICE 'PASS [Test 6]: UPDATE on site_settings completed without error and logged an audit row.';
END $$;

-- ------------------------------------------------------------------------------
-- TEST 7: increment_epaper_views works on published edition, ignored on draft
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_views_before INT;
  v_views_after INT;
  v_draft_views_before INT;
  v_draft_views_after INT;
BEGIN
  SELECT views_count INTO v_views_before FROM public.epaper_editions WHERE id = 'test-pub-edition';
  SELECT views_count INTO v_draft_views_before FROM public.epaper_editions WHERE id = 'test-draft-edition';

  -- Call RPC function with text edition_id
  PERFORM public.increment_epaper_views('test-pub-edition');
  PERFORM public.increment_epaper_views('test-draft-edition');

  SELECT views_count INTO v_views_after FROM public.epaper_editions WHERE id = 'test-pub-edition';
  SELECT views_count INTO v_draft_views_after FROM public.epaper_editions WHERE id = 'test-draft-edition';

  IF v_views_after != v_views_before + 1 THEN
    RAISE EXCEPTION 'TEST 7 FAILED: increment_epaper_views did not increment published edition!';
  END IF;

  IF v_draft_views_after != v_draft_views_before THEN
    RAISE EXCEPTION 'TEST 7 FAILED: increment_epaper_views modified an unpublished draft edition!';
  END IF;

  RAISE NOTICE 'PASS [Test 7]: increment_epaper_views increments published editions and guards drafts.';
END $$;

DO $$
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'ALL 7 SECURITY & RLS SMOKE TESTS PASSED (100%)!';
  RAISE NOTICE '==================================================';
END $$;

-- Rollback the test transaction so no test fixture pollution remains
ROLLBACK;
