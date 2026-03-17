import { readFile } from "fs/promises";
import path from "path";

export type PageSectionConfig = { id: string; variation: string };

export type PageConfig = {
  sections: PageSectionConfig[];
};

export type PagesConfig = {
  homepage?: PageConfig;
  work?: PageConfig;
  about?: PageConfig;
  craft?: PageConfig;
};

const DEFAULT_HOMEPAGE: PageConfig = {
  sections: [
    { id: "hero", variation: "synthesis" },
    { id: "about", variation: "synthesis" },
    { id: "capabilities", variation: "synthesis" },
    { id: "process", variation: "synthesis" },
    { id: "work", variation: "synthesis" },
    { id: "philosophy", variation: "synthesis" },
    { id: "testimonials", variation: "synthesis" },
    { id: "cta", variation: "synthesis" },
  ],
};

export async function getPageConfig(page: keyof PagesConfig): Promise<PageConfig> {
  try {
    const filePath = path.join(process.cwd(), "content", "pages.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as PagesConfig;
    const config = parsed[page];
    if (config?.sections?.length) return config;
  } catch {
    // fall through
  }
  if (page === "homepage") return DEFAULT_HOMEPAGE;
  return { sections: [] };
}
