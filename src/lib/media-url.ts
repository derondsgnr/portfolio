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

