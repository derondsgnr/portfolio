import { readFile } from "fs/promises";
import path from "path";

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
    const filePath = path.join(process.cwd(), "content", "media.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<MediaConfig>;
    return {
      heroBackground: parsed?.heroBackground ?? DEFAULT.heroBackground,
      sectionBackgrounds: { ...DEFAULT.sectionBackgrounds, ...parsed?.sectionBackgrounds },
    };
  } catch {
    return DEFAULT;
  }
}
