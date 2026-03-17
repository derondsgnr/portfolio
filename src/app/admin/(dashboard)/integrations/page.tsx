import { getGitHubFile } from "@/lib/admin/github";
import { getIntegrations } from "@/lib/content/integrations";
import type { IntegrationsConfig } from "@/lib/content/integrations";
import { IntegrationsForm } from "./integrations-form";

export const dynamic = "force-dynamic";

export default async function AdminIntegrationsPage() {
  let initial: IntegrationsConfig;
  const gh = await getGitHubFile("content/integrations.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content) as Partial<IntegrationsConfig>;
      initial = {
        googleAnalytics: { enabled: false, measurementId: "", ...parsed.googleAnalytics },
        googleTagManager: { enabled: false, containerId: "", ...parsed.googleTagManager },
      };
    } catch {
      initial = await getIntegrations();
    }
  } else {
    initial = await getIntegrations();
  }

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Integrations</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Google Analytics (GA4) and Google Tag Manager. Enable and paste your IDs.
        API secrets stay in env; only non-secret IDs are stored here.
      </p>
      <IntegrationsForm initial={initial} />
    </div>
  );
}
