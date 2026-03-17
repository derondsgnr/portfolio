import { getGitHubFile } from "@/lib/admin/github";
import { getMedia } from "@/lib/content/media";
import { getCraftItems } from "@/lib/content/craft";
import { getExplorations } from "@/lib/content/explorations";
import type { MediaConfig } from "@/lib/content/media";
import type { CraftItem } from "@/lib/content/craft";
import type { Exploration } from "@/lib/content/explorations";
import { MediaForm } from "./media-form";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let mediaInitial: MediaConfig;
  let craftInitial: CraftItem[];
  let explorationsInitial: Exploration[];

  const [mediaGh, craftGh, explorationsGh] = await Promise.all([
    getGitHubFile("content/media.json"),
    getGitHubFile("content/craft.json"),
    getGitHubFile("content/explorations.json"),
  ]);

  if (mediaGh?.content) {
    try {
      const parsed = JSON.parse(mediaGh.content) as Partial<MediaConfig>;
      mediaInitial = {
        heroBackground: parsed?.heroBackground ?? "",
        sectionBackgrounds: parsed?.sectionBackgrounds ?? {},
      };
    } catch {
      mediaInitial = await getMedia();
    }
  } else {
    mediaInitial = await getMedia();
  }

  if (craftGh?.content) {
    try {
      const parsed = JSON.parse(craftGh.content);
      craftInitial = Array.isArray(parsed) ? parsed : await getCraftItems();
    } catch {
      craftInitial = await getCraftItems();
    }
  } else {
    craftInitial = await getCraftItems();
  }

  if (explorationsGh?.content) {
    try {
      const parsed = JSON.parse(explorationsGh.content);
      explorationsInitial = Array.isArray(parsed) ? parsed : await getExplorations();
    } catch {
      explorationsInitial = await getExplorations();
    }
  } else {
    explorationsInitial = await getExplorations();
  }

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
