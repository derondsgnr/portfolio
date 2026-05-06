import { getProjects } from "@/lib/content/projects";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { getPageCopy } from "@/lib/content/copy";
import { getBlogPosts } from "@/lib/content/blog";
import { HomePage } from "@/components/pages/home-page";

export default async function Page() {
  const [projects, landing, pageConfig, pageCopy, posts] = await Promise.all([
    getProjects(),
    getLandingContent(),
    getPageConfig("homepage"),
    getPageCopy("homepage"),
    getBlogPosts(),
  ]);
  return (
    <HomePage
      projects={projects}
      landing={landing}
      pageConfig={pageConfig}
      pageCopy={pageCopy}
      latestPosts={posts}
    />
  );
}
