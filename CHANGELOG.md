# Changelog — Dainik Jagat Sameeksha (दैनिक जगत समीक्षा)

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Phase 0: Security and Production Foundation] - 2026-10-28
### Branch: `feat/phase-0-security`

### Added
- **Database Migration (`supabase/migrations/20261028_01_security_hardening.sql`)**:
  - `handle_new_user()` trigger for automated profile creation on signup with least-privilege default `role: 'author'`.
  - `prevent_self_role_escalation()` trigger preventing non-admins from escalating permissions.
  - `log_entity_audit()` trigger on `articles`, `profiles`, and `site_settings`.
  - Dedicated `contact_messages` table with strict public insert and staff-only read/update RLS policies.
  - Safe, idempotent procedure `public.setup_initial_admin(p_email, p_password, p_display_name)` to initialize primary administrator without committing plaintext passwords.
- **Production Configuration Guard (`src/components/common/ConfigErrorScreen.tsx`)**:
  - Production build displays an explicit configuration-error screen in Hindi and English if Supabase environment variables are missing, preventing silent fallbacks to local storage.
- **HTML Sanitization (`src/lib/sanitize.ts`)**:
  - Integrated `DOMPurify` to disarm XSS vectors (`<script>`, event handlers, `javascript:` URLs) while preserving legitimate editorial styling.
  - Enforced sanitization on both render (`ArticleDetailPage.tsx`) and save (`repository.ts`).
- **Form Security & Anti-Spam (`src/lib/security/formProtection.ts`)**:
  - Honeypot spam defense for automated bot detection.
  - Client-side sliding-window rate limiting for public forms.
- **Audit Logging & Contact Flow (`src/lib/repository.ts`)**:
  - `logAudit()` and `getAuditLogs()` tracking `create`, `update`, `delete`, and `publish` events.
  - `submitContactMessage()` and `getContactMessages()` providing a real submission pipeline.
- **Security & RLS Test Suite (`src/test/integration/rlsAndSecurityPolicies.test.ts`)**:
  - 9 automated test scenarios verifying anonymous visibility boundaries, author least-privilege role, DOMPurify XSS disarming, honeypot bot blocking, and rate limiting.

### Changed
- **Authentication Hardening (`src/context/AuthContext.tsx`)**:
  - Removed demo fallback allowing `@janvaninews.com` with any password in production.
  - Enforced least privilege: unprofiled authenticated users default to `role: 'author'`.
  - Restricted demo mode strictly to `VITE_DEMO_MODE=true` in development.
- **Login Screen (`src/pages/admin/AdminLoginPage.tsx`)**:
  - Removed hardcoded credentials (`admin@janvaninews.com` / `admin123`) from input defaults and banners.
  - Restricted demo login hint box to non-production environments when demo mode is active.
- **Environment & Git Hygiene**:
  - Untracked `.env` from Git index (`git rm --cached .env`) and enforced exclusion in `.gitignore`.
  - Updated `.env.example` with Dainik Jagat Sameeksha branding and production flags.
  - Scanned Git commit history confirming no live secrets were historically committed.
- **HTTP Security Headers (`vercel.json`)**:
  - Configured Content Security Policy (CSP) allowing Supabase, YouTube-nocookie, Vimeo, Open-Meteo, and Google Fonts.
  - Configured `frame-ancestors 'self'`.
  - Configured `X-Robots-Tag: noindex, nofollow` for `/admin(.*)`.
- **E-Paper & Editorial Metrics (`src/pages/EpaperPage.tsx`)**:
  - Removed fake hardcoded mock metrics (`views_count || 1200`, `downloads_count || 320`) and replaced with verified dynamic counters defaulting to 0.
- **Contact Form (`src/pages/StaticPages.tsx`)**:
  - Replaced dummy `submitted=true` with real `repository.submitContactMessage()` flow, phone input, honeypot input, and error handling.
- **Seed Data Isolation (`src/lib/repository.ts`)**:
  - Production builds strip demo seed articles, initializing local stores only in development.
