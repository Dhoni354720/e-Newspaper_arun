# Changelog — Dainik Jagat Sameeksha (दैनिक जगत समीक्षा)

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Phase 3: Digital E-Paper Reader Pipeline & Interactive Clipping] - 2026-10-28
### Branch: `feat/phase-3-epaper`

### Added
- **Database Migration (`supabase/migrations/20261028_04_epaper_pipeline.sql`)**:
  - `epaper_editions` and `epaper_pages` tables with foreign keys, cascading deletes, and performance indexes.
  - `epaper_clips` table for saving, indexing, and sharing interactive broadsheet crops.
  - Strict Row Level Security policies: public read for published editions/pages, staff-only mutation for editors and admins.
- **Genuine Client Broadsheet Processing**:
  - Processed `DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf` (client broadsheet dated 26 August 2026, 4 pages, RNI `MAHHIN/2014/57312`, Editor: Arun Ramakant Tiwari).
  - Generated web-view (`page-*.jpg`), thumbnail (`page-*-thumb.jpg`), and ultra-high-resolution deep-zoom (`page-*-zoom.jpg`) images in `public/epaper/2026-08-26/`.
  - Copied official broadsheet PDF to `public/client-assets/DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf` for direct reader downloads.
- **Interactive Article Clipping Tool (`src/components/epaper/EpaperClipper.tsx`)**:
  - Drag-to-select marquee box overlay over broadsheet pages on desktop and mobile touch devices.
  - HTML5 Canvas high-resolution composite generator:
    - Official Dainik Jagat Sameeksha Brand Red and Gold masthead banner.
    - Publication metadata (Date, Page Number, RNI `MAHHIN/2014/57312`, Chief Editor Arun Ramakant Tiwari).
    - Extracted broadsheet story with border styling.
    - Official digital footer with website URL and Bhandup West, Mumbai office address.
  - Direct WhatsApp sharing with encoded intent.
  - One-click PNG image download and clipboard copy.
- **Reader Viewer Enhancements (`src/pages/EpaperPage.tsx`)**:
  - Parameterized routes for direct page and edition linking: `/epaper`, `/epaper/:editionId`, `/epaper/:editionId/page/:pageNumber`.
  - Deep-zoom switching to 3000px high-resolution scans when zoom exceeds 1.25x.
  - Double-click to zoom toggle (1x <-> 1.75x).
  - Single-page view, keyboard arrow navigation (`ArrowLeft`, `ArrowRight`), fullscreen toggle.
  - Real-time view and download counter tracking.
- **Admin E-Paper CMS Updates (`src/pages/admin/AdminEpaperPage.tsx`)**:
  - Dainik Jagat Sameeksha branding, Mumbai main edition defaults, 4-page broadsheet default, and regional filtering.
- **Integration Test Suite (`src/test/integration/epaperPipeline.test.tsx`)**:
  - 7 comprehensive tests verifying broadsheet page loading, date/region filtering, parameterized routing, interactive clipper canvas generation, view tracking, and admin CMS management.

---

## [Phase 2: New Content Types & Multimedia Subsystems] - 2026-10-28
### Branch: `feat/phase-2-content-types`

### Added
- **Database Migration (`supabase/migrations/20261028_03_content_types.sql`)**:
  - `galleries` and `gallery_images`: High-resolution photo stories with captions, credits, and responsive masonry ordering.
  - `videos`: Video hub supporting privacy-conscious `youtube-nocookie.com` embeds, duration formatting, and JSON-LD `VideoObject`.
  - `briefs`: Quick news bullet stream (फटाफट खबरें / Flash News) with urgent flags and WhatsApp sharing.
  - `horoscopes`: Daily rashifal (दैनिक राशिफल) for 12 zodiac signs across daily, weekly, and monthly periods with lucky numbers and colors.
  - `supplements`: Thematic broadsheet pullouts (विशेषांक) with cover thumbnails, issue dates, and downloadable print PDFs.
  - `news_tips`: Citizen journalism tip inbox (नागरिक पत्रकारिता) with phone validation, image uploads, and honeypot protection.
  - `pages`: Dynamic CMS static pages (About, Grievance, Terms, Privacy) with DOMPurify sanitization.
- **Public Pages & Widgets**:
  - `PhotoGalleryPage.tsx` (`/photos`) & `PhotoGalleryDetailPage.tsx` (`/photos/:slug`): Responsive image grid, full-screen interactive lightbox with keyboard controls (Arrow keys, Escape).
  - `VideoHubPage.tsx` (`/videos`): Clean privacy-preserving video player, duration pills, category filtering, and schema.org structured data.
  - `FlashNewsPage.tsx` (`/flash`): Real-time rapid card stream with one-click direct WhatsApp sharing.
  - `RashifalPage.tsx` (`/rashifal`): 12 Hindi zodiac signs, lucky colors, lucky numbers, daily astrological guidance.
  - `SupplementDetailPage.tsx` (`/supplement/:slug`): PDF download links and archive of thematic special issues.
  - `NewsTipsPage.tsx` (`/submit-news`): Citizen journalism reporting form with honeypot security and editorial receipt.
  - `DynamicPage.tsx` (`/page/:slug` & `/grievance`): IT Rules 2021 statutory compliance Grievance Redressal Officer page for Chief Editor Arun Ramakant Tiwari.
  - `WeatherWidget.tsx`: Live weather reports for Mumbai, Pune, Nagpur, Indore, and Delhi powered by Open-Meteo with client-side caching.
