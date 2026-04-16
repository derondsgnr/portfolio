import Link from "next/link";
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
      <p className="text-white/50 font-mono text-sm mb-4">
        Google Analytics (GA4), Google Tag Manager, and custom integrations (Plausible, Fathom, etc.).
        API secrets stay in env; only non-secret IDs are stored here.
      </p>
      <p className="text-white/40 font-mono text-xs mb-8 border border-white/[0.08] bg-white/[0.02] px-3 py-2 max-w-2xl">
        Admin content saves use <code className="text-[#E2B93B]/80">GITHUB_TOKEN</code> in Vercel — not stored here.
        {" "}
        <Link href="/admin/security" className="text-[#E2B93B]/90 underline-offset-2 hover:underline">
          Security → GitHub PAT rotation reminder
        </Link>
        {" "}
        (default every 7 days; log when you rotate).
      </p>
      <IntegrationsForm initial={initial} />
    </div>
  );
}
