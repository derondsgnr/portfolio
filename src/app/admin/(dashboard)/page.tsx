import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Dashboard</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Content management for derondsgnr
      </p>
      <div className="grid gap-4 max-w-md">
        <Link
          href="/admin/copy"
          className="block p-4 border border-white/10 hover:border-[#E2B93B]/30 transition-colors"
        >
          <span className="font-mono text-[#E2B93B] text-sm">Copy</span>
          <p className="text-white/50 text-xs mt-1">
            Hero, about, CTA text for landing page
          </p>
        </Link>
        <Link
          href="/admin/meta"
          className="block p-4 border border-white/10 hover:border-[#E2B93B]/30 transition-colors"
        >
          <span className="font-mono text-[#E2B93B] text-sm">Meta / SEO</span>
          <p className="text-white/50 text-xs mt-1">
            Title, description, OG image, logo, favicon
          </p>
        </Link>
        <Link
          href="/admin/projects"
          className="block p-4 border border-white/10 hover:border-[#E2B93B]/30 transition-colors"
        >
          <span className="font-mono text-[#E2B93B] text-sm">Projects</span>
          <p className="text-white/50 text-xs mt-1">
            Work grid items
          </p>
        </Link>
        <Link
          href="/admin/layout-builder"
          className="block p-4 border border-white/10 hover:border-[#E2B93B]/30 transition-colors"
        >
          <span className="font-mono text-[#E2B93B] text-sm">Layout & Components</span>
          <p className="text-white/50 text-xs mt-1">
            Reorder sections, swap hero/work/CTA from Synthesis, Void, Signal, Cipher
          </p>
        </Link>
      </div>
    </div>
  );
}
