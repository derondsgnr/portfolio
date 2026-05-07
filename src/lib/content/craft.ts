import { DEFAULT_CRAFT_ITEMS } from "./defaults";
import {
  CRAFT_LAYOUT_MODES,
  normalizeCraftItem,
  type CraftDocument,
  type CraftItem,
  type CraftLayoutMode,
  type CraftSection,
} from "./craft-model";
import { readContentJson } from "./live-source";

export type { CraftDocument, CraftItem, CraftLayoutMode, CraftSection } from "./craft-model";
export { CRAFT_LAYOUT_MODES, normalizeCraftItem } from "./craft-model";

export const DEFAULT_CRAFT_DOCUMENT: CraftDocument = {
  sections: [
    {
      id: "gallery",
      layoutMode: "masonry-3",
      items: DEFAULT_CRAFT_ITEMS.map((row) => normalizeCraftItem({ ...(row as CraftItem) })),
    },
  ],
};

function isCraftLayoutMode(v: unknown): v is CraftLayoutMode {
  return typeof v === "string" && (CRAFT_LAYOUT_MODES as readonly string[]).includes(v);
}

function normalizeSection(raw: unknown, index: number): CraftSection {
  if (!raw || typeof raw !== "object") {
    return { id: `section-${index}`, layoutMode: "masonry-3", items: [] };
  }
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() !== "" ? o.id.trim() : `section-${index}`;
  const layoutMode = isCraftLayoutMode(o.layoutMode) ? o.layoutMode : "masonry-3";
  const title = typeof o.title === "string" ? o.title : undefined;
  const itemsRaw = Array.isArray(o.items) ? o.items : [];
  const items = itemsRaw.filter((it): it is CraftItem => it && typeof it === "object" && typeof (it as CraftItem).id === "string").map((it) => normalizeCraftItem(it as CraftItem));
  return { id, title, layoutMode, items };
}

/** Migrate legacy flat `CraftItem[]` file to `{ sections }`. */
function documentFromLegacyArray(items: CraftItem[]): CraftDocument {
  const normalized = items.map(normalizeCraftItem);
  return {
    sections: [
      {
        id: "gallery",
        title: undefined,
        layoutMode: "masonry-3",
        items: normalized,
      },
    ],
  };
}

/**
 * Parses any historical craft.json shape into a validated document (public + admin reads).
 */
export function parseCraftDocumentFromUnknown(parsed: unknown): CraftDocument {
  if (parsed === null || parsed === undefined) {
    return DEFAULT_CRAFT_DOCUMENT;
  }
  if (Array.isArray(parsed)) {
    return documentFromLegacyArray(parsed as CraftItem[]);
  }
  if (typeof parsed !== "object" || !Array.isArray((parsed as CraftDocument).sections)) {
    return DEFAULT_CRAFT_DOCUMENT;
  }
  const sections = (parsed as CraftDocument).sections.map((s, i) => normalizeSection(s, i));
  return { sections };
}

function filterCraftItem(
  item: CraftItem,
  includeDrafts: boolean,
  includeArchived: boolean
): boolean {
  const status = item.status ?? "published";
  if (!includeArchived && status === "archived") return false;
  if (!includeDrafts && status === "draft") return false;
  return true;
}

function filterDocument(doc: CraftDocument, includeDrafts: boolean, includeArchived: boolean): CraftDocument {
  return {
    sections: doc.sections.map((sec) => ({
      ...sec,
      items: sec.items.filter((it) => filterCraftItem(it, includeDrafts, includeArchived)),
    })),
  };
}

/** Global sort when flattening (e.g. list view across sections): pinned → featured → title. Order within section preserved before merge only if we concatenate then sort once. */
function sortCraftItemsGlobal(items: CraftItem[]): CraftItem[] {
  return [...items].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return a.title.localeCompare(b.title);
  });
}

/** Derived list-order for Cipher list toggle (pinned → featured → title). Pure; safe to call server-side once per request. */
export function flattenedSortedCraftItems(doc: CraftDocument): CraftItem[] {
  return sortCraftItemsGlobal(doc.sections.flatMap((s) => s.items));
}

export async function getCraftDocument(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CraftDocument> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  try {
    const parsed = await readContentJson<unknown>("craft.json");
    const doc = parseCraftDocumentFromUnknown(parsed);
    return filterDocument(doc, includeDrafts, includeArchived);
  } catch {
    const doc = parseCraftDocumentFromUnknown(DEFAULT_CRAFT_DOCUMENT);
    return filterDocument(doc, includeDrafts, includeArchived);
  }
}

/** All published items flattened; section order is preserved via concat then stable global sort by pin/feature. */
export async function getCraftItems(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<CraftItem[]> {
  const doc = await getCraftDocument(options);
  return flattenedSortedCraftItems(doc);
}
