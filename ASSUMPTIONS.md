# Dainik Jagat Sameeksha (दैनिक जगत समीक्षा) — Assumptions & Defaults Log

This document records the stated defaults and fallback values for every requirement marked with ⚠️ in the project specification. If the client has not explicitly overridden these items, the system utilizes these verified defaults based on the print edition PDF (`DAINIK_JAGAT_SAMEEKSHA_26_AUGUST_2026.pdf`) and Indian digital publishing standards.

---

## 1. Identity & Legal Metadata (⚠️ Items)

| Specification Item | Stated Default / Inferred Fallback | Source / Rationale |
|---|---|---|
| **English Name Spelling** ⚠️ | `Dainik Jagat Sameeksha` | Verified against masthead English email `jagatsameeksha2014@gmail.com` and transliteration. |
| **Established Year** ⚠️ | `2014` | Corroborated by RNI Registration No. `MAHHIN/2014/57312` and email handle. |
| **Owner & Publisher** ⚠️ | अरुण रमाकांत तिवारी (Arun Ramakant Tiwari) | Editor named in print edition strip; owner of Vaishnavi Property Consultancy in Mumbai. |
| **Printer & Printing Press** ⚠️ | मुद्रक एवं प्रकाशक: अरुण रमाकांत तिवारी | Standard print press fallback pending specific commercial press name confirmation. |
| **Office Address** ⚠️ | मुंबई / भांडुप (पश्चिम), मुंबई, महाराष्ट्र 400078 | Inferred from Garud Security & Vaishnavi Consultancy offices listed in print edition. |
| **Grievance Officer (IT Rules 2021)** ⚠️ | **अधिकारी:** अरुण रमाकांत तिवारी (संपादक)<br>**ईमेल:** `jagatsameeksha2014@gmail.com`<br>**फोन:** +91-8369517611 | Statutory digital media requirement under India Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. |
| **Hindi Tagline** ⚠️ | `सत्य, निष्पक्ष और निर्भीक पत्रकारिता` | Editorial standard Devanagari tagline. |

---

## 2. Content & Editorial Settings (⚠️ Items)

| Specification Item | Stated Default / Inferred Fallback | Source / Rationale |
|---|---|---|
| **Category Tree** ⚠️ | **मुख्य समाचार** (Top flag), **देश**, **विदेश**, **राजनीति**, **महाराष्ट्र** (मुंबई, ठाणे/नवी मुंबई, पुणे, नागपुर, नाशिक), **मध्य प्रदेश** (इंदौर, ग्वालियर), **दिल्ली**, **क्राइम**, **अदालत**, **खेल**, **मनोरंजन**, **व्यापार**, **कृषि**, **शिक्षा-करियर**, **स्वास्थ्य**, **लाइफस्टाइल**, **धर्म-त्योहार**, **मौसम**, **विचित्र**, **संपादकीय** (अग्रलेख, लेख-विचार, स्तंभ), **पुरवणी**, **फोटो**, **वीडियो**, **राशिफल**. | Standard comprehensive Hindi daily tree seeded with `hi`, `mr`, and `en` translations. |
| **Default Weather City** ⚠️ | मुंबई (Mumbai) | Coverage cities: पुणे, नागपुर, दिल्ली, इंदौर, ग्वालियर. |
| **Horoscope (राशिफल) Author & Disclaimer** ⚠️ | **लेखक:** 'जगत समीक्षा ज्योतिष डेस्क'<br>**डिस्क्लेमर:** "यह राशिफल सामान्य ज्योतिषीय एवं ग्रहीय गणनाओं पर आधारित है। किसी भी महत्वपूर्ण निर्णय से पूर्व संबंधित विशेषज्ञ से परामर्श लें।" | Manual entry in CMS; avoids automated AI hallucinated horoscopes. |
| **DTP & Design Services Page** ⚠️ | Include as a dedicated tab under `/services` and footer link | Advertised in Page 4 print edition (8-page ₹500, 12-page ₹700, Contact: 8369517611). |
| **E-Paper Region & Publishing Time** ⚠️ | **Default Region:** 'मुंबई / महाराष्ट्र' (National Edition)<br>**Daily Release Schedule:** 05:00 IST | Standard Indian morning daily newspaper publishing cycle. |
| **E-Paper OCR Search** ⚠️ | Ask user first; default No for initial phase | Tesseract / Vision OCR requires server-side processing; can be enabled if requested. |

---

## 3. Advertising & Commercial Settings (⚠️ Items)

| Specification Item | Stated Default / Inferred Fallback | Source / Rationale |
|---|---|---|
| **Online Display for Print Advertisers** ⚠️ | Do NOT publish print ad creatives online until confirmed by client | Avoids publishing without digital consent; provide fallback in-house Dainik Jagat Sameeksha subscription & DTP promo banners. |
| **Ad Rate Card** ⚠️ | Header Leaderboard: ₹15,000/mo; Home Sidebar: ₹10,000/mo; In-Article: ₹8,000/mo; E-Paper Sponsor: ₹20,000/mo | Fully editable from Admin CMS settings with inquiry form. |
| **AdSense / Google Ad Manager** ⚠️ | Configurable toggle in Admin Settings (`enable_programmatic_ads: false` by default) | Allows client to enable script slots when AdSense account is approved. |

---

## 4. Technical Architecture (⚠️ Items)

| Specification Item | Stated Default / Inferred Fallback | Source / Rationale |
|---|---|---|
| **Social Crawler OpenGraph Preview** ⚠️ | **Option A (Default):** Vercel Edge Middleware | Intercepts social bot crawlers (`WhatsApp`, `FacebookExternalHit`, `Twitterbot`, `TelegramBot`, `LinkedInBot`) and serves server-generated HTML with OG meta tags and JSON-LD, preserving existing Vite React SPA architecture without full Next.js rewrite. |
| **Analytics Platform** ⚠️ | Privacy-friendly lightweight page view counter via Supabase RPC (`page_views_daily`) + configurable GA4 Measurement ID in Admin Settings. | No third-party cookie dependence by default; complies with privacy norms. |
| **First Admin Account** ⚠️ | `arun.tiwari@jagatsameeksha.com` or `jagatsameeksha2014@gmail.com` | Created via SQL migration trigger without hardcoded passwords. |
| **Email Service Provider** ⚠️ | Supabase Edge Function with Resend / SMTP settings stored in Supabase Vault | Public submissions securely relayed to `jagatsameeksha2014@gmail.com`. |
