import type { CaseStudy } from "../../types/case-study";
import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

/**
 * CareerEdge(d) — flagship case study
 * Replace images in Admin → Case Studies in **top-to-bottom slide order**:
 *   Cover hero → M01 shell → M02 Sophia strip → F01–F03 onboarding flow → P01–P03 process → G01–G03 gallery
 * (captions echo these IDs so you can paste URLs without hunting.)
 * Live: https://careeredged.com
 */

const cover = ph("CareerEdge · AI-guided career OS", 1920, 1080);

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
      "Information Architecture",
      "Design Systems",
    ],
    cover,
    summary:
      "Built fast and wide first—eight roles and twenty-plus features—CareerEdge needed design to turn breadth into a legible product. I reframed the AI guide as the spine so the experience could breathe without giving up the roadmap.",
    color: "#E2B93B",
  },
  template: "full-product",
  liveDemoUrl: "https://careeredged.com",
  acts: [
    {
      title: "Stakes",
      slides: [
        {
          type: "cover",
          id: "ce-cover",
          headline: "CareerEdge",
          subtitle:
            "Designing calm inside a complex career OS—AI as the spine, not the wallpaper.",
          tags: ["Career", "AI UX", "Platform design"],
          heroImage: cover,
          device: "browser",
        },
        {
          type: "narrative",
          id: "ce-origin",
          headline: "Fast shipping rewired the sequence—design had to catch a moving train",
          body: "We live in a moment where almost anyone can ship breadth: more roles, more dashboards, more toggles, faster than ever. That speed is not the enemy. What gets dangerous is when experience becomes the last discipline to get a real seat. The interface becomes a mirror of the backlog—honest, exhaustive, and exhausting.\n\nCareerEdge arrived in that shape: real ambition, real build velocity, and a footprint that had already outgrown casual browsing. My entry point was not “pick nicer cards.” It was redesigning how the product asks for attention.",
          narrator: {
            label: "DESIGNER'S NOTE",
            mood: "thinking",
            text: "I am not knocking the build. I am naming the new normal: if you wait on UX until the map is huge, you are not polishing—you are negotiating reality.",
          },
        },
        {
          type: "insight",
          id: "ce-built-breadth",
          headline: "What landed on the table first was coverage, not clarity",
          insightLabel: "WHERE IT STARTED",
          insightText:
            "Development had already assembled eight distinct roles—each with its own dashboard—and north of twenty features surfaced across the product. The system was real. The story users could hold in their heads was not.",
          body: "Numbers like that are not melodrama. They describe load: every role multiplies mental models, navigation hooks, and permission edges. Without a spine, the product does not feel “feature-rich.” It feels like homework with no teacher.\n\nThat is the gap my work targeted: keep the capability, earn comprehension.",
        },
        {
          type: "narrative",
          id: "ce-why",
          headline: "Career software fails in the gaps, not the hero section",
          body: "People don't struggle because a dashboard is ugly. They stall because the product pulls them through the wrong sequence—too much at once, too late, or the same questions asked again because nothing remembers.\n\nCareerEdge sits in a sharp corner of that problem: guidance, progression, identities that overlap, and a roadmap that refuses to shrink politely. My job was to compress that collision into something followable: one spine users could trust, and a shell the team could ship without turning every ambition into a homepage takeover.",
          annotation:
            "Structural win: what surfaces first, what waits, and what Sophia is allowed to remember so humans do not rehearse their life story on every screen.",
          narrator: {
            label: "DESIGNER'S NOTE",
            mood: "thinking",
            text: "Reduce cognitive load without burying power. Founders say “we need AI” here when what they need is sequencing and trust—not another panel parade.",
          },
        },
        {
          type: "insight",
          id: "ce-insight-complexity",
          headline: "What made this hard was not visuals",
          insightLabel: "SYSTEM TRUTH",
          insightText:
            "This stayed an ecosystem problem end to end: many actors, many journeys, overlapping mental models. The interface had to feel simple while the backend reality stayed honestly complex.",
          body: "Teams under pressure default to exposure—every stakeholder has a “critical” surface. The UX failure mode is quieter but crueler: the UI tells the truth about scope, and the user absorbs the anxiety.\n\nSo I did not treat this as a polish pass. I treated the tension as the brief.",
        },
      ],
    },
    {
      title: "Strategy",
      slides: [
        {
          type: "section-break",
          id: "ce-act-strategy",
          actTitle: "Strategy",
          actNumber: 2,
          subtitle: "Spine, disclosure, and permissions—not another chat bolt-on",
        },
        {
          type: "narrative",
          id: "ce-sophia-spine",
          headline: "Sophia as the product spine—experience + business",
          body: "I reframed Sophia from “an assistant you can open” into the connective tissue of the product.\n\nFor users, the goal was directional: meet people where they are, move them to the next best action, and keep context so they are not re-explaining themselves on every surface.\n\nFor the business, the goal was conservation: keep the roadmap’s breadth without turning the UI into a yard sale of features. If the spine works, the product can carry depth without screaming it.",
          narrator: {
            label: "PROCESS NOTE",
            mood: "pointing",
            text: "This is the product-management heart of the work: one spine that lets you preserve capability while improving legibility. That is how you earn the right to complexity.",
          },
        },
        {
          type: "insight",
          id: "ce-insight-disclosure",
          headline: "Progressive disclosure beats “show everything”",
          insightLabel: "POSITIONING DECISION",
          insightText:
            "The team needed breadth visible for legitimate reasons. Users need a path. I argued for layering: insight-first surfaces with a route into depth for power users—instead of an information inventory on first load.",
          body: "This is not aesthetic minimalism. It is risk management. When everything is visible, nothing signals priority—and users blame themselves when they cannot find progress.\n\nMy direction was to let Sophia carry interpreted insight and next steps, while the full map remains available for people who want control.",
        },
        {
          type: "narrative",
          id: "ce-access-matrix",
          headline: "Roles are not personas—they are permissions and life reality",
          body: "One of the sharpest product inconsistencies we had to unwind was access logic that ignored real human overlap.\n\nIf a parent is also building their own career, forcing a separate identity or email to access basic progression is not “security”—it is a workflow tax. I pushed the team to rethink the access matrix so cross-user reality could exist without asking humans to fractured themselves across accounts.\n\nBetter forms followed from the same principle: if Sophia already holds context from prior steps, the UI should not repeat fields for sport.",
        },
        {
          type: "narrative",
          id: "ce-forms",
          headline: "Shorter forms by design—context carries",
          body: "Traditional career products love giant questionnaires because they are easy to implement. Users hate them because they feel like homework with no feedback loop.\n\nBecause Sophia can gather and reuse context across touchpoints, I routed the experience toward fewer, better questions—timed where they matter—so each step feels like progress, not bureaucracy.",
        },
        {
          type: "narrative",
          id: "ce-navigation-philosophy",
          headline: "Navigation is emotional infrastructure",
          body: "Conversational UI is powerful, but “replace the shell with chat” is rarely correct for repeated work software. People build spatial memory: where a thing lives becomes part of how they trust the system.\n\nMy recommendation stayed grounded in three complementary modes: a stable structure users can learn, a contextual intelligence layer for guidance, and fast paths for expert intent. The goal is not novelty—it is reducing retrieval cost on bad days.",
          narrator: {
            label: "DESIGNER'S NOTE",
            mood: "neutral",
            text: "If you are hiring: this is the kind of argument I bring into a room—evidence-backed, user-honest, and compatible with serious engineering constraints.",
          },
        },
        {
          type: "single-mockup",
          id: "ce-mock-shell",
          headline: "[M01] Product shell — primary dashboard or role home",
          image: ph("CareerEdge · M01 shell", 1600, 1000),
          device: "browser",
          caption:
            "Admin: paste image URL here — best frame that shows structure + density before the spine work reads.",
        },
        {
          type: "single-mockup",
          id: "ce-mock-sophia",
          headline: "[M02] Sophia layer — context strip, not ambient chat",
          image: ph("CareerEdge · M02 Sophia", 1600, 1000),
          device: "browser",
          caption:
            "Admin: paste URL — show Sophia interpreting state (deadlines, next moves). If you have video, use a still here and link video elsewhere.",
        },
        {
          type: "flow",
          id: "ce-flow-onboarding",
          headline: "[F01–F03] Onboarding walkthrough (three beats)",
          screens: [
            {
              image: ph("CareerEdge · F01 onboarding", 900, 1200),
              label: "F01 Entry",
              device: "phone",
            },
            {
              image: ph("CareerEdge · F02 onboarding", 900, 1200),
              label: "F02 Context",
              device: "phone",
            },
            {
              image: ph("CareerEdge · F03 onboarding", 900, 1200),
              label: "F03 Commitment",
              device: "phone",
            },
          ],
        },
      ],
    },
    {
      title: "Execution",
      slides: [
        {
          type: "section-break",
          id: "ce-act-ship",
          actTitle: "Execution",
          actNumber: 3,
          subtitle: "Prototype-first, validation-led—ship what survives contact with reality",
        },
        {
          type: "narrative",
          id: "ce-build",
          headline: "How I actually worked (and how I judge “done”)",
          body: "This product could not afford theatre. A beautiful walkthrough that dead-ends is worse than an ugly one that tells the truth.\n\nMy standard is end-to-end fidelity for anything we claim: if a path is marked shipped, it must survive real interaction—states, transitions, empty cases, and the boring branches—not a demo that only works on the golden path.\n\nWhen tooling speed created gaps, I treated that as a process failure to fix, not a secret to live with.",
        },
        {
          type: "insight",
          id: "ce-insight-validation",
          headline: "The hidden metric is trust velocity",
          insightLabel: "QUALITY BAR",
          insightText:
            "Teams do not lose weeks because pixels are wrong—they lose weeks because work is marked complete when it is not. I optimized for verification: fewer promises, sharper proof.",
          body: "That discipline matters more in AI-assisted builds because speed can disguise incompleteness. I care about the moment someone tries the real click path—because that is when credibility is won or lost.",
        },
        {
          type: "metric",
          id: "ce-metrics-honest",
          headline: "What we can say without inventing KPIs",
          metrics: [
            {
              label: "Planning window",
              value: "~2 weeks",
              delta: "initial sprint shape",
            },
            {
              label: "Delivery window",
              value: "~1 month",
              delta: "real collaboration cadence",
            },
            {
              label: "Live iteration",
              value: "careeredged.com",
              delta: "external URL — verify in production",
            },
            {
              label: "Primary deliverable",
              value: "Spine + IA",
              delta: "directional platform UX",
            },
          ],
          narrator: {
            label: "REALITY CHECK",
            mood: "thinking",
            text: "If a number cannot be verified, it does not belong on a flagship case study. This panel is intentionally honest so founders trust the rest of the story.",
          },
        },
        {
          type: "process",
          id: "ce-process-artifacts",
          headline: "[P01–P03] Process artifacts — proof, not decoration",
          artifacts: [
            {
              image: ph("CareerEdge · P01 IA", 1200, 800),
              label: "P01 IA / nav model",
              description: "Admin: URL here — journey map, simplified role×surface diagram, or excerpt that shows how you reordered the story.",
            },
            {
              image: ph("CareerEdge · P02 rigor", 1200, 800),
              label: "P02 Validation / audit capture",
              description: "Admin: URL — notes, edge-case screen, or before/after that shows your verification standard.",
            },
            {
              image: ph("CareerEdge · P03 system", 1200, 800),
              label: "P03 System / moment",
              description: "Admin: URL — token hit, component, or branded “earned” instant that shows taste with rationale.",
            },
          ],
        },
        {
          type: "mockup-gallery",
          id: "ce-gallery",
          headline: "[G01–G03] Extra surfaces — fill what best sells the breadth",
          mockups: [
            {
              image: ph("CareerEdge · G01 browser", 1200, 800),
              device: "browser",
              label: "G01 Core browser surface",
            },
            {
              image: ph("CareerEdge · G02 browser", 1200, 800),
              device: "browser",
              label: "G02 Second hero flow",
            },
            {
              image: ph("CareerEdge · G03 mobile", 900, 1200),
              device: "phone",
              label: "G03 Mobile-critical path",
            },
          ],
        },
        {
          type: "narrative",
          id: "ce-close",
          headline: "What I would tell a founder reviewing this",
          body: "If you are building something with multiple audiences and an AI layer, your competitive advantage is not the model card.\n\nIt is sequencing: what to show first, what to earn over time, what the system remembers, and what never deserves a user’s attention on day one.\n\nThat is the work I want more of—high-trust product craft where the interface earns the right to be intelligent.",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Focus", value: "Spine-led IA" },
      { label: "Honest cadence", value: "~2 wk → ~1 mo" },
      { label: "Live product", value: "careeredged.com" },
    ],
  },
};
