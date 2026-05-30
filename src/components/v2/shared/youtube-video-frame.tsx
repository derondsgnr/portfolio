"use client";

import { toYouTubeEmbedUrl, getVideoEmbedUrl } from "@/lib/media-url";

// Re-exported for existing callers (Explorations) that import from here.
export { toYouTubeEmbedUrl };

interface VideoEmbedFrameProps {
  /** Raw provider URL (YouTube watch/youtu.be/Shorts or Vimeo). */
  url?: string | null;
  title?: string;
  className?: string;
}

/** Iframe for a hosted-provider video (YouTube or Vimeo). Renders nothing if the
 *  URL isn't a recognized provider link. */
export function VideoEmbedFrame({ url, title, className }: VideoEmbedFrameProps) {
  const src = getVideoEmbedUrl(url);
  if (!src) return null;
  return (
    <iframe
      src={src}
      title={title ?? "Embedded video"}
      className={className}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

interface YouTubeVideoFrameProps {
  url?: string | null;
  title?: string;
  className?: string;
}

/** Back-compat wrapper used by the Explorations viewer. */
export function YouTubeVideoFrame({ url, title, className }: YouTubeVideoFrameProps) {
  return <VideoEmbedFrame url={url} title={title ?? "YouTube video"} className={className} />;
}
