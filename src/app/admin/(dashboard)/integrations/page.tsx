import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getIntegrations } from "@/lib/content/integrations";
import type { IntegrationsConfig } from "@/lib/content/integrations";
import { IntegrationsForm } from "./integrations-form";

export const dynamic = "force-dynamic";

export default async function AdminIntegrationsPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/integrations.json",
    getIntegrations,
    (local, parsed): IntegrationsConfig => {
      const p = parsed as { googleAnalytics?: object; googleTagManager?: object; extra?: unknown[] };
      return {
        googleAnalytics: { ...local.googleAnalytics, ...p?.googleAnalytics },
        googleTagManager: { ...local.googleTagManager, ...p?.googleTagManager },
        extra: Array.isArray(p?.extra) ? p.extra as IntegrationsConfig["extra"] : (local.extra ?? []),
      };
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Integrations</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Google Analytics (GA4), Google Tag Manager, and custom integrations (Plausible, Fathom, etc.).
        API secrets stay in env; only non-secret IDs are stored here.
      </p>
      <IntegrationsForm initial={initial} />
    </div>
  );
}
