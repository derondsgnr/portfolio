import { readContentJson } from "./live-source";

export type NavItem = {
  label: string;
  path?: string;
  href?: string;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Work", path: "/work" },
  { label: "Craft", path: "/craft" },
  { label: "Writing", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Now", path: "/now" },
];

export async function getNav(): Promise<NavItem[]> {
  try {
    const parsed = await readContentJson<NavItem[]>("nav.json");
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_NAV;
    return parsed.filter((item) => item?.label && (item.path || item.href));
  } catch {
    return DEFAULT_NAV;
  }
}
