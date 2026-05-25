import { getExplorations } from "@/lib/content/explorations";
import { ExplorationsList } from "./explorations-list";

export const dynamic = "force-dynamic";

export default async function AdminExplorationsPage() {
  const initial = await getExplorations();

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Explorations</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Manage motion + visual experiments shown in the Craft page gallery. Saved to content/explorations.json.
      </p>
      <ExplorationsList initial={initial} />
    </div>
  );
}
