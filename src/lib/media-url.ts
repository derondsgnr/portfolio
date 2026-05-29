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
