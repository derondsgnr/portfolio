import { getAdminReminders } from "@/lib/content/admin-reminders.server";
import { AdminDashboardClient } from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
  const reminders = await getAdminReminders();
  return <AdminDashboardClient githubReminder={reminders.githubPat} />;
}
