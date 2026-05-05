import type { BlogCategory } from "@/types/blog";
import { readContentJson } from "@/lib/content/live-source";

const DEFAULT_CATEGORIES: BlogCategory[] = [
  "Thinking",
  "Craft",
  "Process",
  "Case Notes",
  "Tools",
  "Industry",
  "Life",
];

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const parsed = await readContentJson<string[]>("blog-categories.json");
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORIES;
    return parsed as BlogCategory[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
