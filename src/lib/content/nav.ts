import { readContentJson } from "./live-source";

export type NavItem = {
  label: string;
  path?: string;
  href?: string;
  /** When true: the link is dropped from all public menus AND the route 404s. */
  hidden?: boolean;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Work", path: "/work" },
  { label: "Craft", path: "/craft" },
  { label: "Writing", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Now", path: "/now" },
];

/** Raw nav, including hidden items — for the admin editor and route gating. */
async function readNav(): Promise<NavItem[]> {
  try {
    const parsed = await readContentJson<NavItem[]>("nav.json");
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_NAV;
    return parsed.filter((item) => item?.label && (item.path || item.href));
  } catch {
    return DEFAULT_NAV;
  }
}

/**
 * Public nav. Hidden items are stripped by default so they vanish from the
 * sidebar, mobile navbar, and footer in one place. Pass `includeHidden` for
 * the admin editor.
 */
export async function getNav(options?: { includeHidden?: boolean }): Promise<NavItem[]> {
  const all = await readNav();
  if (options?.includeHidden) return all;
  return all.filter((item) => !item.hidden);
}

/** Internal `path`s flagged hidden, e.g. ["/blog"]. External `href`s are ignored. */
export async function getHiddenNavPaths(): Promise<string[]> {
  const all = await readNav();
  return all
    .filter((item) => item.hidden && item.path && item.path.startsWith("/"))
    .map((item) => item.path as string);
}

/**
 * True when `pathname` belongs to a hidden page — the page itself or anything
 * nested under it (so hiding `/blog` also hides `/blog/[slug]` and series).
 * The home route (`/`) is never treated as hideable.
 */
export async function isPathHidden(pathname: string): Promise<boolean> {
  const hidden = await getHiddenNavPaths();
  return hidden.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`))
  );
}
