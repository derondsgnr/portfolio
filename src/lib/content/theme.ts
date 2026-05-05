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
};

const DEFAULT: Theme = {
  fonts: {
    primary: "anton",
    secondary: "instrument-sans",
    pair: "anton-instrument",
  },
  colors: {
    primary: "#E2B93B",
    secondary: "#1a1a1a",
    accent: "#E2B93B",
    background: "#0A0A0A",
    text: "#f0f0f0",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
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
    };
  } catch {
    return DEFAULT;
  }
}
