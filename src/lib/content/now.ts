import { readContentJson } from "./live-source";
import {
  NOW_STATUS,
  NOW_STREAK,
  NOW_FOCUS,
  NOW_TOOLS_TODAY,
  NOW_ACTIVITY,
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
  activity: NOW_ACTIVITY.slice(0, 14),
  todos: NOW_TODOS,
};

export async function getNow(): Promise<NowConfig> {
  try {
    const parsed = await readContentJson<Partial<NowConfig>>("now.json");
    if (!parsed) return DEFAULT;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
