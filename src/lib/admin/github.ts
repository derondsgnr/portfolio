const GITHUB_API = "https://api.github.com";

type GitHubFile = {
  content: string;
  sha?: string;
};

export async function getGitHubFile(
  path: string
): Promise<{ content: string; sha: string } | null> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || "derondsgnr";
  const repo = process.env.GITHUB_REPO_NAME || "portfolio";

  if (!token) {
    console.warn("GITHUB_TOKEN not set");
    return null;
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { content?: string; sha?: string };
  if (!data.content) return null;

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha || "" };
}

export async function updateGitHubFile(
  path: string,
  content: string,
  sha?: string,
  message?: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || "derondsgnr";
  const repo = process.env.GITHUB_REPO_NAME || "portfolio";

  if (!token) {
    return { ok: false, error: "GITHUB_TOKEN not set" };
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  const body = {
    message: message || `Update ${path}`,
    content: Buffer.from(content, "utf-8").toString("base64"),
    ...(sha && { sha }),
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: (err as { message?: string }).message || res.statusText };
  }

  return { ok: true };
}
