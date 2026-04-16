import type { StudioFormat } from "@/types/presentation-studio";

/** Export pixel sizes (long edge 1080 for manageable files) */
export const STUDIO_FORMATS: StudioFormat[] = [
  { id: "1:1", label: "IG / LinkedIn square", w: 1080, h: 1080 },
  { id: "4:5", label: "IG feed portrait", w: 1080, h: 1350 },
  { id: "9:16", label: "Stories / Reels / Shorts", w: 1080, h: 1920 },
];

export function getFormatById(id: string): StudioFormat | undefined {
  return STUDIO_FORMATS.find((f) => f.id === id);
}
