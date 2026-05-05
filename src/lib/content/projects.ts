import { DEFAULT_PROJECTS } from "./defaults";
import { readContentJson } from "./live-source";

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  slug: string;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
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

export async function getProjects(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<Project[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

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
    return sortProjects(filtered);
  } catch {
    const normalized = DEFAULT_PROJECTS.map((project) => normalizeProject(project as Project));
    const filtered = normalized.filter((project) => {
      const status = project.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    return sortProjects(filtered);
  }
}
