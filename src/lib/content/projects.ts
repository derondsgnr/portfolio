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
  projectType?: "case-study" | "personal";
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
    const projectTypeBySlug = new Map<string, CaseStudy["projectType"]>();
    for (const cs of studies) {
      const url = bestCaseStudyCoverThumb(cs);
      if (url) coverBySlug.set(cs.slug, url);
      if (cs.projectType !== undefined) projectTypeBySlug.set(cs.slug, cs.projectType);
    }
    return projects.map((p) => {
      const updates: Partial<Project> = {};
      const fromStudy = coverBySlug.get(p.slug);
      // Always prefer the case study cover so admin cover updates propagate immediately.
      if (fromStudy) updates.image = fromStudy;
      const pt = projectTypeBySlug.get(p.slug);
      if (pt !== undefined) updates.projectType = pt;
      return Object.keys(updates).length > 0 ? { ...p, ...updates } : p;
    });
  } catch {
    return projects;
  }
}

/**
 * For any published case study that doesn't already have a row in projects.json,
 * synthesize a project tile so admin-created case studies appear in the work listing
 * without requiring a manual projects.json edit.
 */
async function synthesizeProjectsFromCaseStudies(
  existing: Project[],
  visibility: { includeDrafts?: boolean; includeArchived?: boolean }
): Promise<Project[]> {
  try {
    const studies = await getCaseStudies(visibility);
    const existingSlugs = new Set(existing.map((p) => p.slug));
    const synthetic: Project[] = [];
    for (const cs of studies) {
      if (existingSlugs.has(cs.slug)) continue;
      const thumb = bestCaseStudyCoverThumb(cs);
      synthetic.push(
        normalizeProject({
          id: cs.slug,
          title: cs.meta.title,
          category: cs.meta.tags?.[0] ?? "Design",
          year: cs.meta.year,
          description: cs.meta.summary ?? "",
          image: thumb ?? "",
          slug: cs.slug,
          status: cs.status ?? "published",
          featured: cs.featured ?? false,
          pinned: cs.pinned ?? false,
          projectType: cs.projectType,
        })
      );
    }
    return [...existing, ...synthetic];
  } catch {
    return existing;
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
    const merged = await synthesizeProjectsFromCaseStudies(filtered, visibility);
    let hydrated = await hydrateProjectImagesFromCaseStudies(merged, visibility);
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
