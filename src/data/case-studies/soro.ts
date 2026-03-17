import type { CaseStudy } from "../../types/case-study";

/**
 * SORO — Community marketplace teardown + redesign
 *
 * Stress-tests the engine with:
 *   - "teardown" template (analysis + redesign)
 *   - Comparison-heavy (multiple before/after)
 *   - Mixed device: browser + phone (responsive design)
 *   - Full 3-act structure with rich narrator commentary
 *   - Process slide with unconventional artifacts (screenshots of competitor fails)
 *   - Video slide (poster-only, no actual video)
 *   - Metric slide with business impact
 */
export const SORO_CASE_STUDY: CaseStudy = {
  slug: "soro",
  meta: {
    title: "Soro",
    client: "Soro Markets",
    year: "2024",
    role: "Product Designer (Contract)",
    duration: "6 weeks",
    tags: ["Marketplace", "Redesign", "Mobile + Web", "UX Teardown"],
    cover: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    summary: "UX teardown and complete redesign of a Nigerian community marketplace — taking it from 'Craigslist clone' to trusted local commerce.",
    color: "#22C55E",
  },
  template: "teardown",
  acts: [
    {
      title: "Teardown",
      slides: [
        {
          type: "cover",
          id: "soro-cover",
          headline: "Trust is a design problem",
          subtitle: "A marketplace where nobody trusted anyone. The fix wasn't features — it was removing reasons to doubt.",
          tags: ["UX Teardown", "Marketplace", "Trust Design"],
          heroImage: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
        },
        {
          type: "narrative",
          id: "soro-context",
          headline: "The state of local commerce",
          body: "Soro Markets was a 2-year-old marketplace for local goods in Lagos. Vendors could list products, buyers could browse. Simple.\n\nThe problem: 68% of users who added items to their cart never completed a purchase. Exit surveys pointed to one word over and over: trust.\n\n'How do I know this person is real?'\n'What if the product looks different?'\n'What if they take my money and disappear?'",
          narrator: {
            text: "I asked the founder: 'What's your return policy?' He said: 'We don't have one.' That's when I knew this wasn't a UI problem — it was a system design problem.",
            label: "FIRST IMPRESSION",
            mood: "frustrated",
          },
        },
        {
          type: "process",
          id: "soro-audit",
          headline: "The teardown",
          artifacts: [
            {
              image: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Heuristic Audit",
              description: "Found 23 usability violations in the first 5 screens. Missing feedback states, no loading indicators, error messages that said 'Error.'",
            },
            {
              image: "https://images.unsplash.com/photo-1773089237195-bc9449198ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Competitor Mapping",
              description: "Analyzed Jiji, Jumia, Instagram shops, and WhatsApp vendor accounts. Found that trust signals were the differentiator, not features.",
            },
            {
              image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "User Interview Synthesis",
              description: "12 interviews revealed that buyers judged vendor legitimacy by response speed, photo quality, and whether the listing had a price (many didn't).",
            },
          ],
          narrator: {
            text: "The biggest insight came from watching a user browse. She said: 'This feels like a scam website.' The product images were fine — but the typography, spacing, and color choices screamed 'amateur.' Trust is aesthetic before it's functional.",
            label: "OBSERVATION",
            mood: "thinking",
          },
        },
        {
          type: "insight",
          id: "soro-insight",
          headline: "The trust equation",
          insightLabel: "CORE FRAMEWORK",
          insightText: "Trust = (Responsiveness + Specificity + Social Proof) - Uncertainty. Every design decision was scored against this equation.",
          body: "We mapped every screen against this framework. Any element that increased Uncertainty was removed or redesigned. Any element that increased the numerator was amplified.",
        },
      ],
    },
    {
      title: "Redesign",
      slides: [
        {
          type: "section-break",
          id: "soro-act2",
          actTitle: "Redesign",
          actNumber: 2,
          subtitle: "Rebuilding trust from the ground up",
        },
        {
          type: "narrative",
          id: "soro-approach",
          headline: "Five trust-building patterns",
          body: "1. Verified vendor badges — not self-reported, earned through 3 completed transactions.\n\n2. Photo quality gates — listings without clear photos were deprioritized in search.\n\n3. Response time indicators — 'Usually responds in 5 minutes' shown prominently.\n\n4. Price transparency — mandatory pricing with 'negotiable' tag if flexible.\n\n5. Buyer protection banner — visible on every listing page, not buried in FAQ.",
          annotation: "Each pattern directly addressed a specific trust barrier from user interviews.",
        },
        {
          type: "comparison",
          id: "soro-listing-comparison",
          headline: "Product listing: Before vs. After",
          before: {
            image: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "Before: sparse, uncertain",
          },
          after: {
            image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            label: "After: verified, specific",
          },
          device: "phone",
          narrator: {
            text: "The before listing had 4 trust signals. The after has 11. Same information density — just intentionally arranged to answer doubt before it forms.",
            label: "DESIGN DETAIL",
            mood: "pointing",
          },
        },
        {
          type: "single-mockup",
          id: "soro-homepage",
          headline: "The new homepage",
          image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
          caption: "Redesigned homepage with trust-first hierarchy: verified vendors featured, buyer protection visible above the fold.",
          annotation: "The hero doesn't show products — it shows people. Real vendor photos. Because you trust faces, not SKUs.",
        },
        {
          type: "flow",
          id: "soro-mobile-flow",
          headline: "Mobile purchase flow — 4 taps to checkout",
          screens: [
            { image: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Browse", device: "phone" },
            { image: "https://images.unsplash.com/photo-1773089237195-bc9449198ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Listing Detail", device: "phone" },
            { image: "https://images.unsplash.com/photo-1758598304354-0a86fd5d62c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Cart + Protection", device: "phone" },
            { image: "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Confirmation", device: "phone" },
          ],
        },
      ],
    },
    {
      title: "Impact",
      slides: [
        {
          type: "section-break",
          id: "soro-act3",
          actTitle: "Impact",
          actNumber: 3,
          subtitle: "The numbers and the stories",
        },
        {
          type: "metric",
          id: "soro-metrics",
          headline: "6 weeks after launch",
          metrics: [
            { label: "Cart completion", value: "+156%", delta: "from 32% to 82%" },
            { label: "Avg. vendor response", value: "4 min", delta: "down from 3 hours" },
            { label: "New vendor signups", value: "3x", delta: "month over month" },
            { label: "Support tickets", value: "-72%", delta: "'Is this legit?' queries" },
          ],
          narrator: {
            text: "The metric I'm proudest of is the support ticket drop. When nobody asks 'is this legit?', that means trust is built into the interface — not explained in an FAQ.",
            label: "REFLECTION",
            mood: "celebrating",
          },
        },
        {
          type: "video",
          id: "soro-walkthrough",
          headline: "Product walkthrough",
          posterImage: "https://images.unsplash.com/photo-1746171114403-f4c4877b1f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "browser",
          caption: "2-minute walkthrough of the redesigned marketplace experience.",
        },
        {
          type: "quote",
          id: "soro-final",
          quote: "We went from 'is this a scam?' to 'can you expand to Abuja?' in six weeks. That's not a redesign — that's a reputation rebuild.",
          attribution: "Tunde Adeyemi",
          role: "CEO, Soro Markets",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Completion rate", value: "+156%" },
      { label: "Response time", value: "4 min" },
      { label: "Vendor growth", value: "3x" },
    ],
    testimonial: "We went from 'is this a scam?' to 'can you expand to Abuja?' in six weeks. That's not a redesign — that's a reputation rebuild.",
    testimonialAuthor: "Tunde Adeyemi, CEO, Soro Markets",
  },
};
