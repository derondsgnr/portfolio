export type GithubPatReminder = {
  /** ISO 8601 when you last rotated the token */
  lastRotatedIso: string | null;
  intervalDays: number;
  label: string;
};

export type AdminRemindersConfig = {
  githubPat: GithubPatReminder;
};

export const DEFAULT_ADMIN_REMINDERS: AdminRemindersConfig = {
  githubPat: {
    lastRotatedIso: null,
    intervalDays: 7,
    label: "GitHub PAT (admin content writes)",
  },
};

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
