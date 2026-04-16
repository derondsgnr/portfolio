import type { CaseStudy } from "../../types/case-study";
import { caseStudyPlaceholder as ph } from "@/lib/case-study-placeholders";

/**
 * BRIDGEPAY — Escrow & International Payments
 * Migrated from Framer product exploration (copy + structure; images are placeholders).
 * @see https://derondsgns.framer.website/product-explorations/bridgepay-escrow-international-payments
 */
const cover = ph("Bridgepay · Escrow & FX", 1920, 1080);

export const BRIDGEPAY_CASE_STUDY: CaseStudy = {
  slug: "bridgepay",
  meta: {
    title: "Bridgepay",
    client: "Bridgepay",
    year: "2025",
    role: "Product Designer",
    tags: ["Fintech", "Payments", "Escrow", "Mobile Design"],
    cover,
    summary:
      "An escrow and international payments sub-product designed from scratch — clear flows for buyers, sellers, and non-registered users, under compliance and budget constraints.",
    color: "#3B82F6",
  },
  template: "full-product",
  acts: [
    {
      title: "Context",
      slides: [
        {
          type: "cover",
          id: "bridgepay-cover",
          headline: "Bridgepay — Escrow & International Payments",
          subtitle: "Making online buying and selling safer for everyone.",
          tags: ["Fintech", "Escrow", "Mobile Design"],
          heroImage: cover,
          device: "phone",
        },
        {
          type: "narrative",
          id: "bridgepay-context",
          headline: "The brief",
          body: "Bridgepay was building a payments platform to help Nigerians move money globally when the founder approached me with an emerging idea: \"Can we make online buying and selling safer for everyone?\" He and I had worked together before, so he trusted my ability to think holistically — product → UX → compliance → UI → strategy. Together, we shaped a new escrow sub-product from the ground up, starting with an empty screen.",
        },
      ],
    },
    {
      title: "What I Designed",
      slides: [
        {
          type: "section-break",
          id: "bridgepay-act2",
          actTitle: "What I Designed",
          actNumber: 2,
          subtitle: "End-to-end flows from sign-up to cross-border transfer",
        },
        {
          type: "narrative",
          id: "bridgepay-flows",
          headline: "Designed flows",
          body: "Sign-up and onboarding flow · Escrow initiation for buyers and business owners · Escrow initiation for freelancers and sellers · Non-registered recipient flow · Status and confirmation screens for both parties · Ability to switch between \"Escrow\" and \"International Payments\" · Cross-border transfer flow with currency clarity.",
        },
        {
          type: "single-mockup",
          id: "bridgepay-mock-onboarding",
          headline: "Onboarding",
          image: ph("Bridgepay · Sign up"),
          device: "phone",
          caption: "Placeholder — swap for shipped UI.",
        },
        {
          type: "single-mockup",
          id: "bridgepay-mock-escrow",
          headline: "Escrow initiation",
          image: ph("Bridgepay · Escrow"),
          device: "phone",
          caption: "Placeholder — buyer / seller paths.",
        },
        {
          type: "single-mockup",
          id: "bridgepay-mock-intl",
          headline: "International payments",
          image: ph("Bridgepay · FX transfer"),
          device: "phone",
          caption: "Placeholder — currency clarity & confirmation.",
        },
      ],
    },
    {
      title: "Outcome",
      slides: [
        {
          type: "section-break",
          id: "bridgepay-act3",
          actTitle: "Outcome",
          actNumber: 3,
          subtitle: "Results and reflection",
        },
        {
          type: "narrative",
          id: "bridgepay-outcome",
          headline: "What happened",
          body: "The escrow product wasn't shipped, but the work strengthened our collaboration. The founder continued bringing me in for product input, and later invited me as his design partner for a Lagos Business School innovation bootcamp, where our team earned an award. This project represents early but meaningful fintech thinking: building trust, reducing ambiguity, and designing flows that help people feel safe when money is involved.",
        },
        {
          type: "quote",
          id: "bridgepay-testimonial",
          quote:
            "One key thing I would say about Deron, having worked with him for a very long time, is the full attention, detail, and commitment he puts into getting work done. He goes the extra mile to make sure the results surpass your expectations. It has always been a pleasure working with him, and I am super confident you would love working with him too.",
          attribution: "Alabi Hafeez",
          role: "CEO, Bridgepay",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Project", value: "Escrow sub-product" },
      { label: "Recognition", value: "LBS Innovation Bootcamp Award" },
    ],
    testimonial:
      "One key thing I would say about Deron is the full attention, detail, and commitment he puts into getting work done. He goes the extra mile to make sure the results surpass your expectations.",
    testimonialAuthor: "Alabi Hafeez, CEO, Bridgepay",
  },
};
