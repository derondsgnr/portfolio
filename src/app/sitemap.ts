import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/content/case-studies";
import { getBlogPosts, getBlogSeries } from "@/lib/content/blog";

const BASE_URL = "https://derondsgnr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, blogPosts, series] = await Promise.all([
    getCaseStudies(),
    getBlogPosts(),
    getBlogSeries(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/craft`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/now`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies
    .filter((cs) => cs.status !== "draft" && cs.status !== "archived")
    .map((cs) => ({
      url: `${BASE_URL}/work/${cs.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const blogPostRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.meta.date ? new Date(post.meta.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${BASE_URL}/blog/series/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogPostRoutes, ...seriesRoutes];
}
