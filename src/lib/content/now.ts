import { readContentJson } from "./live-source";
import { getGitHubActivity, computeStreak } from "./now-github";
import {
  NOW_STATUS,
  NOW_STREAK,
  NOW_FOCUS,
  NOW_TOOLS_TODAY,
  NOW_TODOS,
  type WorkStatus,
  type ActivityEntry,
  type TodoItem,
} from "@/lib/data/now-data";

export type NowConfig = {
  status: WorkStatus;
  focus: string;
  streak: number;
  streakStart: string;
  toolsToday: string[];
  activity: ActivityEntry[];
  todos: TodoItem[];
};

const DEFAULT: NowConfig = {
  status: NOW_STATUS,
  focus: NOW_FOCUS,
  streak: NOW_STREAK,
  streakStart: "2026-03-07",
  toolsToday: NOW_TOOLS_TODAY,
  activity: [],
  todos: NOW_TODOS,
};

export async function getNow(): Promise<NowConfig> {
  let manual: NowConfig;
  try {
    const parsed = await readContentJson<Partial<NowConfig>>("now.json");
    manual = parsed ? { ...DEFAULT, ...parsed } : DEFAULT;
  } catch {
    manual = DEFAULT;
  }

  // Auto-populate the activity feed from GitHub when available, merged with any
  // manually-logged entries. Status/focus/tools/todos stay manually curated.
  const github = await getGitHubActivity(14);
  if (github.length === 0) return manual;

  const seen = new Set<string>();
  const activity = [...github, ...manual.activity]
    .filter((a) => (seen.has(a.id) ? false : seen.add(a.id)))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 14);

  return {
    ...manual,
    activity,
    streak: computeStreak(activity) || manual.streak,
  };
}
