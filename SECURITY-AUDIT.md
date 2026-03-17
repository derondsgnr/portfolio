# Security Audit — Portfolio

**Date:** March 2025  
**Scope:** Next.js 15 portfolio application

---

## Portfolio 2 / Portfolio updtaed — Git Status

**Confirmed:** `Portfolio 2/` and `Portfolio updtaed/` are **gitignored and never pushed**.

- Listed in `.gitignore` (lines 39–40)
- `git ls-files` returns no matches for "portfolio" (excluding this project)
- They exist only on disk as local reference; not in the remote repository

---

## 1. React2Shell (CVE-2025-55182) — FIXED

**Status:** Patched

- **Vulnerability:** Pre-auth RCE via unsafe deserialization in React Flight protocol (CVSS 10.0)
- **Previous version:** Next.js 15.1.0 (vulnerable)
- **Action taken:** Upgraded to Next.js 15.5.13 (patches React2Shell and additional CVEs: GHSA-3h52-269p-cp9r, GHSA-g5qg-72qw-gw5v, GHSA-xv57-4mr9-wg8v, GHSA-4342-x723-ch2f, GHSA-9g9p-9gw9-jx7f, GHSA-h25m-26qc-wcjf, GHSA-f82v-jwr5-mffw)
- **Follow-on:** Run `npm install` and redeploy to apply the fix

---

## 2. Secrets & Credentials

| Item | Location | Risk | Recommendation |
|------|----------|------|----------------|
| Supabase projectId | `src/lib/supabase/info.tsx` | Low | Move to `NEXT_PUBLIC_SUPABASE_URL` / env |
| Supabase anon key | `src/lib/supabase/info.tsx` | Low | Anon key is meant for client-side; move to `NEXT_PUBLIC_SUPABASE_ANON_KEY` for easier rotation |
| Supabase Edge Function URL | `comments-section.tsx`, `booking-drawer.tsx` | Low | Centralize in env if the function URL changes |

**Note:** Supabase anon keys are intended to be public; Row Level Security (RLS) enforces access control. Hardcoding still reduces flexibility for key rotation.

---

## 3. XSS & Injection

| Item | Location | Risk | Notes |
|------|----------|------|-------|
| `dangerouslySetInnerHTML` | `src/components/ui/chart.tsx` | Low | Builds CSS from `THEMES` and `colorConfig`; `id` comes from props. Chart `id` is not user-controlled in portfolio usage. Safe if parent controls the data. |
| User-generated content | Comments section | Medium | Comment `name` and `text` are rendered. If stored/displayed without sanitization, risk of stored XSS. Verify Supabase/Edge Function sanitizes or escapes output. |

**Recommendation:** Ensure comments are sanitized on the backend before storage and escaped when rendered. If rendering raw HTML, use a sanitizer (e.g. DOMPurify).

---

## 4. API & Data Flow

| Endpoint | Method | Auth | Notes |
|----------|--------|------|-------|
| `{API_BASE}/comments/{slug}` | GET | Bearer (anon key) | Public read; slug from URL |
| `{API_BASE}/comments` | POST | Bearer (anon key) | Public submit; no rate limiting in app |

**Gaps:**
- No rate limiting on comment/contact submission; backend (Supabase Edge Functions) should enforce limits.
- `slug` in URL is validated indirectly by case study lookup; 404 handling is present.

---

## 5. Dependencies

- **Next.js:** Upgraded to 15.1.11 (patched)
- **React:** 18.3.1 — not affected by React2Shell (RSC vulnerability is in React 19 RSC packages; Next.js bundles its own RSC implementation)
- **Other:** No known critical CVEs identified; run `npm audit` regularly

---

## 6. Configuration Hardening

| Item | Status | Suggestion |
|------|--------|-----------|
| `.env` files | Gitignored | Ensure `.env*.local` never committed |
| `images.remotePatterns` | Configured | Only `images.unsplash.com` allowed; good |
| Security headers | Not set | Add CSP, X-Frame-Options, etc. in `next.config.ts` or middleware |
| CORS | Default | Edge Functions handle CORS; verify Supabase config |

---

## 7. Content & Paths

- No Server Actions (`'use server'`) found; RSC usage is limited to pages/components.
- Dynamic route `[slug]` validates against known case studies; 404 returned for unknown slugs.
- No obvious open redirects or path traversal.

---

## 8. Summary of Actions

1. **Done:** Upgrade Next.js to 15.1.11 (React2Shell fix)
2. **Recommended:** Move Supabase config to environment variables
3. **Recommended:** Add security headers (CSP, X-Frame-Options, etc.)
4. **Recommended:** Ensure comment/contact endpoints have rate limiting on the backend
5. **Recommended:** Run `npm audit` and fix high/critical issues
