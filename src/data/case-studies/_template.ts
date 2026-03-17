/**
 * ═══════════════════════════════════════════════════════════════
 * CASE STUDY TEMPLATE — Step-by-step guide for adding new case studies
 * ═══════════════════════════════════════════════════════════════
 *
 * HOW TO ADD A NEW CASE STUDY
 * ───────────────────────────
 *
 * STEP 1: Copy this file
 *   Duplicate this file and rename it to your project slug.
 *   Example: cp _template.ts urban.ts
 *
 * STEP 2: Replace the placeholder data below
 *   Fill in your project details. Every field is documented inline.
 *   The only REQUIRED fields are marked. Everything else is optional.
 *
 * STEP 3: Register it in index.ts
 *   Open /src/app/data/case-studies/index.ts and add:
 *
 *     import { YOUR_CASE_STUDY } from "./your-slug";
 *
 *     export const ALL_CASE_STUDIES: CaseStudy[] = [
 *       DARA_CASE_STUDY,
 *       YOUR_CASE_STUDY,  // <-- add here
 *     ];
 *
 * STEP 4: (Optional) Add to Work page grid
 *   In /src/app/components/v2/v2-data.ts, add a slug field to
 *   your project in V2_PROJECTS:
 *
 *     { id: "05", title: "Urban", ..., slug: "urban" }
 *
 *   This makes the project card on the Work page link to /work/urban.
 *
 * STEP 5: Test it
 *   Navigate to /work/your-slug in the browser.
 *   Both Reader mode (continuous scroll) and Cinematic mode should work.
 *
 * DONE. The routing, navigation, and engine handle everything else.
 *
 * ═══════════════════════════════════════════════════════════════
 *
 * SLIDE TYPE REFERENCE (13 types)
 * ────────────────────────────────
 *
 *   "cover"           Full-screen hero with headline, subtitle, tags, background image
 *   "narrative"       Text-heavy storytelling block with headline, body, annotation
 *   "single-mockup"   One image in a device frame (phone/browser/tablet/watch)
 *   "comparison"      Before/after slider (interactive drag)
 *   "insight"         Highlighted research finding or key insight card
 *   "metric"          Grid of numbers/stats with labels and deltas
 *   "quote"           Full-bleed centered quote with attribution
 *   "flow"            Horizontal scroll of multiple screens in device frames
 *   "embed"           Live iframe embed with device frame (desktop) / fallback image (mobile)
 *   "video"           Video player with poster image and device frame
 *   "mockup-gallery"  Grid of multiple mockups in various device frames
 *   "section-break"   Act/chapter divider with number and title
 *   "process"         Grid of process artifacts (images + labels + descriptions)
 *
 * TEMPLATE TYPES (4 options — affects nothing yet, but signals intent)
 * ────────────────────────────────────────────────────────────────────
 *
 *   "full-product"    End-to-end product story (15-30 slides)
 *   "feature-dive"    Deep dive into one feature or system (8-15 slides)
 *   "visual-brand"    Art direction / brand work, image-heavy (10-20 slides)
 *   "teardown"        UX teardown / redesign analysis (10-25 slides)
 *
 * NARRATOR SLOT
 * ─────────────
 *   Any slide can include an optional `narrator` field:
 *
 *   narrator: {
 *     text: "Your commentary here...",
 *     label: "DESIGNER'S NOTE",      // or "CLIENT VOICE", "PROCESS NOTE", "TECH NOTE"
 *     mood: "thinking",              // "neutral" | "thinking" | "pointing" | "celebrating" | "frustrated"
 *   }
 *
 *   This renders as a monospace sidebar block on desktop, stacked below on mobile.
 *
 * IMAGES
 * ──────
 *   For images, you have three options:
 *
 *   1. Figma asset imports (best for real project screenshots):
 *      import myScreen from "figma:asset/abc123.png";
 *      Then use: image: myScreen
 *
 *   2. Unsplash URLs (for placeholders during drafting):
 *      image: "https://images.unsplash.com/photo-xxxxx?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
 *
 *   3. Your own hosted images:
 *      image: "https://yourdomain.com/path/to/image.png"
 *
 * ═══════════════════════════════════════════════════════════════
 */

import type { CaseStudy } from "../../types/case-study";

