# Admin Panel — Scope Document

**Status:** Draft for review  
**Last updated:** March 2025

---

## 1. Goals & Non-Goals

### Goals
- Edit portfolio content (projects, testimonials, about, hero, CTA) without touching code
- Add/remove/reorder work projects and case study links (drag-and-drop)
- Manage Craft page items (typography, motion, explorations)
- **Create new pages** and compose them from existing section components
- **Preview before publish** — changes go to draft; publish when ready
- **Reversibility** — undo/redo, version history, revert to previous
- **Full case study editor** — WYSIWYG-style editor for acts, slides, narrator blocks

### Non-Goals (out of scope for v1)
- Switching homepage variation (Synthesis only in production)
- Multi-user roles (single owner/admin)
- Public API for content

---

## 2. Data Entities

| Entity | Source | Fields | Complexity |
|--------|--------|--------|------------|
| **Projects** | V2_PROJECTS | id, title, category, year, description, image, slug | Low |
| **Testimonials** | V2_TESTIMONIALS | id, quote, name, role, company, avatar, companyLogo | Low |
| **Services (simple)** | V2_SERVICES | list of strings | Low |
| **Services (detailed)** | V2_SERVICES_DETAILED | name, description, icon | Low |
| **Process** | V2_PROCESS, V2_PROCESS_DETAILED | word, label, description, deliverables[] | Medium |
| **Craft items** | V2_CRAFT_ITEMS | id, title, category, description, image | Low |
| **Explorations** | V2_EXPLORATIONS | id, title, category, type, image, tools[], date | Medium |
| **About** | V2_ABOUT | name, handle, bio[], stats[], socials[], philosophy, etc. | Medium |
| **Hero / CTA** | SynthesisHeroSection, SynthesisCTASection props | name, tagline, philosophy, headline, ctaPrimary, etc. | Low |
| **Case studies** | src/data/case-studies/*.ts | acts[], slides[], meta, narrator blocks | High |

---

## 3. Case Study Editor (Full)

Case studies use a slide-based structure:

- **Acts** (sections): each has `id`, `title`, `slides[]`
- **Slide types**: `cover`, `narrative`, `single-mockup`, `comparison`, `insight`, `outcome`, etc.
- **Narrator blocks**: optional commentary on any slide

**Scope:** Full editor — add/remove acts, add/remove/reorder slides (drag-and-drop), switch slide types, edit all fields (headline, body, image, caption, narrator), image upload per slide.

---

## 4. Auth & Security

| Option | Pros | Cons |
|--------|------|------|
| **Vercel Password Protection** | Zero code; protect /admin | Shared password |
| **NextAuth.js (GitHub)** | OAuth, no password; you control repo | Extra dep |
| **Env-based secret** | Simple: `ADMIN_SECRET` in env, check in middleware | Single shared secret |

**Recommended:** Env-based `ADMIN_SECRET` + middleware. No external auth service. For Git-based storage, GitHub token is separate (server-side only).

---

## 5. Data Persistence — Completely Free

**Requirement:** No tiered/paid database. Fully free.

| Option | Cost | Reversibility | Pros | Cons |
|--------|------|---------------|------|------|
| **GitHub API + JSON in repo** | Free | Built-in (git history) | No DB; version control; free | Needs GITHUB_TOKEN; rate limits |
| **PocketBase self-hosted** | Free (hosting may have limits) | Custom | Full DB, auth, files | Requires host (Railway, Fly.io) |
| **SQLite file in repo** | Free | Git history | Simple, no external deps | Writes need build/deploy flow |

**Recommended: Git-based (GitHub API)**

- Content stored as JSON/TS in `content/` (e.g. `content/projects.json`, `content/case-studies/dara.json`)
- Admin edits → Server Action → GitHub API `createOrUpdateFileContents` → new commit
- Draft: write to `content/draft/` or a `published: false` flag in files; publish = move to main `content/`
- **Reversibility:** Every save is a commit. "Revert" = `git revert` via GitHub API or restore from commit SHA
- **Preview:** Draft branch or `?preview=draft` query param; frontend reads draft files when in preview mode
- **Cost:** $0. GitHub free tier allows this. One `GITHUB_TOKEN` (fine-grained, repo scope) in Vercel env.

---

## 6. Admin UI (High-Level)

```
/admin
├── /login                    # Auth gate (ADMIN_SECRET)
├── /                         # Dashboard (overview, quick stats)
├── /projects                 # CRUD + drag-and-drop reorder
├── /testimonials             # CRUD + drag-and-drop reorder
├── /services                 # Edit services (simple + detailed)
├── /process                  # Edit process phases (drag-and-drop)
├── /craft                    # Craft items + Explorations (drag-and-drop)
├── /about                    # About / bio / stats / socials
├── /hero-cta                 # Hero + CTA copy
├── /case-studies             # Full editor (acts, slides, narrator)
│   └── /[slug]/edit          # Slide-by-slide editor
├── /pages                    # Page builder — create new pages
│   └── /new                  # Compose from section components
│   └── /[path]/edit          # Edit existing custom page
└── /preview                  # Preview draft changes before publish
```

**Design:** Use existing design system (Button, Text, etc.). Dark theme to match portfolio. Drag-and-drop via `@dnd-kit/core` or similar. All lists reorderable.

---

## 7. Integration with Frontend (Git-Based)

Current flow: components import from `v2-data.ts` and `case-studies/index.ts` (static).

**New flow (Git-based):**
1. Content lives in `content/` as JSON (e.g. `content/projects.json`).
2. Build time: Next.js reads from `content/*.json` (or generated TS). Same as today, but source is `content/` not `v2-data.ts`.
3. Admin saves → Server Action → GitHub API updates file → new commit → Vercel webhook rebuilds (or manual deploy).
4. **Draft:** `content/draft/` or `?preview=true` cookie; frontend optionally reads draft when in preview mode.

**Page builder:** Custom pages defined in `content/pages.json` — each has `path`, `title`, `sections[]` (section id + props). Dynamic route `/app/[...path]/page.tsx` reads page config and renders sections from our component library.

---

## 8. Page Builder — Create New Pages

**Goal:** Create new pages and compose them from existing section components.

**Mechanics:** Page config `{ path, title, sections: [{ id, props }] }`; section registry maps id → component; dynamic route renders from config. All sections accept props — no new components, just new combinations.

---

## 9. Reversibility Affordance

**Requirement:** Undo changes or revert to a previous state.

| Mechanism | How |
|-----------|-----|
| **Draft vs Published** | Draft in `content/draft/`; Publish = copy to `content/`. "Discard" = delete draft. |
| **Version history** | Every save = git commit. "Revert" = restore from older commit via GitHub API. |
| **In-editor undo** | Client-side undo stack for current session (before save). |

---

## 10. Phased Rollout

| Phase | Scope | Effort |
|-------|-------|--------|
| **0** | Auth (ADMIN_SECRET) + /admin shell, GitHub API wiring | 1–2 days |
| **1** | Projects CRUD + drag-and-drop + content/projects.json | 2–3 days |
| **2** | Draft/publish + preview mode | 1 day |
| **3** | Testimonials, About, Hero/CTA (DnD) | 1–2 days |
| **4** | Services, Process, Craft, Explorations | 2 days |
| **5** | Page builder (create pages, pick sections, set props) | 2–3 days |
| **6** | Full case study editor | 3–4 days |
| **7** | Version history + revert UI | 1–2 days |

---

## 11. Tech Stack Summary

- **Auth:** ADMIN_SECRET env + middleware (no external auth)
- **Persistence:** GitHub API + JSON in repo — $0
- **Admin UI:** Next.js App Router, design-system, React Hook Form, @dnd-kit/core
- **API:** Server Actions → GitHub REST API
- **Images:** External URLs, or base64 in JSON, or commit to repo

---

## 12. Open Questions

1. **Image uploads:** Base64 in JSON (size limit), GitHub repo as blob store, or external URLs only?
2. **Webhook:** Auto-trigger Vercel deploy on push, or manual deploy after save?

---

## 13. Next Steps

1. Review scope; confirm image strategy
2. Create content/ structure; migrate existing data to JSON
3. Implement Phase 0 (auth + GitHub API)
4. Implement Phase 1 (Projects CRUD + DnD) as pilot  
