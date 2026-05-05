import { readContentJson } from "./live-source";

export type SocialLink = {
  label: string;
  url: string;
};

export type GlobalConfig = {
  socialLinks: SocialLink[];
  footerCopyright: string;
  footerTagline: string;
  ctaButtonLabel: string;
};

const DEFAULT: GlobalConfig = {
  socialLinks: [
    { label: "Twitter / X", url: "https://twitter.com/derondsgnr" },
    { label: "LinkedIn", url: "https://linkedin.com/in/derondsgnr" },
    { label: "Dribbble", url: "https://dribbble.com/derondsgnr" },
  ],
  footerCopyright: "© 2025 DERONDSGNR",
  footerTagline: "Designed & built by hand",
  ctaButtonLabel: "Book a call",
};

export async function getGlobal(): Promise<GlobalConfig> {
  try {
    const parsed = await readContentJson<Partial<GlobalConfig>>("global.json");
    if (!parsed) return DEFAULT;
    return {
      socialLinks: Array.isArray(parsed.socialLinks)
        ? parsed.socialLinks.filter((s) => s?.label && s?.url)
        : DEFAULT.socialLinks,
      footerCopyright: parsed.footerCopyright ?? DEFAULT.footerCopyright,
      footerTagline: parsed.footerTagline ?? DEFAULT.footerTagline,
      ctaButtonLabel: parsed.ctaButtonLabel ?? DEFAULT.ctaButtonLabel,
    };
  } catch {
    return DEFAULT;
  }
}
