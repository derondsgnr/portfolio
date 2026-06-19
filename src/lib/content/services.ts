import type { ServiceItem, ServiceMediaRef } from "./defaults";
import { DEFAULT_SERVICES } from "./defaults";
import { readContentJson } from "./live-source";
import { isPlayableVideoUrl, isLottieUrl } from "@/lib/media-url";

export type { ServiceItem, ServiceMediaRef };

function slugify(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || fallback;
}

function normalizeMediaRef(raw: unknown): ServiceMediaRef | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const url = typeof item.url === "string" ? item.url.trim() : "";
  if (!url) return null;
  // Trust a stored type, but also infer from the URL so older entries and
  // hand-edited JSON still render with the right element.
  const declared =
    item.type === "video" ? "video" : item.type === "image" ? "image" : item.type === "lottie" ? "lottie" : undefined;
  const type: ServiceMediaRef["type"] =
    declared ?? (isLottieUrl(url) ? "lottie" : isPlayableVideoUrl(url) ? "video" : "image");
  const label = typeof item.label === "string" && item.label.trim() ? item.label.trim() : undefined;
  return { url, type, label };
}

function normalizeService(raw: unknown, index: number): ServiceItem {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const name = String(item.name ?? "").trim();
  const gives = Array.isArray(item.gives)
    ? item.gives.map((g) => String(g ?? "").trim()).filter(Boolean)
    : [];
  const media = Array.isArray(item.media)
    ? (item.media.map(normalizeMediaRef).filter(Boolean) as ServiceMediaRef[])
    : [];
  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : slugify(name, `service-${index + 1}`),
    name,
    gives,
    scope: String(item.scope ?? "").trim(),
    media,
    status: (item.status as ServiceItem["status"]) ?? "published",
    featured: Boolean(item.featured),
    pinned: Boolean(item.pinned),
  };
}

function sortServices(items: ServiceItem[]): ServiceItem[] {
  return [...items].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return 0;
  });
}

export async function getServices(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<ServiceItem[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  let base: unknown[];
  try {
    const parsed = await readContentJson<unknown>("services.json");
    base = Array.isArray(parsed) ? parsed : DEFAULT_SERVICES;
  } catch {
    base = DEFAULT_SERVICES;
  }

  const normalized = base.map((item, i) => normalizeService(item, i));
  const filtered = normalized.filter((item) => {
    const status = item.status ?? "published";
    if (!includeArchived && status === "archived") return false;
    if (!includeDrafts && status === "draft") return false;
    return true;
  });
  return sortServices(filtered);
}
