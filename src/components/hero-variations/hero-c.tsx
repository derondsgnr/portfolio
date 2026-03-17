/**
 * HERO VARIATION C — "Cropped Monumental"
 *
 * DNA: Name is SO large it crops off edges — Aristide-style.
 * Only partial letterforms visible, creating architectural negative space.
 * Statement floats in a small block, asymmetrically positioned.
 * The name becomes a background texture, not a readable word.
 */

import { motion } from "motion/react";
import { Reveal } from "../motion-primitives";

export function HeroVariationC() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Cropped monumental name — fills viewport, overflows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <h1
          className="text-white/[0.04] uppercase whitespace-nowrap"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(20rem, 45vw, 55rem)",
            letterSpacing: "-0.02em",
            lineHeight: 0.8,
          }}
        >
          deron
        </h1>
      </motion.div>

      {/* Second layer — slightly offset, different opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 flex items-end justify-center pointer-events-none select-none"
        style={{ transform: "translateY(15%)" }}
      >
        <h1
          className="text-white/[0.03] uppercase whitespace-nowrap"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(18rem, 40vw, 50rem)",
            letterSpacing: "-0.02em",
            lineHeight: 0.8,
          }}
        >
          dsgnr
        </h1>
      </motion.div>

      {/* Top content */}
      <div className="relative z-10 pt-24 md:pt-28 px-6 md:px-10">
        <Reveal delay={0.8}>
          <div className="flex items-center justify-between">
            <p
              className="text-[var(--brand-accent)] text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Product Designer & Builder
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)] animate-pulse" />
              <span
                className="text-white/40 text-[0.65rem] uppercase tracking-[0.2em] hidden sm:inline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Available for projects
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Center — readable name, moderate size, floating */}
      <div className="relative z-10 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 12vw, 11rem)",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
            }}
          >
            derondsgnr
          </h1>
        </motion.div>
      </div>

      {/* Bottom content — statement + scroll */}
      <div className="relative z-10 pb-10 md:pb-16 px-6 md:px-10">
        {/* Statement — asymmetric, right-aligned on desktop */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left — scroll indicator */}
          <Reveal delay={1.3}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-start gap-2 order-2 md:order-1"
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

          {/* Right — statement block */}
          <div className="order-1 md:order-2 md:max-w-lg md:text-right">
            <Reveal delay={0.9}>
              <div className="h-px bg-white/10 mb-6" />
            </Reveal>
            <Reveal delay={1}>
              <p
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.2rem, 2.2vw, 2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Your product will be judged
              </p>
            </Reveal>
            <Reveal delay={1.1}>
              <p
                className="text-[var(--brand-accent)] uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.2rem, 2.2vw, 2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                on how it looks
              </p>
            </Reveal>
            <Reveal delay={1.2}>
              <p
                className="text-[var(--brand-secondary-text)] uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.2rem, 2.2vw, 2rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                before anyone uses it.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
