import { readFile } from "fs/promises";
import path from "path";
import type { TestimonialItem } from "./defaults";
import { DEFAULT_TESTIMONIALS } from "./defaults";

export type { TestimonialItem };

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "testimonials.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_TESTIMONIALS;
    return parsed.map((p, i) => ({
      id: (p as TestimonialItem).id ?? i + 1,
      quote: String((p as TestimonialItem).quote ?? ""),
      name: String((p as TestimonialItem).name ?? ""),
      role: String((p as TestimonialItem).role ?? ""),
      company: String((p as TestimonialItem).company ?? ""),
      avatar: (p as TestimonialItem).avatar ?? null,
      companyLogo: (p as TestimonialItem).companyLogo ?? null,
    }));
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}
