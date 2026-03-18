import type { BlogPost } from "@/types/blog";

/**
 * BLOG CONTENT
 * ============
 * Static blog posts using the case study Slide union for content.
 * Rendered by BlogReader (not CaseStudyEngine) — no acts, no cinematic mode.
 *
 * Slide types used: narrative, section-break, quote, insight, metric, single-mockup
 *
 * TODO (Cursor — when admin panel is ready):
 *   - Replace this static array with Supabase KV reads (key prefix: blog:post:)
 *   - The BlogPost type matches the server contract — just deserialize and render
 */

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────
  // POST 01: Designing in the Age of AI
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "designing-in-the-age-of-ai",
    meta: {
      title: "Designing in the Age of AI",
      date: "2026-03-12",
      category: "Thinking",
      tags: ["AI", "Product Design", "Tools", "Future"],
      cover:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
      summary:
        "AI didn't make me a better designer. Learning to use it ruthlessly did. On what changes, what doesn't, and where craft still lives.",
      readingTime: 7,
      featured: true,
    },
    slides: [
      {
        type: "narrative",
        id: "ai-01",
        headline: "Everyone said it would replace us.",
        body: "Every few months, a new model drops and the discourse resets. Designers panic. Twitter goes dark with takes. Then a week passes and everyone goes back to making stuff. I've been through this cycle enough times now to have a perspective — not a hot take, but an actual working theory on what AI changes about design and what it fundamentally cannot touch.",
      },
      {
        type: "section-break",
        id: "ai-sb-01",
        actTitle: "What changed",
        actNumber: 1,
        subtitle: "The parts of the job that disappeared overnight",
      },
      {
        type: "narrative",
        id: "ai-02",
        body: "The things that changed first were the things I was doing on autopilot. Writing first-draft copy for interfaces. Generating eight logo directions from a brief. Stitching together placeholder screens to communicate an idea in a meeting. These weren't the craft parts of my job. They were the overhead. The warming-up-the-engine work that happened before the real design thinking started.",
        narrator: {
          text: "I used to spend two hours on Monday mornings doing research synthesis before I could start designing. Now that's thirty minutes.",
          label: "FIELD NOTE",
          mood: "thinking",
        },
      },
      {
        type: "insight",
        id: "ai-03",
        headline: "Speed exposed the gaps.",
        body: "When the generation overhead collapsed, something uncomfortable happened: the quality gaps in my thinking became undeniable. I could now produce a mediocre screen in 4 minutes instead of 40. The bottleneck shifted from execution to judgment.",
        insightLabel: "THE SHIFT",
        insightText:
          "AI didn't make design easier. It made the hard parts of design — the judgment, the taste, the strategic framing — the only parts left.",
      },
      {
        type: "quote",
        id: "ai-04",
        quote:
          "The designers who are worried about AI are worried about the wrong thing. The question isn't whether AI can make a screen. It's whether you can tell a good screen from a bad one.",
        attribution: "A conversation with a senior PM",
        role: "at a Series B fintech",
      },
      {
        type: "section-break",
        id: "ai-sb-02",
        actTitle: "What didn't",
        actNumber: 2,
        subtitle: "The things AI still can't touch",
      },
      {
        type: "narrative",
        id: "ai-05",
        headline: "Taste is not a prompt.",
        body: "I've watched people use AI to generate fifty variations and pick the one that looks most like what they've seen before. That's not design. That's pattern matching from a position of low confidence. Great design — the kind that feels inevitable after the fact — comes from a designer who has a point of view strong enough to reject the obvious answer. AI is an incredible tool for making the obvious answer faster. It cannot tell you when the obvious answer is wrong.",
      },
      {
        type: "narrative",
        id: "ai-06",
        body: "The other thing AI cannot do is sit in the room with a founder who doesn't know what they're asking for and turn confusion into clarity. That's the core of what product designers do at the senior level. The design work is almost a side effect of that. The listening, the reframing, the ability to name something the client felt but couldn't articulate — that's the service. AI is nowhere near that.",
        narrator: {
          text: "I once spent three weeks on a product before realising the client was solving the wrong problem. No model would have caught that.",
          label: "REAL TALK",
          mood: "pointing",
        },
      },
      {
        type: "section-break",
        id: "ai-sb-03",
        actTitle: "My workflow",
        actNumber: 3,
        subtitle: "What I actually do with it now",
      },
      {
        type: "narrative",
        id: "ai-07",
        headline: "I use it like an intern who's read everything.",
        body: "My workflow now: I handle the strategy, the POV, the user framing. I use AI to generate raw material fast — screens, copy directions, code scaffolds. Then I edit. Ruthlessly. The editing is where the design happens. The generation is just the starting gun. Knowing what to keep, what to throw away, and why — that's still entirely a human skill. And it's getting more valuable, not less.",
      },
      {
        type: "metric",
        id: "ai-08",
        headline: "What actually changed in my output",
        metrics: [
          { label: "Exploration coverage", value: "4×", delta: "+300%" },
          { label: "Time to first concept", value: "–60%", delta: "faster" },
          { label: "Iteration speed", value: "3×", delta: "+200%" },
          { label: "Quality ceiling", value: "same", delta: "still human" },
        ],
      },
      {
        type: "quote",
        id: "ai-09",
        quote:
          "The tool doesn't determine the quality of the thinking. The thinking determines the quality of the tool's output.",
        attribution: "derondsgnr",
        role: "obviously",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // POST 02: Why I Build What I Design
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "why-i-build-what-i-design",
    meta: {
      title: "Why I Build What I Design",
      date: "2026-02-28",
      category: "Craft",
      tags: ["Engineering", "Design", "Workflow", "Handoff"],
      cover:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
      summary:
        "The designer-who-codes debate is tired. Here's the real reason I ship what I design — and what I've learned from being on both sides of the Figma handoff.",
      readingTime: 5,
    },
    slides: [
      {
        type: "narrative",
        id: "build-01",
        headline: "The handoff moment is a design failure.",
        body: "Every time a designer hands a Figma file to an engineer and walks away, something is lost. Microstates that weren't specced. Edge cases that weren't considered. Animations that seemed obvious in the designer's head but were never documented. The engineer makes judgment calls. Reasonable ones, usually. But not the designer's judgment calls. The product that ships is a translation of the design, not the design.",
      },
      {
        type: "insight",
        id: "build-02",
        headline: "I started building because I was tired of the drift.",
        body: "Not because I wanted to be a full-stack engineer. I have no interest in database schemas or DevOps. But the last mile — the React components, the interactions, the CSS that makes something feel right — that's still design work. It's just design work in a different medium.",
        insightLabel: "THE REASON",
        insightText:
          "Code is the only design medium where what you make is exactly what ships. Every other output is an instruction set for someone else to interpret.",
      },
      {
        type: "section-break",
        id: "build-sb-01",
        actTitle: "What I learned",
        actNumber: 1,
        subtitle: "From being on both sides of the file",
      },
      {
        type: "narrative",
        id: "build-03",
        body: "Designing with the constraint of implementation makes you a better designer. When I know what a smooth animation costs at 60fps versus a janky one at 30fps, I make different decisions in Figma. When I know that this layout will need three breakpoints, I design with those in mind from the start. The constraint doesn't limit creativity — it focuses it. Designers who've never built often design things that are beautiful and impractical in ways that could have been avoided.",
        narrator: {
          text: "The first time I tried to implement one of my own hover animations, I rewrote the Figma file three times. Each version was better.",
          label: "HONEST TAKE",
          mood: "thinking",
        },
      },
      {
        type: "quote",
        id: "build-04",
        quote:
          "The best designs I've ever built were the ones where the designer and engineer were the same person having an argument with themselves.",
        attribution: "derondsgnr",
        role: "half-joking",
      },
      {
        type: "narrative",
        id: "build-05",
        headline: "The real superpower isn't building. It's the conversation.",
        body: "When I'm in a room with engineers and I can say 'let's do this in a CSS variable instead of hardcoding it' or 'that animation can be done in 8 lines of Motion' — the dynamic changes. I'm not an outsider handing down a spec anymore. I'm a collaborator speaking the same language. That changes what's possible. Engineers suggest interactions they would have assumed were too expensive. Design reviews become dialogues. The product gets better because the friction went away.",
      },
      {
        type: "metric",
        id: "build-06",
        metrics: [
          { label: "Figma-to-ship fidelity", value: "95%", delta: "+40% vs handoff" },
          { label: "Revision rounds (avg)", value: "1.2", delta: "–60%" },
          { label: "Engineer sync time / week", value: "30min", delta: "down from 3h" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // POST 03: The 90-Second Interface
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "the-90-second-interface",
    meta: {
      title: "The 90-Second Interface",
      date: "2026-02-10",
      category: "Case Notes",
      tags: ["Mobile", "Wellness", "UX", "Constraints"],
      cover:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
      summary:
        "Designing Pulse forced a rule I hadn't worked with before: every session must complete in under 90 seconds. Here's what that constraint broke open.",
      readingTime: 6,
    },
    slides: [
      {
        type: "narrative",
        id: "90s-01",
        headline: "The brief had one weird clause.",
        body: "When the Pulse founder handed me the brief, everything was standard until the last line: 'All user sessions must be completable in under 90 seconds.' Not 90 seconds as a goal. As a hard constraint. Users were high-stress professionals — lawyers, surgeons, early-stage founders. They didn't have time for a 10-minute meditation. They needed something they could do in a elevator, or between meetings, or in a bathroom stall at a conference.",
      },
      {
        type: "insight",
        id: "90s-02",
        headline: "90 seconds broke every pattern I knew.",
        body: "Standard mobile UX patterns assume time. Onboarding flows assume 3–5 minutes. Content exploration assumes browsing. Progress systems assume multi-day loops. None of that works when the max session is 90 seconds. I had to throw out most of what I knew about mobile UX and design from constraint.",
        insightLabel: "THE CONSTRAINT",
        insightText:
          "When you can only ask a user for 90 seconds, every second has to earn its place. Ornamentation becomes disqualifying.",
      },
      {
        type: "section-break",
        id: "90s-sb-01",
        actTitle: "The decisions",
        actNumber: 1,
        subtitle: "What the constraint forced",
      },
      {
        type: "narrative",
        id: "90s-03",
        headline: "One action per screen.",
        body: "The first cut was aggressive: no screen can have more than one thing to do. Not one primary and one secondary. One. This is harder than it sounds when you're conditioned by apps that layer options as a feature, not a bug. Every time I added a 'maybe they'd also want to…' element, I cut it. The density came down. The clarity went up.",
        narrator: {
          text: "I kept a running count of actions per screen during reviews. Anything above 1.2 average went back for rework.",
          label: "PROCESS NOTE",
          mood: "pointing",
        },
      },
      {
        type: "narrative",
        id: "90s-04",
        body: "One-handed use wasn't a nice-to-have — it was required. These users were often holding something else. A coffee. A laptop. A kid. All interactive elements had to be reachable with a right thumb in the bottom 40% of the screen on a standard phone. This completely changed the information hierarchy. Navigation moved down. Content moved up. Primary actions sat at natural thumb rest position.",
      },
      {
        type: "quote",
        id: "90s-05",
        quote:
          "Most apps are designed for someone sitting at a desk with two hands and nothing better to do. Pulse is designed for someone who has approximately 90 seconds before their next meeting starts.",
        attribution: "Founder brief",
        role: "Pulse, 2025",
      },
      {
        type: "narrative",
        id: "90s-06",
        headline: "Haptics became a design material.",
        body: "When screen time is at a premium, every feedback channel matters. Haptic feedback let us confirm actions without a confirmation screen. A soft tap on session start. A distinct double-pulse on completion. Users could feel the session arc without looking at the interface. This was the highest-leverage accessibility win we shipped — it also happened to make the experience feel genuinely premium on devices that support it.",
      },
      {
        type: "metric",
        id: "90s-07",
        headline: "Outcomes from the constraint",
        metrics: [
          { label: "Avg session length", value: "74s", delta: "under target" },
          { label: "7-day retention", value: "68%", delta: "vs 41% industry avg" },
          { label: "One-hand completions", value: "89%", delta: "of all sessions" },
          { label: "Screen count (final)", value: "4", delta: "down from 14 in v0" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // POST 04: On Design Systems and Taste
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "on-design-systems-and-taste",
    meta: {
      title: "On Design Systems and Taste",
      date: "2026-01-20",
      category: "Process",
      tags: ["Design Systems", "Tokens", "Teams", "Craft"],
      cover:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
      summary:
        "Design systems are great at enforcing consistency. They're terrible at preserving taste. The two are not the same thing — and conflating them is how good products go beige.",
      readingTime: 5,
    },
    slides: [
      {
        type: "narrative",
        id: "ds-01",
        headline: "Every design system eventually becomes a trap.",
        body: "The pitch is always the same: consistency at scale, faster shipping, one source of truth. All true. All worth pursuing. But there's a side effect nobody talks about in the conference talks: design systems, left unguarded, drain personality from products. They reward compliance over judgment. They make it easy to assemble something that looks designed without anyone having made a single real design decision.",
      },
      {
        type: "insight",
        id: "ds-02",
        headline: "Consistency is not the same as quality.",
        body: "A design system can make every screen consistent and every screen mediocre simultaneously. Consistency means sameness. Quality means rightness. They overlap, but they're not identical. A component library full of passable components shipped consistently is still a passable product.",
        insightLabel: "THE DISTINCTION",
        insightText:
          "A great design system is a platform for taste, not a replacement for it. It should make it easier to make good decisions, not eliminate the need to make them.",
      },
      {
        type: "section-break",
        id: "ds-sb-01",
        actTitle: "What to protect",
        actNumber: 1,
        subtitle: "The things a system should never decide for you",
      },
      {
        type: "narrative",
        id: "ds-03",
        body: "The things a design system should handle: spacing scales, colour tokens, type ramps, component states, accessibility baselines. The things it should never decide for you: hierarchy within a screen, emphasis choices, when to break the grid, when an illustration serves better than an icon, when silence is the right answer. These are judgment calls. They require a designer in the room with an opinion. Systematising them away doesn't make your product better — it makes it safer and duller.",
        narrator: {
          text: "I once audited a product where the team was proud that 100% of screens used system components. Every screen was also profoundly boring.",
          label: "FIELD NOTE",
          mood: "frustrated",
        },
      },
      {
        type: "quote",
        id: "ds-04",
        quote:
          "The best design systems I've worked with had a Figma file and a person. The file had the components. The person had the taste. You need both.",
        attribution: "derondsgnr",
      },
      {
        type: "narrative",
        id: "ds-05",
        headline: "Tokens without taste are just variables.",
        body: "Design tokens are genuinely powerful. Theming, multi-brand systems, dark mode — none of it scales without tokens. But I've seen teams spend six months perfecting their token architecture and ship a product that feels generic. The tokens were immaculate. The design decisions that used those tokens were safe. Safe is not good. Tokens give you leverage. Leverage magnifies whatever judgment is behind it — good or bad.",
      },
      {
        type: "narrative",
        id: "ds-06",
        body: "The system I aspire to build is one that makes the right thing the easy thing, not the only thing. It should be faster to make a good decision than a bad one. But it should always preserve the possibility of the brilliant exception — the bespoke treatment, the unexpected moment, the one screen that earns the right to look different because it has something important to say.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.meta.featured);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, count);
}
