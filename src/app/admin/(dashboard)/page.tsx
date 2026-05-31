import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getAdminReminders } from "@/lib/content/admin-reminders.server";
import { type AdminRemindersConfig, mergeAdminReminders } from "@/lib/content/admin-reminders";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const reminders = await getContentWithGitHubOverlay(
    "content/admin-reminders.json",
    getAdminReminders,
    (local, parsed) => mergeAdminReminders(local, parsed as Partial<AdminRemindersConfig>),
  );
  return (
    <AdminDashboardClient
      githubReminder={reminders.githubPat}
      mydaraReminder={reminders.mydaraGoogleAuth}
    />
  );
}
