/**
 * Fetches GitHub + local content in parallel, merges GitHub overlay over local.
 * Eliminates async waterfalls in admin pages.
 */

import { getGitHubFile } from "./github";

export async function getContentWithGitHubOverlay<T>(
  path: string,
  getLocal: () => Promise<T>,
  merge: (local: T, parsed: unknown) => T
): Promise<T> {
  const [gh, local] = await Promise.all([getGitHubFile(path), getLocal()]);
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content);
      return merge(local, parsed);
    } catch {
      return local;
    }
  }
  return local;
}
