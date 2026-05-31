import {
  type AdminRemindersConfig,
  DEFAULT_ADMIN_REMINDERS,
  mergeAdminReminders,
} from "@/lib/content/admin-reminders";
import { readContentJson } from "./live-source";

export async function getAdminReminders(): Promise<AdminRemindersConfig> {
  try {
    const parsed = await readContentJson<Partial<AdminRemindersConfig>>("admin-reminders.json");
    return mergeAdminReminders(DEFAULT_ADMIN_REMINDERS, parsed);
  } catch {
    return { ...DEFAULT_ADMIN_REMINDERS };
  }
}
