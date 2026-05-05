import { readContentJson } from "./live-source";

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
    const parsed = await readContentJson<Partial<SiteMeta>>("site-meta.json");
    if (!parsed) return DEFAULT;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
