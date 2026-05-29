import type { ActivityEntry, ActivityType } from "@/lib/data/now-data";

/**
 * GITHUB ACTIVITY → NOW PAGE
 * ==========================
 * Pulls recent public GitHub events and maps them into Now-page activity
 * entries so the feed maintains itself. Read-only, cached, and best-effort:
 * any failure (no token, rate limit, network) returns [] so the loader can
 * fall back to manually-curated entries.
 */

const OWNER = process.env.GITHUB_REPO_OWNER || "derondsgnr";

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  // GitHub event payloads are loosely typed; we read a handful of fields.
  payload?: {
    size?: number;
    commits?: unknown[];
    action?: string;
    ref?: string;
    ref_type?: string;
    pull_request?: { title?: string; merged?: boolean };
    issue?: { title?: string };
    release?: { tag_name?: string };
  };
};

function shortRepo(name?: string): string {
  if (!name) return "a repo";
  const i = name.indexOf("/");
  return i >= 0 ? name.slice(i + 1) : name;
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export async function getGitHubActivity(limit = 14): Promise<ActivityEntry[]> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(
      `https://api.github.com/users/${OWNER}/events/public?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "derondsgnr-portfolio",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // Cache for 30 minutes so we don't hammer the API on every request.
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];
    const events: unknown = await res.json();
    if (!Array.isArray(events)) return [];

    // Collapse multiple pushes to the same repo on the same day into one entry.
    const pushAgg = new Map<string, { date: string; repo: string; commits: number }>();
    const others: ActivityEntry[] = [];

    for (const ev of events as GitHubEvent[]) {
      const date = (ev.created_at || "").slice(0, 10);
      if (!date) continue;
      const repo = shortRepo(ev.repo?.name);
      const p = ev.payload ?? {};

      switch (ev.type) {
        case "PushEvent": {
          const commits = Array.isArray(p.commits) ? p.commits.length : p.size ?? 1;
          const key = `${date}|${repo}`;
          const cur = pushAgg.get(key);
          if (cur) cur.commits += commits;
          else pushAgg.set(key, { date, repo, commits });
          break;
        }
        case "PullRequestEvent": {
          const verb =
            p.action === "closed" && p.pull_request?.merged
              ? "Merged"
              : p.action === "closed"
                ? "Closed"
                : "Opened";
          others.push({
            id: `gh-${ev.id}`,
            date,
            type: "code",
            description: `${verb} PR: ${p.pull_request?.title ?? "a pull request"} (${repo})`,
            tool: "GitHub",
          });
          break;
        }
        case "CreateEvent": {
          const refType = p.ref_type ?? "branch";
          others.push({
            id: `gh-${ev.id}`,
            date,
            type: "code",
            description: p.ref
              ? `Created ${refType} ${p.ref} in ${repo}`
              : `Created ${refType} ${repo}`,
            tool: "GitHub",
          });
          break;
        }
        case "IssuesEvent": {
          others.push({
            id: `gh-${ev.id}`,
            date,
            type: "planning",
            description: `${cap(p.action ?? "updated")} issue: ${p.issue?.title ?? "an issue"} (${repo})`,
            tool: "GitHub",
          });
          break;
        }
        case "ReleaseEvent": {
          others.push({
            id: `gh-${ev.id}`,
            date,
            type: "code",
            description: `Released ${p.release?.tag_name ?? ""} (${repo})`.replace(" ()", ` (${repo})`),
            tool: "GitHub",
          });
          break;
        }
        default:
          break;
      }
    }

    const pushEntries: ActivityEntry[] = Array.from(pushAgg.entries()).map(
      ([key, v]) => ({
        id: `gh-push-${key}`,
        date: v.date,
        type: "code" as ActivityType,
        description: `Pushed ${v.commits} commit${v.commits === 1 ? "" : "s"} to ${v.repo}`,
        tool: "GitHub",
      })
    );

    return [...pushEntries, ...others]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** Current streak: consecutive days (ending today, or yesterday) with activity. */
export function computeStreak(entries: ActivityEntry[]): number {
  const dates = new Set(entries.map((e) => e.date));
  if (dates.size === 0) return 0;
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  // Allow today to be empty — count the streak ending yesterday in that case.
  if (!dates.has(iso(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (dates.has(iso(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
