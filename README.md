# JANVANI NEWS (जनवाणी न्यूज) — PREMIUM MULTILINGUAL NEWS PLATFORM

> **सत्य, निष्पक्ष आणि निर्भीक वृत्तपत्र**  
> Modern, production-oriented digital news portal and secure content management system (CMS) tailored for Indian journalism in **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English**.

---

## 1. System Overview

**JANVANI NEWS** is built to deliver a credible, high-aesthetic contemporary Indian broadsheet experience combined with a streamlined, mobile-friendly editorial publishing workflow.

### Key Highlights
- **Tri-Lingual Content System**: Full multilingual content model supporting native articles in Marathi, Hindi, and English linked via `translation_group_id`.
- **Editorial Typography & Aesthetics**: Optimized Devanagari typography (Mukta & Noto Serif Devanagari) paired with classic serif display headers (Playfair Display) on an off-white broadsheet background with restrained crimson accents.
- **Dynamic Breaking News Ticker**: Real database-driven ticker with pause/play controls, previous/next buttons, and reduced-motion compliance.
- **Complete Editorial Publishing Lifecycle**: `draft → scheduled → published → archived` with automatic Asia/Kolkata timezone formatting and private drafts isolation.
- **Tiptap Rich-Text Editor**: Headings, lists, blockquotes, inline images, and links with Unicode preservation.
- **Media Asset Management**: Supabase Storage integration with client-side mime-type/size validation (max 10MB) and persistent local fallback.
- **Centralized Site Configuration**: Edit publication name, tagline, office address, contact numbers, and social links from the admin dashboard without touching code.

---

## 2. Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | React 18, TypeScript (Strict), Vite 6 |
| **Styling & Design Tokens** | Tailwind CSS with custom editorial palette, Devanagari font families |
| **Routing** | React Router v6 with dynamic slug routing & scroll restoration |
| **Rich Text Editing** | Tiptap Editor (`@tiptap/react`, `@tiptap/starter-kit`, Image, Link) |
| **Icons & Primitives** | Lucide React |
| **Backend / Database** | Supabase PostgreSQL with Row Level Security (RLS) & Triggers |
| **Authentication** | Supabase Auth (or provisioned local admin credentials) |
| **Storage** | Supabase Storage (`article-media` bucket) with local fallback |
| **Testing** | Vitest, React Testing Library, JSDOM |

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Quick Launch
```bash
# 1. Clone repository
git clone <repo-url>
cd news

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be accessible at:
- **Public News Portal**: `http://localhost:5173/`
- **Editorial CMS Panel**: `http://localhost:5173/admin/login`

---

## 4. Administrative CMS Credentials

The portal is pre-configured with a dedicated authorized administrator account for demonstration and workflow verification:

- **Login URL**: `/admin/login`
- **Admin Email**: `admin@janvaninews.com`
- **Admin Password**: `admin123`
- **Editor Email**: `editor@janvaninews.com` (Sub-editor role)

---

## 5. Connecting Your Live Supabase Backend

When ready to link your production Supabase database:

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env` and provide your project URL and public anon key:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_NAME=JANVANI NEWS
VITE_DEFAULT_LOCALE=mr
VITE_TIMEZONE=Asia/Kolkata
```

### Step 2: Apply SQL Database Migrations
1. Navigate to the **SQL Editor** in your [Supabase Dashboard](https://app.supabase.com).
2. Open and run the migration file:
   `supabase/migrations/20260221_initial_schema.sql`
3. Open and run the storage configuration file:
   `supabase/storage_setup.sql`
4. (Optional) Run the seed content script to pre-populate demonstration news:
   `supabase/seed.sql`

### Step 3: Automated Scheduled Publishing
The migration includes the PostgreSQL function `public.publish_due_scheduled_articles()`.  
To run this automatically every 5 minutes, enable `pg_cron` in Supabase:

```sql
SELECT cron.schedule(
  'auto-publish-scheduled-news',
  '*/5 * * * *',
  $$ SELECT public.publish_due_scheduled_articles(); $$
);
```

---

## 6. Route Sitemap

### Public Portal
- `/` — Editorial Homepage (Lead hero, Breaking Ticker, Regional News)
- `/news` — All News Explorer with category & language filtering
- `/category/:slug` — Category Dispatches (e.g. `/category/maharashtra`)
- `/article/:slug` — Article Detail Page (Full text, Translations, Social Share)
- `/search` — Live Keyword & Tag Search
- `/about` — About Us & Editorial Manifesto
- `/contact` — Bureau Contacts & Feedback Form
- `/privacy-policy` — Reader Privacy Policy
- `/terms` — Terms of Service
- `/404` — Page Not Found

### Private CMS
- `/admin/login` — Secure Administrator Login
- `/admin` — CMS Dashboard with live metrics
- `/admin/articles` — Articles Management Table
- `/admin/articles/new` — Tiptap Writing Interface
- `/admin/articles/:id/edit` — Article Editor & Translator
- `/admin/categories` — Category & Translation Management
- `/admin/breaking-news` — Breaking News Ticker Controls
- `/admin/media` — Media Asset Library
- `/admin/settings` — Centralized Publication Settings
- `/admin/account` — Profile & Session Overview

---

## 7. Automated Test Suite

Run the full Vitest automated test suite:

```bash
npm test
```

Test coverage includes:
- **Unit Tests**: Devanagari transliteration & slug generation, Asia/Kolkata date formatting, reading time calculation.
- **Integration Tests**: Complete publishing lifecycle (`draft → published → draft → delete`), draft privacy enforcement, future scheduled article isolation, language filtering.
- **E2E Component Tests**: Public header masthead, live breaking news ticker, home page rendering, language switching.

---

## 8. License & Attribution
© 2026 JANVANI NEWS (जनवाणी न्यूज). All rights reserved.
Demonstration editorial news platform built with React, Vite, Tailwind CSS, and Supabase.
# e-Newspaper_arun
