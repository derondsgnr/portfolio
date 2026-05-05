import { readFile } from "fs/promises";
import path from "path";
import { getGitHubFile } from "@/lib/admin/github";

export async function readContentJson<T>(filename: string): Promise<T | null> {
  const contentPath = `content/${filename}`;

  try {
    const fromGitHub = await getGitHubFile(contentPath);
    if (fromGitHub?.content) {
      return JSON.parse(fromGitHub.content) as T;
    }
  } catch {
    // Fall through to local filesystem snapshot.
  }

  try {
    const filePath = path.join(process.cwd(), "content", filename);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

