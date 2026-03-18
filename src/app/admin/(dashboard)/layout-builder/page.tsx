import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getPagesConfig, type PageConfig, type PagesConfig } from "@/lib/content/pages";
import { LayoutBuilderForm } from "./layout-builder-form";

function isValidPageConfig(x: unknown): x is PageConfig {
  return x != null && typeof x === "object" && Array.isArray((x as PageConfig).sections);
}

export const dynamic = "force-dynamic";

export default async function LayoutBuilderPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/pages.json",
    getPagesConfig,
    (fallback, parsed): PagesConfig => {
      const p = parsed as { homepage?: unknown; work?: unknown; about?: unknown };
      return {
        homepage: isValidPageConfig(p?.homepage) ? p.homepage : fallback.homepage,
        work: isValidPageConfig(p?.work) ? p.work : fallback.work,
        about: isValidPageConfig(p?.about) ? p.about : fallback.about,
      };
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Layout & Components</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Reorder sections and swap components from different variations (Synthesis, Void, Signal, Cipher).
      </p>
      <LayoutBuilderForm initial={initial} />
    </div>
  );
}
