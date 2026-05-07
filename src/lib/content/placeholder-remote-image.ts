/**
 * Remote URLs used when no real asset is set yet (`caseStudyPlaceholder`, etc.).
 * Used to overlay real images from case studies onto work grid thumbnails.
 */
export function isPlaceholderRemoteImage(url?: string): boolean {
  if (!url?.trim()) return true;
  const u = url.toLowerCase();
  return u.includes("placehold.co") || u.includes("via.placeholder");
}
