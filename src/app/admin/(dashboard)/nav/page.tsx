import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getNav } from "@/lib/content/nav";
import { NavForm } from "./nav-form";

export const dynamic = "force-dynamic";

export default async function AdminNavPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/nav.json",
    getNav,
    (local, parsed) => (Array.isArray(parsed) ? parsed : local)
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Nav</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Add, remove, reorder nav items. Use path for internal links, href for external.
      </p>
      <NavForm initial={initial} />
    </div>
  );
}
