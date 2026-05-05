import { DEFAULT_EXPLORATIONS } from "./defaults";
import { readContentJson } from "./live-source";

export type Exploration = {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  image: string;
  videoUrl?: string;
  tools: string[];
  date: string;
};

export async function getExplorations(): Promise<Exploration[]> {
  try {
    const parsed = await readContentJson<unknown>("explorations.json");
    if (!Array.isArray(parsed)) return DEFAULT_EXPLORATIONS;
    return parsed as Exploration[];
  } catch {
    return DEFAULT_EXPLORATIONS;
  }
}
