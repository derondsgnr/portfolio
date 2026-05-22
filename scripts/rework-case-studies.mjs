/**
 * Case study rework script
 * - Merges redundant narrative pairs
 * - Removes single-narrative acts (collapses into adjacent acts)
 * - Adds cinematicCaption to every visual slide
 *
 * Run: node scripts/rework-case-studies.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dirname, "../content/case-studies.json");

const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Set cinematicCaption on a slide by id across a flat array */
function cap(slides, id, caption) {
  const s = slides.find((x) => x.id === id);
  if (s) s.cinematicCaption = caption;
  else console.warn(`  ⚠ slide not found: ${id}`);
}

/** Remove slide(s) by id */
function drop(slides, ...ids) {
  return slides.filter((s) => !ids.includes(s.id));
}

/** Replace a slide by id with a new object */
function replace(slides, id, next) {
  return slides.map((s) => (s.id === id ? next : s));
}

/** Merge two consecutive narrative slides into the first, drop the second */
function mergeNarrative(slides, keepId, dropId, headline, body, narrator) {
  const updated = slides.map((s) => {
    if (s.id !== keepId) return s;
    return {
      ...s,
      ...(headline !== undefined && { headline }),
      body,
      ...(narrator !== undefined && { narrator }),
    };
  });
  return drop(updated, dropId);
}

// ─── CAREEREDGE ───────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "careeredge");
  console.log("careeredge");

  // Act 1 (Context): merge ce-brief + ce-first-moves into one tight narrative
  // Keep ce-brief id, absorb first-moves content
  const mergedContextBody =
    "CareerEdge came through a referral. The backend was robust, the features extensive. The problem was everything the user actually touches — no hierarchy, no visual language, eight user types with no through-line.\n\nTwo decisions before I touched a screen: they needed a brand identity first (I referred a designer and we moodboarded together), and I fed Claude the team's PRD alongside my product skills to prototype navigation and onboarding directions in Figma Make. The prototypes were thinking tools, not deliverables. A way to feel whether a direction was right before committing to building it.";

  let actSlides = cs.acts[0].slides; // Context
  actSlides = mergeNarrative(
    actSlides,
    "ce-brief",
    "ce-first-moves",
    "The product was built. The experience wasn't.",
    mergedContextBody,
    { label: "THE CONSTRAINT", text: "The brief was complete: overhaul the UI across all eight user types. The constraint was firm — nothing could be removed. Every feature had to ship.", mood: "thinking" }
  );
  cs.acts[0].slides = actSlides;

  // Act 2 (Architecture): remove ce-sophia-complexity (repeats ce-sophia-intro + narrator)
  cs.acts[1].slides = drop(cs.acts[1].slides, "ce-sophia-complexity");

  // Act 3 (Build): merge ce-hard-parts + ce-learned into one closing reflection
  const mergedOutroBody =
    "EdgePath and EdgeMap were the features the team was most particular about. We went back and forth and landed somewhere in between — some sub-features in Sophia, some surfaced directly. The political context around immigration and AI language required careful navigation across the entire platform copy.\n\nThe hardest part was holding the system in mind while making decisions at the component level. If Sophia's behaviour changed on one surface, it affected six others. That kind of systems thinking stretched me in ways I did not expect.\n\nBuilding the entire frontend alone, with AI, in a little over a month confirmed something I have been building toward: a designer who builds in code sees the system, not just the interface. The constraints are different. The tradeoffs are different. I could not have done this two years ago.";

  cs.acts[2].slides = mergeNarrative(
    cs.acts[2].slides,
    "ce-hard-parts",
    "ce-learned",
    "What tested me — and what I built",
    mergedOutroBody,
    { label: "WHAT STRETCHED ME", text: "Building the frontend meant understanding how the backend worked — data flow, role authentication, feature communication across the system. This deepened my understanding of backend architecture in a way pure design work never could.", mood: "thinking" }
  );

  // Cinematic captions — all visual slides
  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "ce-cover",             "Eight user types. One AI layer. One designer. One month to build the whole frontend.");
  cap(allSlides, "ce-scope",             "33+ features across 8 user types — the brief was 'don't remove anything.'");
  cap(allSlides, "ce-brand",             "Brand first. Without a visual language, every downstream decision is a guess.");
  cap(allSlides, "ce-act-architecture",  "Navigation that serves eight roles, and AI that reads the room.");
  cap(allSlides, "ce-nav-compare",       "From 33 items with equal weight to 5 per role, plus a more menu for the rest.");
  cap(allSlides, "ce-nav-layers",        "Sidebar for muscle memory. Sophia for guidance. More for power users. Same product, three interfaces for three states of mind.");
  cap(allSlides, "ce-sophia-mockup",     "Sophia on the career roadmap — phase-aware, deadline-aware, never generic.");
  cap(allSlides, "ce-sophia-gallery",    "Same intelligence, different context — Sophia reads the surface, not just the user.");
  cap(allSlides, "ce-act-build",         "One designer. Eight dashboards. Built entirely in code.");
  cap(allSlides, "ce-color-system",      "Three-tier color system: role accent, semantic (cyan for AI, lime for wins), neutral for everything else.");
  cap(allSlides, "ce-process-artifacts", "Color system, navigation architecture, verification standard — the structural backbone of the build.");
  cap(allSlides, "ce-what-shipped",      "8 user types. 33+ features redesigned. Built in code. Zero Figma screens. Live at careeredged.com.");
  cap(allSlides, "ce-live",              "Live at careeredged.com — full frontend across eight user types, built alone in a month.");
}

