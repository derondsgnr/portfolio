import { getProjects } from "@/lib/content/projects";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { HomePage } from "@/components/pages/home-page";

export default async function Page() {
  const [projects, landing, pageConfig] = await Promise.all([
    getProjects(),
    getLandingContent(),
    getPageConfig("homepage"),
  ]);
  return <HomePage projects={projects} landing={landing} pageConfig={pageConfig} />;
}
