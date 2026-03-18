import type { CaseStudy } from "../../types/case-study";

const cover =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

/**
 * URBAN — Redesigning a Transportation Experience
 * Source: https://derondsgns.framer.website/product-explorations/urban-redesigning-a-transportation-experience-(end-user-driver)
 */
export const URBAN_CASE_STUDY: CaseStudy = {
  slug: "urban",
  meta: {
    title: "Urban",
    client: "Urban",
    year: "2025",
    role: "Product Designer",
    tags: ["Transportation", "Rideshare", "Mobile Design", "Web Design"],
    cover,
    summary: "Redesigning both rider and driver apps for a Nigerian interstate transport platform — modern, simple, safe, without breaking the complex system already in use.",
    color: "#10B981",
  },
  template: "full-product",
  acts: [
    {
      title: "Overview & Problem",
      slides: [
        {
          type: "cover",
          id: "urban-cover",
          headline: "Urban — Redesigning a Transportation Experience",
          subtitle: "End user & driver — one ecosystem, two distinct needs.",
          tags: ["Transportation", "Mobile Design", "Web Design"],
          heroImage: cover,
          device: "phone",
        },
        {
          type: "narrative",
          id: "urban-overview",
          headline: "Overview",
          body: "Urban is a transportation platform built to improve how Nigerians travel across states. The founder had a big, long-term vision — something that would outlive him and genuinely make travel safer, kinder, and more organized for ordinary Nigerians. The product team before me was mostly engineers, and the apps reflected that. The design was outdated, the flows were confusing, and the experience didn't match the heart and ambition behind the idea.",
        },
        {
          type: "narrative",
          id: "urban-problem",
          headline: "The problem (before redesign)",
          body: "The UI looked old and disconnected. The UX was confusing, with too many unnecessary screens. Trip booking didn't follow patterns Nigerians are familiar with. The copy felt robotic and unhelpful. Drivers had three separate pages just to understand their trips. Important actions were hidden. There were no real safety features. The navigation made simple tasks feel stressful. The founder knew something was wrong, but he couldn't fully name it. He just knew the product wasn't doing justice to his vision — and he needed help.",
        },
      ],
    },
    {
      title: "What I Did",
      slides: [
        {
          type: "section-break",
          id: "urban-act2",
          actTitle: "What I Did",
          actNumber: 2,
          subtitle: "Rider app and driver app",
        },
        {
          type: "narrative",
          id: "urban-rider",
          headline: "Rider app",
          body: "I redesigned the booking flow for trips and flights, updated the home screen, and simplified the way users view their history and upcoming schedules. I introduced bottom sheets to show clear travel requirements, payment status, and important information people need before travelling. Overall, I modernized the entire experience and made it feel familiar to anyone who has used apps like Bolt or Uber — but adapted to interstate travel needs.",
        },
        {
          type: "narrative",
          id: "urban-driver",
          headline: "Driver app",
          body: "This side was more constrained because of business rules, but it needed clarity even more. I consolidated three separate sections (Records, Requests, Trips) into two simple ones. I reorganized their dashboard, redesigned the profile, and made important actions easier to find. Because interstate travel in Nigeria carries real risks, I added: an SOS button, a place to view vehicle documents during police checks, and a hidden wallet toggle for safety during robbery situations. These were features the founder never thought about, but they were necessary for the real world.",
        },
      ],
    },
    {
      title: "Result & Reflection",
      slides: [
        {
          type: "section-break",
          id: "urban-act3",
          actTitle: "The Result",
          actNumber: 3,
          subtitle: "After the redesign",
        },
        {
          type: "narrative",
          id: "urban-result",
          headline: "Impact",
          body: "The apps became much easier to navigate. The booking and trip flow became clearer. Drivers could manage work without confusion. The product looked modern and trustworthy. Safety was taken seriously. Redundant screens were removed. Development became faster because of the components I created. Most importantly, the product finally started to look and feel like the vision the founder had in his mind.",
        },
        {
          type: "narrative",
          id: "urban-reflection",
          headline: "Reflection",
          body: "This project taught me a lot about designing within tight constraints and improving a system without breaking what already worked. It also reminded me how much I enjoy helping founders translate their ideas into experiences that feel human and thoughtful.",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Scope", value: "Rider + driver apps" },
      { label: "Focus", value: "Interstate travel in Nigeria" },
    ],
  },
};
