import { readContentJson } from "./live-source";

export type MediaConfig = {
  heroBackground: string;
  sectionBackgrounds: Record<string, string>;
};

const DEFAULT: MediaConfig = {
  heroBackground: "",
  sectionBackgrounds: {},
};

export async function getMedia(): Promise<MediaConfig> {
  try {
    const parsed = await readContentJson<Partial<MediaConfig>>("media.json");
    if (!parsed) return DEFAULT;
    return {
      heroBackground: parsed?.heroBackground ?? DEFAULT.heroBackground,
      sectionBackgrounds: { ...DEFAULT.sectionBackgrounds, ...parsed?.sectionBackgrounds },
    };
  } catch {
    return DEFAULT;
  }
}
