import { getProjects } from "@/lib/content/projects";
import { HomePage } from "@/components/pages/home-page";

export default async function Page() {
  const projects = await getProjects();
  return <HomePage projects={projects} />;
}
