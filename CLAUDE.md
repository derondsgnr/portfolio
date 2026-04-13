# PORTFOLIO — AI Agent Index

> **Living document.** This is the single source of truth for any AI coding tool working on this project.
> Last updated: 2026-03-28. Update this file when making architectural or design decisions.

---

## IDENTITY

**Owner:** Deron — product designer and builder based in Lagos, Nigeria
**Site:** derondsgnr.com
**Repo:** github.com/derondsgnr/portfolio
**Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · Supabase · Vercel

---

## DESIGN DNA — DO NOT BREAK

These are the non-negotiable visual and interaction principles. Every change must respect them.

### Visual Language
- **Dark-first.** Background `#0A0A0A`, foreground `#F0F0F0`. No light mode. No gray washes.
- **Gold accent only.** `#E2B93B` for CTAs, focus states, highlights, active tabs. No other accent colors.
- **Brutalist editorial.** Clean, high-contrast, controlled tension. No rounded-everything, no soft gradients, no pastel.
- **Typography hierarchy:** Anton (heading, display, uppercase) + Instrument Sans (body, UI). These are the primary pair. Inter/Playfair and Space/DM are alternates selectable via admin.
- **Monospace for system text.** Labels, metadata, timestamps, categories, admin UI — always monospace, uppercase, tight tracking (`0.12em–0.18em`).
- **Text as architecture.** Ghost text, oversized type, overlapping elements are intentional. They are not bugs.

### Interaction Principles
- **ScrambleText is the signature animation.** Character-by-character random reveal, triggers on scroll, plays sound on complete. It exists at `src/components/v2/shared/scramble-text.tsx`. Use it — don't recreate it.
- **Sound is a dimension.** Hover, click, text reveal, loader — all have optional sound. Respects `prefers-reduced-motion`. Sound config lives in `content/sounds.json`.
- **Motion library is `motion` (v12+).** Not Framer Motion. Import from `"motion/react"`.
- **Easing:** Primary `[0.25, 0.46, 0.45, 0.94]`, wipe `[0.77, 0, 0.175, 1]`. Use spring physics for interactive elements.
- **Scroll-triggered, once.** Animations fire `whileInView` with `once: true`. No repeat animations on scroll.

### Color Tokens (CSS Variables)
```
--background: #0A0A0A       --foreground: #F0F0F0
--accent: #E2B93B           --accent-foreground: #0A0A0A
--card: #111111             --secondary: #1A1A1A
--muted: #1A1A1A            --muted-foreground: #6B6B6B
--border: rgba(255,255,255,0.08)
--destructive: #D4183D
```

### Spacing & Layout
- Mobile padding: `px-6` (24px). Desktop: `px-10` (40px).
- Border radius: `0.625rem` (10px) base.
- Mobile-first. Breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`.
- Grid: single column mobile → sidebar layouts on `lg:`.

---

## ARCHITECTURE — HOW THINGS WORK

### Content Model
All public content lives as **JSON files in `content/`**. Each file has a loader in `src/lib/content/` with fallback defaults in `defaults.ts`. The admin saves to GitHub via API, which updates these files.

```
content/
  nav.json          → Navigation links
  theme.json        → Color, font, spacing tokens
  global.json       → Footer, social links, CTA label
  site-meta.json    → Title, description, OG image
  projects.json     → Work/case study grid items
  copy.json         → Homepage hero text, blog page copy
  testimonials.json → Quotes + attribution
  now.json          → Current status, activity log
  sounds.json       → Audio event URLs
  media.json        → Background/media URLs
  integrations.json → Analytics IDs (GTM, GA)
  landing.json      → Homepage variation selection
  pages.json        → Page layout config
  craft.json        → Craft items
