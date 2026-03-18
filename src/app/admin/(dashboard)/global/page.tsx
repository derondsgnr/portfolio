import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getGlobal, type GlobalConfig, type SocialLink } from "@/lib/content/global";
import { GlobalForm } from "./global-form";

export const dynamic = "force-dynamic";

export default async function AdminGlobalPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/global.json",
    getGlobal,
    (base, parsed): GlobalConfig => {
      const p = parsed as { socialLinks?: unknown[]; footerCopyright?: string; footerTagline?: string; ctaButtonLabel?: string };
      const links: SocialLink[] = Array.isArray(p?.socialLinks)
        ? (p.socialLinks as SocialLink[])
        : base.socialLinks;
      return {
        socialLinks: links,
        footerCopyright: p?.footerCopyright ?? base.footerCopyright,
        footerTagline: p?.footerTagline ?? base.footerTagline,
        ctaButtonLabel: p?.ctaButtonLabel ?? base.ctaButtonLabel,
      };
    }
  );

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
