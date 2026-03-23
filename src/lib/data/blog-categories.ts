import { readFile } from "fs/promises";
import path from "path";
import type { BlogCategory } from "@/types/blog";

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
    const filePath = path.join(process.cwd(), "content", "blog-categories.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORIES;
    return parsed as BlogCategory[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
