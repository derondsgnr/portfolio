import { getPageCopy } from "@/lib/content/copy";
import { getBlogCategories } from "@/lib/data/blog-categories";
import { getBlogPosts, getBlogSeries } from "@/lib/content/blog";
import BlogPageClient from "./blog-page-client";

export default async function Page() {
  const [copy, categories, posts, series] = await Promise.all([
    getPageCopy("blog"),
    getBlogCategories(),
    getBlogPosts(),
    getBlogSeries(),
  ]);

  return (
    <BlogPageClient
      copy={{
        title: (copy.hero?.title as string) ?? "WRITING",
        label: (copy.hero?.label as string) ?? "WRITING",
        description:
          (copy.hero?.philosophy as string) ??
          "Notes from the intersection of design, code, and craft. Long-form thinking, not short-form takes.",
      }}
      categories={["All", ...categories]}
      posts={posts}
      series={series}
    />
  );
}
