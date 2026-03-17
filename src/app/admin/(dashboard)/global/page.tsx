import { getGitHubFile } from "@/lib/admin/github";
import { getGlobal } from "@/lib/content/global";
import { GlobalForm } from "./global-form";

export const dynamic = "force-dynamic";

export default async function AdminGlobalPage() {
  let initial: Awaited<ReturnType<typeof getGlobal>>;
  const gh = await getGitHubFile("content/global.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content) as Partial<Awaited<ReturnType<typeof getGlobal>>>;
      const base = await getGlobal();
      initial = {
        socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : base.socialLinks,
        footerCopyright: parsed.footerCopyright ?? base.footerCopyright,
        footerTagline: parsed.footerTagline ?? base.footerTagline,
        ctaButtonLabel: parsed.ctaButtonLabel ?? base.ctaButtonLabel,
      };
    } catch {
      initial = await getGlobal();
    }
  } else {
    initial = await getGlobal();
  }

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Global</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Footer text, social links, and shared CTA button label. Saved to content/global.json.
      </p>
      <GlobalForm initial={initial} />
    </div>
  );
}
