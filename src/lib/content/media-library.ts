/**
 * MEDIA LIBRARY COLLECTOR (server-only)
 * =====================================
 * Walks every place the site already stores uploaded media — case study slides,
 * craft items, and the media config — and returns one flat, deduped list. The
 * admin Services picker reads this so media can be *referenced*, never re-uploaded.
 *
 * Only image + playable-video assets are surfaced (Lottie/JSON and unplayable
 * provider links are skipped) because the services crawl renders <img>/<video>.
 */

import { getCaseStudies } from "./case-studies";
import { getCraftItems } from "./craft";
import { getMedia } from "./media";
import type { Slide } from "@/types/case-study";
import { classifyVideoUrl, isPlayableVideoUrl } from "@/lib/media-url";

export type LibraryMediaItem = {
  url: string;
  type: "image" | "video";
  /** Human label for the picker tray, e.g. "Case study: Dara". */
  label: string;
  /** Coarse origin bucket for grouping/filtering in the UI. */
  source: "case-study" | "craft" | "media";
};

/** Classify a URL for the crawl. Skips Lottie/JSON and unplayable provider links. */
function classifyForLibrary(url: string | undefined | null): "image" | "video" | null {
  const u = url?.trim();
  if (!u) return null;
  if (/\.(json|lottie)(\?|#|$)/i.test(u)) return null;
  if (isPlayableVideoUrl(u)) return "video";
  // YouTube/Vimeo can't render in a bare <video>/<img> tile — leave them out.
  const videoKind = classifyVideoUrl(u);
  if (videoKind === "youtube" || videoKind === "vimeo") return null;
  return "image";
}

/** Pull every image/video URL carried by a single case-study slide. */
function urlsFromSlide(slide: Slide): string[] {
  switch (slide.type) {
    case "cover":
      return [slide.heroImage ?? ""];
    case "single-mockup":
      return [slide.image];
    case "comparison":
      return [slide.before?.image ?? "", slide.after?.image ?? ""];
    case "insight":
    case "metric":
      return [slide.image ?? ""];
    case "flow":
      return (slide.screens ?? []).map((s) => s.image ?? "");
    case "embed":
      return [slide.fallbackImage];
    case "video":
      return [slide.videoUrl ?? "", slide.posterImage];
    case "mockup-gallery":
      return (slide.mockups ?? []).map((m) => m.image ?? "");
    case "process":
      return (slide.artifacts ?? []).map((a) => a.image ?? "");
    default:
      return [];
  }
}

/**
 * Gather all referenceable media across the site. Deduped by URL; first label wins.
 */
export async function getMediaLibrary(): Promise<LibraryMediaItem[]> {
  const [caseStudies, craftItems, media] = await Promise.all([
    getCaseStudies({ includeDrafts: true, includeArchived: true }),
    getCraftItems({ includeDrafts: true, includeArchived: true }),
    getMedia(),
  ]);

  const seen = new Set<string>();
  const out: LibraryMediaItem[] = [];

  const push = (url: string, label: string, source: LibraryMediaItem["source"]) => {
    const u = url?.trim();
    if (!u || seen.has(u)) return;
    const type = classifyForLibrary(u);
    if (!type) return;
    seen.add(u);
    out.push({ url: u, type, label, source });
  };

  for (const cs of caseStudies) {
    const title = cs.meta?.title || cs.slug;
    push(cs.meta?.cover ?? "", `Case study: ${title} — cover`, "case-study");
    for (const act of cs.acts ?? []) {
      for (const slide of act.slides ?? []) {
        for (const url of urlsFromSlide(slide)) {
          push(url, `Case study: ${title}`, "case-study");
        }
      }
    }
  }

  for (const item of craftItems) {
    if (item.videoUrl) push(item.videoUrl, `Craft: ${item.title}`, "craft");
    if (item.image) push(item.image, `Craft: ${item.title}`, "craft");
  }

  push(media.heroBackground ?? "", "Media: hero background", "media");
  for (const [key, url] of Object.entries(media.sectionBackgrounds ?? {})) {
    push(url, `Media: ${key} background`, "media");
  }

  return out;
}
