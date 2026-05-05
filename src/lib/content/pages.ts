import { readContentJson } from "./live-source";

export type PageSectionConfig = {
  id: string;
  variation: string;
  overrides?: Record<string, unknown>;
};

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
    const parsed = await readContentJson<PagesConfig>("pages.json");
    if (!parsed) throw new Error("missing pages config");
    const config = parsed[page];
    if (config?.sections?.length) return config;
    if (config) return { sections: config.sections ?? [] };
  } catch {
    // fall through
  }
  if (page === "homepage") return DEFAULT_HOMEPAGE;
  return { sections: [] };
}

/** Returns full pages config for admin layout builder. */
export async function getPagesConfig(): Promise<PagesConfig> {
  try {
    const parsed = await readContentJson<PagesConfig>("pages.json");
    if (!parsed) throw new Error("missing pages config");
    return {
      homepage: parsed.homepage ?? DEFAULT_HOMEPAGE,
      work: parsed.work ?? { sections: [] },
      about: parsed.about ?? { sections: [] },
      craft: parsed.craft ?? { sections: [] },
    };
  } catch {
    return {
      homepage: DEFAULT_HOMEPAGE,
      work: { sections: [] },
      about: { sections: [] },
      craft: { sections: [] },
    };
  }
}