- **Admin CMS Modules**:
  - `AdminGalleriesPage.tsx` (`/admin/galleries`): Photo gallery creation and image management.
  - `AdminVideosPage.tsx` (`/admin/videos`): Video hub curation and embed management.
  - `AdminFlashNewsPage.tsx` (`/admin/flash`): Rapid broadcast brief creation and toggle.
  - `AdminRashifalPage.tsx` (`/admin/rashifal`): 12 signs horoscope editor with lucky numbers and colors.
  - `AdminNewsTipsPage.tsx` (`/admin/news-tips`): Citizen tip review, status tracking (new, reviewed, used, rejected).
  - `AdminPagesManager.tsx` (`/admin/pages`): Rich-text editing for statutory and policy pages.
- **Integration Test Suite**:
  - `src/test/integration/contentSubsystems.test.tsx`: 8 comprehensive tests verifying galleries, videos, flash news, horoscopes, news tips with honeypot validation, grievance officer statutory compliance, weather widget, and supplements.

### Changed
- Integrated `WeatherWidget` compact mode into the primary newspaper header masthead strip and full mode into the dynamic homepage weather block.
- Updated `AdminLayout.tsx` navigation sidebar with dedicated links for all 6 new content CMS management tools.
- Extended `MegaMenu.tsx` and mobile navigation drawer with quick access to photo galleries, video hub, flash news, rashifal, citizen journalism, and statutory grievance pages.

---

## [Phase 1: Sections, Menus, Homepage, and Authors] - 2026-10-28
### Branch: `feat/phase-1-sections-home`

### Added
- **Database Migration (`supabase/migrations/20261028_02_categories_authors_homeblocks.sql`)**:
  - Extended `categories` with `parent_id` (hierarchical tree), `kind`, `show_in_nav`, `nav_order`, and `color_hex`.
  - Added `slug`, `designation`, `bio_hi`, `bio_mr`, `bio_en`, `is_columnist`, and `is_active` to `profiles`.
  - Created `home_blocks` table with `block_type`, `item_count`, `sort_order`, `is_active`, and multilingual title overrides.
  - Added `article_revisions` table for editorial versioning and rollback capability.
  - Added `is_top`, `top_rank`, `kind`, `dateline`, and `credit_line` to `articles`.
- **Branding & Assets**:
  - Extracted client logo from PDF to `public/images/logo.png` and `public/logo.png`.
  - Added broadsheet color tokens to `tailwind.config.js` (`brand-red: #ed1c24`, `brand-gold: #fbc707`, highlight colors).
  - Print masthead CSS styling and typography in `src/index.css`.
- **Hierarchical Categories & Authors Seed Data (`src/data/seedData.ts`)**:
  - Seeded 24 broadsheet categories (Maharashtra, Vidarbha, Marathwada, Western Maharashtra, Mumbai, Pune, Thane, Nagpur, Nashik, Editorial, National, Business, Sports, Entertainment, Crime).
  - Seeded Chief Editor Arun Ramakant Tiwari (`arun-ramakant-tiwari`), Special Correspondent Bureau, Legal Bureau, and Sports Desk.
  - Seeded 9 configurable home blocks (`hero`, `top_news`, `city_tabs`, `opinion`, `crime`, `sports`, `epaper_promo`, `weather`).
  - Added Dainik Jagat Sameeksha print issue metadata (RNI `MAHHIN/2014/57312`, Vol 12, Issue 24).
- **Mega Menu Component (`src/components/common/MegaMenu.tsx`)**:
  - Full broadsheet section directory grouped by Kind (Maharashtra, Rashtriya, Editorial, Crime, Sports, Business, Entertainment).
  - Direct links to subcategories with active dispatch counters and latest headlines.
- **Dedicated Public Pages**:
  - `TopNewsPage.tsx` (`/top-news`): Dedicated view for chief editorial picks and top ranked breaking stories.
  - `TagPage.tsx` (`/tag/:slug`): Tag-based news archive with datelines and reading times.
  - `AuthorDetailPage.tsx` (`/author/:slug`): Editorial profile page for Chief Editor Arun Ramakant Tiwari and columnists, including bio, designation pill, and published articles archive.
- **Admin CMS Customizer (`src/pages/admin/AdminHomeBlocksPage.tsx`)**:
  - Interactive management UI for homepage blocks with reordering, active/inactive toggles, item count control, and custom multilingual titles.
- **Test Suites**:
  - `src/test/integration/i18nCompleteness.test.ts`: Verifies complete 1:1 key parity across `hi`, `mr`, and `en` translations with zero missing keys.
  - `src/test/integration/categoryAndMegaMenu.test.tsx`: Verifies hierarchical category retrieval, author profile routing, and Mega Menu navigation.

### Changed
- **Default Language & Navigation**:
  - Switched default publication language to Hindi (`'hi'`), with language order `हिन्दी | मराठी | English`.
  - Header updated with Dainik Jagat Sameeksha logo, RNI registration strip, Gold print issue bar, and Mega Menu trigger.
  - Article cards updated with bold print datelines (`dateline`) and author bylines linking to `/author/:slug`.
- **Dynamic Homepage (`src/pages/HomePage.tsx`)**:
  - Replaced static layout with dynamic block engine rendering configured blocks (Hero Lead, Big 4, City Dispatches with tabs, Editor's Column, Crime, Sports, E-paper promo).

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
