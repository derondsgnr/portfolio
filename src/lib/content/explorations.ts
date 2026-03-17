import { readFile } from "fs/promises";
import path from "path";
import { V2_EXPLORATIONS } from "@/components/v2/v2-data";

export type Exploration = {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  image: string;
  tools: string[];
  date: string;
};

export async function getExplorations(): Promise<Exploration[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "explorations.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return V2_EXPLORATIONS;
    return parsed as Exploration[];
  } catch {
    return V2_EXPLORATIONS;
  }
}
