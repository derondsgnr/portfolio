import { readFile } from "fs/promises";
import path from "path";

const copyPath = () => path.join(process.cwd(), "content", "copy.json");

export type HeroCopy = {
  name?: string;
  tagline?: string;
  philosophy?: string;
  title?: string;
  accessLabel?: string;
  countSuffix?: string;
  activeLabel?: string;
  label?: string;
  headline?: string;
};

export type AboutCopy = {
  label?: string;
  headline?: string;
  headlineAccent?: string;
  bioParagraphs?: string[];
  stats?: { label: string; value: string }[];
};

export type CtaCopy = {
  label?: string;
  headline?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  subtext?: string;
  tagline?: string;
};

export type PageCopy = {
  hero?: HeroCopy;
  about?: AboutCopy;
  cta?: CtaCopy;
  [key: string]: unknown;
};

export type CopyConfig = {
  [page: string]: PageCopy;
};

const DEFAULTS: CopyConfig = {
  homepage: {
    hero: { name: "DERON", tagline: "PRODUCT_DESIGNER // BUILDER", philosophy: "Your product will be judged on how it looks before anyone uses it." },
    about: {
      label: "> ABOUT.DECODE()",
      headline: "Designer who",
      headlineAccent: "ships",
      bioParagraphs: [
        "I'm Deron — a product designer and builder based in Lagos, Nigeria...",
        "Over 5 years, I've helped startups and scale-ups ship products...",
      ],
      stats: [{ label: "YEARS", value: "5+" }, { label: "PROJECTS", value: "40+" }, { label: "CLIENTS", value: "25+" }],
    },
    cta: { label: "[READY TO DECODE YOUR NEXT PROJECT?]", headline: "LET'S BUILD", ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE", subtext: "FREE 30-MINUTE DISCOVERY CALL", tagline: "Designed & built by hand" },
  },
  work: {
    hero: { accessLabel: "> ACCESSING WORK_ARCHIVE...", title: "WORK", countSuffix: "TRANSMISSIONS FOUND", activeLabel: "SIGNAL: ACTIVE" },
    cta: { label: "[READY TO DECODE YOUR NEXT PROJECT?]", headline: "LET'S BUILD", ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE", subtext: "FREE 30-MINUTE DISCOVERY CALL" },
  },
  about: {
    hero: { label: "[READY TO DECODE YOUR NEXT PROJECT?]", headline: "LET'S BUILD" },
    cta: { label: "[READY TO DECODE YOUR NEXT PROJECT?]", headline: "LET'S BUILD", ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE", subtext: "FREE 30-MINUTE DISCOVERY CALL" },
  },
  craft: {
    hero: { label: "> EXPERIMENTS.MAP()" },
    cta: { ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE" },
  },
};

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const out = { ...target };
  for (const k of Object.keys(source)) {
    const v = source[k];
    if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) {
      (out as Record<string, unknown>)[k] = deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else if (v !== undefined) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}

export async function getCopy(): Promise<CopyConfig> {
  try {
    const raw = await readFile(copyPath(), "utf-8");
    const parsed = JSON.parse(raw) as CopyConfig;
    const shared = parsed._shared as PageCopy | undefined;
    const result: CopyConfig = {};
    for (const [page, data] of Object.entries(parsed)) {
      if (page.startsWith("_")) continue;
      const base = shared ? deepMerge({} as PageCopy, shared) : {};
      result[page] = deepMerge(base, data as PageCopy);
    }
    return result;
  } catch {
    return DEFAULTS;
  }
}

export async function getPageCopy(page: string): Promise<PageCopy> {
  const all = await getCopy();
  const pageData = all[page] ?? {};
  return deepMerge(deepMerge({} as PageCopy, DEFAULTS[page] ?? {}), pageData);
}

/** Returns raw copy.json for admin editing. Preserves _shared. */
export async function getCopyForAdmin(): Promise<CopyConfig> {
  try {
    const raw = await readFile(copyPath(), "utf-8");
    return JSON.parse(raw) as CopyConfig;
  } catch {
    const def = { ...DEFAULTS };
    (def as Record<string, unknown>)._shared = { cta: { ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE", subtext: "FREE 30-MINUTE DISCOVERY CALL" } };
    return def as CopyConfig;
  }
}
