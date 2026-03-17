import { getProjects } from "@/lib/content/projects";
import { getPageCopy } from "@/lib/content/copy";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { WorkPage } from "@/components/pages/work-page";

export default async function Page() {
  const [projects, copy, landing, pageConfig] = await Promise.all([
    getProjects(),
    getPageCopy("work"),
    getLandingContent(),
    getPageConfig("work"),
  ]);
  return (
    <WorkPage
      projects={projects}
      copy={copy}
      pageConfig={pageConfig}
      landing={landing}
    />
  );
}
