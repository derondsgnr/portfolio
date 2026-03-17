import type { PageCopy } from "./copy";
import { getPageCopy } from "./copy";

export type LandingContent = {
  hero: { name: string; tagline: string; philosophy: string };
  about: {
    label: string;
    headline: string;
    headlineAccent: string;
    bioParagraphs: string[];
    stats: { label: string; value: string }[];
  };
  cta: {
    label: string;
    headline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    subtext: string;
    tagline: string;
  };
};

export async function getLandingContent(): Promise<LandingContent> {
  const p = (await getPageCopy("homepage")) as PageCopy & LandingContent;
  return {
    hero: {
      name: p.hero?.name ?? "DERON",
      tagline: p.hero?.tagline ?? "PRODUCT_DESIGNER // BUILDER",
      philosophy: p.hero?.philosophy ?? "Your product will be judged on how it looks before anyone uses it.",
    },
    about: {
      label: p.about?.label ?? "> ABOUT.DECODE()",
      headline: p.about?.headline ?? "Designer who",
      headlineAccent: p.about?.headlineAccent ?? "ships",
      bioParagraphs: p.about?.bioParagraphs?.length ? p.about.bioParagraphs : [
        "I'm Deron — a product designer and builder based in Lagos, Nigeria. I work at the intersection of design and engineering, which means I don't just hand off Figma files. I build what I design.",
        "Over 5 years, I've helped startups and scale-ups ship products that users actually love — not just tolerate. I think in systems, obsess over details, and believe that how something feels is as important as what it does.",
      ],
      stats: p.about?.stats?.length ? p.about.stats : [
        { label: "YEARS", value: "5+" },
        { label: "PROJECTS", value: "40+" },
        { label: "CLIENTS", value: "25+" },
      ],
    },
    cta: {
      label: p.cta?.label ?? "[READY TO DECODE YOUR NEXT PROJECT?]",
      headline: p.cta?.headline ?? "LET'S BUILD",
      ctaPrimary: p.cta?.ctaPrimary ?? "BOOK A CALL",
      ctaSecondary: p.cta?.ctaSecondary ?? "SEND A MESSAGE",
      subtext: p.cta?.subtext ?? "FREE 30-MINUTE DISCOVERY CALL",
      tagline: p.cta?.tagline ?? "Designed & built by hand",
    },
  };
}
