/**
 * Branded placeholder images for case studies when real exports are not available.
 * Uses placehold.co — swap URLs for production assets later.
 */

const BG = "0A0A0A";
const FG = "E2B93B";

/** PNG placeholder: dark background, gold text (portfolio accent). */
export function caseStudyPlaceholder(
  label: string,
  width = 1600,
  height = 1000,
): string {
  const t = encodeURIComponent(label.replace(/\s+/g, " ").slice(0, 44));
  return `https://placehold.co/${width}x${height}/${BG}/${FG}/png?text=${t}`;
}
