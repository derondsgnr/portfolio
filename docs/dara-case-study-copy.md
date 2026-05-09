# Dara — case study copy reference

**Purpose:** Human-readable archive of everything the portfolio case study viewer can render for `/work/dara`, so you can edit or cross-check without spelunking JSON.

**Canonical authoring (recommended):**

1. **`src/data/case-studies/dara.ts`** — Type definition + version control–friendly source.
2. **`content/case-studies.json`** — **This file wins at runtime.** The loader merges JSON over code (`mergeCaseStudiesOverlay` in `src/lib/content/case-studies.ts`). If JSON still has old Dara payloads, production shows old copy **even after you change `dara.ts`**.

**After editing `dara.ts`,** sync the `"slug": "dara"` object in **`content/case-studies.json`** (re-run the repo `npx tsx` snippet from `CLAUDE.md` or CI, or paste from TypeScript manually).

**Work grid blurb:** `content/projects.json` (the Dara tile text) does **not** come from `case-studies.json`. Update description/year there separately if needed.

---

## Meta

| Field | Copy |
|--------|------|
| title | Dara |
| client | Personal Project |
| year | 2025–26 |
| role | Founder, product, UX, frontend, AI-assisted build |
| duration | Ongoing |
| tags | Fintech, Product Design, Full-Stack, AI-Assisted, Tax |
| summary | Dara turns bank and fintech alerts into filing signal: scan email, run Gemini, you classify into buckets, the system learns, then it aggregates toward what you owe and when. Extraction is still patchy by provider—I am not dressing that up. Long posts unpack prompts, tax content, and what broke in beta. |
| template | full-product |
| liveDemoUrl | https://mydara.co |

---

## Act I — Discovery

### Cover (`dara-cover`)

- **headline:** From inbox noise to filing signal  
- **subtitle:** Email alerts → Gemini → you verify → buckets improve over time → aggregation and tax guidance. Built while I leveled up on AI-assisted shipping; the write-ups unpack each layer.  
- **tags:** Fintech, Tax, AI-Assisted Build  

### Narrative (`dara-context`)

- **headline:** Start with the real friction  
- **body:** Personal income tax in Nigeria is strenuous, overcomplicated, and thin on public education. Fines are heavy. A huge pool of freelancers and self-employed people earn in naira and dollars and are meeting that system for the first time with almost no plain-language on-ramp.  
- **annotation:** I'm building for self-employed people first. Grassroots scale is the vision, but the story has to work for one person's inbox before it works for millions.  
- **narrator (NOTE):** This wasn't a brief from a client. It started with my own frustration and what I see around me. The product is how I'm learning to ship with AI—not a slide deck about AI.

### Insight (`dara-insight-1`)

- **headline:** The wedge is what people already have  
- **insightLabel:** PRODUCT CALL  
- **insightText:** Debit and credit alerts already land in email from banks and fintech. The job is extraction → classification → aggregation, then tax guidance that respects state rules.  
- **body:** If the pipeline lies, the dashboard is a dark theme on garbage. Extraction is uneven by bank and sender today. I state that on purpose so the story stays mechanical, not magical.

### Single mockup (`dara-competitor`)

- **headline:** What most tax products assume  
- **annotation:** They assume patience for jargon, dense tables, and accountant-first mental models. I'm designing for someone who needs to know what they owe, when, and how to pay—without treating them like they already passed a tax exam.  
- **caption:** Placeholder stand-in for legacy / spreadsheet-heavy compliance UX — swap for labeled comparison when assets are ready.

---

## Act II — Build

### Section break (`dara-act2`)

- **actTitle:** Build  
- **actNumber:** 2  
- **subtitle:** Pipeline, pivots, what ships today  

### Process (`dara-process`)

- **headline:** How the core loop works  

| Step label | Description |
|------------|--------------|
| Ingest | Scan email for debit and credit alerts from banks and fintech. Not every provider parses cleanly—that is still an active engineering edge. |
| Gemini, then you verify | Alerts run through Gemini, then you classify into buckets. The model does not get a free pass. Over time that feedback teaches the system to take more of the sorting with fewer mistakes. |
| Aggregate and tax path | Structured signals roll up into estimates for what you owe, when to pay, and how to pay—plus state-level due dates and filing steps where that content is locked in the build. |
| Same pipe, wider surface (direction) | Savings and investment platforms can ride the same ingestion idea later. Goals, journeys, and one centralized view across providers are the next horizon—not something I am pretending is finished in the flagship build. |

