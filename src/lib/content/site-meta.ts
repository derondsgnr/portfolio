import { readFile } from "fs/promises";
import path from "path";

export type SiteMeta = {
  title: string;
  description: string;
  siteName: string;
  url: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: string;
  favicon: string;
  logo: string;
};

const DEFAULT: SiteMeta = {
  title: "derondsgnr | Product Designer & Builder",
  description: "Product designer and builder based in Lagos, Nigeria.",
  siteName: "derondsgnr",
  url: "https://derondsgnr.com",
  ogImage: "",
  ogImageAlt: "derondsgnr — Product Designer & Builder",
  twitterCard: "summary_large_image",
  favicon: "/favicon.ico",
  logo: "",
};

export async function getSiteMeta(): Promise<SiteMeta> {
  try {
    const filePath = path.join(process.cwd(), "content", "site-meta.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteMeta>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
