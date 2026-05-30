/**
 * Shared media-URL detection — used by admin previews and public renderers so a
 * pasted Cloudinary link (image / video / Lottie .json) is rendered with the right
 * element instead of always assuming an <img>.
 */

export type MediaUrlKind = "image" | "video" | "lottie";

/** True for direct MP4/WebM/OGG files or Cloudinary video delivery URLs. */
export function isPlayableVideoUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return false;
  const u = url.trim();
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(u)) return true;
  if (u.includes("res.cloudinary.com") && u.includes("/video/upload/")) return true;
  return false;
}

/** True for hosted Lottie animation files (.json / .lottie or Cloudinary raw delivery). */
export function isLottieUrl(url: string | undefined | null): boolean {
  if (!url?.trim()) return false;
  const u = url.trim();
  if (/\.(json|lottie)(\?|#|$)/i.test(u)) return true;
  if (u.includes("res.cloudinary.com") && u.includes("/raw/upload/") && /\.json(\?|#|$)/i.test(u)) return true;
  return false;
}

/** Classify a media URL. Defaults to "image" when it's neither video nor Lottie. */
export function detectMediaUrlKind(url: string | undefined | null): MediaUrlKind {
  if (isLottieUrl(url)) return "lottie";
  if (isPlayableVideoUrl(url)) return "video";
  return "image";
}

/**
 * Normalize a Cloudinary VIDEO delivery URL for playback.
 *
 * `f_auto`/`q_auto` are great for images, but on a video they force Cloudinary
 * to transcode — which many plans restrict, returning 403 "Host not in
 * allowlist" so the video never loads. People (and our own media-form hints)
 * routinely paste those transforms onto video links, so we strip format/quality
 * transform segments from the `/video/upload/<transforms>/` path here and serve
 * the original. No-op for non-Cloudinary or non-video URLs.
 */
export function normalizeCloudinaryVideoUrl(url: string | undefined | null): string | undefined {
  const u = url?.trim();
  if (!u) return url ?? undefined;
  if (!(u.includes("res.cloudinary.com") && u.includes("/video/upload/"))) return u;

  const marker = "/video/upload/";
  const i = u.indexOf(marker);
  const head = u.slice(0, i + marker.length);
  const segments = u.slice(i + marker.length).split("/");

  // Cloudinary stacks transforms as separate path segments
  // (`/video/upload/q_auto/f_auto/...`) and/or comma-joined (`f_auto,q_auto`).
  // Drop every leading segment that looks like a transform; stop at the version
  // (`v1780014552`) or the public id, which must be preserved.
  const looksLikeTransform = (seg: string) =>
    /(^|,)(f|q|w|h|c|e|fl|b|dpr|ar|g|so|du|vc|l|u|t|r|o|a|pg)_/.test(seg);
  while (segments.length > 1 && looksLikeTransform(segments[0])) {
    segments.shift();
  }

  return head + segments.join("/");
}

/* ─── Hosted-provider embeds (YouTube / Vimeo) ──────────────────────────────
 * Direct files (Cloudinary mp4, *.mp4) play in a <video>. Provider links must
 * be converted to their /embed/ iframe form — pasting a youtube.com/watch URL
 * into a <video> tag (or iframing a watch URL) silently fails. These pure
 * helpers detect the provider and build the correct embeddable URL. */

export function extractYouTubeId(url: string | undefined | null): string | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
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
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
}

/** Vimeo numeric id (+ optional unlisted hash) from any vimeo.com / player URL. */
export function extractVimeoId(url: string | undefined | null): { id: string; hash?: string } | null {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
    const segments = parsed.pathname.split("/").filter(Boolean);
    // player.vimeo.com/video/<id>[/<hash>]  or  vimeo.com/<id>[/<hash>]  or
    // vimeo.com/channels/<name>/<id>
    const nums = segments.filter((s) => /^\d+$/.test(s));
    const id = nums[0];
    if (!id) return null;
    const idIdx = segments.indexOf(id);
    const next = segments[idIdx + 1];
    const hash = next && /^[a-z0-9]+$/i.test(next) && !/^\d+$/.test(next) ? next : undefined;
    return { id, hash };
  } catch {
    return null;
  }
}

export function toVimeoEmbedUrl(url?: string | null): string | null {
  const v = extractVimeoId(url);
  if (!v) return null;
  const params = new URLSearchParams({ autoplay: "1", muted: "1", playsinline: "1" });
  if (v.hash) params.set("h", v.hash);
  return `https://player.vimeo.com/video/${v.id}?${params.toString()}`;
}

/** Embed iframe URL for a hosted provider (YouTube/Vimeo), else null. */
export function getVideoEmbedUrl(url?: string | null): string | null {
  return toYouTubeEmbedUrl(url) ?? toVimeoEmbedUrl(url);
}

export type VideoUrlKind = "file" | "youtube" | "vimeo" | "unknown";

/** Classify a video URL so callers know whether to use <video> or an iframe. */
export function classifyVideoUrl(url: string | undefined | null): VideoUrlKind {
  if (!url?.trim()) return "unknown";
  if (toYouTubeEmbedUrl(url)) return "youtube";
  if (toVimeoEmbedUrl(url)) return "vimeo";
  if (isPlayableVideoUrl(url)) return "file";
  return "unknown";
}

/** True if the URL is playable inline anywhere — direct file OR hosted embed. */
export function isPlayableOrEmbeddableVideoUrl(url: string | undefined | null): boolean {
  return classifyVideoUrl(url) !== "unknown";
}

