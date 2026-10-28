# दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)
### राष्ट्रीय एवं प्रादेशिक हिंदी दैनिक समाचार पत्र | RNI: MAHHIN/2014/57312

> **"सत्य, निष्पक्ष और निर्भीक पत्रकारिता"**  
> Chief Editor: **अरुण रमाकांत तिवारी (Arun Ramakant Tiwari)**  
> Head Office: **भांडुप (पश्चिम), मुंबई, महाराष्ट्र 400078**  
> Official Email: `jagatsameeksha2014@gmail.com` | Tel: `+91-8369517611`, `+91-7448193748`

---

## 1. Overview & Publication Identity

**दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)** is a leading Hindi daily newspaper headquartered in Mumbai, Maharashtra, serving readers across Mumbai, Pune, Nagpur, Delhi, Indore, Gwalior, and nationwide. 

This platform represents the production-ready digital broadsheet portal, digital e-paper edition pipeline, and secure editorial Content Management System (CMS).

### Key Architectural Pillars
- **Authentic Broadsheet Experience**: High-resolution print scans (300 DPI broadsheet editions) transformed into an interactive web reader with deep-zoom capabilities (up to 3000px).
- **Interactive Article Clipper**: Readers and journalists can marquee-crop any news article from the e-paper page. The system synthesizes an on-the-fly branded clipping with the official publication crest, Chief Editor byline, RNI registration (`MAHHIN/2014/57312`), digital verification watermark, and 1-click WhatsApp/PNG sharing.
- **Tri-Lingual Journalism Support**: First-class support for Hindi (`hi`), Marathi (`mr`), and English (`en`), interconnected through `translation_group_id` for synchronized multi-language reporting.
- **24 Broadsheet Categories**: National, International, Mumbai, Maharashtra, Delhi, Madhya Pradesh, Business & Share Market, Sports, Crime & Court, Religion & Culture, Environment, Tech & Auto, and Editorial Opinions.
- **Rich Content Verticals**:
  - **E-Paper Reader** (`/epaper`, `/epaper/:editionId`): Multi-page flipbook, thumbnail filmstrip, and full-issue PDF download.
  - **Flash News & Briefs** (`/flash`): Rapid newsfeed with auto-refresh and category filtering.
  - **Daily Rashifal** (`/rashifal`): All 12 zodiac signs with element icons, lucky numbers, and astrological forecast.
  - **Special Supplements** (`/supplement/:slug`): Features like *श्री दर्शन (Shree Darshan)* and *व्यापार मंच (Vyapar Manch)*.
  - **Photo Galleries & Video Hub** (`/photos`, `/videos`): Media galleries and responsive video players.
  - **Citizen Journalism & News Tips** (`/submit-news`): Secure citizen reporting with attachment uploads, honeypot protection, and sliding-window rate limiting.
  - **Statutory Grievance Redressal** (`/grievance`): Compliance with Rule 11 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
- **SEO & Syndication**: Google News compliant sitemap (`/news-sitemap.xml`), standard sitemap (`/sitemap.xml`), and RSS 2.0 feed (`/rss.xml`).

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript (Strict Mode), Vite 6 |
| **Styling & Design System** | Tailwind CSS with Dainik Jagat Sameeksha brand tokens (`#ed1c24` Crimson, `#fbc707` Gold, `#1c1917` Editorial Ink) |
| **Typography** | Mukta, Noto Sans Devanagari, Noto Serif Devanagari, Playfair Display |
| **Interactive Canvas** | HTML5 Canvas for dynamic broadsheet clipping and watermark composition |
| **Rich Text Editor** | Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, Image, Link) with DOMPurify sanitization |
| **Backend & Database** | Supabase PostgreSQL with Row Level Security (RLS) & triggers |
| **Storage Pipeline** | Supabase Storage (`article-media`, `epaper-editions`) with local fallback |
| **Security** | DOMPurify sanitization, honeypot fields, sliding-window rate limiters, security headers |
| **Testing** | Vitest, React Testing Library, JSDOM (12 test suites, 61 automated tests) |

---

## 3. Quick Start & Local Development

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or pnpm

### Setup
```bash
# 1. Clone repository
git clone https://github.com/Dhoni354720/e-Newspaper_arun.git
cd news

# 2. Install dependencies
npm install

# 3. Generate XML sitemaps and RSS feeds
npm run build:feeds

# 4. Run automated test suite
npm test

# 5. Start development server
npm run dev
```

Visit:
- **Public Portal**: `http://localhost:5173/`
- **E-Paper Edition**: `http://localhost:5173/epaper`
- **Editorial CMS**: `http://localhost:5173/admin/login`

