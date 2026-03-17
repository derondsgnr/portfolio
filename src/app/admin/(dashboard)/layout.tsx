import Link from "next/link";
import { logout } from "../actions";
import { AdminBackLink } from "./admin-back-link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 px-6 py-4 flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-4">
          <AdminBackLink />
          <Link href="/admin" className="font-mono text-sm tracking-wider text-[#E2B93B]">
            ADMIN
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="font-mono text-xs text-white/60 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/copy" className="font-mono text-xs text-white/60 hover:text-white">
            Copy
          </Link>
          <Link href="/admin/meta" className="font-mono text-xs text-white/60 hover:text-white">
            Meta / SEO
          </Link>
          <Link href="/admin/projects" className="font-mono text-xs text-white/60 hover:text-white">
            Projects
          </Link>
          <Link href="/admin/layout-builder" className="font-mono text-xs text-white/60 hover:text-white">
            Layout
          </Link>
          <Link href="/admin/theme" className="font-mono text-xs text-white/60 hover:text-white">
            Theme
          </Link>
          <Link href="/admin/nav" className="font-mono text-xs text-white/60 hover:text-white">
            Nav
          </Link>
          <Link href="/admin/global" className="font-mono text-xs text-white/60 hover:text-white">
            Global
          </Link>
          <Link href="/admin/integrations" className="font-mono text-xs text-white/60 hover:text-white">
            Integrations
          </Link>
          <Link href="/admin/media" className="font-mono text-xs text-white/60 hover:text-white">
            Media
          </Link>
          <Link href="/" className="font-mono text-xs text-white/40 hover:text-white">
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="font-mono text-xs text-white/40 hover:text-white">
              Logout
            </button>
          </form>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </>
  );
}
