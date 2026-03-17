import { getGitHubFile } from "@/lib/admin/github";
import { getSiteMeta } from "@/lib/content/site-meta";
import { MetaForm } from "./meta-form";

export default async function AdminMetaPage() {
  // Prefer GitHub (source of truth); fallback to local file
  let initial: Awaited<ReturnType<typeof getSiteMeta>>;
  const gh = await getGitHubFile("content/site-meta.json");
  if (gh?.content) {
    try {
      initial = { ...(await getSiteMeta()), ...JSON.parse(gh.content) };
    } catch {
      initial = await getSiteMeta();
    }
  } else {
    initial = await getSiteMeta();
  }

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Meta / SEO</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Title, description, OG image, logo, favicon and related meta tags.
      </p>
      <MetaForm initial={initial} />
    </div>
  );
}
