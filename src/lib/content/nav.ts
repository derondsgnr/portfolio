import { readFile } from "fs/promises";
import path from "path";

export type NavItem = {
  label: string;
  path?: string;
  href?: string;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Work", path: "/work" },
  { label: "Craft", path: "/craft" },
  { label: "About", path: "/about" },
  { label: "Now", path: "/now" },
];

export async function getNav(): Promise<NavItem[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "nav.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as NavItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_NAV;
    return parsed.filter((item) => item?.label && (item.path || item.href));
  } catch {
    return DEFAULT_NAV;
  }
}
