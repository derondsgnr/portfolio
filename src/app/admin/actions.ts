"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createAdminSession, getAdminCookieName, getAdminCookieValue, verifyAdminSession } from "@/lib/admin/auth";
import { updateGitHubFile, getGitHubFile } from "@/lib/admin/github";

async function requireAdmin() {
  const ok = await verifyAdminSession();
  if (!ok) throw new Error("Unauthorized");
}

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password) return { error: "Password required" };

  const valid = await createAdminSession(password);
  if (!valid) return { error: "Invalid password" };

  const token = await getAdminCookieValue();
  if (!token) return { error: "Config error" };

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  redirect("/admin/login");
}

export async function saveContent(
  path: string,
  content: string,
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const existing = await getGitHubFile(path);
  const sha = existing?.sha;
  return updateGitHubFile(path, content, sha, message);
}

export async function loadContent(path: string): Promise<string | null> {
  const result = await getGitHubFile(path);
  return result?.content ?? null;
}

export async function saveProjects(projects: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(projects, null, 2);
  return saveContent("content/projects.json", content, message ?? "Update projects");
}

export async function saveCopy(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/copy.json", content, message ?? "Update site copy");
}

export async function savePagesConfig(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/pages.json", content, message ?? "Update page layout");
}

export async function saveTheme(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/theme.json", content, message ?? "Update theme");
}

export async function saveNav(data: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/nav.json", content, message ?? "Update nav");
}

export async function saveGlobal(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/global.json", content, message ?? "Update global");
}

export async function saveMedia(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/media.json", content, message ?? "Update media");
}

export async function saveCraftItems(items: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(items, null, 2);
  return saveContent("content/craft.json", content, message ?? "Update craft items");
}

export async function saveExplorations(items: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(items, null, 2);
  return saveContent("content/explorations.json", content, message ?? "Update explorations");
}

export async function saveTestimonials(items: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(items, null, 2);
  return saveContent("content/testimonials.json", content, message ?? "Update testimonials");
}

export async function saveSounds(data: Record<string, string>, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/sounds.json", content, message ?? "Update sounds");
}

/** Blog post — read existing blog.json, upsert post by slug, persist via GitHub */
export async function saveBlogPost(
  slug: string,
  data: unknown,
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  // Read existing posts, upsert, and save
  let posts: Record<string, unknown>[] = [];
  try {
    const existing = await getGitHubFile("content/blog.json");
    if (existing) {
      const parsed = JSON.parse(existing.content);
      if (Array.isArray(parsed)) posts = parsed;
    }
  } catch { /* first save — start fresh */ }
  const idx = posts.findIndex((p) => (p as { slug?: string }).slug === slug);
  if (idx >= 0) posts[idx] = data as Record<string, unknown>;
  else posts.push(data as Record<string, unknown>);
  const content = JSON.stringify(posts, null, 2);
  return saveContent("content/blog.json", content, message ?? "Update blog post");
}

/** Blog categories — persist to content/blog-categories.json via GitHub */
export async function saveBlogCategories(
  categories: string[],
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(categories, null, 2);
  return saveContent("content/blog-categories.json", content, message ?? "Update blog categories");
}

/** Blog series — persist to content/blog-series.json via GitHub */
export async function saveBlogSeries(
  series: unknown[],
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(series, null, 2);
  return saveContent("content/blog-series.json", content, message ?? "Update blog series");
}

/** Now page config — persist to content/now.json via GitHub */
export async function saveNow(data: unknown, message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(data, null, 2);
  return saveContent("content/now.json", content, message ?? "Update now page");
}

// ─── Supabase KV helpers (comments & bookmarks) ─────────────────
const KV_TABLE = "kv_store_3fa6479f";

function supabaseAdmin() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectId || !serviceKey) return null;
  return { url: `https://${projectId}.supabase.co`, key: serviceKey };
}

async function kvGetByPrefix(prefix: string): Promise<{ key: string; value: unknown }[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];
  const res = await fetch(`${sb.url}/rest/v1/${KV_TABLE}?key=like.${encodeURIComponent(prefix + "%")}&select=key,value`, {
    headers: { apikey: sb.key, Authorization: `Bearer ${sb.key}` },
  });
  if (!res.ok) return [];
  return res.json();
}

async function kvSet(key: string, value: unknown): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  const res = await fetch(`${sb.url}/rest/v1/${KV_TABLE}`, {
    method: "POST",
    headers: {
      apikey: sb.key, Authorization: `Bearer ${sb.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({ key, value }),
  });
  return res.ok;
}

async function kvDelete(key: string): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  const res = await fetch(`${sb.url}/rest/v1/${KV_TABLE}?key=eq.${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: { apikey: sb.key, Authorization: `Bearer ${sb.key}` },
  });
  return res.ok;
}

/** Fetch all comments from Supabase KV */
export async function fetchAllComments(): Promise<{ ok: boolean; comments: unknown[]; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, comments: [], error: "Unauthorized" };
  }
  const rows = await kvGetByPrefix("comment:");
  const comments = rows.map((r) => ({ ...(r.value as Record<string, unknown>), _kvKey: r.key }));
  return { ok: true, comments };
}

/** Update a comment's status in KV */
export async function updateCommentStatus(kvKey: string, status: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const rows = await kvGetByPrefix(kvKey.slice(0, kvKey.length));
  const row = rows.find((r) => r.key === kvKey);
  if (!row) return { ok: false, error: "Comment not found" };
  const updated = { ...(row.value as Record<string, unknown>), status };
  const success = await kvSet(kvKey, updated);
  return success ? { ok: true } : { ok: false, error: "Failed to update" };
}

/** Delete a comment from KV */
export async function deleteComment(kvKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const success = await kvDelete(kvKey);
  return success ? { ok: true } : { ok: false, error: "Failed to delete" };
}

/** Fetch all bookmarks from Supabase KV */
export async function fetchAllBookmarks(): Promise<{ ok: boolean; bookmarks: unknown[]; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, bookmarks: [], error: "Unauthorized" };
  }
  const rows = await kvGetByPrefix("bookmark:");
  const bookmarks = rows.map((r) => r.value);
  return { ok: true, bookmarks };
}

/** Save a bookmark to Supabase KV */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveBookmark(bookmark: any): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const success = await kvSet(`bookmark:${bookmark.id}`, bookmark);
  return success ? { ok: true } : { ok: false, error: "Failed to save" };
}

/** Delete a bookmark from Supabase KV */
export async function deleteBookmark(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const success = await kvDelete(`bookmark:${id}`);
  return success ? { ok: true } : { ok: false, error: "Failed to delete" };
}

/** Case studies — persist to content/case-studies.json via GitHub */
export async function saveCaseStudies(studies: unknown[], message?: string): Promise<{ ok: boolean; error?: string }> {
  const content = JSON.stringify(studies, null, 2);
  return saveContent("content/case-studies.json", content, message ?? "Update case studies");
}
