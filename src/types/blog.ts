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
  status?: "published" | "draft" | "archived";
  meta: {
    title: string;
    date: string;        // ISO: "2026-03-18"
    category: BlogCategory;
    tags: string[];
    cover: string;       // hero image URL
    summary: string;
    readingTime: number; // minutes
    featured?: boolean;
    pinned?: boolean;
    series?: {
      slug: string;      // reference to BlogSeries.slug
      position: number;  // 1-based index in the series
    };
  };
  slides: Slide[];       // flat, no acts — use section-break for chapters
}

export interface BlogSeries {
  slug: string;           // URL-safe: "craft-and-code"
  title: string;          // "Craft & Code"
  description: string;    // 1-2 sentence summary
  cover?: string;         // optional hero image for series landing page
  posts: string[];        // ordered array of post slugs
  archived?: boolean;     // hidden from public pages when true
}

export type BlogCategory = string;
