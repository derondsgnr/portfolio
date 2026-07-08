# PORTFOLIO — AI Agent Index

> **Living document.** This is the single source of truth for any AI coding tool working on this project.
> Last updated: 2026-05-08. Update this file when making architectural or design decisions.

---

## IDENTITY

**Owner:** Deron — product designer and builder (remote, Nigeria)
**Site:** derondsgnr.com
**Repo:** github.com/derondsgnr/portfolio
**Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · Supabase · Vercel

---

## DESIGN DNA — DO NOT BREAK

These are the non-negotiable visual and interaction principles. Every change must respect them.

### Visual Language
- **Dark-first.** Background `#121316`, foreground `#F0F0F0`. No light mode. No gray washes. (Panels/cards sit *above* the page — `#16171B`/`#17181C`; never darker than the background.)
- **Spline palette — lime primary + rotating accents.** Primary accent is lime `#ECFF95` (CTAs, focus states, highlights, active tabs, links) with purple `#904FD3` as the secondary brand / gradient partner. Three pill colors — orange `#E5A94E`, mint `#95FFA5`, pink `#D34F79` — rotate across accents via `src/lib/pill-palette.ts` (`pillAt(index)` / `pillFor(key)`). Restrained canvas, colorful accents — do **not** tint large surfaces or body text; color lives in the accents, not the background. (Superseded the gold-only rule; see Decisions Log 2026-07.)
- **Pills are icon chips, not colored text.** Categories / tags render via `<PillChip>` (`src/components/pill-chip.tsx`): rounded dark chip (`--surface-3`/`--surface-4`) + a **filled Phosphor icon** carrying the accent + a **neutral** label. The icon holds the color so every hue stays legible (fixes purple-on-dark). Icon + color come from `src/lib/pill-icons.ts` (`pillIconFor(key)` — curated keyword rules, deterministic `Tag`+`pillFor` fallback). Add a keyword rule there when a new category/tag needs a specific icon. Filled Phosphor (`@phosphor-icons/react`, `weight="fill"`) is the pill/marker icon set; lucide remains for general UI.
- **Surface + text scales.** Elevation `--surface-1..4` (`#191A1D`→`#212225`, above the page, never darker) and text `--text-1..4` (`#F0F0F0`→`#8D8D8E`). Tailwind: `bg-surface-3`, `text-ink-2`, etc. Value semantics: neutral for positive/normal, pink `#D34F79` for negative/destructive.
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
--background: #121316       --foreground: #F0F0F0
--accent: #ECFF95           --accent-foreground: #121316   (lime, primary)
--accent-2: #904FD3         --accent-2-foreground: #F0F0F0 (purple, secondary brand)
--card: #17181C            --secondary: #1D1E24
--muted: #1D1E24            --muted-foreground: #6B6B6B
--pill-lime: #ECFF95   --pill-purple: #904FD3   --pill-orange: #E5A94E
--pill-mint: #95FFA5   --pill-pink: #D34F79
--border: rgba(255,255,255,0.08)
--destructive: #D4183D
```
Tokens live in `globals.css` `:root` (base) and are re-injected at runtime from
`content/theme.json` in `layout.tsx` (admin-editable `--accent`/`--background`).
Change a brand color in **both** places (plus `theme.ts` `DEFAULT`) or the runtime
injection silently overrides the CSS. The `--pill-*` set + `src/lib/pill-palette.ts`
are the source of truth for rotating chip colors — mirror any change across both.

### Spacing & Layout
- Mobile padding: `px-6` (24px). Desktop: `px-10` (40px).
- Border radius: `0.625rem` (10px) base.
- Mobile-first. Breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`.
- Grid: single column mobile → sidebar layouts on `lg:`.

---

## CASE STUDY & NARRATIVE VOICE (DERON)

Use for **case studies** (`src/data/case-studies/*`), **flagship blog posts**, and **project narratives**. This is verbal DNA alongside Design DNA: reflective builder journey, not pitch tone.

