import { getProjects } from "@/lib/content/projects";
import { getTestimonials } from "@/lib/content/testimonials";
import { getGlobal } from "@/lib/content/global";
import { getCopy } from "@/lib/content/copy";
import { getCraftItems } from "@/lib/content/craft";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { TransmissionVariation } from "@/components/v2/v2-transmission";

export default async function Page() {
  const [projects, testimonials, globalConfig, copy, craftItems] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getGlobal(),
    getCopy(),
    getCraftItems(),
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
      craftItems={craftItems}
      global={globalConfig}
      copy={copy}
    />
  );
}
