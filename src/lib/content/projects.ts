import { getCaseStudies } from "./case-studies";
import { DEFAULT_PROJECTS } from "./defaults";
import { isPlaceholderRemoteImage } from "./placeholder-remote-image";
import { readContentJson } from "./live-source";
import type { CaseStudy } from "@/types/case-study";

/** Prefer meta cover, then first real Cover-slide hero (Admin often fills one but not the other). */
function bestCaseStudyCoverThumb(cs: CaseStudy): string | null {
  const meta = typeof cs.meta?.cover === "string" ? cs.meta.cover.trim() : "";
  if (meta && !isPlaceholderRemoteImage(meta)) return meta;

  for (const act of cs.acts) {
    for (const sl of act.slides) {
      if (sl.type !== "cover") continue;
      const hi = sl.heroImage?.trim() ?? "";
      if (hi && !isPlaceholderRemoteImage(hi)) return hi;
    }
  }
  return null;
}

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  slug: string;
  status?: "published" | "draft" | "archived";
  featured: boolean;
  pinned: boolean;
};

function normalizeProject(project: Project): Project {
  return {
    ...project,
    status: project.status ?? "published",
    featured: project.featured ?? false,
    pinned: project.pinned ?? false,
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return Number(b.year) - Number(a.year);
  });
}

/**
 * `/work` list/grid uses `projects.json` thumbnails; Case Studies overlay often has the real cover first.
 * When the project tile still shows a synthetic placeholder URL, reuse `meta.cover` from the matched study.
 */
async function hydrateProjectImagesFromCaseStudies(
  projects: Project[],
  visibility: { includeDrafts?: boolean; includeArchived?: boolean }
): Promise<Project[]> {
  try {
    const studies = await getCaseStudies(visibility);
    const coverBySlug = new Map<string, string>();
    for (const cs of studies) {
      const url = bestCaseStudyCoverThumb(cs);
      if (url) coverBySlug.set(cs.slug, url);
    }
    return projects.map((p) => {
      if (!isPlaceholderRemoteImage(p.image)) return p;
      const fromStudy = coverBySlug.get(p.slug);
      return fromStudy ? { ...p, image: fromStudy } : p;
    });
  } catch {
    return projects;
  }
}

/** Slugs with case studies hidden from the requested visibility (draft/archived filtered out). */
async function suppressedCaseStudySlugsForTiles(options: {
  includeDrafts: boolean;
  includeArchived: boolean;
}): Promise<Set<string>> {
  try {
    const wide = await getCaseStudies({
      includeDrafts: true,
      includeArchived: true,
    });
    return new Set(
      wide
        .filter((s) => {
          const st = (s.status ?? "published") as string;
          if (!options.includeArchived && st === "archived") return true;
          if (!options.includeDrafts && st === "draft") return true;
          return false;
        })
        .map((s) => s.slug)
    );
  } catch {
    return new Set();
  }
}

export async function getProjects(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<Project[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  const visibility = { includeDrafts, includeArchived };

  try {
    const parsed = await readContentJson<Project[]>("projects.json");
    const base = Array.isArray(parsed) ? parsed : DEFAULT_PROJECTS;
    const normalized = base.map(normalizeProject);
    const filtered = normalized.filter((project) => {
      const status = project.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    let hydrated = await hydrateProjectImagesFromCaseStudies(filtered, visibility);
    const hiddenCs = await suppressedCaseStudySlugsForTiles({
      includeDrafts,
      includeArchived,
    });
    hydrated = hydrated.filter((p) => !p.slug || !hiddenCs.has(p.slug));

    return sortProjects(hydrated);
  } catch {
    const normalized = DEFAULT_PROJECTS.map((project) =>
      normalizeProject(project as Project)
    );
    const filtered = normalized.filter((project) => {
      const status = project.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    let hydrated = await hydrateProjectImagesFromCaseStudies(filtered, visibility);
    const hiddenCs = await suppressedCaseStudySlugsForTiles({
      includeDrafts,
      includeArchived,
    });
    hydrated = hydrated.filter((p) => !p.slug || !hiddenCs.has(p.slug));

    return sortProjects(hydrated);
  }
}
