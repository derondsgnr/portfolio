import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getAdminReminders } from "@/lib/content/admin-reminders.server";
import type { AdminRemindersConfig } from "@/lib/content/admin-reminders";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const reminders = await getContentWithGitHubOverlay(
    "content/admin-reminders.json",
    getAdminReminders,
    (local, parsed): AdminRemindersConfig => {
      const p = parsed as Partial<AdminRemindersConfig>;
      return {
        githubPat: {
          ...local.githubPat,
          ...p.githubPat,
          intervalDays: Math.min(
            90,
            Math.max(1, p.githubPat?.intervalDays ?? local.githubPat.intervalDays),
          ),
        },
      };
    },
  );
  return <AdminDashboardClient githubReminder={reminders.githubPat} />;
}
