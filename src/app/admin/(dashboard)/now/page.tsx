import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getNow } from "@/lib/content/now";
import { AdminNowForm } from "./now-form";

export const dynamic = "force-dynamic";

export default async function AdminNowPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/now.json",
    getNow,
    (local, parsed) => ({ ...local, ...(parsed as object) })
  );
  return <AdminNowForm initial={initial} />;
}
