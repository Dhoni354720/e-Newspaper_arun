-- ==============================================================================
-- DAINIK JAGAT SAMEEKSHA (दैनिक जगत समीक्षा) — PHASE 0 SECURITY HARDENING
-- Timestamp: 20261028_01_security_hardening.sql
-- ==============================================================================

-- 1. CONTACT MESSAGES TABLE (Real form submissions)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can submit contact messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only staff (admin & editor) can read and manage contact messages
DROP POLICY IF EXISTS "Staff can read contact messages" ON public.contact_messages;
CREATE POLICY "Staff can read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Staff can update contact messages" ON public.contact_messages;
CREATE POLICY "Staff can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- ------------------------------------------------------------------------------
-- 2. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP (LEAST PRIVILEGE: 'author')
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'author', -- Least privilege default: author, never admin
    NEW.raw_user_meta_data->>'avatar_url',
    timezone('utc', now()),
    timezone('utc', now())
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. PREVENT PRIVILEGE ESCALATION
-- Non-admin users cannot alter their own or others' roles
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Security Violation: Only system administrators can modify user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC AUDIT LOGGING TRIGGER ON CORE ENTITIES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_entity_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
  v_entity_type TEXT := TG_TABLE_NAME;
  v_entity_id TEXT;
  v_meta JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_entity_id := NEW.id::TEXT;
    v_meta := jsonb_build_object('data', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'articles' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'published' THEN
      v_action := 'publish';
    ELSE
      v_action := 'update';
    END IF;
    v_entity_id := NEW.id::TEXT;
    v_meta := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_entity_id := OLD.id::TEXT;
    v_meta := jsonb_build_object('old', to_jsonb(OLD));
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
    v_meta,
    timezone('utc', now())
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit logging triggers
DROP TRIGGER IF EXISTS trigger_audit_articles ON public.articles;
CREATE TRIGGER trigger_audit_articles
  AFTER INSERT OR UPDATE OR DELETE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

DROP TRIGGER IF EXISTS trigger_audit_settings ON public.site_settings;
CREATE TRIGGER trigger_audit_settings
  AFTER UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_audit();

-- ------------------------------------------------------------------------------
-- 5. REINFORCE ARTICLE RLS POLICIES (Strict Public & Author boundaries)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (
    (status = 'published' AND published_at <= timezone('utc', now()))
    OR (
      auth.uid() IS NOT NULL AND (
        -- Staff can view all articles
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
        -- Authors can only view their own drafts / submissions
        OR author_id = auth.uid()
      )
    )
  );

-- Author can only update their own unapproved articles
DROP POLICY IF EXISTS "Authors can update own non-published articles" ON public.articles;
CREATE POLICY "Authors can update own non-published articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
    OR (
      author_id = auth.uid()
      AND status IN ('draft', 'submitted')
    )
  );

-- ------------------------------------------------------------------------------
-- 6. INITIAL ADMIN SETUP PROCEDURE (Idempotent Helper)
-- To create the first administrator safely without committing credentials:
-- Run in Supabase SQL editor:
-- SELECT public.setup_initial_admin('jagatsameeksha2014@gmail.com', 'YourStrongPasswordHere', 'अरुण तिवारी (मुख्य संपादक)');
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.setup_initial_admin(
  p_email TEXT,
  p_password TEXT,
  p_display_name TEXT DEFAULT 'मुख्य संपादक'
)
RETURNS UUID AS $$
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

  -- Record audit log
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  VALUES (v_user_id, 'create', 'initial_admin', v_user_id::TEXT, jsonb_build_object('email', lower(p_email)));

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
