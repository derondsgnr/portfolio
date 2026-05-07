import type { CaseStudy } from "@/types/case-study";
import { ALL_CASE_STUDIES as STATIC_CASE_STUDIES } from "@/data/case-studies";
import { readContentJson } from "./live-source";

function normalizeCaseStudy(study: CaseStudy): CaseStudy {
  return {
    ...study,
    status: study.status ?? "published",
    featured: study.featured ?? false,
    pinned: study.pinned ?? false,
  };
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
 * Merge persisted JSON (GitHub or content/case-studies.json) with the static registry by slug.
 * Persisted entry wins per slug; slugs that exist only in code remain listed.
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

export async function getCaseStudies(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CaseStudy[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  let base: CaseStudy[] = STATIC_CASE_STUDIES.map(normalizeCaseStudy);
  try {
    const parsed = await readContentJson<CaseStudy[]>("case-studies.json");
    if (Array.isArray(parsed)) {
      base = mergeCaseStudiesOverlay(base, parsed);
    }
  } catch {
    // Fallback to static case studies when content file is unavailable.
  }

  const filtered = base.filter((study) => {
    const status = study.status ?? "published";
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
      const status = s.status ?? "published";
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
