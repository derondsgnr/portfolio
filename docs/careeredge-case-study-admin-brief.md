# CareerEdge case study — brief for Admin (manual build)

Use this when creating or rewriting the CareerEdge entry in **Admin → Case Studies**.  
**Slug must stay:** `careeredge` (matches `/work/careeredge` and Projects).

---

## Tone & stakes (what readers should feel)

- **Honest momentum, not melodrama.** The world ships fast — that is not framed as villainy.
- **Design / UX arriving late on a moving train:** call it clearly, calmly. You are explaining *sequence*, not blame.
- **Scale is real, not exaggerated:** roughly **eight roles**, **eight dashboards**, **twenty‑plus shipped features**. This sets up why the work was *architectural* (spine, disclosure, sequencing), not decoration.
- **Voice:** same brutalist/editorial portfolio voice as the rest of the site — sharper hooks welcome, zero drama‑for‑sport.

---

## Honesty guardrails

- **No fabricated KPIs** (conversion %, invented revenue lifts, fake user counts).
- **Timeline:** ~2-week scope that became ~**1 month** active delivery is OK to state plainly.
- **Live product:** https://careeredged.com (`liveDemoUrl` in meta / case study shell if exposed in Admin).

---

## Story arc (recommended)

Work in three beats — **Stakes → Strategy → Execution**:

1. **Stakes**
   - **Fast shipping rewired sequence** — breadth exists before narrative calm; experience was the last discipline to get a sharp seat at the table.
   - **Why it hurt** — not “ugly dashboards,” but *asking for attention in the wrong order*: too much at once, too late, repeated across surfaces; career software breaks in gaps.
   - **Breadth grounding** — the **8 roles / 8 dashboards / 20+ features** line lands here once, as fact, then you move on.

2. **Strategy**
   - **Spine framing** — reposition the AI guide (Sophia) from “bolt-on assistant” to *connective tissue* / directional intelligence.
   - **Progressive disclosure** — legitimacy of breadth vs user path; layering insight-first with routes into depth.
   - **Access & reality** — roles as permissions/life overlap (avoid forcing fractured identities across accounts).
   - **Navigation philosophy** — structure + contextual intelligence + fast paths for experts; conversational UI is not wholesale replacement.

3. **Execution**
   - Shorter flows, reused context where it already exists (where product truth supports it).
   - Shell + mocks / flows / process visuals as evidence — **URLs you paste in Admin** (below).

---

## Slide craft rules

- **Narrative / insight `body` and similar fields:** plain prose only — **do not use Markdown** (no `**bold**` chunks); the renderer treats these as plain text.
- **`id` fields on slides:** keep **stable IDs** once you paste real image URLs — changing IDs orphans media links in GitHub JSON.
- **`narrator` strips:** optional — use sparingly (“DESIGNER’S NOTE”, “PROCESS NOTE”). Short, monospace voice.

---

## Media map (paste URLs in this order — matches slide captions / labels)

Rough order **top → bottom** in the timeline you ship:

| Slot   | Typical slide type           | Paste |
|--------|-------------------------------|-------|
| Cover  | Opening cover hero            | `meta.cover` + Cover slide hero image URL |
| M01    | Primary product shell mock    | Large mock slider |
| M02    | “Sophia” / guidance strip     | Narrow / secondary strip mock |
| F01–F03 | Onboarding flow            | Flow screenshots (≤3 beats) |
| P01–P03 | Process / artifacts        | Linear process slide images |
| G01–G03 | Gallery / comparison       | Supporting gallery or comparison mocks |

Naming is for your sanity in Admin search — captions in copy can echo **M01, F02**, etc., if helpful.

---

## Also wire on `/work`

**Admin → Projects:** keep a Project row whose **`slug`** is `careeredge` so the deck appears on the work index.

- **`image`:** ideally same hero as cover (tile quality).
- If you **archive** the case study (`status: archived`), the public site should hide the `/work/[slug]` page **and drop the matching project tile** (after deploying current code fixes).

---

## After you save

- Git commits `content/case-studies.json` — production reads that (+ code registry for slugs that never hit JSON yet).
- If copy is **only** in this `.md` file and not typed into Admin → it will **not** be live until you paste it through Case Studies UI and Save.
