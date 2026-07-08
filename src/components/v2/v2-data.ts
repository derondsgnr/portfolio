/* Shared data for V2 homepage variations */

import {
  DEFAULT_PROJECTS,
  DEFAULT_CRAFT_ITEMS,
  DEFAULT_EXPLORATIONS,
  DEFAULT_TESTIMONIALS,
} from "@/lib/content/defaults";

export const V2_PROJECTS = DEFAULT_PROJECTS;
export const V2_CRAFT_ITEMS = DEFAULT_CRAFT_ITEMS;
export const V2_EXPLORATIONS = DEFAULT_EXPLORATIONS;

/** @deprecated Use useTestimonials() from contexts/testimonials-context. Re-exported for backward compatibility. */
export const V2_TESTIMONIALS = DEFAULT_TESTIMONIALS;

export const V2_SERVICES = [
  "Product Design",
  "Design Systems",
  "Build & Ship",
  "Brand Identity",
  "AI Product Design",
  "Interactive Prototypes",
];

export const V2_SERVICES_DETAILED = [
  {
    name: "Product Design",
    description: "End-to-end product thinking — from user research through shipped pixels.",
    icon: "layers",
  },
  {
    name: "Design Systems",
    description: "Scalable component libraries and design tokens that keep teams aligned.",
    icon: "grid",
  },
  {
    name: "Build & Ship",
    description: "Hands-on implementation with modern stacks—prototype to production with validation, not theatre.",
    icon: "code",
  },
  {
    name: "Brand Identity",
    description: "Visual language, typography systems, and brand strategy that resonates.",
    icon: "pen-tool",
  },
  {
    name: "AI Product Design",
    description: "Human-first interfaces for AI/ML products that feel intuitive, not intimidating.",
    icon: "cpu",
  },
  {
    name: "Interactive Prototypes",
    description: "High-fidelity prototypes that communicate the vision better than any deck.",
    icon: "play",
  },
];

export const V2_PROCESS = ["Discover", "Define", "Design", "Deliver"];

export const V2_PROCESS_DETAILED = [
  {
    word: "Discover",
    label: "EXPLORE & LEARN",
    description:
      "Prototype to see what's possible—references, flows, friction. Pressure-test assumptions with something tangible before the details harden.",
    deliverables: ["Direction", "Interactive probe", "Problem boundaries"],
  },
  {
    word: "Define",
    label: "STRUCTURE & INTENT",
    description:
      "Turn learning into decisions: IA, journeys, and the non-negotiables. Name the tradeoffs so the UI isn't negotiating them in silence.",
    deliverables: ["Flows & IA", "Principles", "Success signals"],
  },
  {
    word: "Design",
    label: "CRAFT & FEEL",
    description:
      "Systems, motion, typography, and the micro-moments that make a product memorable—not just usable.",
    deliverables: ["UI system", "Motion", "High-fidelity surface"],
  },
  {
    word: "Deliver",
    label: "SHIP & VALIDATE",
    description:
      "Build alongside production reality. The bar is simple: real interactions, validated end-to-end—not slides dressed as software.",
    deliverables: ["Prototype → product", "QA mindset", "Launch support"],
  },
];

export const V2_ABOUT = {
  name: "Deron",
  handle: "derondsgnr",
  title: "Product Designer & Builder",
  location: "Remote, Nigeria",
  coordinates: { lat: "", lng: "" },
  bio: [
    "I'm Deron — a designer who ships and builds. I start by prototyping to explore what's possible, test the problem, and pressure the solution until it's real. Then I go back and refine the finer details until they fit—interaction, motion, typography, and the moments people remember.",
    "I care that products are intuitive, and also delightful: users should leave with a feeling, not just a completed task. I've spent years with startups and teams at the intersection of design and product—thinking in systems, validating what we ship, and staying hungry to learn and push what's next.",
  ],
  philosophy: "Prototype to learn what's possible, then refine until it ships—clear enough to use, memorable enough to feel.",
  stats: [
    { label: "YEARS", value: "5+" },
    { label: "PROJECTS", value: "40+" },
    { label: "CLIENTS", value: "25+" },
  ],
  tools: ["Figma", "Figma Make", "Cursor", "Claude", "React", "Next.js", "TypeScript", "Tailwind", "Supabase", "Vercel", "GitHub"],
  socials: [
    { label: "Twitter / X", handle: "@derondsgnr", url: "#" },
    { label: "LinkedIn", handle: "/in/derondsgnr", url: "#" },
    { label: "Dribbble", handle: "/derondsgnr", url: "#" },
    { label: "GitHub", handle: "/derondsgnr", url: "#" },
  ],
  currently: "Available for projects",
  values: [
    { word: "Clarity", desc: "Strip what doesn't serve the user—then make what's left inevitable." },
    { word: "Craft", desc: "Details are the product. Motion and typography carry as much truth as layout." },
    { word: "Curiosity", desc: "Keep learning tools and patterns so the work stays current, not nostalgic." },
    { word: "Honesty", desc: "Ship what's real. Validate like your reputation depends on it—because it does." },
  ],
};