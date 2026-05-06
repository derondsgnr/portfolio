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
      philosophy: p.hero?.philosophy ?? "Prototype to learn what's possible, then refine until it ships—clear enough to use, memorable enough to feel.",
    },
    about: {
      label: p.about?.label ?? "> ABOUT.DECODE()",
      headline: p.about?.headline ?? "Designer who",
      headlineAccent: p.about?.headlineAccent ?? "ships",
      bioParagraphs: p.about?.bioParagraphs?.length ? p.about.bioParagraphs : [
        "I'm Deron — a designer who ships and builds. I start by prototyping to explore what's possible, test the problem, and pressure the solution until it's real. Then I go back and refine the finer details until they fit—interaction, motion, typography, and the moments people remember.",
        "I care that products are intuitive, and also delightful: users should leave with a feeling, not just a completed task. I've spent years with startups and teams at the intersection of design and product—thinking in systems, validating what we ship, and staying hungry to learn and push what's next.",
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
