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
      "Dara turns bank and fintech alerts into filing signal: scan email, run Gemini, you classify into buckets, the system learns, then it aggregates toward what you owe and when. Extraction is still patchy by provider—I am not dressing that up. Long posts unpack prompts, tax content, and what broke in beta.",
    color: "#E2B93B",
  },
  template: "full-product",
  liveDemoUrl: "https://mydara.co",
  acts: [
    {
      title: "Discovery",
      slides: [
        {
          type: "cover",
          id: "dara-cover",
          headline: "From inbox noise to filing signal",
          subtitle:
            "Email alerts → Gemini → you verify → buckets improve over time → aggregation and tax guidance. Built while I leveled up on AI-assisted shipping; the write-ups unpack each layer.",
          tags: ["Fintech", "Tax", "AI-Assisted Build"],
          heroImage: daraHero,
          device: "browser",
        },
        {
          type: "narrative",
          id: "dara-context",
          headline: "Start with the real friction",
          body:
            "Personal income tax in Nigeria is strenuous, overcomplicated, and thin on public education. Fines are heavy. A huge pool of freelancers and self-employed people earn in naira and dollars and are meeting that system for the first time with almost no plain-language on-ramp.",
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
            "Debit and credit alerts already land in email from banks and fintech. The job is extraction → classification → aggregation, then tax guidance that respects state rules.",
          body:
            "If the pipeline lies, the dashboard is a dark theme on garbage. Extraction is uneven by bank and sender today. I state that on purpose so the story stays mechanical, not magical.",
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
                "Scan email for debit and credit alerts from banks and fintech. Not every provider parses cleanly—that is still an active engineering edge.",
            },
            {
              image:
                "https://images.unsplash.com/photo-1562601555-513820e5d0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Gemini, then you verify",
              description:
                "Alerts run through Gemini, then you classify into buckets. The model does not get a free pass. Over time that feedback teaches the system to take more of the sorting with fewer mistakes.",
            },
            {
              image:
                "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Aggregate and tax path",
              description:
                "Structured signals roll up into estimates for what you owe, when to pay, and how to pay—plus state-level due dates and filing steps where that content is locked in the build.",
            },
            {
              image:
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Same pipe, wider surface (direction)",
              description:
                "Savings and investment platforms can ride the same ingestion idea later. Goals, journeys, and one centralized view across providers are the next horizon—not something I am pretending is finished in the flagship build.",
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
            "• Tax output: aggregate, estimate what you owe, when to pay, and how to pay—with state-specific due dates and filing steps where content is locked.\n\n• Human-in-the-loop after Gemini so classification improves from real use, not vibes.\n\n• WhatsApp nudges were cut. Cost and implementation weight were not worth it for where the product is.\n\n• Pioneer / beta: people can register; welcome-email automation is not end-to-end yet. I am not pretending the growth layer is finished.\n\n• Sub-features and edge cases stay out of this flagship so the spine stays readable. They ship in follow-up posts.",
          annotation:
            "Distribution and monetization hook to the same data plane: widen ingestion to savings and investments, then goals and one view across providers. I keep that in the case study as direction—the series goes deep on each slice.",
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
              device: "browser",
              label: "Additional surface",
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
            label: "Inbox → verify → learn → clarity",
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
              "No inflated percentages on this slide. If I did not measure it rigorously, it does not get a vanity metric.",
            label: "NOTE",
            mood: "thinking",
          },
        },
        {
          type: "embed",
          id: "dara-live",
          headline: "Live beta",
          embedUrl: "https://mydara.co",
          fallbackImage: daraHero,
          device: "browser",
          caption:
            "Beta is open registration at mydara.co. If this frame is empty, the app may block embedding—use the Live demo link above or open the site in a new tab. Mail access runs only after you authorize your mail provider sign-in flow; you can revoke anytime from provider security settings or in-app disconnect actions. Anything about retention or data handling on mydara.co privacy/terms is authoritative over this portfolio copy. This slide is explanatory, not a separate legal agreement.",
          narrator: {
            text:
              "Trust is often the bottleneck, not novelty: granting read access to mail feels existential until consent, revoke, and what we persist are plainly visible. Published policy pages carry the commitment; flagship copy only points people there honestly while extraction and classification still improve.",
            label: "TRUST NOTE",
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
