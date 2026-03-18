import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getSounds } from "@/lib/content/sounds";
import { SoundsForm } from "./sounds-form";

export const dynamic = "force-dynamic";

export default async function AdminSoundsPage() {
  const sounds = await getContentWithGitHubOverlay(
    "content/sounds.json",
    getSounds,
    (local, parsed) => ({ ...local, ...(parsed as object) })
  );
  return (
    <div className="space-y-6">
      <h1 className="font-mono text-lg tracking-wider text-[#E2B93B]">Sounds</h1>
      <p className="font-mono text-sm text-white/60 max-w-xl">
        URLs for each sound event. Leave empty to disable. Loader, button click, navigation, hover, and hero/header text reveal.
      </p>
      <SoundsForm initial={sounds} />
    </div>
  );
}
