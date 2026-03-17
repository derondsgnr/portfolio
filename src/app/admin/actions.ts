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

  redirect("/admin");
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
