import { getGitHubFile } from "@/lib/admin/github";
import { getProjects } from "@/lib/content/projects";
import { ProjectsList } from "./projects-list";

export default async function AdminProjectsPage() {
  let initial: Awaited<ReturnType<typeof getProjects>>;
  const gh = await getGitHubFile("content/projects.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content);
      initial = Array.isArray(parsed) ? parsed : await getProjects();
    } catch {
      initial = await getProjects();
    }
  } else {
    initial = await getProjects();
  }

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
