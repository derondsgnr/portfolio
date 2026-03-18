/**
 * Section options for admin layout builder.
 * Kept separate from section-registry to avoid pulling in heavy component deps.
 */

export const SECTION_OPTIONS: Record<string, string[]> = {
  hero: ["synthesis", "void", "signal", "cipher", "drift", "echo", "fracture", "gravity"],
  about: ["synthesis"],
  capabilities: ["synthesis"],
  process: ["synthesis", "void", "signal", "drift", "echo", "fracture", "gravity"],
  work: ["synthesis", "void", "signal", "cipher", "drift", "echo", "fracture", "gravity"],
  philosophy: ["synthesis", "void", "cipher", "drift", "echo", "fracture", "gravity"],
  services: ["signal", "cipher"],
  testimonials: ["synthesis", "void", "signal", "cipher", "drift", "echo", "fracture", "gravity"],
  cta: ["synthesis", "void", "signal", "cipher", "drift", "echo", "fracture", "gravity"],
};

export function getSectionKey(id: string, variation: string): string {
  return `${id}_${variation}`;
}
