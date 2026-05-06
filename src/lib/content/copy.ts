import { readContentJson } from "./live-source";

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

export type WritingStripCopy = {
  label?: string;
  title?: string;
  archiveLabel?: string;
  emptyHint?: string;
};

export type PageCopy = {
  hero?: HeroCopy;
  about?: AboutCopy;
  cta?: CtaCopy;
  writing?: WritingStripCopy;
  [key: string]: unknown;
};

export type CopyConfig = {
  [page: string]: PageCopy;
};

const DEFAULTS: CopyConfig = {
  homepage: {
    hero: {
      name: "DERON",
      tagline: "PRODUCT_DESIGNER // BUILDER",
      philosophy:
        "Prototype to learn what's possible, then refine until it ships—clear enough to use, memorable enough to feel.",
    },
    about: {
      label: "> ABOUT.DECODE()",
      headline: "Designer who",
      headlineAccent: "ships",
      bioParagraphs: [
        "I'm Deron — a designer who ships and builds. I start by prototyping to explore what's possible, test the problem, and pressure the solution until it's real. Then I go back and refine the finer details until they fit—interaction, motion, typography, and the moments people remember.",
        "I care that products are intuitive, and also delightful: users should leave with a feeling, not just a completed task. I've spent years with startups and teams at the intersection of design and product—thinking in systems, validating what we ship, and staying hungry to learn and push what's next.",
      ],
      stats: [{ label: "YEARS", value: "5+" }, { label: "PROJECTS", value: "40+" }, { label: "CLIENTS", value: "25+" }],
    },
    writing: {
      label: "> FROM_THE_JOURNAL",
      title: "WRITING",
      archiveLabel: "VIEW ALL",
      emptyHint: "Notes on design, build, and how products ship. The archive is open—more pieces landing here as I publish.",
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
  blog: {
    hero: {
      title: "WRITING",
      label: "WRITING",
      philosophy: "Notes from the intersection of design, code, and craft. Long-form thinking, not short-form takes.",
    },
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
    const parsed = await readContentJson<CopyConfig>("copy.json");
    if (!parsed) return DEFAULTS;
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
    const parsed = await readContentJson<CopyConfig>("copy.json");
    if (parsed) return parsed;
    throw new Error("missing copy");
  } catch {
    const def = { ...DEFAULTS };
    (def as Record<string, unknown>)._shared = { cta: { ctaPrimary: "BOOK A CALL", ctaSecondary: "SEND A MESSAGE", subtext: "FREE 30-MINUTE DISCOVERY CALL" } };
    return def as CopyConfig;
  }
}
