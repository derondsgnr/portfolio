/**
 * Official logos for design/dev tools via Simple Icons CDN.
 * https://cdn.simpleicons.org/{slug}/{color}
 */
const TOOL_MAP: Record<string, { slug: string; color: string }> = {
  figma: { slug: "figma", color: "F24E1E" },
  framer: { slug: "framer", color: "0055FF" },
  react: { slug: "react", color: "61DAFB" },
  typescript: { slug: "typescript", color: "3178C6" },
  "next.js": { slug: "nextdotjs", color: "000000" },
  nextjs: { slug: "nextdotjs", color: "000000" },
  photoshop: { slug: "adobephotoshop", color: "001E36" },
  illustrator: { slug: "adobeillustrator", color: "FF9A00" },
  "after effects": { slug: "adobeaftereffects", color: "9999FF" },
  aftereffects: { slug: "adobeaftereffects", color: "9999FF" },
  "cinema 4d": { slug: "cinema4d", color: "011A6A" },
  cinema4d: { slug: "cinema4d", color: "011A6A" },
  blender: { slug: "blender", color: "F5792A" },
  notion: { slug: "notion", color: "000000" },
  "vs code": { slug: "visualstudiocode", color: "007ACC" },
  vscode: { slug: "visualstudiocode", color: "007ACC" },
  "visual studio code": { slug: "visualstudiocode", color: "007ACC" },
  github: { slug: "github", color: "181717" },
  git: { slug: "git", color: "F05032" },
  node: { slug: "nodedotjs", color: "339933" },
  "node.js": { slug: "nodedotjs", color: "339933" },
  tailwind: { slug: "tailwindcss", color: "06B6D4" },
  tailwindcss: { slug: "tailwindcss", color: "06B6D4" },
  vercel: { slug: "vercel", color: "000000" },
  supabase: { slug: "supabase", color: "3ECF8E" },
  stripe: { slug: "stripe", color: "008CDD" },
  prisma: { slug: "prisma", color: "2D3748" },
  postgresql: { slug: "postgresql", color: "4169E1" },
  postgres: { slug: "postgresql", color: "4169E1" },
  slack: { slug: "slack", color: "4A154B" },
  linear: { slug: "linear", color: "5E6AD2" },
  miro: { slug: "miro", color: "050038" },
  spline: { slug: "spline", color: "000000" },
  protopie: { slug: "protopie", color: "FF6B00" },
  sketch: { slug: "sketch", color: "F7B500" },
  invision: { slug: "invision", color: "FF3366" },
  zeplin: { slug: "zeplin", color: "FDBD39" },
};

export function getToolLogo(toolName: string): { slug: string; color: string } | null {
  const key = toolName.trim().toLowerCase().replace(/\s+/g, " ");
  return TOOL_MAP[key] ?? null;
}

export function getToolLogoUrl(toolName: string, size = 24): string | null {
  const info = getToolLogo(toolName);
  if (!info) return null;
  return `https://cdn.simpleicons.org/${info.slug}/${info.color}`;
}
