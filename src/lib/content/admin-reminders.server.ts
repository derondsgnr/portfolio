import { readFile } from "fs/promises";
import path from "path";
import {
  type AdminRemindersConfig,
  DEFAULT_ADMIN_REMINDERS,
} from "@/lib/content/admin-reminders";

export async function getAdminReminders(): Promise<AdminRemindersConfig> {
  try {
    const filePath = path.join(process.cwd(), "content", "admin-reminders.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AdminRemindersConfig>;
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
