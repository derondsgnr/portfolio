import { readFile } from "fs/promises";
import path from "path";
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
    const filePath = path.join(process.cwd(), "content", "now.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<NowConfig>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
