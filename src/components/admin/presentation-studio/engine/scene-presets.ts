/**
 * Photoreal scene mockups: hands + device, desk + laptop/tablet/desktop.
 * Each preset is calibrated to a base image; replace URLs with your own PNGs/JPEGs for brand-perfect control.
 *
 * Screen rect is normalized 0–1 relative to the intrinsic pixel box (intrinsicW × intrinsicH).
 */

import type { SceneScreenRect } from "@/types/presentation-studio";

export type SceneCategoryId =
  | "phone-hand"
  | "tablet-hand"
  | "phone-desk"
  | "tablet-desk"
  | "laptop-desk"
  | "desktop-desk";

export type ScenePresetDef = {
  id: string;
  label: string;
  category: SceneCategoryId;
  /** Description for admin UI */
  hint: string;
  /** Pixel dimensions the screen rect was authored against */
  intrinsicW: number;
  intrinsicH: number;
  baseImageUrl: string;
  screen: SceneScreenRect;
  /** Optional CSS transform on the screenshot (perspective match) */
  screenTransform?: string;
};

/** Curated placeholders (Unsplash). Swap for your own assets — keep intrinsicW/H in sync or update screen rect. */
export const SCENE_PRESETS: ScenePresetDef[] = [
  {
    id: "hand-phone-low",
    label: "Hand · phone · low angle",
    category: "phone-hand",
    hint: "Phone held in hand; replace with your reference PNG for exact angles.",
    intrinsicW: 1600,
    intrinsicH: 2400,
    baseImageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&auto=format&fit=crop&q=85",
    screen: { x: 0.34, y: 0.36, w: 0.22, h: 0.14, radiusRw: 0.08 },
    screenTransform: "perspective(800px) rotateY(-4deg) rotateX(2deg)",
  },
  {
    id: "hand-phone-one-hand",
    label: "Hand · phone · one-hand grip",
    category: "phone-hand",
    hint: "Alternate grip / angle preset.",
    intrinsicW: 1600,
    intrinsicH: 2400,
    baseImageUrl:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1600&auto=format&fit=crop&q=85",
    screen: { x: 0.38, y: 0.32, w: 0.2, h: 0.36, radiusRw: 0.06 },
    screenTransform: "perspective(900px) rotateY(6deg)",
  },
  {
    id: "tablet-hands",
    label: "Hands · tablet · landscape hold",
    category: "tablet-hand",
    hint: "Two-hand tablet; good for larger UI.",
    intrinsicW: 2400,
    intrinsicH: 1600,
    baseImageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=2400&auto=format&fit=crop&q=85",
    screen: { x: 0.28, y: 0.22, w: 0.44, h: 0.58, radiusRw: 0.03 },
    screenTransform: "perspective(1200px) rotateX(4deg)",
  },
  {
    id: "laptop-cafe",
    label: "Desk · laptop · cafe table",
    category: "laptop-desk",
    hint: "Laptop on table — desktop UI in screen rect.",
    intrinsicW: 2400,
    intrinsicH: 1600,
    baseImageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=2400&auto=format&fit=crop&q=85",
    screen: { x: 0.36, y: 0.26, w: 0.34, h: 0.42, radiusRw: 0.02 },
    screenTransform: "perspective(1400px) rotateX(8deg)",
  },
  {
    id: "desktop-workstation",
    label: "Desk · monitor · workstation",
    category: "desktop-desk",
    hint: "External monitor; wide UI chrome.",
    intrinsicW: 2400,
    intrinsicH: 1600,
    baseImageUrl:
      "https://images.unsplash.com/photo-1499951360447-b19be0fe6f28?w=2400&auto=format&fit=crop&q=85",
    screen: { x: 0.31, y: 0.12, w: 0.38, h: 0.52, radiusRw: 0.015 },
  },
  {
    id: "tablet-desk-flat",
    label: "Desk · tablet · flat lay",
    category: "tablet-desk",
    hint: "Tablet flat on surface.",
    intrinsicW: 2400,
    intrinsicH: 1600,
    baseImageUrl:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=2400&auto=format&fit=crop&q=85",
    screen: { x: 0.35, y: 0.28, w: 0.32, h: 0.48, radiusRw: 0.04 },
    screenTransform: "rotate(-2deg)",
  },
];

export function getScenePresetById(id: string | undefined): ScenePresetDef | undefined {
  if (!id) return undefined;
  return SCENE_PRESETS.find((p) => p.id === id);
}

export function scenePresetsByCategory(): Record<SceneCategoryId, ScenePresetDef[]> {
  const out = {} as Record<SceneCategoryId, ScenePresetDef[]>;
  for (const p of SCENE_PRESETS) {
    if (!out[p.category]) out[p.category] = [];
    out[p.category].push(p);
  }
  return out;
}

export const SCENE_CATEGORY_LABELS: Record<SceneCategoryId, string> = {
  "phone-hand": "Phone in hand",
  "tablet-hand": "Tablet in hand",
  "phone-desk": "Phone on surface",
  "tablet-desk": "Tablet on desk",
  "laptop-desk": "Laptop on desk",
  "desktop-desk": "Desktop / monitor",
};
