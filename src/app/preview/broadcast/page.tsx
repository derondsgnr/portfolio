import { getProjects } from "@/lib/content/projects";
import { BroadcastVariation } from "@/components/v2/v2-broadcast";

export const metadata = { title: "Preview — Broadcast | Deron" };

export default async function BroadcastPreviewPage() {
  const projects = await getProjects();
  return <BroadcastVariation projects={projects} />;
}
