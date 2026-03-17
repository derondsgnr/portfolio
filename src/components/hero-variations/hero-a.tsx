/**
 * HERO VARIATION A — "Full Bleed Statement"
 *
 * DNA: Maximum scale contrast. Name spans near-full viewport width.
 * Statement below in large Anton but deliberately smaller than name.
 * Asymmetric — name bleeds left, statement offsets right.
 * Pure typographic hero, no imagery.
 */

import { motion } from "motion/react";
import { TextReveal, Reveal, LineDraw } from "../motion-primitives";

export function HeroVariationA() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-10 md:pb-16 overflow-hidden">
      {/* Eyebrow — accent yellow, top left */}
      <div className="absolute top-24 md:top-28 left-6 md:left-10">
        <Reveal delay={0.8}>
          <p
            className="text-[var(--brand-accent)] text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Product Designer & Builder
          </p>
        </Reveal>
      </div>

      {/* Availability badge — top right */}
      <div className="absolute top-24 md:top-28 right-6 md:right-10">
        <Reveal delay={1}>
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

      {/* Main content */}
      <div className="relative z-10 px-4 md:px-10">
        {/* Name — massive, bleeds left edge */}
        <div className="overflow-hidden -ml-1 md:-ml-2">
          <TextReveal delay={0.2}>
            <h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(4rem, 15vw, 16rem)",
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
              }}
            >
              deron
            </h1>
          </TextReveal>
        </div>
        <div className="overflow-hidden -ml-1 md:ml-[10%]">
          <TextReveal delay={0.35}>
            <h1
              className="uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(4rem, 15vw, 16rem)",
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                color: "transparent",
              }}
            >
              dsgnr
            </h1>
          </TextReveal>
        </div>

        {/* Divider */}
        <LineDraw className="mt-8 md:mt-10" delay={0.8} />

        {/* Statement — offset right, smaller scale */}
        <div className="mt-6 md:mt-8 md:ml-[35%] lg:ml-[45%]">
          <Reveal delay={0.9}>
            <p
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3.5vw, 3.2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Your product will be judged
            </p>
          </Reveal>
          <Reveal delay={1}>
            <p
              className="text-[var(--brand-secondary-text)] uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3.5vw, 3.2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              on how it looks
            </p>
          </Reveal>
          <Reveal delay={1.1}>
            <p
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3.5vw, 3.2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              before anyone uses it.
            </p>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <Reveal delay={1.5} className="mt-12 md:mt-14">
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
    </section>
  );
}
