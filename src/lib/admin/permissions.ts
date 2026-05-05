import type { AdminRole } from "@/lib/admin/auth";

export type AdminCapability =
  | "monitoring"
  | "bookmarks"
  | "growth_os"
  | "contacts"
  | "comments";

const CONTENT_MANAGER_ALLOWED_ADMIN_PREFIXES = [
  "/admin",
  "/admin/blog",
  "/admin/case-studies",
  "/admin/media",
  "/admin/testimonials",
  "/admin/projects",
  "/admin/copy",
  "/admin/now",
  "/admin/contacts",
  "/admin/comments",
];

const CONTENT_MANAGER_ALLOWED_CONTENT_PATHS = new Set<string>([
  "content/blog.json",
  "content/blog-categories.json",
  "content/blog-series.json",
  "content/case-studies.json",
  "content/media.json",
  "content/craft.json",
  "content/explorations.json",
  "content/testimonials.json",
  "content/projects.json",
  "content/copy.json",
  "content/now.json",
]);

const CONTENT_MANAGER_CAPABILITIES = new Set<AdminCapability>([
  "contacts",
  "comments",
]);

function startsWithPrefix(pathname: string, prefix: string): boolean {
  if (prefix === "/admin") return pathname === "/admin";
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function canAccessAdminPath(role: AdminRole, pathname: string): boolean {
  if (role === "owner") return true;
  return CONTENT_MANAGER_ALLOWED_ADMIN_PREFIXES.some((prefix) => startsWithPrefix(pathname, prefix));
}

export function canWriteContentPath(role: AdminRole, path: string): boolean {
  if (role === "owner") return true;
  return CONTENT_MANAGER_ALLOWED_CONTENT_PATHS.has(path);
}

export function hasAdminCapability(role: AdminRole, capability: AdminCapability): boolean {
  if (role === "owner") return true;
  return CONTENT_MANAGER_CAPABILITIES.has(capability);
}

