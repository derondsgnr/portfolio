# Admin Roadmap — Fully Editable Site

A phased plan to make the portfolio fully editable from admin, including integrations.

---

## Vision Summary

- **Fully editable** — copy, media, fonts, colors, layout, nav, meta
- **Variation library** — mix sections from Void, Signal, Cipher, Drift, Echo, Fracture, Gravity, Synthesis
- **Future-proof** — admin adapts to new layouts and section types
- **Integrations** — Google Analytics, and other third-party services

---

## Phase 1: Design Tokens & Foundation  
*Est: 2–3 sessions | Deps: none* ✅ **DONE**

**Goal:** Centralize fonts, colors, and spacing so components read from config.

| Task | Deliverable |
|------|-------------|
| Theme config | `content/theme.json` — fonts, colors, spacing tokens |
| CSS variables | Root layout injects tokens from theme |
| Admin: Theme | `/admin/theme` — edit fonts, primary/secondary/accent, background colors |
| Font loader | Dynamic font loading from theme (or fixed set of pairs) |

**Outcome:** Change fonts/colors in admin → entire site updates.

---

## Phase 2: Integrations  
*Est: 1–2 sessions | Deps: none* ✅ **DONE**

**Goal:** Support analytics, tracking, and embeds via config.

| Task | Deliverable |
|------|-------------|
| Integrations config | `content/integrations.json` or env vars |
| Google Analytics | GA4 Measurement ID, gtag script when enabled |
| Optional: GTM | Google Tag Manager container ID |
| Optional: Plausible / Umami | Privacy-friendly analytics |
| Admin: Integrations | `/admin/integrations` — toggle + paste IDs, no keys in UI |
| Optional: Cal.com / Calendly | Already have booking — ensure embed URL is editable |
| Optional: Hotjar / FullStory | Session replay (paste script URL or ID) |

**Outcome:** Add GA4 ID in admin → analytics runs. No code changes for new IDs.

---

## Phase 3: Media & Assets  
*Est: 2–3 sessions | Deps: Phase 1 optional* ✅ **DONE**

**Goal:** All images, videos, SVGs controlled from content or admin.

| Task | Deliverable |
|------|-------------|
| Media config | `content/media.json` — keys → URLs (or use projects/copy) |
| Background assets | Hero BG, section BGs, texture SVGs → URLs in theme or page config |
| Admin: Media | Browse/edit URLs, or simple file upload → store URL |
| Component wiring | Hero, craft items, explorations, etc. read image URLs from props |
| Next Image | Use `next/image` with external URLs where needed |

**Outcome:** Replace hero image, section backgrounds, SVGs from admin.

---

## Phase 4: Nav, Links & Global Copy  
*Est: 1–2 sessions | Deps: none* ✅ **DONE**

**Goal:** Navigation, footer links, and global strings editable.

| Task | Deliverable |
|------|-------------|
| Nav config | `content/nav.json` — items, order, external/internal links |
| Global copy | `content/global.json` — footer text, button labels, legal links |
| Admin: Nav | Add/remove/reorder nav items, edit labels and URLs |
| Admin: Global | Edit footer, CTA defaults, social links |
| Component wiring | Navbar, footer read from config |

**Outcome:** Change nav items, footer, social links from admin.

---

## Phase 5: Section Library & Schema  
*Est: 3–4 sessions | Deps: Phases 1–3* ✅ **DONE**

**Goal:** Every variation block is a configurable section with a schema.

| Task | Deliverable |
|------|-------------|
| Section registry | Extend current registry — all hero/work/about/cta variants from each variation |
| Section schema | Each section type has JSON schema (fields, types) |
| Schema registry | `src/lib/section-schemas.ts` — maps section id + variation → form fields |
| Data-driven components | Each section accepts `data` prop, no hardcoded copy/assets |
| Migration pass | Refactor existing section components to use props |

**Outcome:** Admin can pick “Hero (Signal)” or “Hero (Void)” etc., and edit its fields.

---

## Phase 6: Flexible Page Builder  
*Est: 3–4 sessions | Deps: Phase 5* ✅ **DONE**

**Goal:** Add, remove, reorder sections on any page. Works for future layouts.

