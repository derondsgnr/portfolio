import type { CaseStudy } from "@/types/case-study";
import { cache } from "react";
import { ALL_CASE_STUDIES as STATIC_CASE_STUDIES } from "@/data/case-studies";
import { isPlaceholderRemoteImage } from "./placeholder-remote-image";
import { readContentJson } from "./live-source";

function normalizeCaseStudyStatus(
  raw: CaseStudy["status"] | string | undefined
): "published" | "draft" | "archived" {
  if (raw === "draft" || raw === "archived") return raw;
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    if (s === "draft" || s === "archived") return s;
  }
  return "published";
}

/**
 * Admin often updates `meta.cover` first; the opening cover slide still reads `heroImage`.
 * When meta has a real asset URL and the slide uses a placeholder, show the uploaded image everywhere.
 */
function hydrateCoverSlidesFromMetaCover(study: CaseStudy): CaseStudy {
  const metaCover =
    typeof study.meta?.cover === "string" ? study.meta.cover.trim() : "";
  if (!metaCover || isPlaceholderRemoteImage(metaCover)) return study;

  const acts = study.acts.map((act) => ({
    ...act,
    slides: act.slides.map((slide) => {
      if (slide.type !== "cover") return slide;
      const hi = slide.heroImage?.trim() ?? "";
      if (hi && !isPlaceholderRemoteImage(hi)) return slide;
      return { ...slide, heroImage: metaCover };
    }),
  }));
  return { ...study, acts };
}

function normalizeCaseStudy(study: CaseStudy): CaseStudy {
  return hydrateCoverSlidesFromMetaCover({
    ...study,
    status: normalizeCaseStudyStatus(study.status),
    featured: study.featured ?? false,
    pinned: study.pinned ?? false,
  });
}

function sortCaseStudies(items: CaseStudy[]): CaseStudy[] {
  return [...items].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return Number(b.meta.year) - Number(a.meta.year);
  });
}

/**
 * Merge persisted JSON (GitHub `content/case-studies.json`) over the code registry.
 * For each slug present in JSON, the **saved payload wins in full** — copy, slides, and images.
 * Code-only slugs (not in JSON) still appear from `/src/data/case-studies`.
 */
export function mergeCaseStudiesOverlay(local: CaseStudy[], overlay: unknown): CaseStudy[] {
  if (!Array.isArray(overlay)) return local;
  const map = new Map<string, CaseStudy>();
  for (const s of local) {
    map.set(s.slug, normalizeCaseStudy(s));
  }
  for (const item of overlay) {
    if (item && typeof item === "object" && "slug" in item && typeof (item as CaseStudy).slug === "string") {
      const cs = item as CaseStudy;
      map.set(cs.slug, normalizeCaseStudy(cs));
    }
  }
  return sortCaseStudies(Array.from(map.values()));
}

/** One filesystem/GitHub merge per request — dedupes nested `getCaseStudies` callers. */
const loadCaseStudiesMergedOnce = cache(async (): Promise<CaseStudy[]> => {
  let base: CaseStudy[] = STATIC_CASE_STUDIES.map(normalizeCaseStudy);
  try {
    const parsed = await readContentJson<CaseStudy[]>("case-studies.json");
    if (Array.isArray(parsed)) {
      base = mergeCaseStudiesOverlay(base, parsed);
    }
  } catch {
    // Keep bundled registry only.
  }
  return base;
});

/**
 * Canonical list from `/src/data/case-studies` (what ships in git).
 * Admin merges persisted JSON over this—call this seed first so new code-only studies
 * cannot disappear when the loader ever returns GitHub-only data.
 */
export function seedCaseStudiesFromRegistry(): CaseStudy[] {
  return STATIC_CASE_STUDIES.map(normalizeCaseStudy);
}

export async function getCaseStudies(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CaseStudy[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  const base = await loadCaseStudiesMergedOnce();

  /** Pre-filter merged status — used so we never resurrect static TS when GitHub hides a slug */
  const mergedStatusBySlug = new Map<string, "published" | "draft" | "archived">(
    base.map((study) => [study.slug, normalizeCaseStudyStatus(study.status)])
  );

  const filtered = base.filter((study) => {
    const status = normalizeCaseStudyStatus(study.status);
    if (!includeArchived && status === "archived") return false;
    if (!includeDrafts && status === "draft") return false;
    return true;
  });

  /** Re-add code-only published studies if GitHub overlay downgraded them to draft (avoids public 404). */
  if (!includeDrafts) {
    const seen = new Set(filtered.map((s) => s.slug));
    for (const raw of STATIC_CASE_STUDIES) {
      const s = normalizeCaseStudy(raw);
      if (seen.has(s.slug)) continue;

      /** JSON explicitly archived or drafted this slug — do not bring back bundled TS publish. */
      const mergedStatus = mergedStatusBySlug.get(s.slug);
      if (mergedStatus === "draft" || mergedStatus === "archived") {
        continue;
      }

      const status = normalizeCaseStudyStatus(s.status);
      if (status === "archived" && !includeArchived) continue;
      if (status === "draft") continue;
      filtered.push(s);
      seen.add(s.slug);
    }
  }

  return sortCaseStudies(filtered);
}

export async function getCaseStudyBySlug(
  slug: string,
  options?: { includeDrafts?: boolean; includeArchived?: boolean }
): Promise<CaseStudy | undefined> {
  const studies = await getCaseStudies(options);
  return studies.find((study) => study.slug === slug);
}
