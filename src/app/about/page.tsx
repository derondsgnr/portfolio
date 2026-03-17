import { getProjects } from "@/lib/content/projects";
import { getPageCopy } from "@/lib/content/copy";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { AboutPage } from "@/components/pages/about-page";

export default async function Page() {
  const [projects, copy, landing, pageConfig] = await Promise.all([
    getProjects(),
    getPageCopy("about"),
    getLandingContent(),
    getPageConfig("about"),
  ]);
  return (
    <AboutPage
      copy={copy}
      pageConfig={pageConfig}
      landing={landing}
      projects={projects}
    />
  );
}
