# Interactive prototypes under derondsgnr.com

> **Status:** Planned — flesh out when ready. Not implemented yet.

## Intent

Upgrade how case studies are presented: move from static mockups/slides toward **clickable interactive prototypes** users can play with. The case study engine already supports this direction (`liveDemoUrl`, embed slides, etc.).

## Model

- Each prototype is a **separate front-end** (Framer export, Next.js app, etc.), deployed on its own.
- Host under your domain so links feel cohesive, e.g.:
  - Subdomains: `bridgepay.derondsgnr.com`, `urban.derondsgnr.com`, or
  - Path prefix: `projects.derondsgnr.com/<slug>`
- From `/work/[slug]`, a CTA opens the live prototype so visitors can click through the real experience.

## Hosting / cost (reference)

- **Vercel Hobby** can support multiple projects + custom subdomains; see limits (bandwidth ~100 GB/mo, domains per project, etc.) in [Vercel plans](https://vercel.com/docs/plans/hobby).
- Watch usage if traffic grows; Pro tier if commercial scale or limits become an issue.

## Implementation checklist (when you start)

- [ ] Decide URL pattern: per-project subdomains vs `projects.*` paths.
- [ ] DNS: add records for each subdomain (or wildcard) per Vercel instructions.
- [ ] Wire `liveDemoUrl` (or equivalent) in case study meta for each shipped prototype.
- [ ] Ensure CSP / `frame-src` in `next.config.ts` if embedding prototypes in iframes.
- [ ] Optional: embed slide type or dedicated “Open prototype” block in SlideRenderer.

## Related code

- Case study type: `liveDemoUrl` on `CaseStudy` (`src/types/case-study.ts`).
- Case study engine / reader may surface a persistent demo button — verify when implementing.
