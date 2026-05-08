import type { CaseStudy } from "../../types/case-study";

// TODO: swap for real Dara UI captures when exported from mydara
const daraHero =
  "https://images.unsplash.com/photo-1623593476737-0fc80f6be51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

/**
 * DARA — Personal fintech (tax + money clarity)
 * Source of truth for product flows: mydara/ at repo root.
 */
export const DARA_CASE_STUDY: CaseStudy = {
  slug: "dara",
  meta: {
    title: "Dara",
    client: "Personal Project",
    year: "2025–26",
    role: "Founder, product, UX, frontend, AI-assisted build",
    duration: "Ongoing",
    tags: ["Fintech", "Product Design", "Full-Stack", "AI-Assisted", "Tax"],
    cover: daraHero,
    summary:
      "Dara turns bank and fintech alerts into something you can file from—Gemini first, you confirm, it learns. I'm documenting how I built that while leveling up on AI-assisted shipping; the long posts unpack each layer.",
    color: "#E2B93B",
  },
  template: "full-product",
  liveDemoUrl: "#",
  acts: [
    {
      title: "Discovery",
      slides: [
        {
          type: "cover",
          id: "dara-cover",
          headline: "From email alerts to something you can file from",
          subtitle:
            "Gemini first, you confirm, it learns. Built while I leveled up on AI-assisted shipping—the write-ups unpack each layer.",
          tags: ["Fintech", "Tax", "AI-Assisted Build"],
          heroImage: daraHero,
          device: "browser",
        },
        {
          type: "narrative",
          id: "dara-context",
          headline: "Start with the real friction",
          body:
            "Personal income tax in Nigeria is a long, opaque process. Official education is thin, mistakes are expensive, and penalties are heavy. More freelancers and self-employed people earn in naira and dollars now—they are being introduced to a system that was never explained in plain language.",
          annotation:
            "I'm building for self-employed people first. Grassroots scale is the vision, but the story has to work for one person's inbox before it works for millions.",
          narrator: {
            text:
              "This wasn't a brief from a client. It started with my own frustration and what I see around me. The product is how I'm learning to ship with AI—not a slide deck about AI.",
            label: "NOTE",
            mood: "thinking",
          },
        },
        {
          type: "insight",
          id: "dara-insight-1",
          headline: "The wedge is what people already have",
          insightLabel: "PRODUCT CALL",
          insightText:
            "Debit and credit alerts already land in email from banks and fintech. The job is extraction, classification, aggregation—then tax guidance that respects state rules.",
          body:
            "If the pipeline can't turn those alerts into structured truth, the rest of the app is theatre. Extraction is uneven across providers today. That's the honest state of the build.",
        },
        {
          type: "single-mockup",
          id: "dara-competitor",
          headline: "What most tax products assume",
          annotation:
            "They assume patience for jargon, dense tables, and accountant-first mental models. I'm designing for someone who needs to know what they owe, when, and how to pay—without treating them like they already passed a tax exam.",
          image:
            "https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
          caption: "Placeholder stand-in for legacy / spreadsheet-heavy compliance UX — swap for labeled comparison when assets are ready.",
        },
      ],
    },
    {
      title: "Build",
      slides: [
        {
          type: "section-break",
          id: "dara-act2",
          actTitle: "Build",
          actNumber: 2,
          subtitle: "Pipeline, pivots, what ships today",
        },
        {
          type: "process",
          id: "dara-process",
          headline: "How the core loop works",
          artifacts: [
            {
              image:
                "https://images.unsplash.com/photo-1576153192396-180ecef2a715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Ingest",
              description:
                "Scan email for debit and credit alerts from banks and fintech. Not every provider parses cleanly yet—that's an active engineering edge.",
            },
            {
              image:
                "https://images.unsplash.com/photo-1562601555-513820e5d0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Gemini → you verify",
              description:
                "Every alert runs through Gemini, then you classify into buckets so the system learns and can take more of the work over time with fewer mistakes.",
            },
          ],
          narrator: {
            text:
              "I work in Cursor and Claude with the real repo in mydara/. Figma is in the loop when the UI needs it. The stack and prompts will get their own posts—this case study is the spine.",
            label: "PROCESS NOTE",
            mood: "pointing",
          },
        },
        {
          type: "narrative",
          id: "dara-decisions",
          headline: "Calls that shaped the product",
          body:
            "• Tax output: aggregate, estimate what you owe, when to pay, and how to pay—with state-specific due dates and filing steps where we've locked content.\n\n• Human-in-the-loop after Gemini so classification improves from real use, not guesswork.\n\n• WhatsApp nudges were cut. Cost and implementation weight weren't worth it for where the product is.\n\n• Pioneer / beta: people can register; welcome-email automation isn't end-to-end yet. I'm not pretending the growth layer is finished.",
          annotation:
            "Distribution and monetization extend the same data: savings and investment platforms next, then goals and one consolidated view across providers. That arc belongs in the flagship only as direction—the series goes deep.",
        },
        {
          type: "single-mockup",
          id: "dara-dashboard",
          headline: "Where clarity is supposed to land",
          image: daraHero,
          device: "browser",
          caption:
            "Dashboard shell — replace with current Dara UI from production or staging when exported.",
          annotation:
            "The promise is: money signal in, verified buckets, tax guidance out—plus a path to goals across accounts as the ingestion surface grows.",
          narrator: {
            text:
              "Dark-first UI and plain language stayed non-negotiable. Money UIs fail when they feel like they're auditing the user instead of briefing them.",
            label: "NOTE",
            mood: "neutral",
          },
        },
        {
          type: "mockup-gallery",
          id: "dara-screens",
          headline: "Surfaces to document next",
          mockups: [
            { image: daraHero, device: "browser", label: "Dashboard" },
            {
              image:
                "https://images.unsplash.com/photo-1642055509518-adafcad1d22e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              device: "phone",
              label: "Mobile / responsive",
            },
          ],
        },
        {
          type: "comparison",
          id: "dara-before-after",
          headline: "Traditional stack vs. Dara's bet",
          before: {
            image:
              "https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "Spreadsheets & accountant-first tools",
          },
          after: {
            image: daraHero,
            label: "Alerts → verify → learn → tax clarity",
          },
          device: "browser",
        },
      ],
    },
    {
      title: "Now",
      slides: [
        {
          type: "section-break",
          id: "dara-act3",
          actTitle: "Now",
          actNumber: 3,
          subtitle: "Beta truth, not launch theatre",
        },
        {
          type: "metric",
          id: "dara-metrics",
          headline: "Where it actually is",
          metrics: [
            {
              label: "Beta testers",
              value: "10",
              delta: "learning from real inboxes",
            },
            {
              label: "Tax guidance",
              value: "State-level",
              delta: "due dates + filing steps where locked",
            },
            {
              label: "Core loop",
              value: "Email → Gemini → verify",
              delta: "classification improves with use",
            },
            {
              label: "Extraction",
              value: "Patchy",
              delta: "by bank / sender — in progress",
            },
          ],
          narrator: {
            text:
              "No inflated percentages on this slide. If I didn't measure it rigorously, it doesn't get a vanity metric.",
            label: "NOTE",
            mood: "thinking",
          },
        },
        {
          type: "embed",
          id: "dara-live",
          headline: "Try it when the link is public",
          embedUrl: "#",
          fallbackImage: daraHero,
          device: "browser",
          caption:
            "Wire the real beta or app URL here when you want the iframe live. Until then this slide stays a deliberate stub.",
          narrator: {
            text:
              "Flagship case study + follow-up posts for extraction, prompts, tax content, and what broke in beta. That's the publishing shape I want.",
            label: "NOTE",
            mood: "pointing",
          },
        },
        {
          type: "quote",
          id: "dara-reflection",
          quote:
            "Dara is where I stopped treating AI as a shortcut and started treating it as part of the loop—same as email parsers, state tables, and UI. The case study is one thread; the rest is documented in pieces so nothing sounds like marketing filler.",
          attribution: "Deron",
          role: "Reflection",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Beta testers", value: "10" },
      { label: "Status", value: "In beta" },
      { label: "Build", value: "AI-assisted, ongoing" },
    ],
    testimonial:
      "Shipping Dara meant accepting uneven extraction, cutting WhatsApp for cost, and publishing beta status without dressing it up. The work continues in the open.",
    testimonialAuthor: "Personal reflection",
  },
};
