import { getProjects } from "@/lib/content/projects";
import { IndexVariation } from "@/components/v2/v2-index-var";

export const metadata = { title: "Preview — Index | Deron" };

export default async function IndexPreviewPage() {
  const projects = await getProjects();
  return <IndexVariation projects={projects} />;
}
