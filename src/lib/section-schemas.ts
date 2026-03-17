/**
 * Section schema definitions — maps (id, variation) → editable fields for admin forms.
 * Admin layout builder (Phase 6) will use getSectionSchema to render edit forms.
 */

export type SchemaFieldType = "string" | "textarea" | "string[]" | "stats" | "social";

export type SchemaField = {
  key: string;
  type: SchemaFieldType;
  label?: string;
  default?: unknown;
};

const SCHEMAS: Record<string, SchemaField[]> = {
  hero_synthesis: [
    { key: "name", type: "string", label: "Name", default: "DERON" },
    { key: "tagline", type: "string", label: "Tagline", default: "PRODUCT_DESIGNER // BUILDER" },
    { key: "philosophy", type: "textarea", label: "Philosophy", default: "Your product will be judged on how it looks before anyone uses it." },
  ],
  hero_void: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_signal: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_cipher: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_drift: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_echo: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_fracture: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],
  hero_gravity: [
    { key: "name", type: "string", label: "Name" },
    { key: "tagline", type: "string", label: "Tagline" },
    { key: "philosophy", type: "textarea", label: "Philosophy" },
  ],

  about_synthesis: [
    { key: "label", type: "string", label: "Label", default: "> ABOUT.DECODE()" },
    { key: "headline", type: "string", label: "Headline", default: "Designer who" },
    { key: "headlineAccent", type: "string", label: "Headline accent", default: "ships" },
    { key: "bioParagraphs", type: "string[]", label: "Bio paragraphs" },
    { key: "stats", type: "stats", label: "Stats" },
  ],

  work_synthesis: [],
  work_void: [],
  work_signal: [],
  work_cipher: [],
  work_drift: [],
  work_echo: [],
  work_fracture: [],
  work_gravity: [],

  cta_synthesis: [
    { key: "label", type: "string", label: "Label", default: "[READY TO DECODE YOUR NEXT PROJECT?]" },
    { key: "headline", type: "string", label: "Headline", default: "LET'S BUILD" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA", default: "BOOK A CALL" },
    { key: "ctaSecondary", type: "string", label: "Secondary CTA", default: "SEND A MESSAGE" },
    { key: "subtext", type: "string", label: "Subtext", default: "FREE 30-MINUTE DISCOVERY CALL" },
    { key: "tagline", type: "string", label: "Tagline", default: "Designed & built by hand" },
  ],
  cta_void: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_signal: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_cipher: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_drift: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_echo: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_fracture: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],
  cta_gravity: [
    { key: "headline", type: "string", label: "Headline" },
    { key: "ctaPrimary", type: "string", label: "Primary CTA" },
  ],

  process_synthesis: [],
  process_void: [],
  process_signal: [],
  process_drift: [],
  process_echo: [],
  process_fracture: [],
  process_gravity: [],

  philosophy_synthesis: [],
  philosophy_void: [],
  philosophy_cipher: [],
  philosophy_drift: [],
  philosophy_echo: [],
  philosophy_fracture: [],
  philosophy_gravity: [],

  capabilities_synthesis: [],
  services_signal: [],
  services_cipher: [],

  testimonials_synthesis: [],
  testimonials_void: [],
  testimonials_signal: [],
  testimonials_cipher: [],
  testimonials_drift: [],
  testimonials_echo: [],
  testimonials_fracture: [],
  testimonials_gravity: [],
};

/**
 * Returns the schema (editable fields) for a section type. Used by admin layout builder
 * to render edit forms. Returns null if no schema is defined.
 */
export function getSectionSchema(id: string, variation: string): SchemaField[] | null {
  const key = `${id}_${variation}`;
  const fields = SCHEMAS[key];
  return fields ?? null;
}
