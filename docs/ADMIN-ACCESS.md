# Admin Panel — How to Access

## URL
- **Login:** `https://derondsgnr.com/admin/login`
- **Dashboard:** `https://derondsgnr.com/admin`

Local: `http://localhost:3000/admin/login`

## Steps
1. Visit `/admin` — you'll be redirected to `/admin/login` if not logged in
2. Enter your password (the value of `ADMIN_SECRET` in env)
3. You're redirected to the dashboard

## Env vars (.env)
```
ADMIN_SECRET=your-secure-password
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO_OWNER=derondsgnr
GITHUB_REPO_NAME=portfolio
```

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
