import type { CaseStudy } from "../../types/case-study";

const cover =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

/**
 * CUSTOMER SUPPORT PLATFORM (PowerCS)
 * Source: https://derondsgns.framer.website/product-explorations/powercs-helping-a-founder-turn-a-big-vision-into-a-real-manageable-mvp
 */
export const CUSTOMER_SUPPORT_PLATFORM_CASE_STUDY: CaseStudy = {
  slug: "customer-support-platform",
  meta: {
    title: "Customer Support Platform",
    client: "PowerCS",
    year: "2025",
    role: "Product Designer",
    tags: ["Product Design", "B2B", "Web Design"],
    cover,
    summary: "Helping a founder turn a big vision into a real, manageable MVP — from a long PRD to clear flows, onboarding, and dashboard.",
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
      title: "The Result",
      slides: [
        {
          type: "section-break",
          id: "csp-act2",
          actTitle: "The Result",
          actNumber: 2,
          subtitle: "Even without full development",
        },
        {
          type: "narrative",
          id: "csp-result",
          headline: "What we achieved",
          body: "The onboarding flow became significantly easier. The MVP became clearer and more realistic. The dashboard took shape in a way that matched his brand values. We removed friction from the user journey. The product began to feel intentional and premium. The foundation for V1 was finally solid. And the founder gained clarity he didn't have before. The project didn't complete because of circumstances — but the groundwork and design direction remain strong and usable.",
        },
      ],
    },
    {
      title: "Reflection",
      slides: [
        {
          type: "section-break",
          id: "csp-act3",
          actTitle: "Reflection",
          actNumber: 3,
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
