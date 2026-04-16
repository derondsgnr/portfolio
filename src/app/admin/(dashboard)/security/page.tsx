import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getAdminReminders, type AdminRemindersConfig } from "@/lib/content/admin-reminders";
import { SecurityRemindersForm } from "./security-reminders-form";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const initial = await getContentWithGitHubOverlay(
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

  return <SecurityRemindersForm initial={initial} />;
}
