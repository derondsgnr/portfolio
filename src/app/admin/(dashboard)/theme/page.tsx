import { getGitHubFile } from "@/lib/admin/github";
export const dynamic = "force-dynamic";
import { getTheme } from "@/lib/content/theme";
import { ThemeForm } from "./theme-form";

export default async function AdminThemePage() {
  let initial: Awaited<ReturnType<typeof getTheme>>;
  const gh = await getGitHubFile("content/theme.json");
  if (gh?.content) {
    try {
      const base = await getTheme();
      const parsed = JSON.parse(gh.content) as Partial<Awaited<ReturnType<typeof getTheme>>>;
      initial = {
        fonts: { ...base.fonts, ...parsed.fonts },
        colors: { ...base.colors, ...parsed.colors },
        spacing: { ...base.spacing, ...parsed.spacing },
      };
    } catch {
      initial = await getTheme();
    }
  } else {
    initial = await getTheme();
  }

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
