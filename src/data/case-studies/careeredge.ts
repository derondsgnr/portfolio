import type { CaseStudy } from "../../types/case-study";
import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

/**
 * CareerEdge — flagship case study
 *
 * IMAGE SLOTS (replace via Admin → Case Studies in slide order):
 *   IMG-01  Cover hero           — product overview, dashboard or hero screen
 *   IMG-02  Brand identity       — color palette, typography, logo variants
 *   IMG-03  Comparison before    — original overwhelming navigation
 *   IMG-04  Comparison after     — redesigned 5-item navigation
 *   IMG-05  Flow screen 1        — sidebar navigation (role-filtered)
 *   IMG-06  Flow screen 2        — Sophia in guidance mode
 *   IMG-07  Flow screen 3        — "more" menu expanded
 *   IMG-08  Sophia single mockup — Sophia on career roadmap, reading state
 *   IMG-09  Gallery Sophia 1     — career roadmap surface
 *   IMG-10  Gallery Sophia 2     — employer dashboard
 *   IMG-11  Gallery Sophia 3     — coaching surface
 *   IMG-12  Process artifact 1   — 3-tier color system chart
 *   IMG-13  Process artifact 2   — navigation architecture / IA model
 *   IMG-14  Process artifact 3   — verification / edge case documentation
 *   IMG-15  Embed fallback       — screenshot of live careeredged.com
 */

const ph16x10 = (label: string) => ph(label, 1600, 1000);
const ph9x12 = (label: string) => ph(label, 900, 1200);
const ph12x8 = (label: string) => ph(label, 1200, 800);

