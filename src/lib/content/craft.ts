import { readFile } from "fs/promises";
import path from "path";
import { V2_CRAFT_ITEMS } from "@/components/v2/v2-data";

export type CraftItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

export async function getCraftItems(): Promise<CraftItem[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "craft.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return V2_CRAFT_ITEMS;
    return parsed as CraftItem[];
  } catch {
    return V2_CRAFT_ITEMS;
  }
}
