import { getProjects } from "@/lib/content/projects";
import { DispatchVariation } from "@/components/v2/v2-dispatch";

export const metadata = { title: "Preview — Dispatch | Deron" };

export default async function DispatchPreviewPage() {
  const projects = await getProjects();
  return <DispatchVariation projects={projects} />;
}
