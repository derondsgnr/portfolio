import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getAdminReminders } from "@/lib/content/admin-reminders.server";
import { type AdminRemindersConfig, mergeAdminReminders } from "@/lib/content/admin-reminders";
import { SecurityRemindersForm } from "./security-reminders-form";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/admin-reminders.json",
    getAdminReminders,
    (local, parsed) => mergeAdminReminders(local, parsed as Partial<AdminRemindersConfig>),
  );

  return <SecurityRemindersForm initial={initial} />;
}
