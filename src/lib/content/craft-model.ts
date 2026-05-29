/** Client-safe craft types + layout registry (no fs / GitHub loaders). */

export const CRAFT_LAYOUT_MODES = [
  "masonry-2",
  "masonry-3",
  "editorial-cover",
  "list",
] as const;

export type CraftLayoutMode = (typeof CRAFT_LAYOUT_MODES)[number];

export type CraftItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  /** Optional motion embed or MP4/WebM URL (YouTube/Vimeo paste here too). */
  videoUrl?: string;
  /** URL to a hosted Lottie .json animation file. */
  lottieUrl?: string;
  /** Source pixel width — use for masonry + CLS reserve (optional legacy). */
  width?: number;
  /** Must pair with width for aspect reserve. */
  height?: number;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
};

export type CraftSection = {
  id: string;
  title?: string;
  layoutMode: CraftLayoutMode;
  items: CraftItem[];
};

export type CraftDocument = {
  sections: CraftSection[];
};

export function normalizeCraftItem(item: CraftItem): CraftItem {
  return {
    ...item,
    status: item.status ?? "published",
    featured: item.featured ?? false,
    pinned: item.pinned ?? false,
    width:
      typeof item.width === "number" && Number.isFinite(item.width) && item.width > 0 ? Math.round(item.width) : undefined,
    height:
      typeof item.height === "number" && Number.isFinite(item.height) && item.height > 0
        ? Math.round(item.height)
        : undefined,
    videoUrl:
      typeof item.videoUrl === "string" && item.videoUrl.trim() !== "" ? item.videoUrl.trim() : undefined,
    lottieUrl:
      typeof item.lottieUrl === "string" && item.lottieUrl.trim() !== "" ? item.lottieUrl.trim() : undefined,
  };
}
