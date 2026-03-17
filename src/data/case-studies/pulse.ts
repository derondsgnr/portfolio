import type { CaseStudy } from "../../types/case-study";

/**
 * PULSE — Mobile-only wellness app (feature-dive)
 *
 * Stress-tests the engine with:
 *   - Phone-only mockups (no browser frames)
 *   - NO metrics slide (qualitative outcome)
 *   - Heavy use of flow slides (mobile UX)
 *   - Unconventional process: voice memo → sketch → prototype → user diary
 *   - Only 2 acts (no third "outcome" act — baked into Design)
 *   - Narrator-heavy (lots of personal commentary)
 */
export const PULSE_CASE_STUDY: CaseStudy = {
  slug: "pulse",
  meta: {
    title: "Pulse",
    client: "Stealth Health Startup",
    year: "2025",
    role: "Lead Product Designer",
    duration: "4 weeks",
    tags: ["Mobile", "Wellness", "UX Research", "iOS"],
    cover: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    summary: "A mindfulness and micro-recovery app for high-stress professionals — designed entirely for one-handed use during the workday.",
    color: "#7B68EE",
  },
  template: "feature-dive",
  acts: [
    {
      title: "Understanding",
      slides: [
        {
          type: "cover",
          id: "pulse-cover",
          headline: "Calm in 90 seconds",
          subtitle: "Most wellness apps demand 20 minutes of your day. Nobody has that. I designed one that works in the cracks between meetings.",
          tags: ["Mobile", "Wellness", "One-Handed UX"],
          heroImage: "https://images.unsplash.com/photo-1594561177665-052b6b4b781a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "phone",
        },
        {
          type: "narrative",
          id: "pulse-problem",
          headline: "The 20-minute myth",
          body: "Every wellness app on the market assumes you have a meditation room, a yoga mat, and a clear calendar. That's not reality for a product manager in Lagos at 2pm between back-to-back Zooms.\n\nThe founder came to me with user research showing 94% of their signups churned within 3 days. Not because the content was bad — because the time commitment was impossible.",
          narrator: {
            text: "I almost turned this project down. I thought — another meditation app? Then I saw the churn data and realized nobody had solved the actual problem: time, not motivation.",
            label: "DESIGNER'S NOTE",
            mood: "thinking",
          },
        },
        {
          type: "insight",
          id: "pulse-insight-1",
          headline: "When do people need calm most?",
          insightLabel: "DIARY STUDY FINDING",
          insightText: "Users don't seek calm when they're already calm. They need it most in the 2-3 minutes between stressful events — the walk from a meeting room, the elevator ride, the bathroom break.",
          body: "I ran a 7-day diary study with 8 participants. Each logged their stress spikes and what they did in the 5 minutes after. The pattern was clear: micro-moments, not sessions.",
          narrator: {
            text: "I had participants send me voice memos instead of filling out forms. Way more honest data. One guy literally whispered 'I'm hiding in the stairwell' — that became our design target.",
            label: "RESEARCH METHOD",
            mood: "pointing",
          },
        },
        {
          type: "quote",
          id: "pulse-user-quote",
          quote: "I don't need an app to tell me to breathe for 20 minutes. I need something that catches me in the stairwell and gives me 90 seconds of actual relief.",
          attribution: "Diary Study Participant",
          role: "Senior PM, Tech Company",
        },
      ],
    },
    {
      title: "Design & Outcome",
      slides: [
        {
          type: "section-break",
          id: "pulse-act2",
          actTitle: "Design & Outcome",
          actNumber: 2,
          subtitle: "Designing for one hand, one minute, one breath",
        },
        {
          type: "process",
          id: "pulse-process",
          headline: "An unconventional process",
          artifacts: [
            {
              image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Voice Memo → Sketch",
              description: "Started with voice memos from participants, sketched scenarios directly from their words. No personas, no journey maps.",
            },
            {
              image: "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Prototype in the Stairwell",
              description: "Tested paper prototypes in actual stairwells, elevators, and bathroom breaks. If you couldn't use it one-handed while walking, it failed.",
            },
            {
              image: "https://images.unsplash.com/photo-1635724287614-018e383ee98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
              label: "Haptic-First Design",
              description: "Designed the breathing guide as vibration patterns first, screen second. The app works with your phone in your pocket.",
            },
          ],
          narrator: {
            text: "No Figma file for the first two weeks. Just voice memos, paper, and a lot of awkward stairwell testing. The founder thought I was procrastinating. I was prototyping in context.",
            label: "PROCESS NOTE",
            mood: "frustrated",
          },
        },
        {
          type: "flow",
          id: "pulse-flow",
          headline: "The 90-second flow",
          screens: [
            { image: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Lock Screen Widget", device: "phone" },
            { image: "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Breathing Circle", device: "phone" },
            { image: "https://images.unsplash.com/photo-1594561177665-052b6b4b781a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", label: "Calm Confirmed", device: "phone" },
          ],
        },
        {
          type: "single-mockup",
          id: "pulse-breathing",
          headline: "The breathing circle",
          image: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          device: "phone",
          caption: "One expanding circle. No text. No choices. Just breathe with it.",
          annotation: "The entire interaction is one gesture: hold your thumb on the circle. It expands as you breathe in, contracts as you exhale. Zero cognitive load.",
          narrator: {
            text: "We tested 14 different breathing visualizations. The simple expanding circle won because users could unfocus their eyes and still follow it. Every other version required attention they didn't have.",
            label: "DESIGN DECISION",
            mood: "celebrating",
          },
        },
        {
          type: "mockup-gallery",
          id: "pulse-screens",
          headline: "Key screens — all phone, all one-handed",
          mockups: [
            { image: "https://images.unsplash.com/photo-1633435444831-a343459372a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", device: "phone", label: "Home" },
            { image: "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", device: "phone", label: "Session Complete" },
            { image: "https://images.unsplash.com/photo-1594561177665-052b6b4b781a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", device: "phone", label: "Weekly Reflection" },
          ],
        },
        {
          type: "narrative",
          id: "pulse-outcome",
          headline: "What happened",
          body: "No hard metrics yet — the app is in closed beta with 200 users. But the diary studies tell the story:\n\nAverage session length: 87 seconds. Exactly what we designed for.\n\n6 out of 8 diary study participants kept using the app daily for 3 weeks after the study ended — without being asked to.\n\nThe founder's favorite quote from a beta user: 'It's the only app I've ever used in an elevator and felt better walking out.'",
          annotation: "Sometimes the best metric is a story, not a number.",
          narrator: {
            text: "I deliberately chose not to put a metrics slide here. This project's value isn't in conversion funnels — it's in the guy who uses it in the stairwell every day at 2pm. That matters more than a dashboard.",
            label: "DESIGNER'S NOTE",
            mood: "thinking",
          },
        },
        {
          type: "quote",
          id: "pulse-closing",
          quote: "You designed something my team of 12 couldn't figure out in 6 months. And you did it with paper and voice memos.",
          attribution: "Founder",
          role: "Stealth Health Startup",
        },
      ],
    },
  ],
  outcome: {
    metrics: [
      { label: "Session length", value: "87s" },
      { label: "Beta retention", value: "75%" },
      { label: "Designed for", value: "1 hand" },
    ],
    testimonial: "You designed something my team of 12 couldn't figure out in 6 months. And you did it with paper and voice memos.",
    testimonialAuthor: "Founder, Stealth Health Startup",
  },
};
