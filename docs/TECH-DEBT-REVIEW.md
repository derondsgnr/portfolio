# Tech Debt & Performance Review

Audit against [Vercel React Best Practices](https://github.com/vercel/react-best-practices). Prioritized by impact.

---

## CRITICAL — Async Waterfalls (`async-parallel`)

### Admin pages: sequential GitHub + local fetches

**Pattern:** Most admin pages await `getGitHubFile`, then conditionally await `getNav()` / `getNow()` / etc. when GitHub has no content or parse fails. This creates a waterfall: 2 round-trips when both are needed.

**Affected:**
- `admin/(dashboard)/nav/page.tsx`
- `admin/(dashboard)/now/page.tsx` — `getNow()` then `getGitHubFile()` (both always needed for merge)
- `admin/(dashboard)/sounds/page.tsx` — `getSounds()` then `getGitHubFile()`
- `admin/(dashboard)/meta/page.tsx`
- `admin/(dashboard)/theme/page.tsx`
- `admin/(dashboard)/copy/page.tsx`
- `admin/(dashboard)/projects/page.tsx`
- `admin/(dashboard)/global/page.tsx`
- `admin/(dashboard)/integrations/page.tsx`
- `admin/(dashboard)/layout-builder/page.tsx`

**Fix:** Run both in parallel, then merge:

```ts
// Before (waterfall)
const gh = await getGitHubFile("content/now.json");
let initial = await getNow();
if (gh?.content) { initial = { ...initial, ...JSON.parse(gh.content) }; }

// After (parallel)
const [gh, local] = await Promise.all([
  getGitHubFile("content/now.json"),
  getNow(),
]);
const initial = gh?.content ? { ...local, ...JSON.parse(gh.content) } : local;
```

**Media page:** Already uses `Promise.all` for 3 GitHub fetches. The fallback `getMedia()` / `getCraftItems()` / `getExplorations()` calls are still sequential within the branches. Pre-fetch all 6 (3 GH + 3 local) in parallel, then select per resource.

---

## CRITICAL — Bundle Size (`bundle-dynamic-imports`, `bundle-conditional`)

### No `next/dynamic` for heavy trees

**Affected:**
- `SectionRenderer` / `section-registry` — loads all v2 variation components (void, signal, cipher, drift, echo, fracture, gravity, synthesis) even when only one section is used.
- `BlogReader` — large component with synthesis-pages, explorations gallery, etc.
- `PageBuilder` — pulls in full section-registry and texture layers on every homepage load.
- `layout-builder-form` — uses `SECTION_OPTIONS` (lightweight) but the page may load other heavy admin components.

**Fix:**
1. Use `next/dynamic` for `BlogReader` on blog post page.
2. For `SectionRenderer`, consider lazy-loading sections per key (dynamic import per variation) so only used sections are in the bundle.
3. `PageBuilder` could dynamically import `SectionRenderer` after loader completes.

---

## HIGH — Architecture / Data Redundancy

### Inverted dependency: `lib/content` → `components/v2`

**Files:**
- `lib/content/projects.ts` imports `V2_PROJECTS` from `@/components/v2/v2-data`
- `lib/content/craft.ts` imports `V2_CRAFT_ITEMS` from `@/components/v2/v2-data`
- `lib/content/explorations.ts` imports `V2_EXPLORATIONS` from `@/components/v2/v2-data`

**Problem:** Content loaders live in `lib/` but depend on UI-layer data. This couples server/content logic to the component tree and can cause unexpected bundles.

**Fix:** Single source of truth in `content/` or `data/`:
- `content/projects.json` already exists and mirrors `V2_PROJECTS`. Use it as canonical. `getProjects()` should only read from `content/`; fallback can be a minimal default in `lib/content/defaults.ts`.
- `v2-data.ts` should import from `lib/content` or shared data module, not the other way around.

### Duplicate data: projects, craft, explorations

`content/projects.json` and `V2_PROJECTS` in `v2-data.ts` are duplicated. Same for craft and explorations. Consolidate to `content/*.json` as source; `v2-data` re-exports or components consume via `getProjects()` etc.

---

## MEDIUM — Barrel Imports (`bundle-barrel-imports`)

### design-system + admin-primitives double layer

- Admin forms import from `@/components/admin/admin-primitives` (formCx, FormField, etc.).
- `admin-primitives` re-exports from `@/design-system`.
- Some files (e.g. `theme-form`) import directly from `@/design-system` using `formCx`.

**Fix:** Standardize on one entry point. Either:
1. Admin imports directly from `@/design-system` (or `@/design-system/molecules/form-field`, etc.) for better tree-shaking, or
2. Keep `admin-primitives` as the admin-only facade but ensure all admin code uses it (remove `formCx` imports from design-system in admin).

### Barrel files

- `design-system/index.ts` — acceptable as main DS entry; consider direct subpath imports for heavy consumers.
- `data/case-studies/index.ts` — aggregates case studies; fine for data.
- `components/v2/sections/index.ts` — **unused** after section-registry was updated to direct imports. Can be removed or kept for potential future use.

---

## MEDIUM — Redundancy

### adminCx vs formCx

`adminCx` is an alias for `formCx` in `admin-primitives`. Both refer to the same styles. Pick one name and use it consistently (e.g. `formCx` everywhere, or rename to `adminCx` if that's clearer in admin context).

### Repeated GitHub-first + local fallback pattern

Every admin page repeats:

```ts
const gh = await getGitHubFile("content/X.json");
if (gh?.content) {
  try { initial = merge(JSON.parse(gh.content), base); }
  catch { initial = await getLocal(); }
} else {
  initial = await getLocal();
}
```

**Fix:** Extract a helper, e.g. `getContentWithGitHubOverlay<T>(path, getLocal, merge)` to reduce duplication and centralize error handling.

---

## LOW — Server-Side

### actions.ts: sequential in saveContent

```ts
const existing = await getGitHubFile(path);  // for sha
// ...
return updateGitHubFile(path, content, sha, message);
```

`updateGitHubFile` is a separate call; the sequence is required (need sha before update). No change needed unless batching GitHub ops becomes possible.

### React.cache / dedup

`getProjects()`, `getNav()`, etc. are called from multiple pages. Next.js and React cache some of this, but explicit `React.cache()` on read helpers could reduce duplicate reads within a request. Lower priority.

---

## Summary Table

| Priority | Issue | Rule | Effort |
|----------|-------|------|--------|
| Critical | Admin page fetch waterfalls | async-parallel | Medium |
| Critical | No dynamic import for BlogReader, PageBuilder, SectionRenderer | bundle-dynamic-imports | Medium |
| High | lib/content imports from components/v2 | Architecture | Medium |
| High | Duplicate projects/craft/explorations data | DRY | Medium |
| Medium | Double barrel (admin-primitives) | bundle-barrel-imports | Low |
| Medium | adminCx/formCx inconsistency | Consistency | Low |
| Medium | Repeated GitHub+local pattern | DRY | Low |
| Low | React.cache for content loaders | server-cache-react | Low |

---

## Recommended Order of Fixes

1. **Parallelize admin fetches** — High impact, low risk. Add a shared `getContentWithGitHubOverlay` helper.
2. **Fix data architecture** — Move default projects/craft/explorations to `lib/content/defaults` or ensure `content/*.json` is canonical; have `v2-data` consume from there.
3. **Add next/dynamic** for BlogReader and SectionRenderer.
4. **Standardize formCx/adminCx** and remove redundant barrel where possible.
