import { readFile } from "fs/promises";
import path from "path";

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

const DEFAULT: LandingContent = {
  hero: {
    name: "DERON",
    tagline: "PRODUCT_DESIGNER // BUILDER",
    philosophy: "Your product will be judged on how it looks before anyone uses it.",
  },
  about: {
    label: "> ABOUT.DECODE()",
    headline: "Designer who",
    headlineAccent: "ships",
    bioParagraphs: [
      "I'm Deron — a product designer and builder based in Lagos, Nigeria. I work at the intersection of design and engineering, which means I don't just hand off Figma files. I build what I design.",
      "Over 5 years, I've helped startups and scale-ups ship products that users actually love — not just tolerate. I think in systems, obsess over details, and believe that how something feels is as important as what it does.",
    ],
    stats: [
      { label: "YEARS", value: "5+" },
      { label: "PROJECTS", value: "40+" },
      { label: "CLIENTS", value: "25+" },
    ],
  },
  cta: {
    label: "[READY TO DECODE YOUR NEXT PROJECT?]",
    headline: "LET'S BUILD",
    ctaPrimary: "BOOK A CALL",
    ctaSecondary: "SEND A MESSAGE",
    subtext: "FREE 30-MINUTE DISCOVERY CALL",
    tagline: "Designed & built by hand",
  },
};

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const filePath = path.join(process.cwd(), "content", "landing.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LandingContent>;
    return {
      hero: { ...DEFAULT.hero, ...parsed.hero },
      about: { ...DEFAULT.about, ...parsed.about },
      cta: { ...DEFAULT.cta, ...parsed.cta },
    };
  } catch {
    return DEFAULT;
  }
}
