import type { BlogSeries, BlogPost } from "@/types/blog";
import { BLOG_POSTS, getBlogPost } from "./blog-data";

/**
 * BLOG SERIES
 * ===========
 * Named, ordered collections of blog posts.
 * Posts reference their series via meta.series — this file holds the series definitions
 * and helpers for navigation/filtering.
 */

export const BLOG_SERIES: BlogSeries[] = [
  {
    slug: "craft-and-code",
    title: "Craft & Code",
    description:
      "A series on what happens when designers build — the decisions, the tradeoffs, and the things you only learn on both sides of the handoff.",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
    posts: [
      "why-i-build-what-i-design",
      "on-design-systems-and-taste",
    ],
  },
];

/* ─── Helpers ─────────────────────────────────────────────────── */

export function getAllSeries(includeArchived = false): BlogSeries[] {
  return includeArchived ? BLOG_SERIES : BLOG_SERIES.filter((s) => !s.archived);
}

export function getSeriesBySlug(slug: string): BlogSeries | undefined {
  return BLOG_SERIES.find((s) => s.slug === slug);
}

export function getSeriesForPost(postSlug: string): BlogSeries | undefined {
  return BLOG_SERIES.find((s) => s.posts.includes(postSlug));
}

export function getSeriesPosts(seriesSlug: string): BlogPost[] {
  const series = getSeriesBySlug(seriesSlug);
  if (!series) return [];
  return series.posts
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => !!p);
}

export function getAdjacentSeriesPosts(
  postSlug: string
): { prev?: BlogPost; next?: BlogPost } {
  const series = getSeriesForPost(postSlug);
  if (!series) return {};

  const idx = series.posts.indexOf(postSlug);
  if (idx === -1) return {};

  return {
    prev: idx > 0 ? getBlogPost(series.posts[idx - 1]) : undefined,
    next:
      idx < series.posts.length - 1
        ? getBlogPost(series.posts[idx + 1])
        : undefined,
  };
}
