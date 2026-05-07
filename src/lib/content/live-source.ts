import { readFile } from "fs/promises";
import path from "path";
import { getGitHubFile } from "@/lib/admin/github";

/**
 * Reads `content/{filename}` via raw.githubusercontent.com — no PAT. Works when the repo is public
 * and fixes production when `GITHUB_TOKEN` is missing from the runtime env (still required for saves).
 */
async function readPublicRawRepoContent<T>(contentPath: string): Promise<T | null> {
  if (process.env.DISABLE_PUBLIC_GITHUB_RAW === "1") return null;

  const owner = process.env.GITHUB_REPO_OWNER || "derondsgnr";
  const repo = process.env.GITHUB_REPO_NAME || "portfolio";
  const branch =
    process.env.GITHUB_CONTENT_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    "main";
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${contentPath}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return JSON.parse(await res.text()) as T;
  } catch {
    return null;
  }
}

export async function readContentJson<T>(filename: string): Promise<T | null> {
  const contentPath = `content/${filename}`;

  try {
    const fromGitHub = await getGitHubFile(contentPath);
    if (fromGitHub?.content) {
      return JSON.parse(fromGitHub.content) as T;
    }
  } catch {
    // Fall through to public raw and local filesystem snapshots.
  }

  const fromRaw = await readPublicRawRepoContent<T>(contentPath);
  if (fromRaw !== null) return fromRaw;

  try {
    const filePath = path.join(process.cwd(), "content", filename);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

