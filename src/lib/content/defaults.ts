/**
 * Default/fallback data for content loaders.
 * Single source of truth — used when content/*.json is missing or invalid.
 * lib/content uses these; components/v2/v2-data re-exports for backward compatibility.
 */

import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

export const DEFAULT_PROJECTS = [
  {
    id: "08",
    title: "CareerEdge",
    category: "Career / EdTech",
    year: "2026",
    description:
      "Multi-role career platform — I positioned the AI guide as the product spine so a massive surface area stays learnable: progressive disclosure, honest navigation, and context that carries across journeys.",
    image: ph("CareerEdge · Career OS", 1080, 608),
    slug: "careeredge",
    featured: true,
    pinned: true,
  },
  { id: "01", title: "Bridgepay", category: "Fintech", year: "2025", description: "Shaping a new escrow sub-product from the ground up — making online buying and selling safer for Nigerians moving money globally.", image: ph("Bridgepay · Escrow & FX", 1080, 608), slug: "bridgepay", featured: false, pinned: false },
  { id: "02", title: "Urban", category: "Transportation", year: "2025", description: "Redesigning both rider and driver apps for a Nigerian interstate transport platform — modern, simple, safe.", image: ph("Urban · Rider & driver", 1080, 608), slug: "urban", featured: false, pinned: false },
  { id: "03", title: "Customer Support Platform", category: "B2B", year: "2025", description: "PowerCS — helping a founder turn a big vision into a real, manageable MVP, from PRD to clear flows and dashboard.", image: ph("PowerCS · Customer support", 1080, 608), slug: "customer-support-platform", featured: false, pinned: false },
  { id: "04", title: "Dara", category: "Fintech", year: "2025", description: "A personal finance & tax management platform for Nigerian freelancers and SMEs — designed and built entirely with AI-assisted tools.", image: "https://images.unsplash.com/photo-1623593476737-0fc80f6be51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "dara", featured: false, pinned: false },
  { id: "05", title: "Soro", category: "Marketplace", year: "2024", description: "UX teardown and complete redesign of a Nigerian community marketplace — taking it from 'Craigslist clone' to trusted local commerce.", image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "soro", featured: false, pinned: false },
  { id: "06", title: "Pulse", category: "Mobile Wellness", year: "2025", description: "A mindfulness app for high-stress professionals — designed for one-handed use in 90-second sessions.", image: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "pulse", featured: false, pinned: false },
  { id: "07", title: "Kora", category: "Brand Identity", year: "2024", description: "Complete brand identity for a West African design collective — built on constraint, craft, and cultural tension.", image: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "kora", featured: false, pinned: false },
];

export const DEFAULT_CRAFT_ITEMS = [
  { id: "c-01", title: "Typography Exploration", category: "Type", description: "Experimental lettering compositions pushing the boundaries of editorial design.", image: "https://images.unsplash.com/photo-1734543920075-59872330bec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-02", title: "Geometric Study", category: "Visual", description: "Abstract geometric compositions exploring form, color, and negative space.", image: "https://images.unsplash.com/photo-1688141585146-1fb4a1358c87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-03", title: "Brand Identity Concept", category: "Branding", description: "Speculative brand systems for fictional companies and side ventures.", image: "https://images.unsplash.com/photo-1765448808249-a3610f38e612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-04", title: "Illustration Series", category: "Illustration", description: "Minimalist illustration explorations blending digital and hand-drawn approaches.", image: "https://images.unsplash.com/photo-1763013373616-2d81a44ab7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-05", title: "Component System", category: "UI", description: "Atomic design tokens and component libraries for personal and client projects.", image: "https://images.unsplash.com/photo-1672689956124-18666b4cdae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-06", title: "Motion Study", category: "Motion", description: "Micro-interactions and motion design principles captured in looping compositions.", image: "https://images.unsplash.com/photo-1761331081358-95583c97ddb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-07", title: "Data Visualization", category: "DataViz", description: "Creative approaches to presenting complex datasets in beautiful, human-readable formats.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
  { id: "c-08", title: "3D Interface Concepts", category: "3D", description: "Spatial UI explorations imagining the next dimension of digital interfaces.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
];

export const DEFAULT_EXPLORATIONS = [
  { id: "ex-01", title: "Void Gradient 001", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1754738381797-6066f4759065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Figma", "Photoshop"], date: "2025" },
  { id: "ex-02", title: "Fluid Motion Loop", category: "Motion", type: "video" as const, image: "https://images.unsplash.com/photo-1772037441173-3840bb55b7ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["After Effects", "Cinema 4D"], date: "2025" },
  { id: "ex-03", title: "Neon Signal", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1759266585548-dc7d1b412fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Illustrator"], date: "2025" },
  { id: "ex-04", title: "Geometric Deconstruct", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1640346876473-f76a73c71539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Figma"], date: "2024" },
  { id: "ex-05", title: "Chromatic Drift", category: "Motion", type: "video" as const, image: "https://images.unsplash.com/photo-1616651181620-9906d6e43fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["After Effects", "Figma"], date: "2024" },
  { id: "ex-06", title: "Brutalist Grid 002", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1764083292858-1576bce9e678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Photoshop", "Figma"], date: "2024" },
  { id: "ex-07", title: "Glitch Sequence", category: "Motion", type: "video" as const, image: "https://images.unsplash.com/photo-1770520218894-d9f464825dfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["After Effects"], date: "2024" },
  { id: "ex-08", title: "Sphere Study", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1730047250434-8821bfd28e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Blender", "Figma"], date: "2024" },
  { id: "ex-09", title: "Type In Motion", category: "Motion", type: "video" as const, image: "https://images.unsplash.com/photo-1635870025058-c1f6e70515be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["After Effects", "Illustrator"], date: "2025" },
  { id: "ex-10", title: "Light Trail 003", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1644705198676-f488845bba05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Photoshop"], date: "2025" },
  { id: "ex-11", title: "Dark Matter", category: "Graphics", type: "image" as const, image: "https://images.unsplash.com/photo-1771612983055-e5390a38176b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Figma", "Photoshop"], date: "2025" },
  { id: "ex-12", title: "Particle Cascade", category: "Motion", type: "video" as const, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", tools: ["Cinema 4D", "After Effects"], date: "2024" },
];

export type TestimonialItem = {
  id: string | number;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string | null;
  companyLogo?: string | null;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
};

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { id: 1, quote: "One key thing I would say about Deron, having worked with him for a very long time, is the full attention, detail, and commitment he puts into getting work done. He goes the extra mile to make sure the results surpass your expectations. It has always been a pleasure working with him, and I am super confident you would love working with him too.", name: "Alabi Hafeez", role: "CEO", company: "Bridgepay", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", companyLogo: null },
  { id: 2, quote: "Deron has a keen eye for detail and is always open to feedback to make the project better. Working with him made the entire process enjoyable.", name: "Latifah Yusuf", role: "Collaborator", company: "TechCabal", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", companyLogo: null },
];

/**
 * A service's attached media. URLs are *references* to assets already uploaded
 * elsewhere on the site (case study slides, craft items, media config) — the
 * admin picker gathers those into a library so nothing has to be re-uploaded.
 */
export type ServiceMediaRef = {
  url: string;
  type: "image" | "video" | "lottie";
  /** Where it came from, for the admin tray label (e.g. "Case study: Dara"). */
  label?: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  /** "What you get" bullet list. */
  gives: string[];
  /** One-line scope statement. */
  scope: string;
  /** Media crawl shown in the Editorial Index detail panel. */
  media?: ServiceMediaRef[];
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  pinned?: boolean;
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "product-design",
    name: "Product Design",
    gives: ["Research → shipped pixels", "Flows, IA, journeys", "High-fidelity surface"],
    scope: "End-to-end, solo or embedded in your team.",
    media: [],
  },
  {
    id: "design-systems",
    name: "Design Systems",
    gives: ["Component library", "Design tokens", "Usage docs"],
    scope: "So the team stops redrawing the same button.",
    media: [],
  },
  {
    id: "build-ship",
    name: "Build & Ship",
    gives: ["React / Next implementation", "Prototype → production", "QA mindset"],
    scope: "Hands-on in the codebase. Validation, not theatre.",
    media: [],
  },
  {
    id: "brand-identity",
    name: "Brand Identity",
    gives: ["Visual language", "Type system", "Brand through-line"],
    scope: "Makes the product feel like one coherent thing.",
    media: [],
  },
  {
    id: "ai-product-design",
    name: "AI Product Design",
    gives: ["Human-first AI UX", "Trust & confidence states", "Model-in-the-loop flows"],
    scope: "Building Dara taught me where trust actually breaks.",
    media: [],
  },
  {
    id: "interactive-prototypes",
    name: "Interactive Prototypes",
    gives: ["Clickable demos", "Real interactions", "Vision you can feel"],
    scope: "Carries further than any deck.",
    media: [],
  },
];

/* ─── About page ─────────────────────────────────────────────────
   Editable copy + media + per-section visibility for the About page.
   Wrap a word in *asterisks* to render it in gold (e.g. "*why*"). */
export type AboutFilm = { title: string; why: string; cover?: string };

export type AboutSections = {
  globe: boolean;
  lives: boolean;
  films: boolean;
  console: boolean;
  friendCat: boolean;
  health: boolean;
};

export type AboutContent = {
  greeting: string;
  location: string;
  hook: string;
  intro: string[];
  livesIntro: string;
  lives: string[];
  comics: string;
  missionIntro: string;
  peak: string;
  dara: string;
  daraTag: string;
  midShow: string;
  films: AboutFilm[];
  genres: string[];
  consoleHeading: string;
  consoleBody: string;
  games: string[];
  friendCat: string;
  health: string;
  signoff: string;
  /** Per-section hide/unhide, editable from /admin/about. */
  sections: AboutSections;
};

export const DEFAULT_ABOUT: AboutContent = {
  greeting: "Hi, I'm Deron",
  location: "Abuja, NG · 9.07°N 7.49°E",
  hook: "Most people learn to read a room. I had to *reverse-engineer* one.",
  intro: [
    "Social cues never came easily — people would say one thing and mean the opposite, and I needed to know *why*. So I started watching. Collecting patterns. Working out what people actually meant, so I'd know how to meet them.",
    "That itch became a stack of psychology books. Then neuroscience — emotion is the layer sitting under every decision. Then anthropology, sociology, anything that explained how people work. It's also why I obsess over how a product *feels*, not just whether it works.",
  ],
  livesIntro: "I've lived a few lives to get here —",
  lives: ["Digital marketing", "Code", "Ecommerce", "Music production", "Blogging", "Graphic design"],
  comics:
    "As a kid I drew and wrote my own comics. I was always going to make things — product design just finally gave the creativity somewhere to point.",
  missionIntro:
    "And it pointed somewhere specific. The deeper I went, the clearer it got: technology quietly leaves people behind. Not fast enough, not abled enough, not enough access — and the future moves on without you.",
  peak: "I build so *fewer people* get left.",
  dara: "Right now that's Dara — an AI finance assistant for Nigerian freelancers and small businesses.",
  daraTag: "● beta · still learning",
  midShow: "Off the clock, I'm mid-show. I watch for the people, never the plot.",
  films: [
    { title: "Interview with the Vampire", why: "Immortality as a relationship microscope — messy people problems that never die.", cover: "" },
    { title: "Shrinking", why: "Grief and therapy played for warmth, not pity.", cover: "" },
    { title: "The Midnight Gospel", why: "Psychedelic talks about death, the mind, and meaning.", cover: "" },
    { title: "Dark", why: "Cause and effect across generations — the patterns that refuse to stay buried.", cover: "" },
    { title: "The Big Bang Theory", why: "Comfort sitcom — my social-dynamics sandbox.", cover: "" },
  ],
  genres: ["Documentaries", "Thriller", "Anime & animation", "Horror", "Marvel & DC", "Sitcoms", "Dark & mind-bending"],
  consoleHeading: "I'm also mourning the console I don't own.",
  consoleBody: "Console, PC, mobile — I'll play all of it. Raised on these. The PS5 wishlist stays open indefinitely.",
  games: ["Halo", "God of War", "Mortal Kombat", "FIFA", "Call of Duty", "NBA 2K"],
  friendCat:
    "The rest of the time I'm getting dragged outside by a friend who's better at rest than I am. My *cat* supervises all of it.",
  health:
    "I care, maybe too much, about how people are actually doing — mental health, and the physical stuff the system gets to last. Especially *women's health and autoimmune*. Same reflex that makes me build for the overlooked.",
  signoff: "If you've read this far — hi. Let's build something for the people usually *skipped*. :)",
  sections: { globe: false, lives: false, films: true, console: false, friendCat: false, health: false },
};
