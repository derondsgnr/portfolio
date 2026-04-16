import { readFile } from "fs/promises";
import path from "path";

export type GithubPatReminder = {
  /** ISO 8601 when you last rotated the token */
  lastRotatedIso: string | null;
  intervalDays: number;
  label: string;
};

export type AdminRemindersConfig = {
  githubPat: GithubPatReminder;
};

const DEFAULT: AdminRemindersConfig = {
  githubPat: {
    lastRotatedIso: null,
    intervalDays: 7,
    label: "GitHub PAT (admin content writes)",
  },
};

export async function getAdminReminders(): Promise<AdminRemindersConfig> {
  try {
    const filePath = path.join(process.cwd(), "content", "admin-reminders.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AdminRemindersConfig>;
    return {
      githubPat: {
        ...DEFAULT.githubPat,
        ...parsed.githubPat,
        intervalDays: Math.min(90, Math.max(1, parsed.githubPat?.intervalDays ?? DEFAULT.githubPat.intervalDays)),
      },
    };
  } catch {
    return { ...DEFAULT };
  }
}

/** Client-safe helpers */
export function nextDueDate(lastRotatedIso: string | null, intervalDays: number): Date | null {
  if (!lastRotatedIso) return null;
  const last = new Date(lastRotatedIso);
  if (Number.isNaN(last.getTime())) return null;
  const next = new Date(last);
  next.setDate(next.getDate() + intervalDays);
  return next;
}

export function isOverdue(lastRotatedIso: string | null, intervalDays: number, now = new Date()): boolean {
  const next = nextDueDate(lastRotatedIso, intervalDays);
  if (!next) return true;
  return now.getTime() > next.getTime();
}

export function daysUntilDue(lastRotatedIso: string | null, intervalDays: number, now = new Date()): number | null {
  const next = nextDueDate(lastRotatedIso, intervalDays);
  if (!next) return null;
  const diff = next.getTime() - now.getTime();
  return Math.ceil(diff / (86400000));
}
