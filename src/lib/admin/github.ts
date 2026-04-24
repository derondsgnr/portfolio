const GITHUB_API = "https://api.github.com";

type GitHubFile = {
  content: string;
  sha?: string;
};

function humanizeGitHubError(status: number, message?: string): string {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("bad credentials") || status === 401) {
    return "Admin save failed because the configured GitHub token is invalid or expired. Update GITHUB_TOKEN in Vercel (and locally if you are testing there), then try again.";
  }

  if (normalized.includes("resource not accessible by personal access token")) {
    return "Admin save failed because the configured GitHub token does not have permission to update this repo. Grant repo contents write access, then try again.";
  }

  if (normalized.includes("not found")) {
    return "Admin save failed because the GitHub repo settings are incorrect or the token cannot access this repository.";
  }

  if (status === 403) {
    return "Admin save failed because GitHub denied access. Check the token permissions and repo settings, then try again.";
  }

  if (status >= 500) {
    return "GitHub is unavailable right now. Try again in a moment.";
  }

  return message || "GitHub save failed. Check the token and repo settings, then try again.";
}

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
    return {
      ok: false,
      error: "Admin saves are not configured because GITHUB_TOKEN is missing in this environment.",
    };
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
    return { ok: false, error: humanizeGitHubError(res.status, (err as { message?: string }).message || res.statusText) };
  }

  return { ok: true };
}
