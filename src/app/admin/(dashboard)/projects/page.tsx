import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getProjects } from "@/lib/content/projects";
import { ProjectsList } from "./projects-list";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/projects.json",
    getProjects,
    (local, parsed) => (Array.isArray(parsed) ? parsed : local)
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Projects</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Add, edit, reorder, and delete work items. Saved to content/projects.json.
      </p>
      <ProjectsList initial={initial} />
    </div>
  );
}
