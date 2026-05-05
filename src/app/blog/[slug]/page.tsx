import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAdjacentSeriesPosts,
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedBlogPosts,
  getSeriesForPost,
} from "@/lib/content/blog";

const BlogReader = dynamic(
  () => import("@/components/v2/blog/blog-reader").then((m) => ({ default: m.BlogReader })),
  { ssr: true }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} | derondsgnr`,
    description: post.meta.summary,
    openGraph: {
      title: post.meta.title,
      description: post.meta.summary,
      images: post.meta.cover ? [{ url: post.meta.cover }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.summary,
      images: post.meta.cover ? [post.meta.cover] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = slug ? await getBlogPostBySlug(slug) : undefined;

  if (!post) notFound();

  const [relatedPosts, series, adjacent] = await Promise.all([
    getRelatedBlogPosts(post.slug, 3),
    getSeriesForPost(post.slug),
    getAdjacentSeriesPosts(post.slug),
  ]);

  return (
    <BlogReader
      post={post}
      relatedPosts={relatedPosts}
      series={series}
      seriesPrev={adjacent.prev}
      seriesNext={adjacent.next}
    />
  );
}
