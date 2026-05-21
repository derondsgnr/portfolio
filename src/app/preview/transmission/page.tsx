import { getProjects } from "@/lib/content/projects";
import { getTestimonials } from "@/lib/content/testimonials";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { TransmissionVariation } from "@/components/v2/v2-transmission";

export const metadata = { title: "Preview — Transmission | Deron" };

export default async function TransmissionPreviewPage() {
  const [projects, testimonials] = await Promise.all([
    getProjects(),
    getTestimonials(),
  ]);

  const posts = BLOG_POSTS.filter(
    (p) => !p.status || p.status === "published"
  )
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.meta.title,
      date: p.meta.date,
      category: p.meta.category,
      readingTime: p.meta.readingTime ?? 5,
    }));

  return (
    <TransmissionVariation
      projects={projects}
      testimonials={testimonials}
      posts={posts}
    />
  );
}
