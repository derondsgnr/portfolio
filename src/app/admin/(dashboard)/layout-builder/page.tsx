import { getGitHubFile } from "@/lib/admin/github";
import { getPageConfig } from "@/lib/content/pages";
import { LayoutBuilderForm } from "./layout-builder-form";

export const dynamic = "force-dynamic";

export default async function LayoutBuilderPage() {
  let initial: Awaited<ReturnType<typeof getPageConfig>>;
  const gh = await getGitHubFile("content/pages.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content) as { homepage?: { sections: { id: string; variation: string }[] } };
      initial = parsed.homepage?.sections?.length
        ? { sections: parsed.homepage.sections }
        : await getPageConfig("homepage");
    } catch {
      initial = await getPageConfig("homepage");
    }
  } else {
    initial = await getPageConfig("homepage");
  }

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
