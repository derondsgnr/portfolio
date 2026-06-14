export type AdminRecentEditor = {
  section: "blog" | "case-studies" | "projects" | "testimonials" | "services";
  label: string;
  href: string;
  updatedAt: number;
};

const RECENT_EDITOR_KEY = "admin:recent-editor";

export function rememberAdminEditor(entry: Omit<AdminRecentEditor, "updatedAt">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    RECENT_EDITOR_KEY,
    JSON.stringify({ ...entry, updatedAt: Date.now() } satisfies AdminRecentEditor)
  );
}

export function getRememberedAdminEditor(): AdminRecentEditor | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_EDITOR_KEY) ?? "null") as AdminRecentEditor | null;
    if (!parsed?.href || !parsed.label || !parsed.section) return null;
    return parsed;
  } catch {
    window.localStorage.removeItem(RECENT_EDITOR_KEY);
    return null;
  }
}
