# Content system — first principles (portfolio)

This repo treats **Git-tracked JSON** as the live content store for the public site, with **two primary files** you edit from Admin:

| File | Purpose |
|------|---------|
| `content/projects.json` | **Work index** — cards on `/work`, homepage work section, about. Fields: title, blurb, **`image`**, **`slug`**, `status`. |
| `content/case-studies.json` | **Long reads** — `/work/[slug]` slide decks. Same **`slug`** joins a card to its story. |

**Code** under `src/data/case-studies/*.ts` seeds cases that have **no** JSON row yet. As soon as Admin saves a slug, **JSON owns that story**.

---

## Truth → UI (one chain)

1. **Server** loads JSON (GitHub API, then **public raw fallback**, then local `content/` for dev).
2. **`getCaseStudies`** merges JSON over the TS registry, normalizes **status**, filters **draft/archived** for public routes.
3. **`getProjects`** filters **project** rows, then drops tiles whose **`slug`** matches a **draft/archived case study** so you do not need double-archive.
4. **`/work/[slug]`** resolves the study from the same `getCaseStudies` pipeline.

If **step 1 fails** (network, wrong branch, missing file), you silently fall back to **bundled TS + `defaults.ts`** — **Admin changes vanish** until reads succeed. That is the #1 “nothing I do works” failure mode.

---

## Production reads `main` content (by design)

On **Vercel production**, public raw fetches use **`main`** for `content/*.json` unless you set `GITHUB_CONTENT_BRANCH`.  

Reason: Admin commits land on **`main`**; tying runtime reads to the **deploy commit** made archives and images appear “stuck” until a new deploy.

Preview builds still follow the **preview branch** ref (or override with `GITHUB_CONTENT_BRANCH`).

---

## Images on tiles vs inside the case study

- **Tile** (`/work` list): uses **`projects.json` → `image`**, with a server helper that can borrow **`meta.cover`** or the **first Cover slide `heroImage`** from the case study when the tile URL is still a placeholder.
- **Inside the story**: slide fields (`heroImage`, `image`, etc.).

If you only paste the URL in **one** place, prefer **both** meta cover and Cover slide hero, or set **Projects → image** explicitly.

---

## Archived still visible — checklist

1. **Save** in Admin (GitHub must contain `status: "archived"` for that study).
2. **Production** must run code that **does not resurrect** bundled TS for that slug (see `getCaseStudies` rescue guard).
3. **`projects.json`** row: either **archive the project** or rely on **slug match** to hide the tile when the **case study** is archived.
4. **Do not** trust old homepage files: `homepage-data.ts` / `V2_PROJECTS` **defaults** are fallbacks for **legacy variations**; **Synthesis + PageBuilder** use server `getProjects()`.

---

## Performance note

`getCaseStudies` uses **`React.cache`** so a single request does **one** merge of `case-studies.json` even when `/work` hydration and filters call it multiple times (Vercel **server-cache-react** pattern).
