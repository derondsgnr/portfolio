import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPost, BLOG_POSTS } from "@/lib/data/blog-data";

const BlogReader = dynamic(
  () => import("@/components/v2/blog/blog-reader").then((m) => ({ default: m.BlogReader })),
  { ssr: true }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
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
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) notFound();

  return <BlogReader post={post} />;
}
