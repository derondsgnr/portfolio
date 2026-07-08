import { readContentJson } from "./live-source";

export type FontPairId = "anton-instrument" | "inter-playfair" | "space-dm";

export type Theme = {
  fonts: {
    primary: string;
    secondary: string;
    pair: FontPairId;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  /** Typography knobs surfaced in admin Theme. Line-heights are unitless; letter-spacings are em values (stored without the unit). */
  typography: {
    /** Site-wide base body line-height (unitless). Tailwind preflight default is 1.5. */
    bodyLineHeight: string;
    /** Site-wide base body letter-spacing in em (e.g. "0"). */
    bodyLetterSpacing: string;
    /** Case-study reading body (narrative/insight) line-height. */
    readerLineHeight: string;
    /** Case-study metadata label letter-spacing in em. */
    metaLetterSpacing: string;
  };
};

const DEFAULT: Theme = {
  fonts: {
    primary: "anton",
    secondary: "instrument-sans",
    pair: "anton-instrument",
  },
  colors: {
    primary: "#ECFF95",
    secondary: "#1d1e24",
    accent: "#ECFF95",
    background: "#121316",
    text: "#f0f0f0",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  // Defaults equal the current rendered values so nothing shifts until edited.
  typography: {
    bodyLineHeight: "1.5",
    bodyLetterSpacing: "0",
    readerLineHeight: "1.8",
    metaLetterSpacing: "0.15",
  },
};

export async function getTheme(): Promise<Theme> {
  try {
    const parsed = await readContentJson<Partial<Theme>>("theme.json");
    if (!parsed) return DEFAULT;
    return {
      fonts: { ...DEFAULT.fonts, ...parsed.fonts },
      colors: { ...DEFAULT.colors, ...parsed.colors },
      spacing: { ...DEFAULT.spacing, ...parsed.spacing },
      typography: { ...DEFAULT.typography, ...parsed.typography },
    };
  } catch {
    return DEFAULT;
  }
}
