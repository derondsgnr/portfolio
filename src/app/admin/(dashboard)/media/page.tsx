import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getMedia } from "@/lib/content/media";
import { getCraftItems } from "@/lib/content/craft";
import { getExplorations } from "@/lib/content/explorations";
import type { MediaConfig } from "@/lib/content/media";
import type { CraftItem } from "@/lib/content/craft";
import type { Exploration } from "@/lib/content/explorations";
import { MediaForm } from "./media-form";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [mediaInitial, craftInitial, explorationsInitial] = await Promise.all([
    getContentWithGitHubOverlay(
      "content/media.json",
      getMedia,
      (local, parsed) => {
        const p = parsed as { heroBackground?: string; sectionBackgrounds?: Record<string, string> };
        return {
          heroBackground: p?.heroBackground ?? local.heroBackground ?? "",
          sectionBackgrounds: p?.sectionBackgrounds ?? local.sectionBackgrounds ?? {},
        };
      }
    ),
    getContentWithGitHubOverlay(
      "content/craft.json",
      getCraftItems,
      (local, parsed) => (Array.isArray(parsed) ? parsed : local)
    ),
    getContentWithGitHubOverlay(
      "content/explorations.json",
      getExplorations,
      (local, parsed) => (Array.isArray(parsed) ? parsed : local)
    ),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Media</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Global assets, craft items, and explorations. Edit URLs and save to update the live site.
      </p>
      <MediaForm
        initialMedia={mediaInitial}
        initialCraft={craftInitial}
        initialExplorations={explorationsInitial}
      />
    </div>
  );
}
