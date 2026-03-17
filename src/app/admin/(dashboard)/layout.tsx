import Link from "next/link";
import { logout } from "../actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-mono text-sm tracking-wider text-[#E2B93B]">
          ADMIN
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/admin" className="font-mono text-xs text-white/60 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/meta" className="font-mono text-xs text-white/60 hover:text-white">
            Meta / SEO
          </Link>
          <Link href="/admin/projects" className="font-mono text-xs text-white/60 hover:text-white">
            Projects
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
