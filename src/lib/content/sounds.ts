import { readFile } from "fs/promises";
import path from "path";

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
    const filePath = path.join(process.cwd(), "content", "sounds.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SoundsConfig>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
