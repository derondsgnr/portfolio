import { AdminProvider } from "@/components/admin/admin-context";
import { AdminFeatureGuide } from "@/components/admin/admin-feature-guide";
import { AdminSidebar, MobileAdminNav } from "@/components/admin/admin-sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminSidebar />
      <MobileAdminNav />
      <main className="lg:pl-[220px] min-h-screen pt-14 lg:pt-0 bg-[#121316]">
        <div className="p-6 lg:p-8">{children}</div>
        <AdminFeatureGuide />
      </main>
    </AdminProvider>
  );
}
