/**
 * CASE STUDY TYPE SYSTEM
 * ======================
 * The data contract between your content and the rendering engine.
 * 
 * Each case study is an array of slides. Each slide has a `type` field
 * that determines which component renders it. The engine reads this and
 * picks the right layout automatically.
 * 
 * TEMPLATE TYPES:
 *   "full-product"     — End-to-end, research to shipping (15-30 slides)
 *   "feature-dive"     — One feature or system deep dive (8-15 slides)
 *   "visual-brand"     — Art direction heavy, fewer text slides (10-20 slides)
 *   "teardown"         — Analysis with redesign proposal (10-25 slides)
 * 
 * NARRATOR SLOT:
 *   Any slide can have an optional `narrator` field. When present,
 *   a commentary strip renders alongside the slide content.
 *   Currently renders as editorial monospace text block.
 *   Future: swap in illustrated character with pose prop.
 */

/* ─── Device Mockup Types ────────────────────────────────────── */
export type DeviceType = "phone" | "browser" | "tablet" | "watch" | "none";

/* ─── Narrator (future character system) ─────────────────────── */
export interface NarratorBlock {
  text: string;
  /** Future: character pose/mood when illustration is added */
  mood?: "neutral" | "thinking" | "pointing" | "celebrating" | "frustrated";
  /** Label above the commentary, e.g. "DESIGNER'S NOTE" */
  label?: string;
}

/* ─── Slide Types (discriminated union) ──────────────────────── */

export interface CoverSlide {
  type: "cover";
  id: string;
  headline: string;
  subtitle?: string;
  tags?: string[];
  heroImage?: string;
  device?: DeviceType;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface NarrativeSlide {
  type: "narrative";
  id: string;
  headline?: string;
  body: string;
  annotation?: string;
  narrator?: NarratorBlock;
  references?: { label: string; url: string }[];
}

export interface SingleMockupSlide {
  type: "single-mockup";
  id: string;
  headline?: string;
  annotation?: string;
  image: string;
  device: DeviceType;
  caption?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface ComparisonSlide {
  type: "comparison";
  id: string;
  headline?: string;
  before: { image: string; label: string };
  after: { image: string; label: string };
  device?: DeviceType;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface InsightSlide {
  type: "insight";
  id: string;
  headline: string;
  body?: string;
  insightLabel: string;
  insightText: string;
  image?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface MetricSlide {
  type: "metric";
  id: string;
  headline?: string;
  metrics: { label: string; value: string; delta?: string }[];
  image?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface QuoteSlide {
  type: "quote";
  id: string;
  quote: string;
  attribution: string;
  role?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface FlowSlide {
  type: "flow";
  id: string;
  headline?: string;
  screens: { image: string; label?: string; device?: DeviceType }[];
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface EmbedSlide {
  type: "embed";
  id: string;
  headline?: string;
  embedUrl: string;
  fallbackImage: string;
  device?: DeviceType;
  caption?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface VideoSlide {
  type: "video";
  id: string;
  headline?: string;
  videoUrl?: string;
  posterImage: string;
  device?: DeviceType;
  caption?: string;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface MockupGallerySlide {
  type: "mockup-gallery";
  id: string;
  headline?: string;
  mockups: { image: string; device: DeviceType; label?: string }[];
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface SectionBreakSlide {
  type: "section-break";
  id: string;
  actTitle: string;
  actNumber: number;
  subtitle?: string;
  cinematicCaption?: string;
}

export interface ProcessSlide {
  type: "process";
  id: string;
  headline?: string;
  artifacts: {
    image: string;
    label: string;
    description?: string;
  }[];
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

export interface LottieSlide {
  type: "lottie";
  id: string;
  headline?: string;
  lottieUrl: string;
  caption?: string;
  loop?: boolean;
  narrator?: NarratorBlock;
  cinematicCaption?: string;
}

/** Union of all slide types */
export type Slide =
  | CoverSlide
  | NarrativeSlide
  | SingleMockupSlide
  | ComparisonSlide
  | InsightSlide
  | MetricSlide
  | QuoteSlide
  | FlowSlide
  | EmbedSlide
  | VideoSlide
  | MockupGallerySlide
  | SectionBreakSlide
  | ProcessSlide
  | LottieSlide;

/* ─── Act / Chapter ──────────────────────────────────────────── */
export interface Act {
  title: string;
  slides: Slide[];
}

/* ─── Template ───────────────────────────────────────────────── */
export type CaseStudyTemplate = "full-product" | "feature-dive" | "visual-brand" | "teardown";

/* ─── Full Case Study ────────────────────────────────────────── */
export interface CaseStudy {
  slug: string;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
  meta: {
    title: string;
    client: string;
    year: string;
    role?: string;
    duration?: string;
    tags: string[];
    cover: string;
    summary: string;
    color?: string; // accent override per case study
  };
  template: CaseStudyTemplate;
  acts: Act[];
  outcome?: {
    metrics: { label: string; value: string }[];
    testimonial?: string;
    testimonialAuthor?: string;
  };
  /** Live demo URL — shown as persistent floating button */
  liveDemoUrl?: string;
  /** Address-bar text shown in browser-frame mockups for this study (e.g. "app.dara.finance").
   *  Falls back to the host of liveDemoUrl when unset. */
  browserUrl?: string;
  /** Controls which section this appears in. "personal" shows in the Personal Projects grid.
   *  Defaults to "case-study" if omitted. */
  projectType?: "case-study" | "personal";
}
