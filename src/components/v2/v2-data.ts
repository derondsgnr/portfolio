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
  "Web Development",
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
    name: "Web Development",
    description: "React, Next.js, and modern stacks — I ship what I design.",
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
    label: "RESEARCH & INSIGHT",
    description: "User interviews, competitive analysis, stakeholder alignment — understanding the problem before touching a pixel.",
    deliverables: ["User Research", "Market Analysis", "Problem Framing"],
  },
  {
    word: "Define",
    label: "STRATEGY & STRUCTURE",
    description: "Information architecture, user flows, success metrics — mapping the solution space with precision.",
    deliverables: ["IA & Flows", "Product Strategy", "Success Criteria"],
  },
  {
    word: "Design",
    label: "CRAFT & ITERATION",
    description: "Visual systems, interactive prototypes, user testing — crafting experiences that feel inevitable.",
    deliverables: ["UI Design", "Design System", "Prototypes"],
  },
  {
    word: "Deliver",
    label: "BUILD & SHIP",
    description: "Developer handoff, QA collaboration, launch support — shipping with the same care as designing.",
    deliverables: ["Dev Handoff", "QA Support", "Launch"],
  },
];

export const V2_ABOUT = {
  name: "Deron",
  handle: "derondsgnr",
  title: "Product Designer & Builder",
  location: "Lagos, Nigeria",
  coordinates: { lat: "6.5244° N", lng: "3.3792° E" },
  bio: [
    "I'm Deron — a product designer and builder based in Lagos, Nigeria. I work at the intersection of design and engineering, which means I don't just hand off Figma files. I build what I design.",
    "Over 5 years, I've helped startups and scale-ups ship products that users actually love — not just tolerate. I think in systems, obsess over details, and believe that how something feels is as important as what it does.",
  ],
  philosophy: "Your product will be judged on how it looks before anyone uses it.",
  stats: [
    { label: "YEARS", value: "5+" },
    { label: "PROJECTS", value: "40+" },
    { label: "CLIENTS", value: "25+" },
  ],
  tools: ["Figma", "Framer", "React", "TypeScript", "Next.js", "Cursor"],
  socials: [
    { label: "Twitter / X", handle: "@derondsgnr", url: "#" },
    { label: "LinkedIn", handle: "/in/derondsgnr", url: "#" },
    { label: "Dribbble", handle: "/derondsgnr", url: "#" },
    { label: "GitHub", handle: "/derondsgnr", url: "#" },
  ],
  currently: "Available for projects",
  values: [
    { word: "Clarity", desc: "Strip away everything that doesn't serve the user." },
    { word: "Craft", desc: "Every pixel is a decision. Make it count." },
    { word: "Speed", desc: "Move fast, but never sloppy. Velocity with intention." },
    { word: "Honesty", desc: "Design that doesn't manipulate. Products that respect." },
  ],
};