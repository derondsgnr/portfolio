import { motion } from "motion/react";
import { TextReveal, Reveal } from "./motion-primitives";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-12 md:pb-20 overflow-hidden">
      {/* Decorative accent line — bleeds off right edge */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, delay: 1, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-[35%] right-0 w-[40%] h-px bg-[#e2b93b]/20 origin-right hidden md:block"
      />

      {/* Background typographic element — massive, faded, bleeds off screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-[8%] right-[-5%] select-none pointer-events-none hidden md:block"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(10rem, 25vw, 28rem)",
          lineHeight: 0.85,
          letterSpacing: "-0.02em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          textTransform: "uppercase",
        }}
      >
        D<br />S
      </motion.div>

      {/* Content — asymmetrically positioned */}
      <div className="relative z-10 px-6 md:px-10">
        {/* Eyebrow */}
        <Reveal delay={0.5}>
          <p
            className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.3em] mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Product Designer & Builder
          </p>
        </Reveal>

        {/* Name — massive, editorial, staggered */}
        <div className="overflow-hidden">
          <TextReveal delay={0.3}>
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(3.5rem, 14vw, 14rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              deron
            </h1>
          </TextReveal>
        </div>
        <div className="overflow-hidden md:ml-[8%]">
          <TextReveal delay={0.5}>
            <h1
              style={{
                fontSize: "clamp(3.5rem, 14vw, 14rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                WebkitTextStroke: "1.5px rgba(226, 185, 59, 0.4)",
                color: "transparent",
              }}
            >
              dsgnr
            </h1>
          </TextReveal>
        </div>

        {/* Divider — asymmetric width */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.77, 0, 0.175, 1] }}
          className="h-px bg-white/10 origin-left mt-10 md:mt-14 max-w-[60%]"
        />

        {/* Statement — the hero copy, offset right on desktop */}
        <div className="mt-8 md:mt-10 md:ml-auto md:max-w-[50%] lg:max-w-[40%]">
          <Reveal delay={1}>
            <p
              className="text-white/80 text-[1rem] md:text-[1.15rem]"
              style={{ fontFamily: "var(--font-body)", lineHeight: 1.7 }}
            >
              Your product will be judged on how it looks
              before anyone uses it.
            </p>
          </Reveal>
        </div>

        {/* Scroll indicator — bottom left */}
        <Reveal delay={1.4} className="mt-14 md:mt-20">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-start gap-2"
          >
            <span
              className="text-white/30 text-[0.65rem] uppercase tracking-[0.3em]"
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
