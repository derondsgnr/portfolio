import { getProjects } from "@/lib/content/projects";
import { getTestimonials } from "@/lib/content/testimonials";
import { getGlobal } from "@/lib/content/global";
import { getCopy } from "@/lib/content/copy";
import { getCraftItems } from "@/lib/content/craft";
import { getServices } from "@/lib/content/services";
import { getPagesConfig } from "@/lib/content/pages";
import { getLandingContent } from "@/lib/content/landing";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { TransmissionVariation } from "@/components/v2/v2-transmission";
import { HomePage } from "@/components/pages/home-page";

export default async function Page() {
  const [projects, testimonials, globalConfig, copy, craftItems, services, pagesConfig, landing] =
    await Promise.all([
      getProjects(),
      getTestimonials(),
      getGlobal(),
      getCopy(),
      getCraftItems(),
      getServices(),
      getPagesConfig(),
      getLandingContent(),
    ]);

  const posts = BLOG_POSTS.filter((p) => !p.status || p.status === "published")
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.meta.title,
      date: p.meta.date,
      category: p.meta.category,
      readingTime: p.meta.readingTime ?? 5,
    }));

  const template = pagesConfig.homepageTemplate ?? "section-builder";

  if (template === "transmission") {
    return (
      <TransmissionVariation
        projects={projects}
        testimonials={testimonials}
        posts={posts}
        craftItems={craftItems}
        services={services}
        global={globalConfig}
        copy={copy}
      />
    );
  }

  return (
    <HomePage
      projects={projects}
      landing={landing}
      pageConfig={pagesConfig.homepage ?? { sections: [] }}
      pageCopy={copy}
      latestPosts={posts as never}
    />
  );
}
