export type ImageRoleId =
  | "project-cover"
  | "case-study-hero"
  | "case-study-screenshot"
  | "craft-gallery"
  | "blog-cover"
  | "social-preview"
  | "avatar-logo"
  | "global-background";

export type ImageAspectSpec = {
  id: string;
  label: string;
  ratio: string;
  size: string;
  required?: boolean;
  usage: string;
};

export type ImageRoleSpec = {
  id: ImageRoleId;
  label: string;
  shortLabel: string;
  summary: string;
  master: string;
  behavior: "Art-directed crop" | "Native ratio" | "Artwork-first" | "Identity-safe";
  defaultFit: "cover" | "contain" | "mixed";
  safeZone: string;
  usedIn: string[];
  aspects: ImageAspectSpec[];
  designerChecklist: string[];
  uploadNotes: string[];
};

export const IMAGE_ROLE_SPECS: ImageRoleSpec[] = [
  {
    id: "project-cover",
    label: "Project Cover",
    shortLabel: "Project",
    summary:
      "Marketing/editorial image for work cards and homepage variations. This is the image most likely to be cropped in different shapes.",
    master: "Upload a 2400px+ wide master with the subject centered and enough negative space around the edges.",
    behavior: "Art-directed crop",
    defaultFit: "cover",
    safeZone: "Keep important UI, faces, and text inside the center 60%. Avoid critical details near the top/bottom edges.",
    usedIn: ["Homepage work sections", "Work/project grids", "Related project cards", "Admin project previews"],
    aspects: [
      { id: "wide", label: "Wide cover", ratio: "16 / 10", size: "2400 x 1500", required: true, usage: "Default work card and grid crop" },
      { id: "cinematic", label: "Cinematic", ratio: "21 / 9", size: "2400 x 1029", usage: "Full-width homepage moments" },
      { id: "portrait", label: "Portrait", ratio: "4 / 5", size: "1600 x 2000", usage: "Editorial/tall homepage cards" },
      { id: "square", label: "Square", ratio: "1 / 1", size: "1600 x 1600", usage: "Compact thumbnails and index cards" },
    ],
    designerChecklist: [
      "Create wide first, then check if portrait/square crops still tell the story.",
      "Do not bake small captions or UI text into edges that may be cropped.",
      "Use one strong visual idea, not a dense screenshot collage.",
    ],
    uploadNotes: [
      "Wide crop is required. Portrait and square are optional but recommended for hero projects.",
      "If you only provide one image, the site will crop it with object-cover across all project layouts.",
    ],
  },
  {
    id: "case-study-hero",
    label: "Case Study Hero",
    shortLabel: "Hero",
    summary:
      "Large atmospheric image behind the case-study opening. It can be cropped aggressively because it supports text rather than carrying all detail.",
    master: "Upload 2400px+ wide. Use a strong composition that survives dark overlays and partial opacity.",
    behavior: "Art-directed crop",
    defaultFit: "cover",
    safeZone: "Keep the strongest subject near center. Avoid tiny details; the renderer darkens and overlays the image.",
    usedIn: ["Case-study cover slide", "Cinematic opening backgrounds", "Case-study side navigation thumbnails"],
    aspects: [
      { id: "hero", label: "Hero background", ratio: "16 / 9", size: "2400 x 1350", required: true, usage: "Case-study cover and large background crop" },
      { id: "wide", label: "Editorial wide", ratio: "16 / 10", size: "2400 x 1500", usage: "Reusable work/card crop" },
      { id: "thumb", label: "Navigation thumb", ratio: "1 / 1", size: "1200 x 1200", usage: "Small case-study navigation previews" },
    ],
    designerChecklist: [
      "Check contrast with white and gold text over the image.",
      "Prefer visual atmosphere over detailed UI.",
      "Do not rely on exact edge alignment because mobile and desktop crop differently.",
    ],
    uploadNotes: [
      "A single strong wide image is usually enough.",
      "Add a separate square crop only when the small thumbnail matters.",
    ],
  },
  {
    id: "case-study-screenshot",
    label: "Case Study Screenshot",
    shortLabel: "Screenshot",
    summary:
      "Product UI, prototype, or process screenshot. These should preserve the truth of the interface instead of being forced into generic cover crops.",
    master: "Export at native device or frame dimensions, ideally 2x. Keep screenshot edges clean.",
    behavior: "Native ratio",
    defaultFit: "contain",
    safeZone: "Keep UI readable with at least 32px internal padding in the design file before export.",
    usedIn: ["Phone/browser/tablet/watch mockups", "Flow slides", "Comparison slides", "Process artifacts"],
    aspects: [
      { id: "phone", label: "Phone screen", ratio: "9 / 19.5", size: "1170 x 2535", required: true, usage: "Phone mockups and mobile flows" },
      { id: "browser", label: "Browser/dashboard", ratio: "16 / 10", size: "2400 x 1500", required: true, usage: "Desktop product screens and embeds" },
      { id: "tablet", label: "Tablet", ratio: "4 / 3", size: "2048 x 1536", usage: "Tablet mockups" },
      { id: "watch", label: "Watch", ratio: "1 / 1", size: "1200 x 1200", usage: "Watch mockups" },
    ],
    designerChecklist: [
      "Match the selected device type before uploading.",
      "Use native screenshots for UI detail; avoid placing phone UI inside a wide cover image.",
      "Keep text legible at the rendered mockup size.",
    ],
    uploadNotes: [
      "Choose the device first, then export to that ratio.",
      "Screenshots can use contain/native framing; covers can use crop.",
    ],
  },
  {
    id: "craft-gallery",
    label: "Craft Gallery",
    shortLabel: "Craft",
    summary:
      "Artwork and visual experiments. The grid can crop editorially, but the expanded viewer should preserve the original composition.",
    master: "Upload the best final artwork. Use 2000px+ on the longest side.",
    behavior: "Artwork-first",
    defaultFit: "mixed",
    safeZone: "If the artwork has edge typography, add breathing room or provide a thumbnail crop.",
    usedIn: ["Craft gallery", "Exploration grid", "Expanded viewer", "Homepage craft moments"],
    aspects: [
      { id: "natural", label: "Original artwork", ratio: "natural", size: "2000px+ longest side", required: true, usage: "Expanded viewer and source of truth" },
      { id: "portrait", label: "Gallery portrait", ratio: "4 / 5", size: "1600 x 2000", usage: "Tall editorial grid slots" },
      { id: "landscape", label: "Gallery landscape", ratio: "3 / 2", size: "1800 x 1200", usage: "Wide craft slots" },
      { id: "square", label: "Gallery square", ratio: "1 / 1", size: "1600 x 1600", usage: "Compact thumbnails" },
    ],
    designerChecklist: [
      "One master image is enough for most craft pieces.",
      "Add a custom thumbnail only when the grid crop damages the piece.",
      "Expanded view should show the full composition with object-contain.",
    ],
    uploadNotes: [
      "Design for the artwork first, not the grid.",
      "Use optional thumbnails for fragile compositions with edge text or thin borders.",
    ],
  },
  {
    id: "blog-cover",
    label: "Blog Cover",
    shortLabel: "Blog",
    summary:
      "Editorial image for writing cards and article hero. Blog covers need to work as both card crop and atmospheric masthead.",
    master: "Upload a 2400px+ wide image with a clear central subject and room for overlays.",
    behavior: "Art-directed crop",
    defaultFit: "cover",
    safeZone: "Keep the visual center clean. The article hero uses a dark gradient and crops by viewport height.",
    usedIn: ["Blog index featured card", "Blog grid cards", "Article hero", "Related posts", "Series cards"],
    aspects: [
      { id: "hero", label: "Article hero", ratio: "16 / 9", size: "2400 x 1350", required: true, usage: "Article masthead and related cards" },
      { id: "card", label: "Blog card", ratio: "16 / 10", size: "2400 x 1500", usage: "Blog grid card crop" },
      { id: "featured", label: "Featured card", ratio: "4 / 3", size: "1800 x 1350", usage: "Featured split-layout card on mobile" },
      { id: "series", label: "Series thumb", ratio: "1 / 1", size: "1200 x 1200", usage: "Series thumbnails" },
    ],
    designerChecklist: [
      "Use imagery that supports the title instead of repeating the title as text.",
      "Check `16:9`, `16:10`, and `4:3` crops before publishing.",
      "Avoid tiny UI details unless the post is specifically about an interface.",
    ],
    uploadNotes: [
      "Blog currently stores one cover URL; this guide helps you pick a crop that survives all blog surfaces.",
      "Use 16:9 as the safest master if you only provide one.",
    ],
  },
  {
    id: "avatar-logo",
    label: "Avatar / Logo",
    shortLabel: "Identity",
    summary:
      "Small identity assets for testimonials, company marks, badges, and tool logos. These should stay readable at tiny sizes.",
    master: "Upload clean transparent PNG/SVG when possible. Keep extra padding inside the asset.",
    behavior: "Identity-safe",
    defaultFit: "contain",
    safeZone: "Leave 12-16% padding around logos. Avatars should center the face or initials.",
    usedIn: ["Testimonial avatars", "Company logos", "Tool badges", "Admin previews"],
    aspects: [
      { id: "avatar", label: "Avatar", ratio: "1 / 1", size: "512 x 512", required: true, usage: "Circular avatar crops" },
      { id: "logo", label: "Logo", ratio: "natural", size: "512px+ wide", required: true, usage: "Contained company/tool marks" },
    ],
    designerChecklist: [
      "Use object-contain for logos, object-cover for avatars.",
      "Check legibility at 32-40px.",
      "Prefer transparent backgrounds for logos.",
    ],
    uploadNotes: [
      "Do not upload full presentation mockups as logos.",
      "For avatars, square crops are mandatory because the UI often rounds them.",
    ],
  },
  {
    id: "social-preview",
    label: "Social Preview",
    shortLabel: "Social",
    summary:
      "Open Graph/social sharing image. This should work as a clear external preview card when links are shared.",
    master: "Upload/export a 1200 x 630 image. Keep the main identity and headline inside the center safe area.",
    behavior: "Art-directed crop",
    defaultFit: "cover",
    safeZone: "Keep logos, title text, and key visuals inside the center 80%. Social platforms may crop a few pixels at the edges.",
    usedIn: ["Open Graph previews", "Twitter/X large summary cards", "Link unfurls"],
    aspects: [
      { id: "og", label: "OG / social card", ratio: "1200 / 630", size: "1200 x 630", required: true, usage: "Link preview card" },
      { id: "fallback", label: "Wide fallback", ratio: "16 / 9", size: "2400 x 1350", usage: "Can be adapted into an OG crop" },
    ],
    designerChecklist: [
      "Design this as a standalone card; it may appear outside the portfolio.",
      "Use large readable text if text is included.",
      "Avoid fine UI details and thin lines.",
    ],
    uploadNotes: [
      "Use 1200 x 630 for best Open Graph compatibility.",
      "If using a portfolio image, make a deliberate social crop rather than reusing a random cover.",
    ],
  },
  {
    id: "global-background",
    label: "Global Background",
    shortLabel: "Background",
    summary:
      "Atmospheric images used behind sections. They should create texture without fighting typography.",
    master: "Upload 2400px+ wide. Prefer dark, low-detail imagery that can handle overlays.",
    behavior: "Art-directed crop",
    defaultFit: "cover",
    safeZone: "Keep high-contrast subject matter away from text zones unless intentionally composed.",
    usedIn: ["Hero backgrounds", "Section backgrounds", "Admin media settings"],
    aspects: [
      { id: "desktop", label: "Desktop background", ratio: "16 / 9", size: "2400 x 1350", required: true, usage: "Wide desktop sections" },
      { id: "mobile", label: "Mobile background", ratio: "4 / 5", size: "1600 x 2000", usage: "Mobile/tall section crops" },
    ],
    designerChecklist: [
      "Test with typography on top.",
      "Avoid bright hotspots behind headings.",
      "Treat the image as atmosphere, not primary content.",
    ],
    uploadNotes: [
      "If one crop must serve all breakpoints, keep the visual center simple.",
      "Use Cloudinary `f_auto,q_auto` optimization for large backgrounds.",
    ],
  },
];

export function getImageRoleSpec(role: ImageRoleId): ImageRoleSpec {
  return IMAGE_ROLE_SPECS.find((spec) => spec.id === role) ?? IMAGE_ROLE_SPECS[0];
}
