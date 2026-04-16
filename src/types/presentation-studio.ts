import type { DeviceType } from "@/types/case-study";

/** Where an inspiration reference came from */
export type InspirationProvenance = "bookmark" | "knowledge" | "upload";

/** How the engine uses a reference (optional hints) */
export type VisualRole =
  | "environment-plate"
  | "mockup-reference"
  | "palette-reference"
  | "ui-capture"
  | "unspecified";

/** Normalized item for Presentation Studio + queue */
export interface InspirationRef {
  id: string;
  provenance: InspirationProvenance;
  url: string;
  thumbnailUrl?: string;
  title: string;
  tags: string[];
  notes?: string;
  visualRoles?: VisualRole[];
  addedAt: number;
}

export const PRESENTATION_STUDIO_QUEUE_KEY = "presentation_studio_inspiration_queue_v1";

export type SlideTemplateId =
  | "cinematic-plate"
  | "spotlight-device"
  | "typography-poster";

export type CameraPresetId = "hero-tilt" | "float-right" | "flat" | "dutch-low";

export type GradingPresetId = "cinematic-rich" | "noir" | "vibrant" | "neutral";

/** How the product UI is framed */
export type MockupSource = "composite-scene" | "css-device";

/**
 * Normalized screen quad for photoreal composites (0–1 relative to preset intrinsic pixels).
 */
export interface SceneScreenRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius as fraction of screen width */
  radiusRw?: number;
}

export interface StudioFormat {
  id: string;
  label: string;
  w: number;
  h: number;
}

export interface DeckSlide {
  id: string;
  templateId: SlideTemplateId;
  headline: string;
  subline: string;
  cta?: string;
  /** Primary UI screenshot */
  screenshotUrl: string;
  /** Cinematic / environment plate (optional) */
  environmentPlateUrl?: string;
  /** Photoreal: preset from scene registry (hands, desk, laptop, monitor). CSS path: ignored. */
  mockupSource: MockupSource;
  scenePresetId?: string;
  /** Override preset base image (your mockup PNG/JPEG) */
  sceneBaseUrlOverride?: string;
  /** Fine-tune screen mapping when you replace the asset */
  screenRectOverride?: Partial<SceneScreenRect>;
  /** Extra transform on the screenshot inside the screen cutout */
  sceneScreenInnerTransform?: string;
  /** CSS mockup path only: optional PNG layered on top */
  handOverlayUrl?: string;
  cameraPresetId: CameraPresetId;
  gradingPresetId: GradingPresetId;
  device: DeviceType;
}

export interface PresentationDeck {
  id: string;
  title: string;
  narrativeBrief: string;
  slides: DeckSlide[];
  updatedAt: number;
}

export const PRESENTATION_DECK_STORAGE_KEY = "presentation_studio_deck_v1";