// ─── BRIDGEPAY ────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "bridgepay");
  console.log("bridgepay");

  // Remove bridgepay-flows narrative — it's a bullet list that the mockup headlines already convey
  cs.acts[1].slides = drop(cs.acts[1].slides, "bridgepay-flows");

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "bridgepay-cover",            "Escrow and international payments designed from scratch — making online transactions feel safe.");
  cap(allSlides, "bridgepay-act2",             "End-to-end flows from sign-up to cross-border transfer.");
  cap(allSlides, "bridgepay-mock-onboarding",  "Sign-up built around trust — clear steps, no jargon, no dead ends.");
  cap(allSlides, "bridgepay-mock-escrow",      "Buyer and seller paths with transparent status — both sides know exactly where the money is.");
  cap(allSlides, "bridgepay-mock-intl",        "Cross-border transfers with explicit currency clarity at every confirmation step.");
  cap(allSlides, "bridgepay-act3",             "The escrow product wasn't shipped — but the collaboration continued, and led to an LBS award.");
}

// ─── URBAN ────────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "urban");
  console.log("urban");

  // Act 1: merge urban-overview + urban-problem into one narrative
  const mergedProblemBody =
    "Urban is a transportation platform for interstate travel in Nigeria. The founder had a big vision — safer, kinder, more organised travel. But the apps reflected an engineering-first build: outdated UI, confusing flows, robotic copy, and a driver view split across three separate pages.\n\nTrip booking did not follow patterns Nigerians are familiar with. Important actions were hidden. There were no real safety features. The founder knew something was wrong — he just could not name it. The product was not doing justice to the vision, and he needed help.";

  cs.acts[0].slides = mergeNarrative(
    cs.acts[0].slides,
    "urban-overview",
    "urban-problem",
    "The vision was there. The product wasn't.",
    mergedProblemBody,
    undefined
  );

  // Act 3 (Result): merge urban-result + urban-reflection into one, then remove the act 3 section-break
  const mergedResultBody =
    "The apps became much easier to navigate. Booking and trip flows became clearer. Drivers could manage work without confusion. The product looked modern and trustworthy, and development moved faster because of the component system I created. Most importantly, the product finally looked and felt like the vision the founder had in his mind.\n\nThis project reinforced how much I enjoy designing within tight constraints and improving a system without breaking what already works — and helping founders translate a genuine idea into something that feels human.";

  cs.acts[2].slides = mergeNarrative(
    cs.acts[2].slides,
    "urban-result",
    "urban-reflection",
    "A product that finally matched the vision",
    mergedResultBody,
    undefined
  );
  // Remove the now-empty section-break act 3 header — collapse result into act 2
  // Keep the section-break but retitle it to avoid a standalone act with one slide
  const act3Break = cs.acts[2].slides.find((s) => s.id === "urban-act3");
  if (act3Break) {
    act3Break.subtitle = "Apps easier to navigate, safer to use — and development faster from the component system";
  }

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "urban-cover",              "Rider and driver apps — two experiences, one transportation ecosystem built for Nigeria.");
  cap(allSlides, "urban-act2",               "Rider app and driver app redesigned from the ground up.");
  cap(allSlides, "urban-mock-rider-home",    "Redesigned home and booking — familiar patterns from Bolt and Uber, adapted for interstate travel.");
  cap(allSlides, "urban-mock-rider-sheet",   "Bottom sheet with travel requirements and payment status — everything you need before you board.");
  cap(allSlides, "urban-mock-driver",        "Consolidated driver hub — two tabs instead of three pages, with SOS and a hidden wallet for real-world safety.");
  cap(allSlides, "urban-act3",               "Modern, trustworthy, and finally close to the founder's original vision.");
}

