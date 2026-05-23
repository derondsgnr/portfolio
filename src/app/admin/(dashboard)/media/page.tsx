import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getMedia } from "@/lib/content/media";
import { getCraftDocument, parseCraftDocumentFromUnknown, type CraftDocument } from "@/lib/content/craft";
import { MediaForm } from "./media-form";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [mediaInitial, craftInitial] = await Promise.all([
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
    getContentWithGitHubOverlay<CraftDocument>(
      "content/craft.json",
      () => getCraftDocument({ includeDrafts: true, includeArchived: true }),
      (_local, parsed) => parseCraftDocumentFromUnknown(parsed)
    ),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Media</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Global assets and craft items. Edit URLs and save to update the live site.
      </p>
      <MediaForm
        initialMedia={mediaInitial}
        initialCraft={craftInitial}
      />
    </div>
  );
}
