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
- **Meta / SEO** — title, description, OG image, logo, favicon
- **Projects** — CRUD for work items (add, edit, delete)
