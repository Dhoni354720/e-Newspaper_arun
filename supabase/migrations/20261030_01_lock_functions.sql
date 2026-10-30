-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा)
-- MIGRATION: 20261030_01_lock_functions.sql
-- DESCRIPTION: Lock down privileged functions, secure PostgREST RPC exposure,
--              enforce search_path = public on SECURITY DEFINER functions,
--              fix prevent_self_role_escalation, and fix audit trigger.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SECURITY RATIONALE (PostgREST RPC Exposure)
-- ------------------------------------------------------------------------------
-- By default, Supabase exposes all functions in the public schema as callable
-- API RPC endpoints (/rpc/<function_name>) to anon and authenticated roles.
-- Internal trigger functions, cron workers, and admin bootstrap utilities must
-- have EXECUTE explicitly revoked from PUBLIC, anon, and authenticated so they
-- cannot be invoked directly over the public REST API.

-- ------------------------------------------------------------------------------
-- 2. LOCK DOWN PRIVILEGED / INTERNAL FUNCTIONS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  -- Revoke setup_initial_admin if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'setup_initial_admin'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.setup_initial_admin(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;';
  END IF;

  -- Revoke publish_due_scheduled_articles if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'publish_due_scheduled_articles'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.publish_due_scheduled_articles() FROM PUBLIC, anon, authenticated;';
  END IF;

  -- Revoke handle_new_user (auth.users trigger)
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;';
  END IF;

  -- Revoke prevent_self_role_escalation (profiles trigger)
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'prevent_self_role_escalation'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.prevent_self_role_escalation() FROM PUBLIC, anon, authenticated;';
  END IF;

  -- Revoke log_entity_audit (audit trigger)
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'log_entity_audit'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.log_entity_audit() FROM PUBLIC, anon, authenticated;';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. FIX ROLE ESCALATION TRIGGER (Permit service-role / SQL Editor where auth.uid() IS NULL)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only enforce role check when executed within an authenticated client JWT session.
  -- In SQL Editor migrations, seed scripts, or service-role executions, auth.uid() is NULL.
  IF auth.uid() IS NOT NULL AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Security Violation: Only system administrators can modify user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- ------------------------------------------------------------------------------
-- 4. HARDEN SECURITY DEFINER ON handle_new_user
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enforce default 'author' role for any self-registered user.
  -- Only pre-authorized administrative bootstrap or manual SQL can assign 'admin' or 'editor'.
  INSERT INTO public.profiles (id, display_name, role, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    'author',
    NEW.raw_user_meta_data->>'avatar_url',
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. FIX AUDIT TRIGGER ON TABLES WITHOUT STATUS COLUMN & OPTIMIZE PAYLOAD
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_entity_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action TEXT;
  v_entity_type TEXT := TG_TABLE_NAME;
  v_entity_id TEXT;
  v_meta JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_entity_id := NEW.id::TEXT;
    -- Exclude large HTML bodies to prevent table bloat
    IF TG_TABLE_NAME = 'articles' THEN
      v_meta := jsonb_build_object(
        'status', to_jsonb(NEW)->>'status',
        'headline', to_jsonb(NEW)->>'headline',
        'author_id', to_jsonb(NEW)->>'author_id'
      );
    ELSE
      v_meta := jsonb_build_object('data', to_jsonb(NEW));
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_entity_id := NEW.id::TEXT;

    -- Status comparison runs ONLY inside articles check to prevent crash on tables without status column
    IF TG_TABLE_NAME = 'articles' THEN
      IF to_jsonb(OLD)->>'status' IS DISTINCT FROM to_jsonb(NEW)->>'status' 
         AND to_jsonb(NEW)->>'status' = 'published' THEN
        v_action := 'publish';
      END IF;

      -- Store changed column names plus old/new status and headline
      v_meta := jsonb_build_object(
        'old_status', to_jsonb(OLD)->>'status',
        'new_status', to_jsonb(NEW)->>'status',
        'headline', to_jsonb(NEW)->>'headline',
        'changed_fields', (
          SELECT jsonb_agg(key)
          FROM jsonb_each(to_jsonb(NEW))
          WHERE to_jsonb(NEW)->key IS DISTINCT FROM to_jsonb(OLD)->key
            AND key NOT IN ('updated_at')
        )
      );
    ELSE
      v_meta := jsonb_build_object(
        'changed_fields', (
          SELECT jsonb_agg(key)
          FROM jsonb_each(to_jsonb(NEW))
          WHERE to_jsonb(NEW)->key IS DISTINCT FROM to_jsonb(OLD)->key
            AND key NOT IN ('updated_at')
        )
      );
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_entity_id := OLD.id::TEXT;
    IF TG_TABLE_NAME = 'articles' THEN
      v_meta := jsonb_build_object(
        'headline', to_jsonb(OLD)->>'headline',
        'status', to_jsonb(OLD)->>'status'
      );
    ELSE
      v_meta := jsonb_build_object('old', to_jsonb(OLD));
    END IF;
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata,
    created_at
  )
  VALUES (
    auth.uid(),
    v_action,
    v_entity_type,
    v_entity_id,
    COALESCE(v_meta, '{}'::jsonb),
    timezone('utc', now())
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trigger_audit_articles ON public.articles;
CREATE TRIGGER trigger_audit_articles
  AFTER INSERT OR UPDATE OR DELETE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

DROP TRIGGER IF EXISTS trigger_audit_settings ON public.site_settings;
CREATE TRIGGER trigger_audit_settings
  AFTER UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

-- ------------------------------------------------------------------------------
-- 6. HARDEN handle_updated_at & publish_due_scheduled_articles WITH search_path
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_due_scheduled_articles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH due_articles AS (
    SELECT id
    FROM public.articles
    WHERE status = 'scheduled'
      AND scheduled_at IS NOT NULL
      AND scheduled_at <= timezone('utc', now())
    FOR UPDATE SKIP LOCKED
  ),
  updated AS (
    UPDATE public.articles
    SET
      status = 'published',
      published_at = timezone('utc', now()),
      updated_at = timezone('utc', now())
    WHERE id IN (SELECT id FROM due_articles)
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM updated;

  RETURN v_count;
END;
$$;

-- Ensure setup_initial_admin has search_path = public and is only accessible by service_role/superuser
CREATE OR REPLACE FUNCTION public.setup_initial_admin(
  p_email TEXT,
  p_password TEXT,
  p_display_name TEXT DEFAULT 'मुख्य संपादक'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = lower(p_email);

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      lower(p_email),
      crypt(p_password, gen_salt('bf')),
      timezone('utc', now()),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      jsonb_build_object('display_name', p_display_name),
      timezone('utc', now()),
      timezone('utc', now())
    );
  END IF;

  -- Ensure profile exists with 'admin' role
  INSERT INTO public.profiles (id, display_name, role, created_at, updated_at)
  VALUES (v_user_id, p_display_name, 'admin', timezone('utc', now()), timezone('utc', now()))
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    display_name = p_display_name,
    updated_at = timezone('utc', now());

  RETURN v_user_id;
END;
$$;

-- Lock down execute on setup_initial_admin
REVOKE EXECUTE ON FUNCTION public.setup_initial_admin(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
