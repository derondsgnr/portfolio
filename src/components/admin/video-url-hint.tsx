"use client";

import { classifyVideoUrl } from "@/lib/media-url";

/**
 * Live feedback under a video-URL admin input: tells the editor whether a
 * pasted link will actually play, before they publish. Catches the common
 * mistake of pasting a YouTube watch URL into a field, or an f_auto Cloudinary
 * video link, etc.
 */
export function VideoUrlHint({ url, className = "" }: { url?: string | null; className?: string }) {
  const value = url?.trim();
  if (!value) return null;

  const kind = classifyVideoUrl(value);
  const map: Record<string, { text: string; color: string }> = {
    youtube: { text: "YouTube detected — will embed and play.", color: "#7CC576" },
    vimeo: { text: "Vimeo detected — will embed and play.", color: "#7CC576" },
    file: { text: "Direct video file — will play inline.", color: "#7CC576" },
    unknown: {
      text: "This link may not play. Use a YouTube/Vimeo link, or a direct video file (Cloudinary /video/upload/… .mp4).",
      color: "#ECFF95",
    },
  };
  const { text, color } = map[kind];

  return (
    <p
      className={`mt-1.5 font-mono text-[10px] leading-relaxed ${className}`}
      style={{ color }}
      role={kind === "unknown" ? "alert" : undefined}
    >
      {text}
    </p>
  );
}