| Task | Deliverable |
|------|-------------|
| Page config model | `content/pages.json` extended — per-route config, not just homepage |
| Section instances | Each section has: id, variation, overrides (copy, media, colors) |
| Admin: Page builder | Per-page: add section, pick type+variation, edit overrides, drag to reorder |
| Create section flow | “Add section” → pick from library → form from schema → save |
| Delete section | Remove from page config |

**Outcome:** Build homepage, about, work, craft (and future pages) by composing sections.

---

## Phase 7: Backgrounds & SVG Tweaks  
*Est: 1–2 sessions | Deps: Phase 3, 6*

**Goal:** Section and page backgrounds (image/SVG) editable.

| Task | Deliverable |
|------|-------------|
| Background config | Per-section or per-page: `bgImage`, `bgSvg`, `bgColor` |
| Admin: Backgrounds | In section editor: URL picker, or SVG snippet editor |
| Texture layers | Signal grid, scan lines, cipher — colors/opacity from theme |
| Component wiring | Texture components read from theme/section config |

**Outcome:** Change section background image or SVG from admin.

---

## Phase 8: New Section Types (Extensibility)  
*Est: ongoing | Deps: Phase 5, 6*

**Goal:** New section types added over time without major refactors.

| Task | Deliverable |
|------|-------------|
| Schema convention | New section = new component + schema entry |
| Admin discovery | Page builder “Add section” lists all registered schemas |
| Custom sections | e.g. Pricing, Testimonials, FAQ — add component + schema, appears in admin |

**Outcome:** New layout idea → add component + schema → usable in page builder.

---

## Suggested Order

```
Phase 1 (Tokens)     ──┐
Phase 2 (Integrations)  ├──► Can run in parallel or tight sequence
Phase 4 (Nav/Global) ──┘

Phase 3 (Media)      ──► After 1 (optional), before 5

Phase 5 (Section Library) ──► Core refactor
Phase 6 (Page Builder)   ──► Builds on 5
Phase 7 (Backgrounds)    ──► Polish on 3 + 6
Phase 8 (Extensibility)  ──► Ongoing
```

**Fast path:** Phase 2 (Integrations) + Phase 4 (Nav) can be done quickly for immediate value. Phase 1 (Tokens) sets up everything else.

---

## File Structure (Target)

```
content/
  copy.json          # Page copy (done)
  site-meta.json     # Meta/SEO (done)
  projects.json      # Work items (done)
  pages.json         # Page layout + sections (extend)
  theme.json         # NEW: fonts, colors, tokens
  nav.json           # NEW: nav items
  global.json        # NEW: footer, social, global strings
  media.json         # NEW: asset URLs (optional)
  integrations.json  # NEW: GA, GTM, etc.
```

---

## Integrations Detail (Phase 2)

| Integration | Config | Notes |
|-------------|--------|-------|
| Google Analytics 4 | `GA_MEASUREMENT_ID` or in integrations.json | gtag.js, next/script |
| Google Tag Manager | `GTM_ID` | Container snippet |
| Plausible | `PLAUSIBLE_DOMAIN` | Script with data-domain |
| Hotjar | `HOTJAR_ID` | Script include |
| Cal.com | Already in booking drawer | Ensure base URL editable |
| Crisp / Intercom | Optional | Chat widget URL/ID |

Admin UI: toggles + text inputs for IDs. Secrets stay in env; non-secret IDs can live in `integrations.json`.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-------------|
| Component refactor breaks visuals | Migrate incrementally, one variation at a time |
| Schema explosion | Start with 2–3 section types; expand as needed |
| Font loading complexity | Use a fixed set of font pairs; admin picks pair, not arbitrary font |
| Media uploads | Phase 1: URL-only. Later: consider upload to GitHub or S3 |

---

## Summary

- **Phases 1–2–4:** Foundation + integrations + nav — high impact, lower risk.
- **Phases 3, 5–6–7:** Media, section library, page builder — core of “fully editable” experience.
- **Phase 8:** Extensibility for future layouts and section types.

Integrations (Phase 2) can start anytime; it’s independent and gives quick value (e.g. GA4).