---

## 4. Environment Variables

Create `.env` in the root folder based on `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jukynvinqvsemjootcqf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_pF8Fwg4LcSL5l84jN1OaJg_zGAeWTRM

# Publication Defaults
VITE_SITE_NAME=दैनिक जगत समीक्षा
VITE_DEFAULT_LOCALE=hi
VITE_TIMEZONE=Asia/Kolkata
```

---

## 5. Database Schema & Supabase Migrations

All SQL schema migrations are located in `supabase/migrations/`:

| Migration File | Description |
|---|---|
| `20261028_01_security_hardening.sql` | RLS policies, audit logs, rate limiting, and initial admin bootstrap function |
| `20261028_02_categories_authors_homeblocks.sql` | 24 broadsheet categories, Chief Editor profile, homepage block layouts |
| `20261028_03_content_types.sql` | Galleries, video items, briefs, horoscopes, supplements, news tips, and CMS pages |
| `20261028_04_epaper_pipeline.sql` | Broadsheet editions, pages, deep zoom URLs, and digital clipping archives |

### Setting Up the Admin Account
In the Supabase SQL Editor:
```sql
SELECT public.setup_initial_admin(
  'jagatsameeksha2014@gmail.com',
  'YourSecurePassword123!',
  'अरुण रमाकांत तिवारी (मुख्य संपादक)'
);
```

---

## 6. E-Paper Pipeline & Broadsheet Scans

The real broadsheet issue for **26 August 2026** (Vol 12, Issue 24) is stored in `client-assets/` and processed into optimized web renditions in `public/epaper/2026-08-26/`:
- `page-{1..4}.jpg`: 1600px width web views (~650KB - 1MB) for instant loading.
- `page-{1..4}-thumb.jpg`: 400px width thumbnails (~60KB - 90KB) for filmstrip navigation.
- `page-{1..4}-zoom.jpg`: 3000px width high-res scans (~1.6MB - 2.5MB) for deep zoom inspection.
- `DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf`: Full broadsheet edition download.

### Interactive Clipper
- Drag across any section of the broadsheet page to outline an article.
- Generates a branded PNG composite with publication header, date, edition, RNI number, and Chief Editor byline.
- Instant direct share to WhatsApp and local PNG download.

---

## 7. SEO, Sitemaps & RSS Feeds

- **Automated Sitemap Generation**: `scripts/generate-feeds.mjs` generates:
  - `public/sitemap.xml`: Complete URL tree with priority and change frequencies.
  - `public/news-sitemap.xml`: Google News standard `<news:news>` specification.
  - `public/rss.xml`: RSS 2.0 syndication feed for news readers and aggregators.
- **Dynamic Head Management**: Every page dynamically updates `<title>`, `<meta name="description">`, OpenGraph (`og:*`), Twitter Card (`twitter:*`), and Schema.org `NewsArticle` or `NewsMediaOrganization` JSON-LD data.
- **Robots.txt & Security**: Configured in `public/robots.txt` and `vercel.json`.

---

## 8. Deployment (Vercel)

The repository is configured for zero-configuration continuous deployment on **Vercel**:
1. Connect the GitHub repository `Dhoni354720/e-Newspaper_arun` to Vercel.
2. Ensure Build Command is set to: `npm run build`.
3. Set Output Directory to: `dist`.
4. Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. `vercel.json` provides SPA fallback rewrites, strict Content-Security-Policy (CSP), `X-Frame-Options: SAMEORIGIN`, and immutable caching for static media assets.

---

## 9. Automated Testing & Verification

Run the complete test suite:
```bash
npm test
```
All 12 integration and unit test suites:
- Security policies & RLS validation
- Editorial lifecycle & multilingual switching
- 24 broadsheet categories & mega menu
- Phase 2 content subsystems (Galleries, Videos, Flash, Rashifal, Grievance, News Tips)
- Phase 3 digital e-paper pipeline & article clipping
- Phase 4 SEO, sitemaps, RSS feeds, and 404 handler
- Unicode Devanagari slugs, dates, and reading time estimation

**Status**: 61/61 tests passing (100% green).

---

## 10. Publication Contacts & Copyright

© 2014–2026 **दैनिक जगत समीक्षा (Dainik Jagat Sameeksha)**. All rights reserved.  
- **RNI Registration**: `MAHHIN/2014/57312`
- **Chief Editor**: अरुण रमाकांत तिवारी (Arun Ramakant Tiwari)
- **Office**: भांडुप (पश्चिम), मुंबई, महाराष्ट्र 400078
- **Email**: `jagatsameeksha2014@gmail.com`
- **Phone**: +91-8369517611, +91-7448193748
