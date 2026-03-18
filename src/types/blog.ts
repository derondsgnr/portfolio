import type { Slide } from "./case-study";

/**
 * BLOG TYPE SYSTEM
 * ================
 * Blog posts reuse the case study Slide union for content rendering.
 * The BlogReader component handles masthead + SlideRenderer for body.
 *
 * Key difference from CaseStudy:
 *   - No "acts" structure — slides are flat (section-break slides act as chapters)
 *   - No cinematic mode
 *   - Meta drives the header (not a cover slide)
 *   - TOC is derived from section-break slides at render time
 */

export interface BlogPost {
  slug: string;
  meta: {
    title: string;
    date: string;        // ISO: "2026-03-18"
    category: BlogCategory;
    tags: string[];
    cover: string;       // hero image URL
    summary: string;
    readingTime: number; // minutes
    featured?: boolean;
  };
  slides: Slide[];       // flat, no acts — use section-break for chapters
}

export type BlogCategory =
  | "Craft"
  | "Process"
  | "Thinking"
  | "Tools"
  | "Case Notes"
  | "Industry"
  | "Life";
