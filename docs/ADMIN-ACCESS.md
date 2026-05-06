# Admin Panel — How to Access

## URL
- **Login:** `https://derondsgnr.com/admin/login`
- **Dashboard:** `https://derondsgnr.com/admin`

Local: `http://localhost:3000/admin/login`

## Steps
1. Visit `/admin` — you'll be redirected to `/admin/login` if not logged in
2. Enter a password:
   - `ADMIN_SECRET` → full owner access
   - `ADMIN_CONTENT_SECRET` → limited content-manager access
3. You're redirected to the dashboard with role-appropriate sections

## Env vars (.env)
```
ADMIN_SECRET=your-secure-password
ADMIN_CONTENT_SECRET=separate-content-manager-password
ADMIN_ALLOWED_IPS=203.0.113.10,198.51.100.*
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO_OWNER=derondsgnr
GITHUB_REPO_NAME=portfolio
```

Notes:
- `ADMIN_ALLOWED_IPS` is optional and supports comma-separated values and wildcard suffixes.
- `GITHUB_TOKEN` powers admin content writes and tracker/Growth updates. If it expires, writes fail.

## Access model
- **Owner** (`ADMIN_SECRET`): full admin access (including integrations, security, monitoring, bookmarks, Growth OS).
- **Content manager** (`ADMIN_CONTENT_SECRET`): content-safe surfaces only (blog, case studies, media, testimonials, projects, copy, now, contacts, comments).
- Route access is enforced in middleware, and write permissions are enforced in server actions.

## Sections
- **Copy** — hero, about, CTA text for all pages (homepage, work, about, craft). To add a new page, add its key to `content/copy.json`.
- **Meta / SEO** — title, description, OG image, logo, favicon
- **Projects** — CRUD for work items (add, edit, delete)
- **Layout** — per-page builder for Homepage, Work, About: add/remove/reorder sections, swap variations (Synthesis, Void, Signal, Cipher, Drift, Echo, Fracture, Gravity), edit section overrides
- **Theme** — fonts, colors, spacing tokens (affects entire site)
- **Integrations** — Google Analytics (GA4), Google Tag Manager — enable and paste IDs
- **Nav** — add/remove/reorder nav items, edit labels and paths (internal) or hrefs (external)
- **Global** — social links, footer copyright, footer tagline, CTA button label
- **Media** — hero background URL, craft item images, exploration images