```

**Blog data** is currently in `src/lib/data/blog-data.ts` (static TypeScript array). TODO: migrate to Supabase KV.
**Blog series** in `src/lib/data/blog-series-data.ts`.
**Blog categories** in `src/lib/data/blog-categories.ts` (reads from file, dynamic).
**Case studies** in `src/data/case-studies/*.ts`.

### Slide System (Shared by Blog + Case Studies)
Both blog posts and case studies use a **flat array of typed slides**. The renderer is `src/components/v2/case-study/slide-renderer.tsx`.

13 slide types: `narrative`, `section-break`, `quote`, `insight`, `metric`, `single-mockup`, `comparison`, `flow`, `embed`, `video`, `mockup-gallery`, `process`, `cover`.

Each slide has a `type` discriminator. SlideRenderer pattern-matches on it. **Do not add new slide types without updating SlideRenderer.**

### Homepage Variation System
4 named variations: Monument, Orbit, Descent, Collision (in `src/components/homepage-variations/`).
8 v2 variations: Synthesis, Cipher, Drift, Echo, Gravity, Signal, Void, Fracture (in `src/components/v2/`).

Each is a standalone component. Selected via `landing.json` config. They share data via `homepage-data.ts`.

### Admin System
- **Auth:** Single password via `ADMIN_SECRET` env var. SHA-256 hashed, stored in httpOnly cookie (7-day expiry). Middleware at `src/middleware.ts` protects `/admin/*`.
- **Saves:** `saveContent()` server action → GitHub API → commits JSON to repo.
- **History:** Change log tracked in AdminContext with localStorage persistence. One-click revert.
- **13 admin sections:** Copy, Case Studies, Testimonials, Blog, Now, Contacts, Comments, Bookmarks, Theme, Media, Sounds, Nav, Global.

### API Routes
```
POST /api/comments          → Submit comment (rate-limited: 5/hr/IP, in-memory)
GET  /api/comments/[slug]   → Fetch comments for post
POST /api/now-pin           → Update Now page status
```

### State Management
- Minimal. No Redux/Zustand.
- `SiteConfigContext` — nav + global config.
- `TestimonialsContext` — testimonials data.
- `AdminContext` — change history.
- `BookingContext` — drawer open/close/tab state.
- Form state via `react-hook-form`.

---

## RULES FOR AI AGENTS

### Do
- Read files before modifying them.
- Use existing components (`ScrambleText`, `DeviceMockup`, `SlideRenderer`, Radix UI primitives in `src/components/ui/`).
- Follow the dark theme. Gold accent only.
- Use `motion/react` for animations (not `framer-motion`).
- Use Tailwind utility classes. Follow existing patterns.
- Keep admin saves going through `saveContent()` → GitHub API.
- Run `pnpm build` to verify changes compile.
- Update this file if you make architectural decisions.

### Do Not
- Add a light mode or alternate color schemes.
- Replace Tailwind with CSS-in-JS, styled-components, or CSS modules.
- Add new state management libraries (Redux, Zustand, Jotai).
- Add new animation libraries (GSAP, anime.js). `motion` is the standard.
- Hardcode Supabase function IDs or table names (they already are — don't add more).
- Remove or rename existing `content/*.json` files without updating all loaders.
- Duplicate ScrambleText. It's at `src/components/v2/shared/scramble-text.tsx`.
- Create new fonts. The font pair system is intentional — use what's configured.
- Add `console.log` to production code. Use proper error handling.
- Skip input validation on API routes.
- Use `dangerouslySetInnerHTML` outside the existing theme injection in layout.tsx.
- Auto-approve or auto-merge PRs.

---

## ENVIRONMENT VARIABLES

### Required
```
ADMIN_SECRET                        → Admin panel password
NEXT_PUBLIC_SUPABASE_PROJECT_ID     → Supabase project ID
NEXT_PUBLIC_SUPABASE_ANON_KEY       → Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY           → Supabase service role (server-only)
GITHUB_TOKEN                        → GitHub PAT for admin content writes
```

### Required for Features
```
RESEND_API_KEY                      → Email notifications (contact form)
CONTACT_EMAIL                       → Destination for contact messages
```

### Optional
```
GITHUB_REPO_OWNER                   → Defaults to "derondsgnr"
GITHUB_REPO_NAME                    → Defaults to "portfolio"
NOW_ADMIN_PIN                       → PIN for Now page admin drawer
NEXT_PUBLIC_BOOKING_URL             → Cal.com booking URL for CTA drawer
NEXT_PUBLIC_GA_MEASUREMENT_ID       → Google Analytics
NEXT_PUBLIC_GTM_ID                  → Google Tag Manager
RESEND_FROM                         → Email "from" address (defaults to Resend onboarding)
```

---

## KNOWN ISSUES & TECH DEBT

### Active Bugs
- Blog data is static TypeScript, not Supabase KV (TODO in `blog-data.ts:11`)
- Bookmarks admin uses `MOCK_BOOKMARKS` array that never clears
- Case study slide editor: `mockup-gallery`, `flow`, `process` types return empty arrays
- In-memory rate limiting resets on server restart (not persisted)
- Muted text color `#6B6B6B` on `#0A0A0A` may fail WCAG contrast

### Tech Debt (see `docs/TECH-DEBT-REVIEW.md` for full list)
- **Async waterfalls:** Most admin pages fetch GitHub then local sequentially. Should use `Promise.all`.
- **No `next/dynamic`:** All v2 variation components load even when only one is used.
- **ScrambleText TODO:** Centralized component exists but referenced in 8+ files. The hook `useScrambleText` may be duplicated in some v2 components.
- **Large unused dependencies:** `@mui/material`, `react-slick`, `recharts`, `@emotion/*` may be partially unused.
- **No CSRF protection** on admin forms.
- **No build-time env validation.** Missing vars cause silent runtime failures.
- **Hardcoded Supabase function ID** `make-server-3fa6479f` in comments API routes.
- **Hardcoded KV table name** `kv_store_3fa6479f` in contact.ts.

### Not Yet Built
- **Interactive prototypes on own subdomains** — clickable demos per case study, hosted under derondsgnr.com; spec in `docs/INTERACTIVE-PROTOTYPES.md`
- Blog migration to Supabase KV (posts, series, categories)
- Bookmarks import from external platforms
- Layout builder visual UI (page exists, core functionality incomplete)
- Admin logout endpoint
- Persistent rate limiting (Redis or DB)
- Case study template system (types defined in `_template.ts` but not enforced)

---

## FILE MAP — KEY LOCATIONS

```
/                               Root
├── content/*.json              All editable content (source of truth)
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout (providers, fonts, theme injection)
│   │   ├── page.tsx            Homepage (renders selected variation)
│   │   ├── work/[slug]/        Case study pages
│   │   ├── blog/[slug]/        Blog post pages
│   │   ├── blog/series/[seriesSlug]/  Series landing pages
│   │   ├── admin/              Admin panel (login + 13 dashboard sections)
│   │   └── api/                API routes (comments, now-pin)
│   ├── components/
│   │   ├── v2/                 Homepage variations + rendering engines
│   │   │   ├── shared/         ScrambleText, texture layers
│   │   │   ├── case-study/     SlideRenderer, ReaderView, CinematicView
│   │   │   ├── blog/           BlogReader, SeriesBanner, SeriesNav
│   │   │   ├── sections/       Hero, CTA, About section components
│   │   │   └── booking-drawer.tsx  Contact/booking overlay
│   │   ├── homepage-variations/ 4 named homepage designs
│   │   ├── admin/              Admin UI (sidebar, context, primitives)
│   │   └── ui/                 45+ Radix UI primitive wrappers (shadcn)
│   ├── contexts/               SiteConfig, Testimonials, Admin, Booking
│   ├── lib/
│   │   ├── content/            JSON loaders + defaults
│   │   ├── data/               Blog posts, series, categories, now data
│   │   ├── admin/              Auth, GitHub API, hash utilities
│   │   ├── supabase/           Client initialization
│   │   └── contact.ts          Contact form submission logic
│   ├── data/case-studies/      Case study content files
│   ├── types/                  TypeScript interfaces (blog.ts, case-study.ts)
│   ├── hooks/                  Custom React hooks
│   ├── design-system/          Tokens, atoms, molecules
│   └── middleware.ts           Admin route protection
├── docs/                       Supplementary documentation
├── supabase/                   Supabase config + migrations
└── CLAUDE.md                   THIS FILE
```

---

## DECISIONS LOG

| Date | Decision | Why | Impact |
|------|----------|-----|--------|
| 2026-03 | Dark-only, no light mode | Brand identity is built on dark brutalist aesthetic | All components assume dark bg |
| 2026-03 | JSON files as content store | Simple, git-tracked, no DB dependency for content | Admin writes to GitHub API |
| 2026-03 | Slide-based content model | Reusable across blog + case studies | 13 slide types in shared renderer |
| 2026-03 | Homepage variation system | Allows creative exploration without breaking main | 12 variations, switchable via admin |
| 2026-03 | motion (not framer-motion) | v12+ is the successor, same API | Import from `motion/react` |
| 2026-03 | Supabase for comments + contacts | Real-time capable, free tier sufficient | Edge Functions handle CRUD |
| 2026-04 | `outputFileTracingRoot` in next.config | Parent dir had extra lockfile; Next inferred wrong root for tracing | Build traces and deploys use repo root |
| 2026-03 | No Redux/Zustand | Minimal state needs, Context is sufficient | 4 context providers total |
| 2026-03 | ScrambleText as signature | Core brand interaction, recognizable | Single source at shared/scramble-text.tsx |
| 2026-03 | Admin auth via single secret | Solo user, no multi-user needed | SHA-256 hashed cookie, 7-day expiry |
| 2026-03 | Blog series with archive state | Content organization + lifecycle management | Series can be archived, posts have published/draft/archived |
| 2026-03 | Share button on blog posts | Native Web Share API with clipboard fallback | Built into BlogReader |
| 2026-03 | Dynamic categories from file | Admin can add/remove without code changes | Reads from blog-categories content |
| 2026-03 | Editable blog page copy | "WRITING" title, description editable from admin | Stored in content/copy.json |

---

## DEPLOYMENT

- **Host:** Vercel (auto-deploys on push to `main`)
- **Domain:** derondsgnr.com + www.derondsgnr.com
- **Node:** 24.x
- **Build:** `pnpm build` (Next.js)
- **Preview:** Every PR gets a preview deployment
- **Env vars:** Set in Vercel dashboard (Settings → Environment Variables)

---

## SECURITY HEADERS (next.config.ts)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: allowlist for Google Analytics, Calendly, Supabase
```
