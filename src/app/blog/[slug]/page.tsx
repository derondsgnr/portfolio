import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/data/blog-data";

const BlogReader = dynamic(
  () => import("@/components/v2/blog/blog-reader").then((m) => ({ default: m.BlogReader })),
  { ssr: true }
);

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) notFound();

  return <BlogReader post={post} />;
}