### Golden anchor (tone reference)

New copy must sit next to this example without a style jump—**short** sentences, **mechanical truth**, **ongoing learning**, **no pandering**:

> Dara turns bank and fintech alerts into something you can file from—Gemini first, you confirm, it learns. I'm documenting how I built that while leveling up on AI-assisted shipping; the long posts unpack each layer.

### Intent

- **Journey over trophy:** Lead with **learnings, blockers, decisions, pivots**—not vanity metrics or hype outcomes.
- **Honest scope:** Say what is **live**, what was **cut** (e.g. cost/process pivots), and what is **half-built** when that is accurate.
- **Concrete mechanics:** Name real **loops** (e.g. ingest → model → user verify → system learns). Avoid vague **“AI-powered”** with no chain.
- **Flagship + series:** The **case study** carries one clear through-line; **deeper components** (stack choices, classification, tax content, beta mechanics) belong in **follow-up posts** so the flagship does not bloat.

### Rubric (preflight)

Before shipping narrative copy, confirm:

- Does it sound like something Deron would say out loud—**direct**, not corporate?
- Is there at least one **specific mechanism** or **constraint** a skeptical reader can picture?
- Are **tradeoffs** visible (what changed, what was abandoned, what is unfinished)?
- If numbers appear, are they **true and defensible**—never inflated for polish?

### Anti-patterns (rewrite immediately)

- LinkedIn / “thought leadership” cadence, hype adjectives, **game-changer** energy.
- Generic **problem → solution → impact** with **no** Deron-specific detail.
- Bragging without **cost**; hiding pivots to appear finished.
- **Vanity metrics** or performance for engagement instead of documented reality.

### Reference code

- **Dara product source (local):** `mydara/` at repo root (sibling to `src/`). Use for technical accuracy when writing about Dara; do not invent flows.

---

## ARCHITECTURE — HOW THINGS WORK

### Content Model
All public content lives as **JSON files in `content/`**. Each file has a loader in `src/lib/content/` with fallback defaults in `defaults.ts`. The admin saves to GitHub via API, which updates these files.