// STEP: Import your images here
// import heroImage from "figma:asset/your-hero-image.png";
// import screen1 from "figma:asset/your-screen-1.png";

/**
 * YOUR_PROJECT_CASE_STUDY
 *
 * Replace "YOUR_PROJECT" with your project name in SCREAMING_SNAKE_CASE.
 * Example: URBAN_CASE_STUDY, PAYROUTE_CASE_STUDY
 */
export const YOUR_PROJECT_CASE_STUDY: CaseStudy = {
  // ─── REQUIRED: URL slug ───────────────────────────────────────
  // This determines the URL: /work/your-slug
  slug: "your-slug",

  // ─── REQUIRED: Project metadata ───────────────────────────────
  meta: {
    title: "Project Name",                    // REQUIRED: displayed as the big heading
    client: "Client Name",                    // REQUIRED: shown in header bar
    year: "2025",                             // REQUIRED: year
    role: "Product Designer",                 // optional: your role on the project
    duration: "6 weeks",                      // optional: project duration
    tags: ["Product Design", "Fintech"],      // REQUIRED: at least 1 tag
    cover: "https://images.unsplash.com/photo-placeholder",  // REQUIRED: cover image for cards/previews
    summary: "One or two sentences describing what this project is about.",  // REQUIRED
    color: "#E2B93B",                         // optional: accent color override (default is gold)
  },

  // ─── REQUIRED: Template type ──────────────────────────────────
  template: "full-product",  // "full-product" | "feature-dive" | "visual-brand" | "teardown"

  // ─── Optional: Live demo URL ──────────────────────────────────
  // Shows as a floating button. Set to undefined or "#" to hide.
  liveDemoUrl: undefined,

  // ─── REQUIRED: Acts (chapters) ────────────────────────────────
  // Each act has a title and an array of slides.
  // You can have 1 act or many. 3 acts (Discovery, Design, Outcome) is a good default.
  acts: [
    // ═══ ACT 1: DISCOVERY ═══════════════════════════════════════
    {
      title: "Discovery",
      slides: [
        // ─── Cover slide (always first) ─────────────────────────
        {
          type: "cover",
          id: "project-cover",            // REQUIRED: unique ID across all slides
          headline: "The bold headline",  // REQUIRED
          subtitle: "A longer subtitle explaining the core challenge.",
          tags: ["Tag1", "Tag2"],
          heroImage: "https://images.unsplash.com/photo-placeholder",  // background image
          device: "browser",              // "phone" | "browser" | "tablet" | "watch" | "none"
        },

        // ─── Narrative slide ────────────────────────────────────
        {
          type: "narrative",
          id: "project-context",
          headline: "Why this project matters",
          body: "Write your story here. Use \\n\\n for paragraph breaks.\n\nSecond paragraph goes here. Keep it conversational — you're telling a story, not writing a spec doc.",
          annotation: "This appears as a gold-bordered callout below the text.",
          narrator: {
            text: "Your personal commentary on this part of the project.",
            label: "DESIGNER'S NOTE",
            mood: "thinking",
          },
        },

        // ─── Insight slide ──────────────────────────────────────
        {
          type: "insight",
          id: "project-insight-1",
          headline: "What the research revealed",
          insightLabel: "RESEARCH FINDING",           // REQUIRED: label above the insight card
          insightText: "The key insight in one or two sentences.",  // REQUIRED: the actual insight
          body: "Supporting context around the insight. How you got here, what you observed.",
        },
      ],
    },

    // ═══ ACT 2: DESIGN ══════════════════════════════════════════
    {
      title: "Design",
      slides: [
        // ─── Section break ──────────────────────────────────────
        {
          type: "section-break",
          id: "project-act2",
          actTitle: "Design",     // REQUIRED
          actNumber: 2,           // REQUIRED
          subtitle: "From insight to interface",
        },

        // ─── Single mockup ──────────────────────────────────────
        {
          type: "single-mockup",
          id: "project-main-screen",
          headline: "The core interface",
          image: "https://images.unsplash.com/photo-placeholder",  // REQUIRED
          device: "browser",      // REQUIRED: "phone" | "browser" | "tablet" | "watch" | "none"
          caption: "Caption text below the mockup.",
          annotation: "This floats beside the mockup on desktop as an annotation card.",
        },

        // ─── Comparison (before/after) ──────────────────────────
        {
          type: "comparison",
          id: "project-before-after",
          headline: "Before vs. After",
          before: {
            image: "https://images.unsplash.com/photo-placeholder-before",  // REQUIRED
            label: "Before",                                                 // REQUIRED
          },
          after: {
            image: "https://images.unsplash.com/photo-placeholder-after",   // REQUIRED
            label: "After",                                                  // REQUIRED
          },
          device: "browser",
        },

        // ─── Flow (horizontal screen scroll) ────────────────────
        {
          type: "flow",
          id: "project-flow",
          headline: "User flow walkthrough",
          screens: [
            { image: "https://images.unsplash.com/photo-placeholder-1", label: "Onboarding", device: "phone" },
            { image: "https://images.unsplash.com/photo-placeholder-2", label: "Dashboard", device: "phone" },
            { image: "https://images.unsplash.com/photo-placeholder-3", label: "Settings", device: "phone" },
          ],
        },

        // ─── Mockup gallery ─────────────────────────────────────
        {
          type: "mockup-gallery",
          id: "project-gallery",
          headline: "Key screens",
          mockups: [
            { image: "https://images.unsplash.com/photo-placeholder-1", device: "browser", label: "Dashboard" },
            { image: "https://images.unsplash.com/photo-placeholder-2", device: "phone", label: "Mobile" },
          ],
        },

        // ─── Process slide ──────────────────────────────────────
        {
          type: "process",
          id: "project-process",
          headline: "How the solution took shape",
          artifacts: [
            {
              image: "https://images.unsplash.com/photo-placeholder",
              label: "Wireframes",                   // REQUIRED
              description: "Low-fi explorations of the core flow.",
            },
            {
              image: "https://images.unsplash.com/photo-placeholder",
              label: "Component Library",             // REQUIRED
              description: "Design system built for this project.",
            },
          ],
        },
      ],
    },

    // ═══ ACT 3: OUTCOME ═════════════════════════════════════════
    {
      title: "Outcome",
      slides: [
        // ─── Section break ──────────────────────────────────────
        {
          type: "section-break",
          id: "project-act3",
          actTitle: "Outcome",
          actNumber: 3,
          subtitle: "The results",
        },

        // ─── Metrics ────────────────────────────────────────────
        {
          type: "metric",
          id: "project-metrics",
          headline: "Impact by the numbers",
          metrics: [
            { label: "Conversion rate", value: "+42%", delta: "vs. previous design" },
            { label: "User satisfaction", value: "4.8/5" },
            { label: "Load time", value: "0.8s", delta: "down from 3.2s" },
            { label: "Support tickets", value: "-60%", delta: "month over month" },
          ],
        },

        // ─── Quote / testimonial ────────────────────────────────
        {
          type: "quote",
          id: "project-testimonial",
          quote: "Client testimonial goes here. Make it specific and impactful.",
          attribution: "Client Name",        // REQUIRED
          role: "CEO, Company Name",
        },

        // ─── Video slide ────────────────────────────────────────
        // Uncomment if you have a video:
        // {
        //   type: "video",
        //   id: "project-video",
        //   headline: "See it in action",
        //   videoUrl: "https://your-video-url.mp4",  // optional: if no URL, shows poster with play button
        //   posterImage: "https://images.unsplash.com/photo-placeholder",  // REQUIRED
        //   device: "browser",
        //   caption: "Product walkthrough — 2 minutes",
        // },

        // ─── Embed slide ────────────────────────────────────────
        // Uncomment if you have a live prototype:
        // {
        //   type: "embed",
        //   id: "project-embed",
        //   headline: "Try it yourself",
        //   embedUrl: "https://your-prototype.com",   // REQUIRED: iframe src
        //   fallbackImage: "https://images.unsplash.com/photo-placeholder",  // REQUIRED: shown on mobile
        //   device: "browser",
        //   caption: "Interactive prototype — click through the real interface.",
        // },
      ],
    },
  ],

  // ─── Optional: Outcome summary ────────────────────────────────
  // This renders below all slides as a summary section.
  outcome: {
    metrics: [
      { label: "Conversion", value: "+42%" },
      { label: "Satisfaction", value: "4.8/5" },
    ],
    testimonial: "A closing testimonial from the client.",
    testimonialAuthor: "Name, Role, Company",
  },
};
