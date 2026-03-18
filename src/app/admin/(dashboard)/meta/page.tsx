import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getSiteMeta } from "@/lib/content/site-meta";
import { MetaForm } from "./meta-form";

export const dynamic = "force-dynamic";

export default async function AdminMetaPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/site-meta.json",
    getSiteMeta,
    (local, parsed) => ({ ...local, ...(parsed as object) })
  );

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
