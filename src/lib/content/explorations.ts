import { DEFAULT_EXPLORATIONS } from "./defaults";
import { readContentJson } from "./live-source";

export type Exploration = {
  id: string;
  title: string;
  category: string;
  type: "image" | "video" | "lottie";
  image: string;
  videoUrl?: string;
  lottieUrl?: string;
  tools: string[];
  date: string;
  description?: string;
  status?: "published" | "draft" | "archived";
  width?: number;
  height?: number;
};

export async function getExplorations(): Promise<Exploration[]> {
  try {
    const parsed = await readContentJson<unknown>("explorations.json");
    if (!Array.isArray(parsed)) return DEFAULT_EXPLORATIONS;
    return (parsed as Exploration[]).filter(
      (e) => !e.status || e.status === "published"
    );
  } catch {
    return DEFAULT_EXPLORATIONS;
  }
}
