import { getGitHubFile } from "@/lib/admin/github";
import { getNav } from "@/lib/content/nav";
import { NavForm } from "./nav-form";

export const dynamic = "force-dynamic";

export default async function AdminNavPage() {
  let initial: Awaited<ReturnType<typeof getNav>>;
  const gh = await getGitHubFile("content/nav.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content);
      initial = Array.isArray(parsed) ? parsed : await getNav();
    } catch {
      initial = await getNav();
    }
  } else {
    initial = await getNav();
  }

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
