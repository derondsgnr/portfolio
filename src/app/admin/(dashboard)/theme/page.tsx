import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getTheme } from "@/lib/content/theme";
import { ThemeForm } from "./theme-form";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const initial = await getContentWithGitHubOverlay(
    "content/theme.json",
    getTheme,
    (local, parsed) => {
      const p = parsed as { fonts?: object; colors?: object; spacing?: object };
      return {
        fonts: { ...local.fonts, ...p.fonts },
        colors: { ...local.colors, ...p.colors },
        spacing: { ...local.spacing, ...p.spacing },
      };
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Theme</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Fonts, colors, and spacing tokens. Changes affect the entire site.
      </p>
      <ThemeForm initial={initial} />
    </div>
  );
}
