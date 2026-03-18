/**
 * VARIATION 4 — "ORBIT"
 * DNA: Cosmos. Spatial, scattered, organic. Elements float at different
 * positions across the viewport with intentional asymmetry. Work items
 * at varying scales like a gallery wall. Philosophy as floating label
 * cards. Testimonials as a ticker strip. The page feels like an art
 * installation — not a traditional scroll.
 * Transitions: Elements fade in from different directions. Staggered
 * parallax depths. Gentle rotations. The page drifts, it doesn't march.
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  TextReveal,
  Reveal,
  LineDraw,
  SectionTransition,
  WipeDivider,
  ParallaxImage,
} from "../motion-primitives";
import {
  PROJECTS,
  PRINCIPLES,
  PROCESS_WORDS,
} from "../homepage-data";
import { useTestimonials } from "@/contexts/testimonials-context";
import { useSiteConfig } from "@/contexts/site-config-context";

/* ─── HERO: Scattered, spatial, floating ──────────────────────── */
function HeroOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const statementY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Floating decorative elements — scattered across viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-[20%] right-[15%] hidden md:block pointer-events-none"
      >
        <div className="w-px h-24 bg-gradient-to-b from-[#e2b93b]/20 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.3 }}
        className="absolute top-[35%] left-[8%] hidden md:block pointer-events-none"
      >
        <div className="w-16 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-[30%] right-[8%] hidden md:block pointer-events-none"
      >
        <span
          className="text-[#e2b93b]/10 text-[0.6rem] uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          2025
        </span>
      </motion.div>

      {/* Eyebrow — top left */}
      <div className="absolute top-24 md:top-28 left-6 md:left-10 z-10">
        <Reveal delay={0.5}>
          <p
            className="text-[#e2b93b]/70"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            Product Designer & Builder
          </p>
        </Reveal>
      </div>

      {/* Availability — top right */}
      <div className="absolute top-24 md:top-28 right-6 md:right-10 z-10">
        <Reveal delay={0.7}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2b93b] animate-pulse" />
            <span
              className="text-white/25 hidden sm:inline"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Available
            </span>
          </div>
        </Reveal>
      </div>

      {/* Name — floating in the center-left zone, with parallax */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 z-10">
        <motion.div style={{ y: nameY }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h1
              className="text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 10vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                textTransform: "lowercase",
              }}
            >
              deron
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="md:ml-[15%]"
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 10vw, 9rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                textTransform: "lowercase",
                WebkitTextStroke: "1px rgba(226,185,59,0.25)",
                color: "transparent",
              }}
            >
              dsgnr
            </h1>
          </motion.div>
        </motion.div>
      </div>

      {/* Statement — bottom right, floating */}
      <div className="absolute bottom-14 md:bottom-20 right-6 md:right-10 z-10 max-w-xs md:max-w-sm">
        <motion.div style={{ y: statementY }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="h-px bg-white/10 origin-right mb-4"
          />
          <Reveal delay={0.9}>
            <p
              className="text-white/40 text-right"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                lineHeight: 1.8,
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Your product will be judged on how it looks before anyone uses it.
            </p>
          </Reveal>
        </motion.div>
      </div>

      {/* Scroll — bottom left */}
      <div className="absolute bottom-14 md:bottom-20 left-6 md:left-10 z-10">
        <Reveal delay={1.2}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-start gap-2"
          >
            <span
              className="text-white/15"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Scroll
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── PROCESS: Scattered words, floating positions ────────────── */
function ProcessOrbit() {
  const sizes = ["clamp(2rem, 4vw, 4rem)", "clamp(1.4rem, 2.5vw, 2.5rem)", "clamp(1.8rem, 3.5vw, 3.5rem)", "clamp(1.6rem, 3vw, 3rem)"];
  return (
    <SectionTransition mode="fade">
      <div className="relative py-20 md:py-28 px-6 md:px-10 overflow-hidden border-y border-white/[0.03]">
        <div className="relative h-32 md:h-48">
          {PROCESS_WORDS.map((word, i) => {
            const positions = [
              { left: "2%", top: "10%" },
              { left: "28%", top: "55%" },
              { left: "52%", top: "15%" },
              { left: "78%", top: "50%" },
            ];
            return (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute"
                style={positions[i]}
              >
                <span
                  className="text-[#e2b93b]/8 block mb-1"
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.5rem", letterSpacing: "0.15em", fontWeight: 300, fontStyle: "italic" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-white/[0.07] whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: sizes[i],
                    letterSpacing: "-0.01em",
                    textTransform: "lowercase",
                  }}
                >
                  {word}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionTransition>
  );
}

/* ─── WORK: Gallery wall — scattered at different scales ─────── */
function WorkOrbit() {
  return (
    <SectionTransition mode="fade-up">
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <Reveal>
              <p
                className="text-[#e2b93b]/60 mb-3"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 300, fontStyle: "italic" }}
              >
                Selected Projects
              </p>
            </Reveal>
            <TextReveal delay={0.1}>
              <h2 className="text-white" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 6rem)", letterSpacing: "-0.02em", textTransform: "lowercase" }}>work</h2>
            </TextReveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/work"
              className="text-white/30 hover:text-[#e2b93b] transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 300, fontStyle: "italic" }}
            >
              All work
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>

        {/* Scattered gallery grid — intentionally uneven */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Project 1 — large, spans 7 cols */}
          <SectionTransition
            mode="fade-up"
            className="md:col-span-7 md:col-start-1"
          >
            <Link href={`/work/${PROJECTS[0].slug}`} className="block group">
              <div className="relative overflow-hidden">
                <ParallaxImage
                  src={PROJECTS[0].image}
                  alt={PROJECTS[0].title}
                  className="w-full aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="w-6 h-6 text-[#e2b93b]" strokeWidth={1} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[#e2b93b]/40 text-[0.65rem] tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {PROJECTS[0].id}
                  </span>
                  <h3 className="text-white group-hover:text-[#e2b93b] transition-colors duration-300">
                    {PROJECTS[0].title}
                  </h3>
                </div>
                <span
                  className="text-white/20 text-[0.7rem] hidden md:inline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {PROJECTS[0].year}
                </span>
              </div>
            </Link>
          </SectionTransition>

          {/* Project 2 — smaller, 4 cols, pushed down */}
          <SectionTransition
            mode="fade-up"
            delay={0.2}
            className="md:col-span-4 md:col-start-9 md:mt-32"
          >
            <Link href={`/work/${PROJECTS[1].slug}`} className="block group">
              <div className="relative overflow-hidden">
                <ParallaxImage
                  src={PROJECTS[1].image}
                  alt={PROJECTS[1].title}
                  className="w-full aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="w-5 h-5 text-[#e2b93b]" strokeWidth={1} />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className="text-[#e2b93b]/40 text-[0.65rem] tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {PROJECTS[1].id}
                </span>
                <h3 className="text-white group-hover:text-[#e2b93b] transition-colors duration-300 mt-1">
                  {PROJECTS[1].title}
                </h3>
              </div>
            </Link>
          </SectionTransition>

          {/* Project 3 — wide, centered, below */}
          <SectionTransition
            mode="fade-up"
            delay={0.15}
            className="md:col-span-8 md:col-start-3 md:mt-8"
          >
            <Link href={`/work/${PROJECTS[2].slug}`} className="block group">
              <div className="relative overflow-hidden">
                <ParallaxImage
                  src={PROJECTS[2].image}
                  alt={PROJECTS[2].title}
                  className="w-full aspect-[21/9]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="w-6 h-6 text-[#e2b93b]" strokeWidth={1} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[#e2b93b]/40 text-[0.65rem] tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {PROJECTS[2].id}
                  </span>
                  <h3 className="text-white group-hover:text-[#e2b93b] transition-colors duration-300">
                    {PROJECTS[2].title}
                  </h3>
                </div>
                <span
                  className="text-white/20 text-[0.7rem] hidden md:inline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {PROJECTS[2].category}
                </span>
              </div>
            </Link>
          </SectionTransition>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── PHILOSOPHY: Floating label cards, spatial ───────────────── */
function PhilosophyOrbit() {
  return (
    <SectionTransition mode="fade">
      <section className="py-24 md:py-40 px-6 md:px-10 relative">
        <Reveal>
          <p
            className="text-[#e2b93b]/60 mb-16 md:mb-24"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 300, fontStyle: "italic" }}
          >
            Philosophy & Services
          </p>
        </Reveal>

        <div className="space-y-0">
          {PRINCIPLES.map((p, i) => {
            // Alternate offsets for spatial feel
            const offsets = [
              "md:ml-0 md:mr-[25%]",
              "md:ml-[20%] md:mr-[5%]",
              "md:ml-[5%] md:mr-[20%]",
            ];

            return (
              <SectionTransition key={p.number} mode="fade-up" delay={0.05}>
                <div
                  className={`py-14 md:py-20 border-t border-white/[0.04] ${offsets[i]}`}
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-16">
                    {/* Number + title */}
                    <div className="md:w-1/2">
                      <div className="flex items-start gap-4">
                        <span
                          className="text-[#e2b93b]/20 text-[0.65rem] tracking-[0.3em] mt-2 shrink-0"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {p.number}
                        </span>
                        <TextReveal delay={0.1}>
                          <h3
                            className="text-white whitespace-pre-line"
                            style={{
                              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
                              lineHeight: 0.95,
                            }}
                          >
                            {p.title}
                          </h3>
                        </TextReveal>
                      </div>
                    </div>

                    {/* Body + service */}
                    <div className="md:w-1/2">
                      <Reveal delay={0.2}>
                        <p
                          className="text-white/40 text-[0.85rem]"
                          style={{
                            fontFamily: "var(--font-body)",
                            lineHeight: 1.8,
                          }}
                        >
                          {p.body}
                        </p>
                      </Reveal>
                      <Reveal delay={0.3}>
                        <span
                          className="text-[#e2b93b] text-[0.65rem] uppercase tracking-[0.15em] mt-4 inline-flex items-center gap-3"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <span className="w-4 h-px bg-[#e2b93b]/30" />
                          {p.service}
                        </span>
                      </Reveal>
                    </div>
                  </div>
                </div>
              </SectionTransition>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <p
            className="text-[#e2b93b]/50 text-[0.7rem] uppercase tracking-[0.25em] mt-10 md:text-right"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Design + Strategy + Psychology + Execution.
          </p>
        </Reveal>
      </section>
    </SectionTransition>
  );
}

/* ─── ABOUT: Off-grid, spatial ────────────────────────────────── */
function AboutOrbit() {
  return (
    <SectionTransition mode="scale">
      <section className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        {/* Floating accent marks */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-[15%] right-[12%] pointer-events-none select-none hidden md:block"
        >
          <div className="w-px h-32 bg-gradient-to-b from-[#e2b93b]/15 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Statement — offset left */}
          <div className="md:col-span-8 md:col-start-2">
            <Reveal>
              <p
                className="text-[#e2b93b]/60 mb-6"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 300, fontStyle: "italic" }}
              >
                About
              </p>
            </Reveal>

            <TextReveal>
              <h2 className="text-white" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 6rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "lowercase" }}>
                i don't just
              </h2>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                className="md:ml-[10%]"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 6rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "lowercase",
                  WebkitTextStroke: "1px rgba(226,185,59,0.25)",
                  color: "transparent",
                }}
              >
                design products
              </h2>
            </TextReveal>
            <TextReveal delay={0.3}>
              <h2 className="text-white md:ml-[5%]" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 6vw, 6rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "lowercase" }}>
                i build them.
              </h2>
            </TextReveal>
          </div>

          {/* Body — floating right, pushed down */}
          <div className="md:col-span-3 md:col-start-9 md:mt-20">
            <Reveal delay={0.4}>
              <p
                className="text-white/40 text-[0.85rem] mb-6"
                style={{ fontFamily: "var(--font-body)", lineHeight: 1.8 }}
              >
                From strategy to interface, I move at the speed your startup needs.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#e2b93b]/60 hover:text-[#e2b93b] transition-colors duration-300"
              >
                <span
                  className="text-[0.7rem] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  More
                </span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>

        <WipeDivider className="mt-20 md:mt-28" />
      </section>
    </SectionTransition>
  );
}

