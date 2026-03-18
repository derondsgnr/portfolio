import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getCopyForAdmin } from "@/lib/content/copy";
import { CopyForm } from "./copy-form";

export const dynamic = "force-dynamic";

export default async function AdminCopyPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/copy.json",
    getCopyForAdmin,
    (local, parsed) => (parsed != null && typeof parsed === "object" ? (parsed as Awaited<ReturnType<typeof getCopyForAdmin>>) : local)
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Site Copy</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Edit copy for homepage, work, about, and craft. Changes apply across the site. To add a new page, add its key to content/copy.json.
      </p>
      <CopyForm initial={initial} />
    </div>
  );
}
