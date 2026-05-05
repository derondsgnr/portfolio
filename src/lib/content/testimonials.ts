import { readFile } from "fs/promises";
import path from "path";
import type { TestimonialItem } from "./defaults";
import { DEFAULT_TESTIMONIALS } from "./defaults";

export type { TestimonialItem };

function normalizeTestimonial(item: TestimonialItem, fallbackId: number): TestimonialItem {
  return {
    id: item.id ?? fallbackId,
    quote: String(item.quote ?? ""),
    name: String(item.name ?? ""),
    role: String(item.role ?? ""),
    company: String(item.company ?? ""),
    avatar: item.avatar ?? null,
    companyLogo: item.companyLogo ?? null,
    status: item.status ?? "published",
    featured: item.featured ?? false,
    pinned: item.pinned ?? false,
  };
}

function sortTestimonials(items: TestimonialItem[]): TestimonialItem[] {
  return [...items].sort((a, b) => {
    const pinWeight = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinWeight !== 0) return pinWeight;
    const featureWeight = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featureWeight !== 0) return featureWeight;
    return 0;
  });
}

export async function getTestimonials(options?: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
}): Promise<TestimonialItem[]> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeArchived = options?.includeArchived ?? false;

  try {
    const filePath = path.join(process.cwd(), "content", "testimonials.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    const base = Array.isArray(parsed) ? parsed : DEFAULT_TESTIMONIALS;
    const normalized = base.map((p, i) => normalizeTestimonial(p as TestimonialItem, i + 1));
    const filtered = normalized.filter((item) => {
      const status = item.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    return sortTestimonials(filtered);
  } catch {
    const normalized = DEFAULT_TESTIMONIALS.map((item, i) =>
      normalizeTestimonial(item as TestimonialItem, i + 1)
    );
    const filtered = normalized.filter((item) => {
      const status = item.status ?? "published";
      if (!includeArchived && status === "archived") return false;
      if (!includeDrafts && status === "draft") return false;
      return true;
    });
    return sortTestimonials(filtered);
  }
}
