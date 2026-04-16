import type { CaseStudy } from "../../types/case-study";
import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

/**
 * CUSTOMER SUPPORT PLATFORM (PowerCS)
 * Migrated from Framer product exploration (copy + structure; images are placeholders).
 * @see https://derondsgns.framer.website/product-explorations/powercs-helping-a-founder-turn-a-big-vision-into-a-real-manageable-mvp
 */
const cover = ph("PowerCS · Customer support", 1920, 1080);

export const CUSTOMER_SUPPORT_PLATFORM_CASE_STUDY: CaseStudy = {
  slug: "customer-support-platform",
  meta: {
    title: "Customer Support Platform",
    client: "PowerCS",
    year: "2025",
    role: "Product Designer",
    tags: ["Product Design", "B2B", "Web Design"],
    cover,
    summary:
      "A product design project focused on simplifying onboarding and shaping a cleaner MVP for PowerCS — flows, a clearer PRD, reduced onboarding friction, and psychological UX strategies including the IKEA Effect.",
    color: "#8B5CF6",
  },
  template: "feature-dive",
  acts: [
    {
      title: "Context",
      slides: [
        {
          type: "cover",
          id: "csp-cover",
          headline: "Customer Support Platform",
          subtitle: "PowerCS — turning a big vision into a manageable MVP.",
          tags: ["Product Design", "B2B", "Web Design"],
          heroImage: cover,
          device: "browser",
        },
        {
          type: "narrative",
          id: "csp-context",
          headline: "Where we started",
          body: "When I joined, there was no design, no flows, no screens — just a very long PRD the founder had been updating for months. He had a clear vision, but the details were still rough around the edges. This started with a simple but strong idea: create a platform that connects businesses with trained, certified customer service reps.",
        },
      ],
    },
    {
      title: "What I did",
      slides: [
        {
          type: "section-break",
          id: "csp-act-what",
          actTitle: "What I did",
          actNumber: 2,
          subtitle: "Flows, PRD clarity, psychology",
        },
        {
          type: "narrative",
          id: "csp-what",
          headline: "From PRD to interface",
          body: "I designed flows, clarified the PRD with the founder, and reduced onboarding friction so the MVP scope matched what we could actually ship. I also proposed psychological UX strategies — including the IKEA Effect — so users felt invested in setup steps rather than blocked by them.",
        },
        {
          type: "single-mockup",
          id: "csp-mock-onboarding",
          headline: "Onboarding direction",
          image: ph("Onboarding · wire + UI"),
          device: "browser",
          caption: "Placeholder — replace with final screens from Figma.",
        },
        {
          type: "single-mockup",
          id: "csp-mock-dashboard",
          headline: "Dashboard exploration",
          image: ph("Dashboard · MVP shell"),
          device: "browser",
          caption: "Placeholder — founder-facing dashboard concepts.",
        },
      ],
    },
    {
      title: "The Result",
      slides: [
        {
          type: "section-break",
          id: "csp-act-result",
          actTitle: "The Result",
          actNumber: 3,
          subtitle: "Even without full development",
        },
        {
          type: "narrative",
          id: "csp-result",
          headline: "What we achieved",
          body: "The onboarding flow became significantly easier. The MVP became clearer and more realistic. The dashboard took shape in a way that matched his brand values. We removed friction from the user journey. The product began to feel intentional and premium. The foundation for V1 was finally solid — and the founder gained clarity he didn't have before. The project didn't complete because of circumstances — but the groundwork and design direction remain strong and usable.",
        },
      ],
    },
    {
      title: "Reflection",
      slides: [
        {
          type: "section-break",
          id: "csp-act-reflect",
          actTitle: "Reflection",
          actNumber: 4,
          subtitle: "PowerCS",
        },
        {
          type: "narrative",
          id: "csp-reflection",
          headline: "What I learned",
          body: "PowerCS reminded me of how much I enjoy working directly with founders — especially when their vision is big but the structure needs refining. Collaborating closely, simplifying the PRD, shaping the MVP, and using UX psychology to make onboarding feel lighter were all parts of the work that reinforced my strength in founder-facing product design. Even though the project paused, the work we did together made a difference and gave the founder the clarity and direction he needed at a critical point.",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Client", value: "PowerCS" },
      { label: "Focus", value: "Founder-facing product design" },
    ],
  },
};
