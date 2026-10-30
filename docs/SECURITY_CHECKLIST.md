# Production Security Checklist & Operations Manual
**Publication:** दैनिक जगत समीक्षा (*Dainik Jagat Sameeksha*)  
**Scope:** Supabase, Vercel, GitHub, Domain Registrar, Google Workspace

---

## 1. Supabase Dashboard Configuration
Navigate to your Supabase Project Settings (`https://app.supabase.com/project/<project-id>/settings`):

- [ ] **Authentication Settings (`Authentication > URL Configuration`):**
  - **Site URL:** Set strictly to `https://dainikjagatsameeksha.com` (NO `localhost` in production).
  - **Redirect URLs:** Whitelist ONLY `https://dainikjagatsameeksha.com/**` (remove wildcards and http://localhost).
- [ ] **User Signups (`Authentication > Providers > Email`):**
  - **Enable Signups:** ❌ DISABLE public self-registration. Staff accounts must be provisioned via admin invitation or SQL setup procedure.
  - **Confirm Email:** ✅ ENABLE mandatory email confirmation.
  - **Minimum Password Length:** Set to at least 12 characters.
  - **Leaked Password Protection:** ✅ ENABLE (blocks passwords found in HaveIBeenPwned breaches).
- [ ] **Multi-Factor Authentication (MFA / 2FA):**
  - Enable TOTP (Time-based One-Time Password) for all editorial staff accounts (`Authentication > MFA`).
- [ ] **Database Connection Security (`Database > Connection Pooling`):**
  - Enforce SSL mode `verify-full` on all direct database connections.
  - Keep `service_role` key secret and never enter it into client applications or repository files.
- [ ] **Storage Buckets (`Storage`):**
  - Remove `image/svg+xml` from allowed MIME types for public buckets (`epaper-editions`, `media-assets`).

---

## 2. Vercel Project & Environment Variable Scoping
Navigate to `Vercel Dashboard > Project Settings > Environment Variables`:

- [ ] **Separate Environments:** Scope all sensitive variables strictly between **Production**, **Preview**, and **Development**:
  | Variable Name | Production Value | Preview / Dev Value | Scope |
  |---|---|---|---|
  | `VITE_SUPABASE_URL` | Production project URL | Staging / dev project URL | All |
  | `VITE_SUPABASE_ANON_KEY` | Production anon key | Staging / dev anon key | All |
  | `VITE_DEMO_MODE` | `false` | `false` (or `true` only locally) | All |
  | `TURNSTILE_SECRET_KEY` | Cloudflare Production Secret | Cloudflare Test Secret | Server-only (No VITE_) |
  | `IP_HASH_SALT` | Random 32-byte hex salt | Local dev salt | Server-only (No VITE_) |
  | `UPSTASH_REDIS_REST_URL` | Upstash Production REST URL | Optional dev cluster | Server-only (No VITE_) |
  | `UPSTASH_REDIS_REST_TOKEN` | Upstash Production Token | Optional dev token | Server-only (No VITE_) |

- [ ] **Build & Output Settings:**
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] **Deployment Protection:**
  - Enable Vercel Password Protection or Vercel Authentication on Preview Deployments to prevent unauthenticated indexing of draft previews.

---

## 3. GitHub Repository Hygiene
- [ ] **Branch Protection (`Settings > Branches`):**
  - Protect `main` branch: Require pull request reviews before merging.
  - Require status checks to pass (`Security Audit & Quality Checks`).
- [ ] **Two-Factor Authentication (2FA):**
  - Mandate 2FA for all repository collaborators and organization owners.
- [ ] **Secret Scanning & Dependabot (`Settings > Code security and analysis`):**
  - Enable GitHub Secret Scanning and Push Protection.
  - Enable Dependabot Alerts and Dependabot Security Updates.

---

## 4. Domain Registrar & DNS Security
- [ ] **Registrar 2FA:** Enforce hardware token or authenticator app 2FA on the domain registrar account managing `dainikjagatsameeksha.com`.
- [ ] **DNSSEC:** Enable DNSSEC (Domain Name System Security Extensions) at registrar.
- [ ] **CAA Records:** Configure DNS Certification Authority Authorization (CAA) records specifying `letsencrypt.org` and `digicert.com`.
- [ ] **Email Authentication Records:**
  - **SPF:** `v=spf1 include:_spf.google.com ~all`
  - **DKIM:** 2048-bit DKIM key generated in Google Workspace Admin.
  - **DMARC:** `v=DMARC1; p=reject; rua=mailto:dmarc-reports@dainikjagatsameeksha.com;`

---

## 5. Google Workspace / Editorial Email
- [ ] **Administrative 2FA:** Enforce Google 2-Step Verification for `jagatsameeksha2014@gmail.com` and all official bureau addresses.
- [ ] **Review App Passwords:** Revoke unused OAuth tokens and third-party application authorizations.
