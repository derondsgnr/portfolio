import type { CaseStudy } from "../../types/case-study";

// Placeholder: replace with actual Dara hero asset when available
const daraHero =
  "https://images.unsplash.com/photo-1623593476737-0fc80f6be51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

/**
 * DARA — Personal fintech project
 * Built with Claude, Figma Make, and Cursor
 * Nigerian tax & finance management platform
 */
export const DARA_CASE_STUDY: CaseStudy = {
  slug: "dara",
  meta: {
    title: "Dara",
    client: "Personal Project",
    year: "2025",
    role: "Product Designer & Developer",
    duration: "3 weeks",
    tags: ["Fintech", "Product Design", "Full-Stack", "AI-Assisted"],
    cover: daraHero,
    summary: "A personal finance & tax management platform for Nigerian freelancers and SMEs — designed and built entirely with AI-assisted tools.",
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
          headline: "Tax shouldn't feel like punishment",
          subtitle: "Designing a finance platform that makes Nigerian tax compliance feel effortless — not terrifying.",
          tags: ["Fintech", "Product Design", "AI-Assisted Build"],
          heroImage: daraHero,
          device: "browser",
        },
        {
          type: "narrative",
          id: "dara-context",
          headline: "The problem nobody was solving properly",
          body: "Nigerian freelancers and small business owners face a uniquely frustrating tax landscape. The tools that exist are built for accountants, not for people who just want to know: how much do I owe, and when is it due?",
          annotation: "This insight came from personal frustration — I was one of these people.",
          narrator: {
            text: "I started this project because I was tired of the spreadsheet gymnastics every quarter. If I — a tech-literate designer — was struggling, what about everyone else?",
            label: "DESIGNER'S NOTE",
            mood: "thinking",
          },
        },
        {
          type: "insight",
          id: "dara-insight-1",
          headline: "The trust deficit in Nigerian fintech",
          insightLabel: "RESEARCH FINDING",
          insightText: "7 out of 10 Nigerian freelancers surveyed said they don't trust any existing tool with their financial data. The barrier isn't technology — it's confidence.",
          body: "I spoke with 12 freelancers and small business owners across Lagos and Abuja. The pattern was consistent: they wanted to comply with tax regulations, but every tool made them feel like they needed an accounting degree first.",
        },
        {
          type: "single-mockup",
          id: "dara-competitor",
          headline: "What existing tools looked like",
          annotation: "Dense tables, accounting jargon, zero context. Every tool assumed you already knew what you were doing.",
          image: "https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
          caption: "A typical Nigerian tax compliance dashboard — built for accountants, not humans.",
        },
      ],
    },
    {
      title: "Design",
      slides: [
        {
          type: "section-break",
          id: "dara-act2",
          actTitle: "Design",
          actNumber: 2,
          subtitle: "From chaos to clarity",
        },
        {
          type: "process",
          id: "dara-process",
          headline: "How the solution took shape",
          artifacts: [
            {
              image: "https://images.unsplash.com/photo-1576153192396-180ecef2a715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Information Architecture",
              description: "Mapping the mental model of how freelancers think about money — not how accountants categorize it.",
            },
            {
              image: "https://images.unsplash.com/photo-1562601555-513820e5d0eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Component System",
              description: "A design system built for dark mode from day one — every component optimized for financial data density.",
            },
          ],
          narrator: {
            text: "I didn't follow a linear process here. I was designing in Figma Make, building in Cursor, and using Claude to generate the business logic simultaneously. The tools shaped the process as much as the thinking did.",
            label: "PROCESS NOTE",
            mood: "pointing",
          },
        },
        {
          type: "narrative",
          id: "dara-decisions",
          headline: "Three design decisions that defined everything",
          body: "1. Dark mode as default — because finances feel private, and dark interfaces feel more secure.\n\n2. The dashboard speaks in natural language — 'Good afternoon, Sharon. Here's your financial overview for Q1 2026' instead of raw data dumps.\n\n3. Tax deadlines as a countdown, not a date — '16 DAYS' hits different than 'April 1, 2026'.",
          annotation: "Every decision traced back to one principle: reduce cognitive load around money.",
        },
        {
          type: "single-mockup",
          id: "dara-dashboard",
          headline: "The dashboard that tells you what you need to know",
          image: daraHero,
          device: "browser",
          caption: "Dara's main dashboard — financial overview, tax deadlines, and quick actions in one view.",
          annotation: "Take-home income, tax owed, income sources, upcoming deadlines — all visible without scrolling.",
          narrator: {
            text: "The 'Good afternoon, Sharon' greeting wasn't just polish — it was a deliberate choice to make a financial tool feel like it knows you, not like it's auditing you.",
            label: "DESIGNER'S NOTE",
            mood: "celebrating",
          },
        },
        {
          type: "mockup-gallery",
          id: "dara-screens",
          headline: "Key screens across the platform",
          mockups: [
            { image: daraHero, device: "browser", label: "Dashboard" },
            { image: "https://images.unsplash.com/photo-1642055509518-adafcad1d22e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", device: "phone", label: "Mobile View" },
          ],
        },
        {
          type: "comparison",
          id: "dara-before-after",
          headline: "Before vs. After: Tax overview",
          before: {
            image: "https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "Traditional tax tools",
          },
          after: {
            image: daraHero,
            label: "Dara's approach",
          },
          device: "browser",
        },
      ],
    },
    {
      title: "Outcome",
      slides: [
        {
          type: "section-break",
          id: "dara-act3",
          actTitle: "Outcome",
          actNumber: 3,
          subtitle: "What happened when it shipped",
        },
        {
          type: "metric",
          id: "dara-metrics",
          headline: "The numbers that mattered",
          metrics: [
            { label: "Build time", value: "3 weeks", delta: "vs. typical 3 months" },
            { label: "Design to code", value: "0 handoff", delta: "I built what I designed" },
            { label: "AI assistance", value: "80%", delta: "of code generated" },
            { label: "Components", value: "45+", delta: "in the design system" },
          ],
        },
        {
          type: "embed",
          id: "dara-live",
          headline: "Try it yourself",
          embedUrl: "#",
          fallbackImage: daraHero,
          device: "browser",
          caption: "Live interactive prototype — click through the actual interface.",
          narrator: {
            text: "This is the actual deployed application, not a Figma prototype. Built with Figma Make and Cursor, running on real infrastructure.",
            label: "TECH NOTE",
            mood: "celebrating",
          },
        },
        {
          type: "quote",
          id: "dara-reflection",
          quote: "The future of design isn't choosing between designing and building. It's doing both — simultaneously, with AI as your collaborator.",
          attribution: "Deron",
          role: "Reflection on the process",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Build time", value: "3 weeks" },
      { label: "Components", value: "45+" },
      { label: "AI-generated code", value: "80%" },
    ],
    testimonial: "Dara proved that a single designer-developer, armed with the right AI tools, can ship a production-quality fintech platform in weeks, not months.",
    testimonialAuthor: "Personal reflection",
  },
};