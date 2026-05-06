import type { CaseStudy } from "../../types/case-study";
import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

/**
 * CareerEdge(d) — flagship case study
 * Copy and structure only; replace placeholder images via admin → content/case-studies.json or edit this file.
 * Live: https://careeredged.com (floating CTA uses liveDemoUrl on the case study page).
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
      "A multi-role career platform where I repositioned the AI guide as the spine of the product—making a huge surface area learnable without turning the UI into an inventory list.",
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
          id: "ce-why",
          headline: "Career software fails in the gaps, not the hero section",
          body: "People don't struggle because a dashboard is ugly. They struggle because the product asks for attention in the wrong order—too much at once, too late, or repeated across screens.\n\nCareerEdge sits in that high-stakes space: guidance, progression, identity across roles, and a long list of ambitions from the business. My job was to turn that collision into a coherent experience: one spine users can follow, and a product team can ship without turning every feature into a homepage.",
          annotation:
            "If you only read one thing: the win was architectural—what to surface, what to defer, and what Sophia is responsible for remembering.",
          narrator: {
            label: "DESIGNER'S NOTE",
            mood: "thinking",
            text: "I name the real job early: reduce cognitive load without hiding legitimate power. That is the same problem founders feel when they say “we need AI”—they need sequencing and trust, not more panels.",
          },
        },
        {
          type: "insight",
          id: "ce-insight-complexity",
          headline: "What made this hard was not visuals",
          insightLabel: "SYSTEM TRUTH",
          insightText:
            "This was an ecosystem problem: many actors, many journeys, and overlapping mental models. The interface had to feel simple while the backend reality stayed complex.",
          body: "When the surface area grows, teams often respond by exposing everything—because every stakeholder can point to a “critical” screen. The UX failure mode is different: the product becomes honest but unusable.\n\nI treated that tension as the primary design input, not a polish pass at the end.",
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
          headline: "Product shell + guidance layer (replace with your export)",
          image: ph("CareerEdge · Shell + guidance", 1600, 1000),
          device: "browser",
          caption: "Placeholder hero — upload the real dashboard / shell screenshot.",
        },
        {
          type: "single-mockup",
          id: "ce-mock-sophia",
          headline: "Context strip, not generic chat noise",
          image: ph("CareerEdge · Sophia context", 1600, 1000),
          device: "browser",
          caption: "Capture the moment Sophia interprets state—milestones, deadlines, next actions.",
        },
        {
          type: "flow",
          id: "ce-flow-onboarding",
          headline: "A walkthrough that earns the next screen",
          screens: [
            { image: ph("CareerEdge · Step 01", 900, 1200), label: "Entry", device: "phone" },
            { image: ph("CareerEdge · Step 02", 900, 1200), label: "Context", device: "phone" },
            { image: ph("CareerEdge · Step 03", 900, 1200), label: "Commitment", device: "phone" },
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
          headline: "Artifacts you can swap in for credibility",
          artifacts: [
            {
              image: ph("CareerEdge · IA map", 1200, 800),
              label: "IA / journey map",
              description: "Replace with your navigation model, role map, or simplified diagram.",
            },
            {
              image: ph("CareerEdge · UI audit", 1200, 800),
              label: "Rigor screenshots",
              description: "Optional: validation notes, edge cases, or before/after captures—proof you ship carefully.",
            },
            {
              image: ph("CareerEdge · Design system", 1200, 800),
              label: "System moments",
              description: "Tokens, components, or the “earned moment” highlights—whatever best shows taste with reasons.",
            },
          ],
        },
        {
          type: "mockup-gallery",
          id: "ce-gallery",
          headline: "Surface gallery (replace with final media)",
          mockups: [
            { image: ph("CareerEdge · Screen A", 1200, 800), device: "browser", label: "Core surface A" },
            { image: ph("CareerEdge · Screen B", 1200, 800), device: "browser", label: "Core surface B" },
            { image: ph("CareerEdge · Mobile", 900, 1200), device: "phone", label: "Mobile-critical path" },
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
