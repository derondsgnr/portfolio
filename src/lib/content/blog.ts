import { readFile } from "fs/promises";
import path from "path";
import type { BlogPost, BlogSeries } from "@/types/blog";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { BLOG_SERIES } from "@/lib/data/blog-series-data";

export type BlogPostStatus = "published" | "draft" | "archived";

function normalizePost(input: BlogPost): BlogPost {
  return {
    ...input,
    status: input.status ?? "published",
    meta: {
      ...input.meta,
      featured: input.meta.featured ?? false,
      pinned: input.meta.pinned ?? false,
      tags: Array.isArray(input.meta.tags) ? input.meta.tags : [],
    },
    slides: Array.isArray(input.slides) ? input.slides : [],
  };
}

function normalizeSeries(input: BlogSeries): BlogSeries {
  return {
    ...input,
    archived: input.archived ?? false,
    posts: Array.isArray(input.posts) ? input.posts : [],
  };
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const pinWeight = Number(Boolean(b.meta.pinned)) - Number(Boolean(a.meta.pinned));
    if (pinWeight !== 0) return pinWeight;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}

export async function getBlogPosts(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<BlogPost[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  let basePosts: BlogPost[] = BLOG_POSTS.map(normalizePost);
  try {
    const filePath = path.join(process.cwd(), "content", "blog.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as BlogPost[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      basePosts = parsed.map(normalizePost);
    }
  } catch {
    // Fallback to static posts when content/blog.json is unavailable.
  }

  const filtered = basePosts.filter((post) => {
    const status = post.status ?? "published";
    if (!includeArchived && status === "archived") return false;
    if (!includeDrafts && status === "draft") return false;
    return true;
  });

  return sortPosts(filtered);
}

export async function getBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean; includeArchived?: boolean }
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(options);
  return posts.find((post) => post.slug === slug);
}

export async function getFeaturedBlogPost(): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.meta.featured) ?? posts[0];
}

export async function getRelatedBlogPosts(slug: string, count = 3): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  const others = posts.filter((p) => p.slug !== slug);

  if (post?.meta.series) {
    const seriesSlug = post.meta.series.slug;
    const sameSeries = others.filter((p) => p.meta.series?.slug === seriesSlug);
    const rest = others.filter((p) => p.meta.series?.slug !== seriesSlug);
    return [...sameSeries, ...rest].slice(0, count);
  }

  return others.slice(0, count);
}

export async function getBlogSeries(includeArchived = false): Promise<BlogSeries[]> {
  let seriesList: BlogSeries[] = BLOG_SERIES.map(normalizeSeries);
  try {
    const filePath = path.join(process.cwd(), "content", "blog-series.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as BlogSeries[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      seriesList = parsed.map(normalizeSeries);
    }
  } catch {
    // Fallback to static series when content/blog-series.json is unavailable.
  }

  const visible = includeArchived ? seriesList : seriesList.filter((series) => !series.archived);
  return visible.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getBlogSeriesBySlug(slug: string): Promise<BlogSeries | undefined> {
  const series = await getBlogSeries(true);
  return series.find((item) => item.slug === slug);
}

export async function getSeriesPosts(seriesSlug: string): Promise<BlogPost[]> {
  const [series, posts] = await Promise.all([getBlogSeriesBySlug(seriesSlug), getBlogPosts()]);
  if (!series) return [];
  return series.posts
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post));
}

export async function getSeriesForPost(postSlug: string): Promise<BlogSeries | undefined> {
  const series = await getBlogSeries(true);
  return series.find((item) => item.posts.includes(postSlug));
}

export async function getAdjacentSeriesPosts(
  postSlug: string
): Promise<{ prev?: BlogPost; next?: BlogPost }> {
  const [series, posts] = await Promise.all([getSeriesForPost(postSlug), getBlogPosts()]);
  if (!series) return {};
  const idx = series.posts.indexOf(postSlug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? posts.find((post) => post.slug === series.posts[idx - 1]) : undefined,
    next:
      idx < series.posts.length - 1
        ? posts.find((post) => post.slug === series.posts[idx + 1])
        : undefined,
  };
}
