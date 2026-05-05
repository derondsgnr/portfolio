import {
  type AdminRemindersConfig,
  DEFAULT_ADMIN_REMINDERS,
} from "@/lib/content/admin-reminders";
import { readContentJson } from "./live-source";

export async function getAdminReminders(): Promise<AdminRemindersConfig> {
  try {
    const parsed = await readContentJson<Partial<AdminRemindersConfig>>("admin-reminders.json");
    if (!parsed) return { ...DEFAULT_ADMIN_REMINDERS };
    return {
      githubPat: {
        ...DEFAULT_ADMIN_REMINDERS.githubPat,
        ...parsed.githubPat,
        intervalDays: Math.min(90, Math.max(1, parsed.githubPat?.intervalDays ?? DEFAULT_ADMIN_REMINDERS.githubPat.intervalDays)),
      },
    };
  } catch {
    return { ...DEFAULT_ADMIN_REMINDERS };
  }
}
