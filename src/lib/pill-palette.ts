/**
 * Spline palette — rotating accent colors for repeating chips.
 *
 * The site's primary accent is lime (`--accent`). To make repeating elements
 * (categories, tags, labels, metrics) feel alive without touching layout, cycle
 * a deterministic slice of the brand palette by index or by a stable string key.
 *
 * Colors mirror the CSS tokens in globals.css (`--pill-*`). Keep in sync.
 */
export const PILL_PALETTE = [
  "#ECFF95", // lime   (primary)
  "#904FD3", // purple (secondary brand)
  "#E5A94E", // orange
  "#95FFA5", // mint
  "#D34F79", // pink
] as const;

export type PillColor = (typeof PILL_PALETTE)[number];

/** Pick a palette color by numeric index (wraps). */
export function pillAt(index: number): PillColor {
  return PILL_PALETTE[((index % PILL_PALETTE.length) + PILL_PALETTE.length) % PILL_PALETTE.length];
}

/** Pick a palette color deterministically from a string (stable across renders). */
export function pillFor(key: string): PillColor {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return pillAt(Math.abs(hash));
}
