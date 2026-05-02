"use client";

import React from "react";

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ?? null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live") {
        return segments[1] ?? null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function toYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const id = extractYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
}

export function YouTubeVideoFrame({
  url,
  title,
  className,
}: {
  url?: string | null;
  title: string;
  className?: string;
}) {
  const embedUrl = toYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={`${title} video preview`}
      className={className}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
