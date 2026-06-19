import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getNav } from "@/lib/content/nav";
import { NavForm } from "./nav-form";

export const dynamic = "force-dynamic";

export default async function AdminNavPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/nav.json",
    () => getNav({ includeHidden: true }),
    (local, parsed) => (Array.isArray(parsed) ? parsed : local)
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Nav</h1>
      <p className="text-white/50 font-mono text-sm mb-2">
        Add, remove, reorder nav items. Use path for internal links, href for external.
      </p>
      <p className="text-white/35 font-mono text-xs mb-8">
        Hide a page while you rework it: the link drops from every menu and the route (plus anything under it)
        returns 404. Click Show to make it public again.
      </p>
      <NavForm initial={initial} />
    </div>
  );
}
