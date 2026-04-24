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

const MS_PER_DAY = 86400000;

function parseReminderDate(lastRotatedIso: string | null): Date | null {
  if (!lastRotatedIso) return null;
  const parsed = new Date(lastRotatedIso);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function utcStartOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatReminderDateValue(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatReminderDate(lastRotatedIso: string | null): string | null {
  const parsed = parseReminderDate(lastRotatedIso);
  return parsed ? formatReminderDateValue(parsed) : null;
}

export function toDateInputValue(lastRotatedIso: string | null): string {
  const parsed = parseReminderDate(lastRotatedIso);
  return parsed ? parsed.toISOString().slice(0, 10) : "";
}

export function fromDateInputValue(value: string): string | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed.toISOString();
}

export function todayReminderIso(now = new Date()): string {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString();
}

/** Client-safe helpers */
export function nextDueDate(lastRotatedIso: string | null, intervalDays: number): Date | null {
  const last = parseReminderDate(lastRotatedIso);
  if (!last) return null;
  const next = new Date(last);
  next.setUTCDate(next.getUTCDate() + intervalDays);
  return next;
}

export function isOverdue(lastRotatedIso: string | null, intervalDays: number, now = new Date()): boolean {
  const next = nextDueDate(lastRotatedIso, intervalDays);
  if (!next) return true;
  return utcStartOfDay(now).getTime() > next.getTime();
}

export function daysUntilDue(lastRotatedIso: string | null, intervalDays: number, now = new Date()): number | null {
  const next = nextDueDate(lastRotatedIso, intervalDays);
  if (!next) return null;
  const diff = next.getTime() - utcStartOfDay(now).getTime();
  return Math.round(diff / MS_PER_DAY);
}