```
content/
  nav.json          → Navigation links
  theme.json        → Color, font, spacing + typography (line-height/letter-spacing) tokens
  global.json       → Footer, social links, CTA label
  site-meta.json    → Title, description, OG image
  projects.json     → Work/case study grid items
  case-studies.json → Full case study payloads (admin + GitHub). **Loader merges this over `src/data/case-studies/*.ts` — for any slug in JSON, JSON wins in full.**
  copy.json         → Homepage hero text, blog page copy
  testimonials.json → Quotes + attribution
  services.json     → Homepage Services (Editorial Index): `name`, `gives[]` ("what you get"), `scope`, and `media[]`. Loader `services.ts`; types `ServiceItem`/`ServiceMediaRef` in `defaults.ts`. `media[]` URLs **reference** existing case-study/craft/media uploads — gathered by `media-library.ts` and picked in admin (drag-drop grid + dropdown). Plus a direct upload (image/video/Lottie).
  about.json        → About page copy + media + per-section visibility. Loader `about.ts`; type `AboutContent`/`DEFAULT_ABOUT` in `defaults.ts`. Edited at `/admin/about`. Renders via `AboutV2` (`*word*` → gold). `sections` toggles hide/show each block (globe/lives/films/console/friendCat/health).
  now.json          → Current status, activity log
  sounds.json       → Audio event URLs
  media.json        → Background/media URLs
  integrations.json → Analytics IDs (GTM, GA)
  landing.json      → Homepage variation selection
  pages.json        → Page layout config
   craft.json        → Craft document: `{ "sections": [...] }`; each section `layoutMode`: `masonry-2` | `masonry-3` | `editorial-cover` | `list`, plus `items`. Legacy flat `CraftItem[]` migrates on read. Types live in `craft-model.ts`; loaders in `craft.ts`.
```

**Blog data** is currently in `src/lib/data/blog-data.ts` (static TypeScript array). TODO: migrate to Supabase KV.
**Blog series** in `src/lib/data/blog-series-data.ts`.
**Blog categories** in `src/lib/data/blog-categories.ts` (reads from file, dynamic).
**Case studies:** author in `src/data/case-studies/*.ts`; **sync slug to `content/case-studies.json`** or production shows stale copy from JSON. Cross-reference: `docs/dara-case-study-copy.md` (Dara only).

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
- **Monitoring:** `/admin/automations` uses Supabase SQL tables for health checks, incidents, and automation heartbeats. `/api/monitor/run` performs scheduled sweeps; external jobs POST heartbeats to the Supabase edge function.

### API Routes
```
POST /api/comments          → Submit comment (rate-limited: 5/hr/IP, in-memory)
GET  /api/comments/[slug]   → Fetch comments for post
POST /api/now-pin           → Update Now page status
GET  /api/health            → Public health summary
GET  /api/monitor/run       → Protected monitoring sweep endpoint (also accepts POST)
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
- For case studies and flagship project copy, follow **Case Study & Narrative Voice (DERON)** above.
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
- Pitch-deck or generic LinkedIn case study voice on Deron case-study copy (see **Case Study & Narrative Voice** anti-patterns).

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
CRON_SECRET / MONITORING_CRON_SECRET → Protects monitoring sweep endpoint
```

### Optional
```
GITHUB_REPO_OWNER                   → Defaults to "derondsgnr"
GITHUB_REPO_NAME                    → Defaults to "portfolio"
NOW_ADMIN_PIN                       → PIN for Now page admin drawer
NEXT_PUBLIC_BOOKING_URL             → Cal.com booking URL for CTA drawer
NEXT_PUBLIC_GA_MEASUREMENT_ID       → Google Analytics
NEXT_PUBLIC_GTM_ID                  → Google Tag Manager
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   → Enables admin “Upload file” for Craft/Media (with preset below)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET → Unsigned Cloudinary preset for browser uploads
RESEND_FROM                         → Email "from" address (defaults to Resend onboarding)
MONITORING_SITE_URL                 → Canonical deployed URL for public health probes
MONITORING_WEBHOOK_URL              → Webhook target for alert notifications
MONITORING_ALERT_EMAIL              → Override destination for monitoring emails
ADMIN_ALLOWED_IPS                  → Optional admin IP allowlist (comma-separated, supports `203.0.113.*`)
ADMIN_CONTENT_SECRET               → Optional limited admin password (content manager role)
```

---

## KNOWN ISSUES & TECH DEBT

### Active Bugs
- Blog is still file-based (JSON/GitHub overlay), not Supabase KV (long-term TODO in `blog-data.ts:11`)
- Bookmarks admin uses `MOCK_BOOKMARKS` array that never clears
- Case study slide editor: `mockup-gallery`, `flow`, `process` types return empty arrays
- In-memory rate limiting resets on server restart (not persisted)
- Public/content consistency still depends on GitHub availability and fallback strategy (no DB-backed content store yet)

### Tech Debt (see `docs/TECH-DEBT-REVIEW.md` for full list)
- **Content source migration:** Live GitHub-first loader is in place; long-term move content to DB/KV for stronger runtime consistency at scale.
- **No `next/dynamic`:** All v2 variation components load even when only one is used.
- **ScrambleText TODO:** Centralized component exists but referenced in 8+ files. The hook `useScrambleText` may be duplicated in some v2 components.
- **Large unused dependencies:** `@mui/material`, `react-slick`, `recharts`, `@emotion/*` may be partially unused.
- **No CSRF token model** on admin forms (same-origin mutation checks + strict cookies are implemented as interim protection).
- **No build-time env validation.** Missing vars cause silent runtime failures.
- **Hardcoded Supabase function ID** `make-server-3fa6479f` in comments API routes.
- **Hardcoded KV table name** `kv_store_3fa6479f` in contact.ts.
- **Monitoring depends on SQL migrations.** Deploy `monitoring_services`, `monitoring_alerts`, and `automation_heartbeats` before using the admin monitoring panel.

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
├── mydara/                     Dara product source (reference for accurate case study copy)
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
| 2026-04 | SQL-backed monitoring with cron sweeps | Need durable health history, stale heartbeat detection, and admin incidents | `/api/monitor/run`, `/api/health`, Supabase monitoring tables, admin alert panel |
| 2026-03 | No Redux/Zustand | Minimal state needs, Context is sufficient | 4 context providers total |
| 2026-03 | ScrambleText as signature | Core brand interaction, recognizable | Single source at shared/scramble-text.tsx |
| 2026-03 | Admin auth via single secret | Solo user, no multi-user needed | SHA-256 hashed cookie, 7-day expiry |
| 2026-03 | Blog series with archive state | Content organization + lifecycle management | Series can be archived, posts have published/draft/archived |
| 2026-03 | Share button on blog posts | Native Web Share API with clipboard fallback | Built into BlogReader |
| 2026-03 | Dynamic categories from file | Admin can add/remove without code changes | Reads from blog-categories content |
| 2026-03 | Editable blog page copy | "WRITING" title, description editable from admin | Stored in content/copy.json |
| 2026-05 | Phase 1 admin hardening in app layer | Needed immediate protection before full RBAC and edge WAF rollout | Added admin IP allowlist option, login throttling/lockout, same-origin mutation checks, and mutation rate limits |
| 2026-05 | Phase 2 role split with content manager | Needed safe delegation for blog/case-study/content updates without exposing system controls | Added `ADMIN_CONTENT_SECRET`, path-level admin access gating, and write/capability permission checks |
| 2026-05 | Unified live content read path | Needed reliable E2E sync between admin writes and public/admin reads | Added shared GitHub-first + local-fallback loader across content modules and hardened rollback/race handling in blog/growth/now/reminder flows |
| 2026-05 | Structured craft content + `craft-model.ts` | Per-section galleries (masonry / editorial / list) with native aspect ratios; avoid bundling `fs` into admin client | `content/craft.json` is `{ sections[] }`; loaders in `craft.ts`; types/constants in `craft-model.ts` for RSC + client consumers |
| 2026-05 | Case study & narrative voice locked in `CLAUDE.md` | Portfolio stories should read as reflective builder journey (mechanics, pivots, honest scope)—not vanity or pitch tone; flagship + series pattern for depth | Golden anchor + rubric + anti-patterns; agents use when editing `src/data/case-studies/*` and related longform |
| 2026-05 | Case study content dual source (`content/case-studies.json` + TS registry) documented | Public loader merges JSON **over** bundled `src/data/case-studies/*`; editing TS alone left production on stale admin JSON | Agents must sync slug payloads to `case-studies.json`; `docs/dara-case-study-copy.md` for human cross-check |
| 2026-06 | Per-directive CSP for hosted media (`media-src` + Cloudinary `connect-src`) | Missing `media-src` made `<video>` fall back to `default-src 'self'`, silently blocking the Bantu case-study Cloudinary `.mp4`; same gap blocked hosted Lottie fetches and admin uploads | Added `media-src`, extended `connect-src` to `*.cloudinary.com`; CSP directive map + "adding new media is a CSP change" checklist in **Security Headers**. YouTube/Vimeo `frame-src` still pending |
| 2026-06 | Typography tokens in `theme.json` (line-height + letter-spacing) | Wanted admin control over leading/kerning. Values were hardcoded in ~1,600 spots; a single global override would break the brutalist design DNA (mono tracking `0.12–0.18em`) | Added `theme.typography` → CSS vars `--body-leading`/`--body-tracking` (applied at `body`, global baseline) + `--reader-leading`/`--meta-tracking` (wired into case-study prose + meta labels). Defaults equal current values (non-regressing). Components with explicit tracking/leading still win — by design |
| 2026-06 | Site-wide scroll-to-top/bottom affordance + "coming soon" project status + Download CV CTA | Needed quick page navigation on long case studies, a way to list unfinished case studies without exposing them, and a CV download path alongside booking CTAs | Added `ScrollAffordances` (`v2/shared/scroll-affordances.tsx`) mounted in `Providers` (hidden on `/admin`); `Project["status"]` gains `"coming-soon"` (passes through `getProjects()` filtering unchanged), with admin select + bulk action and a hover/click-blocking overlay in `WorkGridView`/`WorkListView`; `GlobalConfig.cvUrl` (admin Global form) renders a "DOWNLOAD CV" link in `CaseStudyCTA` and `SynthesisCTASection` when set |
| 2026-06 | Editable Services section (Editorial Index) with a media crawl that references existing uploads | Picked the Editorial Index direction for the homepage Services section and wanted it elevated with media — but without re-uploading anything | Services are now editable content (`content/services.json`, loader `services.ts`, `ServiceItem`/`ServiceMediaRef` in `defaults.ts`, save action `saveServices`, `/admin/services` section). `media-library.ts` walks case studies + craft + media.json into one deduped `LibraryMediaItem[]`; the admin `MediaLibraryPicker` (drag-drop grid + dropdown) stores chosen URLs as references. `TransmissionServicesIndex` renders per-service via `ServicesMediaMarquee` (kinetic crawl, pause-on-hover, respects reduced-motion) and is wired after About in `v2-transmission`. Temporary `/services-preview` route + the Frequency/Ticker variants were removed |
| 2026-06 | Hide-a-page via a `hidden` flag on nav items | Needed to pull a page (e.g. Writing) off the public site while reworking it, without deleting content | `NavItem` gains `hidden?: boolean` (`content/nav.json`). One source of truth, three effects: (1) `getNav()` strips hidden items so they vanish from sidebar/navbar/footer — pass `{ includeHidden: true }` for the admin editor; (2) `isPathHidden(pathname)` gates routes — each public page (`/work`, `/blog`+`[slug]`+series, `/craft`, `/about`, `/now`, `/work/[slug]`) calls `notFound()` when its section is hidden, covering sub-routes; (3) homepage previews + the sitemap suppress hidden sections (`TransmissionVariation` takes `hiddenPaths`; `sitemap.ts` filters via `getHiddenNavPaths()`). Admin Nav editor has a per-item Show/Hide toggle (`handleEdit` preserves the flag). The home route `/` is never hideable |
| 2026-06 | Hidden = invisible everywhere (no dangling links/previews to a hidden page) | Hiding a page must remove **every** visible route to it across the UI — not just the nav item | `hiddenPaths` is exposed site-wide via `SiteConfigContext` (sourced from `getHiddenNavPaths()` in `layout.tsx` → `Providers`). Two primitives in `contexts/site-config-context.tsx`: `useIsHidden(path)` / `isHiddenPath(path, hiddenPaths)` (exact match covers anchors like `/#services`; subtree match covers `/blog/x`). **`<SafeLink href>` (`components/safe-link.tsx`) is the rule:** any internal link to a nav-managed section (`/work`, `/blog`, `/about`, `/craft`, `/now`, `/#services`) must use it (renders its `fallback`, default nothing, when the target is hidden) — applied to blog-reader, case-study reader-view, series back-link, transmission/dispatch hero CTAs, and the 4 named variations. Whole **preview blocks** call `useIsHidden(...)` and return `null` / gate (`about-preview`, `synthesis-journal-strip`, transmission + dispatch work/blog/craft/about sections). **When adding any internal link or preview section for a nav page, use `<SafeLink>` or gate on `useIsHidden` — never a bare `<Link>`** |
| 2026-06 | CV accepts Drive/Dropbox links + direct upload; Services media gains upload + Lottie | CV field was paste-a-URL only; Services media was reference-only (image/video) | `toDownloadableUrl()` (`lib/download-url.ts`) converts Google Drive / Dropbox share links to direct-download URLs — applied where the CV CTA renders (`case-study-cta`, `synthesis-cta`). `CloudinaryUploadField` gained `accept`/`label` props; `uploadFileToCloudinary` routes PDFs + Lottie to `/raw/upload`. Admin **Global** form now has a PDF uploader for the CV. **Services media** now supports **Lottie**: `ServiceMediaRef.type`/`LibraryMediaItem.type` add `"lottie"`, `media-library.ts` gathers `.json/.lottie` (craft `lottieUrl` + `lottie` slides), `ServicesMediaMarquee` renders it via `lottie-web` (`path:` → host must be in CSP `connect-src`), and `MediaLibraryPicker` adds a lottie filter, placeholder thumb, and a **direct upload** (image/video/Lottie) that attaches to the service |
| 2026-07 | "Spline" color refresh — new dark canvas + lime primary + rotating pill accents (supersedes gold-only) | Site read as monochrome gold-on-near-black; wanted it to feel more alive and colorful (Spline energy) without changing any layout | Background `#0A0A0A → #121316`; accent gold `#E2B93B → #ECFF95` (lime) across all ~1,600 hardcoded spots + `theme.json`/`theme.ts`/`globals.css` tokens; near-black panels (`#0D0D0D`/`#0F0F0F`) lifted to `#16171B` so cards float above the lighter page; grays `#111111→#17181C`, `#1A1A1A→#1D1E24`. Added `--accent-2` (purple `#904FD3`) + `--pill-{lime,purple,orange,mint,pink}` tokens and `src/lib/pill-palette.ts` (`pillAt`/`pillFor`). Rotating accents wired into the most visible repeating chips: blog category filter + card category badges (`blog-page-client`), case-study meta tags (`reader-view`) and section/metric tags (`slide-renderer`). Canvas stays restrained — color lives in accents, not surfaces or body text |
| 2026-07 | Pills → icon chips (`<PillChip>` + filled Phosphor) + surface/text scales | Rotating colored-text pills left purple illegible on dark and read flat; wanted the fintech-dashboard chip feel (dark chip + colored icon + neutral label) | Added `--surface-1..4` (`#191A1D`→`#212225`) + `--text-1..4` (`#F0F0F0`→`#8D8D8E`) tokens (globals.css + Tailwind `surface-*`/`ink-*` + `tokens.ts`). New `@phosphor-icons/react` dep for **filled** icons (lucide stays for general UI). `src/lib/pill-icons.ts` `pillIconFor(key)` resolves category/tag → `{ Icon, color }` via ordered keyword rules with a deterministic `Tag`+`pillFor` fallback; `src/components/pill-chip.tsx` renders rounded chip + icon + neutral label (`tag` = mono/surface-3/active-ring, `chip` = label/surface-4). Swapped ghost-outline pills → PillChip in blog category filter + card badges (`blog-page-client`), case-study meta tags (`reader-view`), section/metric tags (`slide-renderer`). Color now lives in the icon, not the label |
| 2026-07 | PillChip finalized (no outline, white label) + tool logos bundled locally | Chips needed to match the Figma exactly (solid surface, colored icon, white text — no border); tool badges were CDN-fetched (invisible for black brands like Next.js, and fetched at runtime) | `PillChip` dropped the border + active-ring — state now reads via icon/label color only; applied to every tag row incl. blog card secondary tags (`blog-page-client`, `blog-reader`). `src/lib/tool-logos.ts` now embeds brand SVG paths + hex from `simple-icons` (build-time) with a **dark-background-safe display color** (contrast-vs-`#121316` < 2.2 → white, so black brands like Next.js/Vercel/GitHub/Cursor show; saturated brands like Framer keep their color). `getToolIcon(name)` + `<ToolGlyph>` (inline SVG, monogram fallback via `pillFor`) + `<ToolChip>` (surface-3 chip). Swapped ghost-pill tool wrappers → `<ToolChip>` in `about` render sites (cipher/gravity/signal/synthesis). No runtime CDN request for logos |
| 2026-07 | Purple (`--accent-2`) applied as the actual secondary brand (not just pill icons) | Purple was defined but only surfaced as pill-icon color; wanted it visible as the lime partner without tinting surfaces | Purple now appears on: **gradient display type** (`.gradient-display` util in globals.css — white→lime→purple `background-clip:text`, single-node headings only — on blog hero h1), **reading progress bar** (`reader-view`, lime→purple) + **blog hero divider** (`from-[#ECFF95] via-[#904FD3]`), **secondary CTA** (Download CV → purple ghost button in `case-study-cta` + `synthesis-cta`, distinct from the lime primary), **series markers** (`series-badge` → `#B98ADF` text / `#904FD3` rule), and the **section-break ghost act number** (faint `rgba(144,79,211,0.12)`). Small purple **text** uses the lighter `#B98ADF` (raw `#904FD3` is low-contrast on dark); no surface fills are tinted |

---

## DEPLOYMENT

- **Host:** Vercel (auto-deploys on push to `main`)
- **Domain:** derondsgnr.com + www.derondsgnr.com
- **Node:** 24.x
- **Build:** `pnpm build` (Next.js)
- **Preview:** Every PR gets a preview deployment
- **Env vars:** Set in Vercel dashboard (Settings → Environment Variables)
- **Cron:** GitHub Actions triggers `/api/monitor/run` every 5 minutes; set `CRON_SECRET` or `MONITORING_CRON_SECRET` in Vercel and mirror the secret in GitHub Actions

---

## SECURITY HEADERS (next.config.ts)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: per-directive allowlist (see below)
```

### CSP — directive-by-directive

**Directives do NOT inherit.** Each resource type falls back to `default-src 'self'`
when its own directive is absent — so adding a domain to `img-src` does nothing for
video, fonts, or fetches. When media from a domain works as an image but not as a
video, suspect the directive split before suspecting the URL.

| Directive | Allows | Governs |
|-----------|--------|---------|
| `default-src` | `'self'` | Fallback for anything unlisted |
| `img-src` | `'self' https: data: blob:` | `<img>`, poster frames |
| `media-src` | `'self' https: data: blob:` | `<video>`/`<audio>` — incl. Cloudinary `.mp4` |
| `connect-src` | `'self'`, Supabase, GA/GTM, Vercel, `res.cloudinary.com`, `api.cloudinary.com` | `fetch`/XHR — incl. **hosted Lottie JSON** (`lottie-web` `path:`) and **admin Cloudinary uploads** |
| `frame-src` | `'self'`, cal.com, calendly | Embeds. **YouTube/Vimeo are NOT yet allowed** — add before using provider embeds in video slides |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'`, GTM, Calendly | Scripts |
| `style-src` / `font-src` | `'self' 'unsafe-inline' https:` / `https: data:` | Styles / fonts |
| `frame-ancestors` | `'none'` | Clickjacking protection |

**Adding new hosted media is a CSP change, not just a content change.** Checklist:
- Inline image → already covered by `img-src https:`.
- Inline video/audio (`<video>`) → needs the domain in `media-src` (`https:` covers it).
- Hosted Lottie / any `fetch`ed asset → needs the domain in `connect-src`.
- YouTube/Vimeo (or any iframe) → needs the domain in `frame-src`.

CSP failures are **silent** — no build error, no app exception, only a browser
Console `Refused to load … Content Security Policy` line. There is no CI check for
this; verify new media types in a real browser after deploy.
