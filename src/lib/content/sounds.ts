import { readContentJson } from "./live-source";

export type SoundsConfig = {
  loaderComplete: string;
  loaderTick: string;
  click: string;
  hover: string;
  navigate: string;
  textReveal: string;
};

const DEFAULT: SoundsConfig = {
  loaderComplete: "",
  loaderTick: "",
  click: "",
  hover: "",
  navigate: "",
  textReveal: "",
};

export async function getSounds(): Promise<SoundsConfig> {
  try {
    const parsed = await readContentJson<Partial<SoundsConfig>>("sounds.json");
    if (!parsed) return DEFAULT;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
