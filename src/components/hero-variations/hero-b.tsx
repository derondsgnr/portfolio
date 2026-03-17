/**
 * HERO VARIATION B — "Poster Split"
 *
 * DNA: Two-zone composition. Left zone: name stacked with extreme vertical scale.
 * Right zone: statement running vertically down the side.
 * Creates a dialogue between identity and manifesto.
 * On mobile: collapses to stacked with asymmetric offsets.
 */

import { motion } from "motion/react";
import { TextReveal, Reveal, LineDraw } from "../motion-primitives";

export function HeroVariationB() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Eyebrow — accent yellow */}
      <div className="absolute top-24 md:top-28 left-6 md:left-10 z-10">
        <Reveal delay={0.8}>
          <p
            className="text-[var(--brand-accent)] text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Product Designer & Builder
          </p>
        </Reveal>
      </div>

      {/* Main composition — desktop: two zones */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left zone — Name, stacked, massive */}
        <div className="flex-1 flex flex-col justify-end pb-8 md:pb-16 px-4 md:px-10 pt-36 md:pt-0">
          {/* Each syllable on its own line for vertical rhythm */}
          <div className="overflow-hidden">
            <TextReveal delay={0.2}>
              <h1
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(5rem, 18vw, 14rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.85,
                }}
              >
                de
              </h1>
            </TextReveal>
          </div>
          <div className="overflow-hidden">
            <TextReveal delay={0.35}>
              <h1
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(5rem, 18vw, 14rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.85,
                }}
              >
                ron
              </h1>
            </TextReveal>
          </div>
          <div className="overflow-hidden">
            <TextReveal delay={0.5}>
              <h1
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(5rem, 18vw, 14rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.85,
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                dsgnr
              </h1>
            </TextReveal>
          </div>

          {/* Availability dot — below name */}
          <Reveal delay={1} className="mt-6 md:mt-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)] animate-pulse" />
              <span
                className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Available for projects
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right zone — Statement, vertically anchored */}
        <div className="md:w-[38%] lg:w-[35%] flex flex-col justify-end px-4 md:px-0 md:pr-10 pb-10 md:pb-16">
          <LineDraw className="mb-6 md:mb-8 md:hidden" delay={0.8} />

          {/* Statement — stacked with scale contrast */}
          <Reveal delay={0.9}>
            <p
              className="text-[var(--brand-secondary-text)] uppercase mb-1"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(0.7rem, 1vw, 0.85rem)",
                letterSpacing: "0.15em",
              }}
            >
              Manifesto
            </p>
          </Reveal>

          <div className="border-l border-white/10 pl-4 md:pl-6">
            <Reveal delay={1}>
              <p
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.3rem, 2.5vw, 2.4rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Your product
                <br />
                will be judged
              </p>
            </Reveal>
            <Reveal delay={1.1}>
              <p
                className="text-[var(--brand-accent)] uppercase mt-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.3rem, 2.5vw, 2.4rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                on how it looks
              </p>
            </Reveal>
            <Reveal delay={1.2}>
              <p
                className="text-[var(--brand-secondary-text)] uppercase mt-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.3rem, 2.5vw, 2.4rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                before anyone
                <br />
                uses it.
              </p>
            </Reveal>
          </div>

          {/* Scroll indicator — right side */}
          <Reveal delay={1.5} className="mt-10 md:mt-14">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-start gap-2"
            >
              <span
                className="text-white/30 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Scroll
              </span>
              <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
