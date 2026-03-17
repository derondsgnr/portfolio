import { getProjects } from "@/lib/content/projects";
import { WorkPage } from "@/components/pages/work-page";

export default async function Page() {
  const projects = await getProjects();
  return <WorkPage projects={projects} />;
}