// ─── CUSTOMER SUPPORT PLATFORM ────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "customer-support-platform");
  console.log("customer-support-platform");

  // 4 acts with single narratives — collapse acts 3 & 4 into one
  // Merge csp-result + csp-reflection, drop csp-act-reflect section-break
  const mergedResultBody =
    "The onboarding flow became significantly easier. The MVP became clearer and more realistic. The dashboard took shape in a way that matched the founder's brand values. We removed friction from the user journey and the product began to feel intentional and premium.\n\nThe project didn't complete because of circumstances — but the groundwork and design direction remain strong. This kind of work is where I function well: directly with a founder, large vision that needs refining, turning scope into something shippable.";

  cs.acts[2].slides = mergeNarrative(
    cs.acts[2].slides,
    "csp-result",
    "csp-reflection",
    "Foundation solid. Scope right. Direction clear.",
    mergedResultBody,
    undefined
  );

  // Drop the now-empty act 4 (Reflection)
  cs.acts = cs.acts.filter((a) => {
    const hasOnlyBreak = a.slides.every((s) => s.type === "section-break");
    const isEmpty = a.slides.length === 0;
    return !hasOnlyBreak && !isEmpty;
  });

  // Also drop the orphaned csp-act-reflect section-break slide from wherever it ended up
  cs.acts.forEach((act) => {
    act.slides = drop(act.slides, "csp-act-reflect");
  });

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "csp-cover",            "From a 200-page PRD to a structured MVP — clarity before screens.");
  cap(allSlides, "csp-act-what",         "Flows, PRD clarity, reduced onboarding friction, psychological UX.");
  cap(allSlides, "csp-mock-onboarding",  "Onboarding reimagined with the IKEA Effect — users build something before they're asked to commit.");
  cap(allSlides, "csp-mock-dashboard",   "Dashboard MVP shell — premium-feeling, scope-right, aligned to the founder's brand values.");
  cap(allSlides, "csp-act-result",       "Foundation solid. Scope right. Direction clear.");
}

// ─── DARA ─────────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "dara");
  console.log("dara");

  // dara-dashboard and dara-screens both show placeholder dashboard mockups
  // Keep dara-dashboard (has annotation + narrator), drop dara-screens gallery
  cs.acts[1].slides = drop(cs.acts[1].slides, "dara-screens");

  // Trim dara-decisions — remove the distribution/monetisation paragraph
  // (already covered in dara-process artifact 4 "Same pipe, wider surface")
  const decisionSlide = cs.acts[1].slides.find((s) => s.id === "dara-decisions");
  if (decisionSlide) {
    decisionSlide.body =
      "• Tax output: aggregate, estimate what you owe, when to pay, and how — with state-specific due dates and filing steps where content is locked.\n\n• Human-in-the-loop after Gemini so classification improves from real use, not vibes.\n\n• WhatsApp nudges were cut. Cost and implementation weight were not worth it for where the product is.\n\n• Pioneer / beta: people can register; welcome-email automation is not end-to-end yet. I am not pretending the growth layer is finished.\n\n• Sub-features and edge cases stay out of this flagship so the spine stays readable. They ship in follow-up posts.";
    decisionSlide.annotation = undefined;
  }

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "dara-cover",        "Email alerts → Gemini → you verify → buckets learn → tax clarity. Built while levelling up on AI-assisted shipping.");
  cap(allSlides, "dara-insight-1",    "The wedge is what already exists — debit and credit alerts in email. Extraction first, classification second, guidance third.");
  cap(allSlides, "dara-competitor",   "Accountant-first UX, jargon-heavy tables — what I designed against.");
  cap(allSlides, "dara-act2",         "Pipeline, pivots, what ships today.");
  cap(allSlides, "dara-process",      "Ingest → Gemini → you verify → aggregate → tax path. Extraction is still uneven by provider — that stays in the case study.");
  cap(allSlides, "dara-dashboard",    "The promise: money signal in, verified buckets, tax guidance out — plain language, not an audit.");
  cap(allSlides, "dara-before-after", "From spreadsheets and accountant-first tools to inbox → verify → learn → clarity.");
  cap(allSlides, "dara-act3",         "Beta truth, not launch theatre.");
  cap(allSlides, "dara-metrics",      "10 beta users, state-level tax guidance, classification that improves with real inboxes — no vanity numbers.");
  cap(allSlides, "dara-live",         "Open beta at mydara.co — mail access after you authorize; revoke anytime.");
}

