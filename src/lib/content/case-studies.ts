import { readFile } from "fs/promises";
import path from "path";
import type { CaseStudy } from "@/types/case-study";
import { ALL_CASE_STUDIES as STATIC_CASE_STUDIES } from "@/data/case-studies";

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

export async function getCaseStudies(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CaseStudy[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  let base: CaseStudy[] = STATIC_CASE_STUDIES.map(normalizeCaseStudy);
  try {
    const filePath = path.join(process.cwd(), "content", "case-studies.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as CaseStudy[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      base = parsed.map(normalizeCaseStudy);
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

  return sortCaseStudies(filtered);
}

export async function getCaseStudyBySlug(
  slug: string,
  options?: { includeDrafts?: boolean; includeArchived?: boolean }
): Promise<CaseStudy | undefined> {
  const studies = await getCaseStudies(options);
  return studies.find((study) => study.slug === slug);
}
