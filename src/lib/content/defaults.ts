/**
 * Default/fallback data for content loaders.
 * Single source of truth — used when content/*.json is missing or invalid.
 * lib/content uses these; components/v2/v2-data re-exports for backward compatibility.
 */

export const DEFAULT_PROJECTS = [
  { id: "01", title: "Bridgepay", category: "Fintech", year: "2025", description: "Shaping a new escrow sub-product from the ground up — making online buying and selling safer for Nigerians moving money globally.", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "bridgepay" },
  { id: "02", title: "Urban", category: "Transportation", year: "2025", description: "Redesigning both rider and driver apps for a Nigerian interstate transport platform — modern, simple, safe.", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "urban" },
  { id: "03", title: "Customer Support Platform", category: "B2B", year: "2025", description: "PowerCS — helping a founder turn a big vision into a real, manageable MVP, from PRD to clear flows and dashboard.", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "customer-support-platform" },
  { id: "04", title: "Dara", category: "Fintech", year: "2025", description: "A personal finance & tax management platform for Nigerian freelancers and SMEs — designed and built entirely with AI-assisted tools.", image: "https://images.unsplash.com/photo-1623593476737-0fc80f6be51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "dara" },
  { id: "05", title: "Soro", category: "Marketplace", year: "2024", description: "UX teardown and complete redesign of a Nigerian community marketplace — taking it from 'Craigslist clone' to trusted local commerce.", image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "soro" },
  { id: "06", title: "Pulse", category: "Mobile Wellness", year: "2025", description: "A mindfulness app for high-stress professionals — designed for one-handed use in 90-second sessions.", image: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "pulse" },
  { id: "07", title: "Kora", category: "Brand Identity", year: "2024", description: "Complete brand identity for a West African design collective — built on constraint, craft, and cultural tension.", image: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", slug: "kora" },
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
};

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { id: 1, quote: "One key thing I would say about Deron, having worked with him for a very long time, is the full attention, detail, and commitment he puts into getting work done. He goes the extra mile to make sure the results surpass your expectations. It has always been a pleasure working with him, and I am super confident you would love working with him too.", name: "Alabi Hafeez", role: "CEO", company: "Bridgepay", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", companyLogo: null },
  { id: 2, quote: "Deron has a keen eye for detail and is always open to feedback to make the project better. Working with him made the entire process enjoyable.", name: "Latifah Yusuf", role: "Collaborator", company: "TechCabal", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", companyLogo: null },
];
