import type { CaseStudy } from "../../types/case-study";

/**
 * KORA — Visual brand identity (visual-brand template)
 *
 * Stress-tests the engine with:
 *   - Heavy image focus, minimal text
 *   - Comparison slides (before/after brand)
 *   - No metrics, no embed, no flow
 *   - Process artifacts are all visual (moodboards, type specimens, color studies)
 *   - Mixed device frames (browser + tablet)
 *   - Short: only 2 acts, 8 slides total
 */
export const KORA_CASE_STUDY: CaseStudy = {
  slug: "kora",
  meta: {
    title: "Kora",
    client: "Kora Collective",
    year: "2024",
    role: "Brand & Product Designer",
    duration: "2 weeks",
    tags: ["Brand Identity", "Visual Design", "Art Direction"],
    cover: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    summary: "Complete brand identity and web presence for a West African design collective — built on constraint, craft, and cultural tension.",
    color: "#D4583A",
  },
  template: "visual-brand",
  acts: [
    {
      title: "Brief",
      slides: [
        {
          type: "cover",
          id: "kora-cover",
          headline: "Identity is not a logo",
          subtitle: "A design collective needed to look like they belonged globally — without losing what made them distinctly West African.",
          tags: ["Brand Identity", "Art Direction", "Cultural Design"],
          heroImage: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        },
        {
          type: "narrative",
          id: "kora-brief",
          headline: "The tension in the brief",
          body: "Kora Collective is a group of designers and makers across Lagos, Accra, and Nairobi. They wanted a brand that could sit next to Pentagram on a conference slide — but feel unmistakably African when you looked closer.\n\nThe trap would be to reach for obvious motifs: kente patterns, earth tones, tribal geometry. That's what every 'African brand' does. Kora needed something more nuanced.",
          narrator: {
            text: "The name 'Kora' is a 21-string West African harp. The instrument is incredibly sophisticated — but most Westerners have never heard of it. That paradox became the brand strategy.",
            label: "NAMING NOTE",
            mood: "pointing",
          },
        },
        {
          type: "insight",
          id: "kora-insight",
          headline: "The design principle",
          insightLabel: "BRAND STRATEGY",
          insightText: "Sophisticated at distance, culturally specific up close. Like a kora that sounds like a harp until you listen carefully.",
        },
      ],
    },
    {
      title: "Craft",
      slides: [
        {
          type: "section-break",
          id: "kora-act2",
          actTitle: "Craft",
          actNumber: 2,
          subtitle: "From principle to presence",
        },
        {
          type: "process",
          id: "kora-process",
          headline: "Visual exploration",
          artifacts: [
            {
              image: "https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Type Specimen",
              description: "Tested 40+ typefaces. Landed on a grotesque sans for headings (European precision) paired with a custom display face inspired by Nsibidi symbols.",
            },
            {
              image: "https://images.unsplash.com/photo-1635724287614-018e383ee98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Color Language",
              description: "Rejected earth tones. Built a palette from Lagos nightlife: electric terracotta, deep indigo, and a signal white that cuts through noise.",
            },
            {
              image: "https://images.unsplash.com/photo-1772191399367-91ed8d95664b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Texture System",
              description: "Every brand asset includes a subtle noise texture derived from high-res scans of hand-woven aso-oke fabric. You feel it before you see it.",
            },
            {
              image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Photography Direction",
              description: "Shot by Akin Temitope in Lagos. Tight crops, desaturated shadows, subjects caught mid-gesture. No poses. No smiles on demand.",
            },
          ],
          narrator: {
            text: "The texture system was the breakthrough. I spent an entire day at a textile market in Lekki scanning fabrics. Those scans became the invisible DNA of every brand touchpoint.",
            label: "PROCESS NOTE",
            mood: "celebrating",
          },
        },
        {
          type: "comparison",
          id: "kora-before-after",
          headline: "Before vs. After",
          before: {
            image: "https://images.unsplash.com/photo-1773089237195-bc9449198ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "Previous identity",
          },
          after: {
            image: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "Kora rebrand",
          },
        },
        {
          type: "single-mockup",
          id: "kora-web",
          headline: "The website",
          image: "https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
          caption: "koracollective.com — Built in Figma Make, deployed in 3 days.",
          narrator: {
            text: "The website is deliberately slow to scroll. Not broken — intentional. Each section reveals itself with the same pace as unwrapping hand-dyed fabric. The medium IS the message.",
            label: "INTERACTION DESIGN",
            mood: "pointing",
          },
        },
        {
          type: "quote",
          id: "kora-testimonial",
          quote: "For the first time, our brand feels like us — not like a Western studio trying to 'do Africa.' You captured something we couldn't articulate.",
          attribution: "Amara Osei",
          role: "Co-Founder, Kora Collective",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Brand assets", value: "120+" },
      { label: "Time to launch", value: "2 weeks" },
      { label: "Countries", value: "3" },
    ],
    testimonial: "For the first time, our brand feels like us — not like a Western studio trying to 'do Africa.' You captured something we couldn't articulate.",
    testimonialAuthor: "Amara Osei, Co-Founder, Kora Collective",
  },
};