// ─── PULSE ────────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "pulse");
  console.log("pulse");

  // pulse-breathing and pulse-screens gallery share the same placeholder image
  // Structurally distinct (single detail vs. overview gallery) — keep both, captions clarify

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "pulse-cover",      "A wellness app that works in the stairwell — 90 seconds, one hand, zero cognitive load.");
  cap(allSlides, "pulse-insight-1",  "Users need calm most in the 2-3 minutes between stressful events, not in a meditation room.");
  cap(allSlides, "pulse-act2",       "Designing for one hand, one minute, one breath.");
  cap(allSlides, "pulse-process",    "Voice memos to stairwell testing to haptics first — no Figma file for the first two weeks.");
  cap(allSlides, "pulse-flow",       "Lock screen widget → breathing circle → calm confirmed. Three taps, 90 seconds.");
  cap(allSlides, "pulse-breathing",  "One expanding circle, follows with unfocused eyes while walking. Zero choices required.");
  cap(allSlides, "pulse-screens",    "All phone, all one-handed — home, session complete, weekly reflection.");
}

// ─── KORA ─────────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "kora");
  console.log("kora");

  // kora-brief and kora-insight: narrative carries the story, insight distills the principle.
  // They're functionally distinct — keep both, tighten the insight body.
  const insightSlide = cs.acts[0].slides.find((s) => s.id === "kora-insight");
  if (insightSlide) {
    insightSlide.body = undefined; // No body — let the principle land clean
  }

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "kora-cover",        "Globally legible. Distinctly West African when you look closer.");
  cap(allSlides, "kora-insight",      "Like a kora that sounds like a harp until you listen carefully — the design principle behind everything.");
  cap(allSlides, "kora-act2",         "From principle to presence — type, color, texture, photography.");
  cap(allSlides, "kora-process",      "Rejected earth tones, found the brand in Lagos nightlife and hand-woven aso-oke scans.");
  cap(allSlides, "kora-before-after", "From generic to unmistakably Kora — same collective, entirely different presence.");
  cap(allSlides, "kora-web",          "Deliberately slow to scroll — each section reveals itself like unwrapping hand-dyed fabric.");
}

// ─── SORO ─────────────────────────────────────────────────────────────────────
{
  const cs = data.find((c) => c.slug === "soro");
  console.log("soro");

  // Clean structure — no structural changes, just captions and tighten soro-approach narrative
  const approachSlide = cs.acts[1].slides.find((s) => s.id === "soro-approach");
  if (approachSlide) {
    approachSlide.headline = "Five trust patterns — each targeting a specific barrier";
    approachSlide.annotation = "Every pattern came directly from a user interview finding, not a design preference.";
  }

  const allSlides = cs.acts.flatMap((a) => a.slides);
  cap(allSlides, "soro-cover",               "Trust is a design problem — the fix was removing reasons to doubt, not adding features.");
  cap(allSlides, "soro-audit",               "Heuristic audit, competitor mapping, 12 interviews — trust turned out to be aesthetic before it was functional.");
  cap(allSlides, "soro-insight",             "Trust = (Responsiveness + Specificity + Social Proof) − Uncertainty. Every decision scored against this.");
  cap(allSlides, "soro-act2",               "Rebuilding trust from the ground up — five patterns, each targeting a specific barrier from user interviews.");
  cap(allSlides, "soro-listing-comparison",  "4 trust signals before, 11 after — same information density, arranged to answer doubt before it forms.");
  cap(allSlides, "soro-homepage",            "Trust-first hierarchy — verified vendors featured, buyer protection visible above the fold.");
  cap(allSlides, "soro-mobile-flow",         "Browse → listing detail → cart with protection → confirmation. Four taps, trust visible at every step.");
  cap(allSlides, "soro-act3",               "The numbers and the stories — six weeks after launch.");
  cap(allSlides, "soro-metrics",             "+156% cart completion, 4-min response time, 3× vendor growth, −72% 'is this legit?' support tickets.");
  cap(allSlides, "soro-walkthrough",         "Full product walkthrough — from 'is this a scam?' to trusted local commerce.");
}

// ─── Write output ──────────────────────────────────────────────────────────────
writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf8");
console.log(`\n✓ Written to ${JSON_PATH}`);

// Summary
data.forEach((cs) => {
  const total = cs.acts.flatMap((a) => a.slides).length;
  const withCaption = cs.acts.flatMap((a) => a.slides).filter((s) => s.cinematicCaption).length;
  const narrative = cs.acts.flatMap((a) => a.slides).filter((s) => s.type === "narrative").length;
  console.log(`  ${cs.slug}: ${total} slides, ${narrative} narrative, ${withCaption} with caption`);
});