export const CAREEREDGE_CASE_STUDY: CaseStudy = {
  slug: "careeredge",
  status: "published",
  featured: true,
  pinned: true,
  meta: {
    title: "CareerEdge",
    client: "CareerEdge",
    year: "2026",
    role: "Product designer — systems, AI experience, and hands-on build",
    duration: "~1 month active delivery (scoped initially as a 2-week sprint)",
    tags: [
      "Product Design",
      "AI UX",
      "Multi-sided Platform",
      "Design Systems",
      "Design Engineering",
    ],
    cover: ph16x10("CareerEdge · IMG-01 cover hero"),
    summary:
      "Redesigned an 8-user career platform — navigation, AI layer, and full frontend build — without removing a single feature. Sophia went from a chat button to the contextual intelligence running the entire product.",
    color: "#E2B93B",
  },
  template: "full-product",
  liveDemoUrl: "https://careeredged.com",
  acts: [
    /* ─────────────────────────────────────────────────────────────
       ACT 1 — CONTEXT
       The brief, the scope, the constraint, first strategic moves
    ───────────────────────────────────────────────────────────── */
    {
      title: "Context",
      slides: [
        {
          type: "cover",
          id: "ce-cover",
          headline: "CareerEdge",
          subtitle:
            "Redesigning an 8-user career platform without removing a single feature.",
          tags: ["Career OS", "AI UX", "Multi-sided Platform"],
          heroImage: ph16x10("CareerEdge · IMG-01 cover hero"),
          device: "browser",
        },
        {
          type: "narrative",
          id: "ce-brief",
          headline: "The product was built. The experience wasn't.",
          body: "CareerEdge came through a referral from a previous client. The backend was robust. The infrastructure was solid. The features were extensive. The problem was everything the user actually touches.\n\nWhen I got into the dashboard for the first time, it was overwhelming and disorienting. Nothing had hierarchy. Everything competed for attention. It looked like what it was — a product built for functionality, not for use.\n\nDuring our first calls I learned the full scope: eight user types, each with their own dashboard, their own features, their own goals. I asked for a PRD and they did not have one. I suggested they ask their coding agent to generate one from the existing codebase. What came back confirmed what I suspected — this was a genuinely robust system. The problem was that nobody had designed how people would actually use it.",
          narrator: {
            label: "THE CONSTRAINT",
            text: "The brief was complete: overhaul the UI and experience across all eight user types. The constraint was firm — nothing could be removed. Every feature had to ship.",
            mood: "thinking",
          },
        },
        {
          type: "insight",
          id: "ce-scope",
          headline: "Eight distinct user types. North of 33 features. One navigation system.",
          insightLabel: "SCOPE",
          insightText:
            "Job seekers, coaches, employers, parents, students, governments, NGOs, and guides — each with their own dashboard and feature set. The system was real. The story users could hold in their heads was not.",
          body: "Numbers like that describe load: every role multiplies mental models, navigation hooks, and permission edges. Without a spine, the product does not feel feature-rich. It feels like homework with no teacher. That is the gap my work targeted.",
        },
        {
          type: "narrative",
          id: "ce-first-moves",
          headline: "Before touching a single screen, I made two suggestions.",
          body: "First — they needed a brand identity. There was no visual language, no color system, no typography direction, no tone. Everything downstream would be guessing without it. I referred a brand designer I knew and we moodboarded together across several calls to sync on vision. He delivered colors, fonts, visual language, logo and brand assets. That gave me a foundation to build on.\n\nSecond — I fed Claude the generated PRD alongside my custom product skills covering business strategy, UX and product design. We went through ideas, research and brainstorming. I used Figma Make to prototype multiple flows and variations, targeting navigation and onboarding first. The prototypes were not deliverables — they were thinking tools. A way to feel whether a direction was right before committing to building it.",
          narrator: {
            label: "EARLY CATCH",
            text: "I logged into the parent dashboard and found that parents could not create their own career paths — only manage their children's. If a parent wanted to manage their own career, they needed a second account with a different email. That was a role architecture problem, not a UI problem. I flagged it.",
            mood: "pointing",
          },
        },
        {
          type: "single-mockup",
          id: "ce-brand",
          headline: "Brand identity — the foundation for everything downstream",
          image: ph16x10("CareerEdge · IMG-02 brand identity"),
          device: "browser",
          caption: "IMG-02 — Add: brand system overview — color palette, typography scale, logo variants",
        },
      ],
    },

    /* ─────────────────────────────────────────────────────────────
       ACT 2 — ARCHITECTURE
       Navigation that serves eight, and AI that reads the room
    ───────────────────────────────────────────────────────────── */
    {
      title: "Architecture",
      slides: [
        {
          type: "section-break",
          id: "ce-act-architecture",
          actTitle: "Architecture",
          actNumber: 2,
          subtitle: "Navigation that serves eight, and AI that reads the room",
        },
        {
          type: "narrative",
          id: "ce-nav-problem",
          headline: "Everything was visible. Nothing was prioritised.",
          body: "The original navigation was the source of most of the disorientation I felt on first use. Every feature, every link, every option — presented with equal weight. For a job seeker who just needs to update their resume and check their applications, seeing coaching management tools, employer dashboards and government reporting features is noise.\n\nMy first instinct was to strip it — remove features from the navigation entirely and let Sophia surface them contextually. The team pushed back. Some of their target users are not tech-savvy. Some are sensitive to AI. A navigation layer that requires you to know what to ask is not accessible to everyone.\n\nThey were right.",
          narrator: {
            label: "THE COMPROMISE",
            text: "Main navigation comes down to five items per role — the five most relevant to what that user actually needs daily. A 'more' item hosts everything else. Sophia becomes the intelligence layer on top of both.",
            mood: "thinking",
          },
        },
        {
          type: "comparison",
          id: "ce-nav-compare",
          headline: "Navigation — before and after",
          before: {
            image: ph16x10("CareerEdge · IMG-03 nav before"),
            label: "Original — 33 features, equal weight",
          },
          after: {
            image: ph16x10("CareerEdge · IMG-04 nav after"),
            label: "Redesigned — 5 items per role + more",
          },
        },
        {
          type: "flow",
          id: "ce-nav-layers",
          headline: "Three ways to navigate — different users reach for different layers",
          screens: [
            {
              image: ph16x10("CareerEdge · IMG-05 sidebar nav"),
              label: "Sidebar — spatial memory",
              device: "browser",
            },
            {
              image: ph16x10("CareerEdge · IMG-06 Sophia guidance"),
              label: "Sophia — guided action",
              device: "browser",
            },
            {
              image: ph16x10("CareerEdge · IMG-07 more menu"),
              label: "More — full feature access",
              device: "browser",
            },
          ],
          narrator: {
            label: "THREE LAYERS",
            text: "Users who know where they are going use the sidebar. Users who need direction use Sophia. Users who want everything use the more menu. Same product, three interfaces for three different states of mind.",
            mood: "pointing",
          },
        },
        {
          type: "narrative",
          id: "ce-sophia-intro",
          headline: "Sophia was a floating chat button. I redesigned her as the spine.",
          body: "When I first looked at Sophia, she was a floating chat button. Click it, ask a question, get a generic answer. She treated all eight user types the same. No awareness of where you were in the product, what you were trying to do, or what the system already knew about you.\n\nI redesigned her from a chat button into a contextual intelligence layer that runs across every surface of the product. On the career roadmap, she knows your current phase and your deadline. On the dashboard, she surfaces what is urgent today. She does not wait for you to ask — she reads where you are and acts on it.",
          narrator: {
            label: "THE SHIFT",
            text: "The amount of information CareerEdge needed to present was significant — career data, application statuses, coaching schedules, financial tracking, skill assessments, job matches. For one user type alone. Sophia was my answer to information overload.",
            mood: "thinking",
          },
        },
        {
          type: "single-mockup",
          id: "ce-sophia-mockup",
          headline: "Sophia on the career roadmap — knows your phase, knows your deadline",
          image: ph16x10("CareerEdge · IMG-08 Sophia in context"),
          device: "browser",
          caption: "IMG-08 — Add: Sophia contextual strip on career roadmap — showing phase-aware guidance and next action",
        },
        {
          type: "narrative",
          id: "ce-sophia-complexity",
          headline: "The most complex part of the entire project",
          body: "Contextualising Sophia across eight user types and over 33 features meant accounting for edge cases at a scale I had not worked with before. Her tone needed to stay consistent. Her guided interactions needed to be specific to the surface. She needed to maintain user context across the product so she was not asking the same questions on different pages. And every interaction she initiates had to reduce friction — not add a step.\n\nThe team agreed on this direction from the start. The compromise was ensuring Sophia was an addition to the navigation, not a replacement. Users comfortable with AI can do almost everything through her. Users who are not can ignore her entirely and use the sidebar. Both paths lead to the same place.",
        },
        {
          type: "mockup-gallery",
          id: "ce-sophia-gallery",
          headline: "Sophia across surfaces — same intelligence, different contexts",
          mockups: [
            {
              image: ph16x10("CareerEdge · IMG-09 Sophia roadmap"),
              device: "browser",
              label: "IMG-09 — Career roadmap",
            },
            {
              image: ph16x10("CareerEdge · IMG-10 Sophia employer"),
              device: "browser",
              label: "IMG-10 — Employer dashboard",
            },
            {
              image: ph16x10("CareerEdge · IMG-11 Sophia coaching"),
              device: "browser",
              label: "IMG-11 — Coaching surface",
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────────────────────────────────────
       ACT 3 — BUILD
       One designer. Eight dashboards. Six weeks. Built in code.
    ───────────────────────────────────────────────────────────── */
    {
      title: "Build",
      slides: [
        {
          type: "section-break",
          id: "ce-act-build",
          actTitle: "Build",
          actNumber: 3,
          subtitle: "One designer. Eight dashboards. Six weeks. Built in code.",
        },
        {
          type: "narrative",
          id: "ce-build-method",
          headline: "I did not design a single screen in Figma.",
          body: "Given the timeline — initially two weeks, ultimately a little over a month — I could not have designed eight user dashboards end-to-end in Figma and then built them. So I went from PRD to Figma Make prototypes to building directly in code. Every surface, every component, every interaction across all eight user types — built in the frontend.\n\nThe tools: Claude for strategy, brainstorming and code generation. Figma Make for rapid prototyping. Cursor for the build itself. My custom product skills for structured decision-making across UX, business strategy and product design. I worked alone on the entire build, collaborating with the product owner throughout.",
          narrator: {
            label: "PROCESS DISCOVERY",
            text: "Claude's service was unreliable for roughly two weeks during the project. There was a week where Claude told me features were built. When I tested them, they were not there. That is when I started using Git branches as checkpoints — every commit a state I could revert to when the AI's output did not match what it claimed.",
            mood: "frustrated",
          },
        },
        {
          type: "insight",
          id: "ce-color-system",
          headline: "Eight user types needed a color system, not a color palette",
          insightLabel: "THE COLOR SYSTEM",
          insightText:
            "Three tiers: role accent (one per user type), brand and semantic (cyan for Sophia and AI interactions, lime reserved exclusively for earned success moments), neutral gray for everything else. Every colored element had to earn its color.",
          body: "Without that system, eight user types worth of badges, icons, tags and avatars become visual chaos. The discipline was not aesthetic — it was architectural. Color became a signal, not decoration.",
        },
        {
          type: "process",
          id: "ce-process-artifacts",
          headline: "How the work was structured",
          artifacts: [
            {
              image: ph12x8("CareerEdge · IMG-12 color system"),
              label: "IMG-12 — 3-tier color system",
              description: "Add: color system documentation — role accents, semantic colors (cyan, lime), neutral tier",
            },
            {
              image: ph12x8("CareerEdge · IMG-13 nav architecture"),
              label: "IMG-13 — Navigation architecture",
              description: "Add: role × navigation model — which 5 items each user type sees, IA diagram",
            },
            {
              image: ph12x8("CareerEdge · IMG-14 verification"),
              label: "IMG-14 — Verification standard",
              description: "Add: edge case screen, state documentation, or before/after showing quality bar",
            },
          ],
        },
        {
          type: "narrative",
          id: "ce-hard-parts",
          headline: "What actually tested me",
          body: "EdgePath and EdgeMap were the two features the team was most particular about. They wanted many sub-features visible and accessible directly from the surface. My recommendation was to embed those interactions into Sophia — let her prompt those actions contextually while the user was actively working. We went back and forth and landed somewhere in between.\n\nThe product is US-based and the founders' personal experiences are tied to immigration. Given the political climate, there were valid concerns around the language used — around immigration, race and AI. We had to navigate that carefully in all the copy across the platform.\n\nThe hardest part was holding the entire system in mind while making decisions at the component level. Every decision I made on one surface could affect another. If Sophia's behaviour changed on the coaching dashboard, I needed to think through what that meant for the student dashboard, the employer dashboard, the parent dashboard. That kind of systems thinking at this scale was something I had not done before. It stretched me in ways I did not expect.",
          narrator: {
            label: "WHAT STRETCHED ME",
            text: "Building the frontend in code meant I needed to understand how the backend worked — not just the UI layer but how data flowed, how roles were authenticated, how features communicated across the system. This deepened my understanding of backend architecture in a way pure design work never could.",
            mood: "thinking",
          },
        },
        {
          type: "metric",
          id: "ce-what-shipped",
          headline: "What shipped",
          metrics: [
            { label: "User types covered", value: "8", delta: "end-to-end" },
            { label: "Features redesigned", value: "33+", delta: "across all roles" },
            { label: "Build method", value: "Code", delta: "zero Figma screens" },
            { label: "Live product", value: "careeredged.com", delta: "in testing" },
          ],
          narrator: {
            label: "FULL SCOPE",
            text: "Entire frontend across all eight user types — redesigned and built in code. New navigation architecture. Sophia from chat button to contextual intelligence layer. 3-tier color system. Brand identity integrated end-to-end. Onboarding flows.",
            mood: "neutral",
          },
        },
        {
          type: "embed",
          id: "ce-live",
          headline: "Live at careeredged.com",
          embedUrl: "https://careeredged.com",
          fallbackImage: ph16x10("CareerEdge · IMG-15 live product"),
          device: "browser",
          caption: "IMG-15 — Add: screenshot of live careeredged.com for mobile fallback",
        },
        {
          type: "narrative",
          id: "ce-learned",
          headline: "What I learned",
          body: "This was the most complex work I have done. It tested my ability to hold an entire system in mind while making decisions at the component level. It forced me to think about how Sophia's behaviour needed to stay consistent and contextual across eight user types and over 33 features. It deepened my understanding of backend architecture and how infrastructure decisions shape what is possible on the frontend.\n\nAnd it confirmed something I have been building toward: a designer who builds in code does not just see the interface. They see the system. The constraints are different. The tradeoffs are different. The conversations with engineering are different when you understand what is actually happening beneath the surface you are designing.\n\nI built this entire frontend alone, with AI, in a little over a month. Two years ago I could not have done that. The tools changed. I changed with them.",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "User types", value: "8 covered" },
      { label: "Features", value: "33+ redesigned" },
      { label: "Live product", value: "careeredged.com" },
    ],
  },
};