/* ─── TESTIMONIALS: Horizontal ticker strip ───────────────────── */
function TestimonialsOrbit() {
  const [current, setCurrent] = useState(0);
  const testimonials = useTestimonials();
  const total = testimonials.length;
  const t = testimonials[current];

  return (
    <SectionTransition mode="fade">
      <section className="py-24 md:py-40 px-6 md:px-10">
        {/* Ticker-style marquee of names — decorative */}
        <div className="overflow-hidden mb-12 md:mb-16">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 w-max"
          >
            {[...testimonials, ...testimonials].map((tm, i) => (
              <span
                key={`${tm.id}-${i}`}
                className={`text-[0.65rem] uppercase tracking-[0.2em] whitespace-nowrap ${
                  tm.id === t.id ? "text-[#e2b93b]/40" : "text-white/[0.06]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tm.name} — {tm.company}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Main testimonial */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <span
              className="text-white block mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              {current + 1}/{total}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p
                  className="text-white/50 text-[0.9rem]"
                  style={{ fontFamily: "var(--font-body)", lineHeight: 1.8 }}
                >
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 mt-6">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <span
                      className="text-white/40 text-[0.6rem]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-white text-[0.8rem]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-white/30 text-[0.65rem]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setCurrent((p) => (p - 1 + total) % total)}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setCurrent((p) => (p + 1) % total)}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Right — massive heading */}
          <div className="md:col-span-6 md:col-start-7 flex items-center">
            <div>
              <h2
                className="text-white"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "lowercase",
                }}
              >
                trusted by
              </h2>
              <h2
                className="md:ml-[8%]"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "lowercase",
                  WebkitTextStroke: "1px rgba(255,255,255,0.06)", color: "transparent",
                }}
              >
                founders &
              </h2>
              <h2
                style={{
                  fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "lowercase",
                  WebkitTextStroke: "1px rgba(255,255,255,0.06)", color: "transparent",
                }}
              >
                collaborators
              </h2>
            </div>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function FooterOrbit() {
  const { global } = useSiteConfig();
  const socialLinks = global.socialLinks;
  const copyright = global.footerCopyright ?? `© ${new Date().getFullYear()} derondsgnr`;
  return (
    <SectionTransition mode="fade-up">
      <footer id="cta" className="px-6 md:px-10 pt-24 md:pt-40 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-7">
            <Reveal>
              <p
                className="text-[#e2b93b]/60 mb-8"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 300, fontStyle: "italic" }}
              >
                Let's build something
              </p>
            </Reveal>

            <TextReveal>
              <h2
                className="text-white"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "lowercase" }}
              >
                from idea
              </h2>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2
                className="md:ml-[8%]"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "lowercase", WebkitTextStroke: "1px rgba(255,255,255,0.06)", color: "transparent" }}
              >
                to interface
              </h2>
            </TextReveal>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <Reveal delay={0.3}>
              <a
                href="#"
                className="inline-block text-[0.85rem] uppercase tracking-[0.15em] px-8 py-4 bg-[#e2b93b] text-[#0a0a0a] hover:bg-[#e2b93b]/80 transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book a call
              </a>
            </Reveal>
          </div>
        </div>

        <LineDraw />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  className="text-white/30 hover:text-[#e2b93b] transition-colors duration-300 text-[0.75rem] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p
            className="text-white/15 text-[0.65rem] tracking-[0.15em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {copyright}
          </p>
        </div>
      </footer>
    </SectionTransition>
  );
}

/* ─── EXPORT ──────────────────────────────────────────────────── */
export function HomepageOrbit() {
  return (
    <main className="relative">
      <HeroOrbit />
      <ProcessOrbit />
      <WorkOrbit />
      <PhilosophyOrbit />
      <AboutOrbit />
      <TestimonialsOrbit />
      <FooterOrbit />
    </main>
  );
}