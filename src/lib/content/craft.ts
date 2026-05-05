import { DEFAULT_CRAFT_ITEMS } from "./defaults";
import { readContentJson } from "./live-source";

export type CraftItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
};

function normalizeCraftItem(item: CraftItem): CraftItem {
  return {
    ...item,
    status: item.status ?? "published",
    featured: item.featured ?? false,
    pinned: item.pinned ?? false,
  };
}

function sortCraftItems(items: CraftItem[]): CraftItem[] {
  return [...items].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return a.title.localeCompare(b.title);
  });
}

export async function getCraftItems(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CraftItem[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  try {
    const parsed = await readContentJson<unknown>("craft.json");
    const base = Array.isArray(parsed) ? (parsed as CraftItem[]) : DEFAULT_CRAFT_ITEMS;
    const normalized = base.map(normalizeCraftItem);
    const filtered = normalized.filter((item) => {
      const status = item.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    return sortCraftItems(filtered);
  } catch {
    const normalized = DEFAULT_CRAFT_ITEMS.map((item) => normalizeCraftItem(item as CraftItem));
    const filtered = normalized.filter((item) => {
      const status = item.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    return sortCraftItems(filtered);
  }
}
