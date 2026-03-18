# Comments Backend Setup

This guide walks you through setting up the comments feature for case studies. Comments are stored in Supabase and served via an Edge Function.

## Prerequisites

- A Supabase project (create one at [database.new](https://database.new))
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (e.g. `brew install supabase/tap/supabase`)
- [Docker](https://docs.docker.com/get-docker/) (optional, for local testing)

---

## Step 1: Create the KV table in Supabase

Comments use the same `kv_store_3fa6479f` table as the contact form. If you already have contacts working, you likely have this table.

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → select your project
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS kv_store_3fa6479f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Optional: Enable RLS if you want (the Edge Function uses service role, so it bypasses RLS)
ALTER TABLE kv_store_3fa6479f ENABLE ROW LEVEL SECURITY;
```

Comment keys follow the pattern: `comment:{slug}:{id}` (e.g. `comment:dara:1234567890-abc123`).

---

## Step 2: Initialize Supabase in your project

From the project root:

```bash
cd /Users/mac/my-portfolio
supabase init
```

This creates `supabase/config.toml`. The Edge Function code is already in `supabase/functions/make-server-3fa6479f/`.

---

## Step 3: Link to your Supabase project

1. Log in (if needed):
   ```bash
   supabase login
   ```

2. List your projects:
   ```bash
   supabase projects list
   ```

3. Link using your project ref (from the list or Dashboard URL):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

---

## Step 4: Set Edge Function secrets

The Edge Function needs Supabase URL and service role key. Set them as secrets:

```bash
supabase secrets set SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Where to find these:**
- Supabase Dashboard → **Settings** → **API**
- `SUPABASE_URL` = Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = `service_role` key (keep this secret)

---

## Step 5: Deploy the Edge Function

```bash
supabase functions deploy make-server-3fa6479f
```

When it succeeds, the function is live at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-3fa6479f
```

---

## Step 6: Configure your Next.js app

Ensure `.env` has:

```env
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-ref
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Next.js API routes (`/api/comments` and `/api/comments/[slug]`) use these to proxy requests to the Edge Function.

---

## Step 7: Test it

1. **Health check:**
   ```bash
   curl -i "https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-3fa6479f/health" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```
   Expected: `{"status":"ok"}`

2. **Post a comment** (from a case study page, e.g. `/work/dara`):
   - Click "LEAVE A COMMENT"
   - Enter text and submit

3. **Verify in Supabase:**
   - Dashboard → **Table Editor** → `kv_store_3fa6479f`
   - Look for rows with `key` starting with `comment:dara:`

---

## Optional: Run locally

```bash
supabase start          # Start local Supabase (requires Docker)
supabase functions serve make-server-3fa6479f
```

Then point your app to `http://localhost:54321` by setting `NEXT_PUBLIC_SUPABASE_PROJECT_ID` or using a local override. The function serves at `http://localhost:54321/functions/v1/make-server-3fa6479f`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Failed to fetch" in browser | Edge Function not deployed, or wrong project ID in `.env` |
| 500 from Edge Function | Check secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) |
| Empty comments | KV table missing or wrong name; verify `kv_store_3fa6479f` exists |
| CORS errors | Edge Function uses Supabase CORS headers; ensure you're calling via Next.js `/api/comments` (same-origin) |