- **narrator (PROCESS NOTE):** I work in Cursor and Claude with the real repo in mydara/. Figma is in the loop when the UI needs it. The stack and prompts will get their own posts—this case study is the spine.

### Narrative (`dara-decisions`)

- **headline:** Calls that shaped the product  
- **body:**
  - Tax output: aggregate, estimate what you owe, when to pay, and how to pay—with state-specific due dates and filing steps where content is locked.
  - Human-in-the-loop after Gemini so classification improves from real use, not vibes.
  - WhatsApp nudges were cut. Cost and implementation weight were not worth it for where the product is.
  - Pioneer / beta: people can register; welcome-email automation is not end-to-end yet. I am not pretending the growth layer is finished.
  - Sub-features and edge cases stay out of this flagship so the spine stays readable. They ship in follow-up posts.  
- **annotation:** Distribution and monetization hook to the same data plane: widen ingestion to savings and investments, then goals and one view across providers. I keep that in the case study as direction—the series goes deep on each slice.

### Single mockup (`dara-dashboard`)

- **headline:** Where clarity is supposed to land  
- **caption:** Dashboard shell — replace with current Dara UI from production or staging when exported.  
- **annotation:** The promise is: money signal in, verified buckets, tax guidance out—plus a path to goals across accounts as the ingestion surface grows.  
- **narrator (NOTE):** Dark-first UI and plain language stayed non-negotiable. Money UIs fail when they feel like they're auditing the user instead of briefing them.

### Mockup gallery (`dara-screens`)

- **headline:** Surfaces to document next  
- **items:** Dashboard (browser); Additional surface (browser)

### Comparison (`dara-before-after`)

- **headline:** Traditional stack vs. Dara's bet  
- **before label:** Spreadsheets & accountant-first tools  
- **after label:** Inbox → verify → learn → clarity  

---

## Act III — Now

### Section break (`dara-act3`)

- **actTitle:** Now  
- **actNumber:** 3  
- **subtitle:** Beta truth, not launch theatre  

### Metrics (`dara-metrics`)

- **headline:** Where it actually is  

| Label | Value | Delta |
|--------|--------|--------|
| Beta testers | 10 | learning from real inboxes |
| Tax guidance | State-level | due dates + filing steps where locked |
| Core loop | Email → Gemini → verify | classification improves with use |
| Extraction | Patchy | by bank / sender — in progress |

- **narrator (NOTE):** No inflated percentages on this slide. If I did not measure it rigorously, it does not get a vanity metric.

### Embed (`dara-live`)

- **headline:** Live beta  
- **embedUrl:** https://mydara.co  
- **caption:** Beta is open registration at mydara.co. If this frame is empty, the app may block embedding—use the Live demo link above or open the site in a new tab. Mail access runs only after you authorize your mail provider sign-in flow; you can revoke anytime from provider security settings or in-app disconnect actions. Anything about retention or data handling on mydara.co privacy/terms is authoritative over this portfolio copy. This slide is explanatory, not a separate legal agreement.  
- **narrator (TRUST NOTE):** Trust is often the bottleneck, not novelty: granting read access to mail feels existential until consent, revoke, and what we persist are plainly visible. Published policy pages carry the commitment; flagship copy only points people there honestly while extraction and classification still improve.

### Quote (`dara-reflection`)

- **quote:** Dara is where I stopped treating AI as a shortcut and started treating it as part of the loop—same as email parsers, state tables, and UI. The case study is one thread; the rest is documented in pieces so nothing sounds like marketing filler.  
- **attribution:** Deron  
- **role:** Reflection  

---

## Outcome block

**Metrics:**

- Beta testers — 10  
- Status — In beta  
- Build — AI-assisted, ongoing  

**Testimonial:** Shipping Dara meant accepting uneven extraction, cutting WhatsApp for cost, and publishing beta status without dressing it up. The work continues in the open.  

**testimonialAuthor:** Personal reflection  

---

## Changelog (this reference file)

| Date | Note |
|------|------|
| 2026-05-08 | Created; documented JSON-vs-TS precedence; mirrored `dara.ts` / synced `case-studies.json`; aligned `projects.json` grid blurb with meta summary tone. |
