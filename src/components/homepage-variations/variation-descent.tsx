/**
 * VARIATION 1 — "DESCENT"
 * DNA: Damn Good Brands. Vertical storytelling through dramatic scale jumps.
 * Each section feels like turning a magazine page. Massive → intimate → massive.
 * Restrained editorial. Clean column rhythms. The page "breathes" between moments.
 * Transitions: Slow fade-ups with staggered reveals. Horizontal line draws
 * bridge sections. Parallax depth on images. Everything earned, nothing gratuitous.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  TESTIMONIALS,
  PROCESS_WORDS,
  SOCIAL_LINKS,
} from "../homepage-data";

/* ─── HERO: Centered monolith ─────────────────────────────────── */
function HeroDescent() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ghost watermark — bleeds off bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(14rem, 35vw, 40rem)",
          lineHeight: 0.8,
          letterSpacing: "-0.02em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          textTransform: "uppercase",
        }}
      >
        DS
      </motion.div>

      {/* Centered content column */}
      <div className="relative z-10 text-center px-6">
        <Reveal delay={0.3}>
          <p
            className="text-[#e2b93b]/70 mb-12"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            Product Designer & Builder
          </p>
        </Reveal>

        {/* Hero name — Instrument Sans italic, literary feel */}
        <div className="overflow-hidden">
          <TextReveal delay={0.1}>
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(3.5rem, 12vw, 12rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              Deron
            </span>
          </TextReveal>
        </div>
        <div className="overflow-hidden">
          <TextReveal delay={0.25}>
            <span
              className="block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(3.5rem, 12vw, 12rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                fontStyle: "italic",
                fontWeight: 600,
                WebkitTextStroke: "1.5px rgba(226,185,59,0.35)",
                color: "transparent",
              }}
            >
              Designer
            </span>
          </TextReveal>
        </div>

        <Reveal delay={0.8}>
          <p
            className="text-white/40 mt-14 max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              lineHeight: 2.1,
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Your product will be judged on how it looks before anyone uses it.
          </p>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <Reveal delay={1.2} className="absolute bottom-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </Reveal>
    </section>
  );
}

/* ─── PROCESS: Spaced number row ──────────────────────────────── */
function ProcessDescent() {
  const romanNumerals = ["I", "II", "III", "IV"];
  return (
    <SectionTransition mode="fade-up">
      <div className="py-16 md:py-24 px-6 md:px-10">
        <WipeDivider className="mb-12 md:mb-16" />
        <div className="flex items-baseline justify-between max-w-5xl mx-auto">
          {PROCESS_WORDS.map((word, i) => (
            <Reveal key={word} delay={i * 0.12}>
              <div className="text-center">
                <span
                  className="text-[#e2b93b]/20 block mb-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {romanNumerals[i]}
                </span>
                <span
                  className="text-white/25 block"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  {word}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <WipeDivider className="mt-12 md:mt-16" delay={0.3} />
      </div>
    </SectionTransition>
  );
}

/* ─── WORK: Full-width editorial cards ────────────────────────── */
function WorkDescent() {
  return (
    <SectionTransition mode="fade-up">
      <section className="py-24 md:py-40 px-6 md:px-10">
        {/* Header — centered, editorial italic */}
        <div className="text-center mb-20 md:mb-28">
          <Reveal>
            <p
              className="text-[#e2b93b]/60 mb-5"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 400 }}
            >
              Selected Projects
            </p>
          </Reveal>
          <TextReveal delay={0.1}>
            {/* Use span instead of h2 to avoid global heading styles */}
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              Work
            </span>
          </TextReveal>
        </div>

        {/* Full-width cards */}
        <div className="space-y-32 md:space-y-44">
          {PROJECTS.map((project, i) => (
            <SectionTransition key={project.id} mode="parallax" delay={0.1}>
              <Link href={`/work/${project.slug}`} className="block group">
                <div className="relative overflow-hidden">
                  <ParallaxImage
                    src={project.image}
                    alt={project.title}
                    className={`w-full ${i === 1 ? "aspect-[21/9]" : "aspect-[16/10]"}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700" />
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight className="w-8 h-8 text-[#e2b93b]" strokeWidth={1} />
                  </div>
                </div>

                {/* Info — Instrument Sans, editorial style */}
                <div className="flex items-baseline justify-between mt-6 md:mt-7">
                  <div className="flex items-baseline gap-5">
                    <span
                      className="text-[#e2b93b]/30"
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontStyle: "italic", fontWeight: 400 }}
                    >
                      {project.id}
                    </span>
                    {/* Title in Instrument Sans italic — editorial feel */}
                    <span
                      className="text-white group-hover:text-[#e2b93b] transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
                        letterSpacing: "-0.01em",
                        fontStyle: "italic",
                        fontWeight: 500,
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <span
                      className="text-white/20"
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontStyle: "italic", fontWeight: 400 }}
                    >
                      {project.category}
                    </span>
                    <span
                      className="text-white/15"
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 400 }}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>
              </Link>

              {i < PROJECTS.length - 1 && (
                <WipeDivider className="mt-16 md:mt-20" delay={0.2} />
              )}
            </SectionTransition>
          ))}
        </div>

        <Reveal delay={0.3} className="text-center mt-16 md:mt-24">
          <Link
            href="/work"
            className="text-white/30 hover:text-[#e2b93b] transition-colors duration-300 inline-flex items-center gap-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            View all work
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1} />
          </Link>
        </Reveal>
      </section>
    </SectionTransition>
  );
}

/* ─── PHILOSOPHY: Scrolling manifesto with pull quotes ─────────── */
function PhilosophyDescent() {
  return (
    <SectionTransition mode="scale">
      <section className="py-24 md:py-40 px-6 md:px-10 relative">
        {/* Giant background ampersand */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-[-5%] pointer-events-none select-none hidden md:block"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(15rem, 30vw, 35rem)",
            lineHeight: 0.8,
            fontStyle: "italic",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.02)",
          }}
        >
          &
        </motion.div>

        <div className="relative z-10">
          <Reveal>
            <p
              className="text-[#e2b93b]/60 mb-4"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 400 }}
            >
              Philosophy & Services
            </p>
          </Reveal>

          {/* Each principle — Instrument Sans italic for titles */}
          <div className="mt-16 md:mt-24">
            {PRINCIPLES.map((p, i) => (
              <SectionTransition key={p.number} mode="fade-up" delay={0.1}>
                <LineDraw delay={i * 0.08} />
                <div className="py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <span
                      className="text-[#e2b93b]/20 block mb-5"
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontStyle: "italic", fontWeight: 400 }}
                    >
                      {p.number}
                    </span>
                    <TextReveal delay={0.1 + i * 0.05}>
                      {/* Instrument Sans italic headline — literary editorial */}
                      <span
                        className="text-white whitespace-pre-line block"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                          lineHeight: 1.1,
                          letterSpacing: "-0.02em",
                          fontStyle: "italic",
                          fontWeight: 600,
                        }}
                      >
                        {p.title}
                      </span>
                    </TextReveal>
                  </div>

                  <div className="flex flex-col justify-end gap-6">
                    <Reveal delay={0.2 + i * 0.05}>
                      <p
                        className="text-white/35 max-w-md"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.88rem",
                          lineHeight: 2,
                          fontWeight: 400,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {p.body}
                      </p>
                    </Reveal>
                    <Reveal delay={0.3 + i * 0.05}>
                      <span
                        className="text-[#e2b93b]/50 inline-flex items-center gap-4"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.7rem",
                          fontStyle: "italic",
                          fontWeight: 400,
                        }}
                      >
                        <span className="w-8 h-px bg-[#e2b93b]/20" />
                        {p.service}
                      </span>
                    </Reveal>
                  </div>
                </div>
              </SectionTransition>
            ))}
            <LineDraw delay={0.3} />
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── ABOUT: Centered typography block ────────────────────────── */
function AboutDescent() {
  return (
    <SectionTransition mode="fade-up">
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p
              className="text-[#e2b93b]/60 mb-10"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 400 }}
            >
              About
            </p>
          </Reveal>

          {/* Instrument Sans italic headlines — literary */}
          <TextReveal>
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              I don't just
            </span>
          </TextReveal>
          <TextReveal delay={0.15}>
            <span
              className="block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
                WebkitTextStroke: "1px rgba(226,185,59,0.3)",
                color: "transparent",
              }}
            >
              design products
            </span>
          </TextReveal>
          <TextReveal delay={0.3}>
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              I build them.
            </span>
          </TextReveal>

          <Reveal delay={0.5}>
            <p
              className="text-white/35 max-w-lg mx-auto mt-12"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                lineHeight: 2,
                fontWeight: 400,
              }}
            >
              I'm not just a designer — I help founders think clearly, reduce
              complexity, and build products that feel right from day one.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <Link
              href="/about"
              className="inline-flex items-center gap-4 text-[#e2b93b]/50 hover:text-[#e2b93b] transition-colors duration-300 mt-10"
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                More about me
              </span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1} />
            </Link>
          </Reveal>
        </div>

        <WipeDivider className="mt-20 md:mt-28" />
      </section>
    </SectionTransition>
  );
}

/* ─── TESTIMONIALS: Single centered quote ─────────────────────── */
function TestimonialsDescent() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[current];

  return (
    <SectionTransition mode="fade">
      <section className="py-24 md:py-40 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Counter — refined */}
          <Reveal>
            <span
              className="text-white/15 block mb-14"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.4em",
                fontWeight: 300,
              }}
            >
              {current + 1} of {total}
            </span>
          </Reveal>

          {/* Quote */}
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <p
                className="text-white/50"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                  lineHeight: 2,
                  fontWeight: 300,
                  fontStyle: "italic",
                  letterSpacing: "0.01em",
                }}
              >
                "{t.quote}"
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <span
                    className="text-white/30 text-[0.55rem]"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, letterSpacing: "0.1em" }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="text-left">
                  <p
                    className="text-white/70"
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 400 }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-white/25"
                    style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.15em", fontWeight: 300, textTransform: "uppercase" }}
                  >
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>

          {/* Arrows */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrent((p) => (p - 1 + total) % total)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/25 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1} />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % total)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/25 transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── FOOTER/CTA ──────────────────────────────────────────────── */
function FooterDescent() {
  return (
    <SectionTransition mode="fade-up">
      <footer id="cta" className="px-6 md:px-10 pt-24 md:pt-40 pb-8">
        <div className="text-center mb-16 md:mb-24">
          <Reveal>
            <p
              className="text-[#e2b93b]/60 mb-10"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 400 }}
            >
              Let's build something
            </p>
          </Reveal>

          {/* Instrument Sans italic CTA headline */}
          <TextReveal>
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              From idea to interface
            </span>
          </TextReveal>
          <TextReveal delay={0.15}>
            <span
              className="text-white/20 block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              at your speed.
            </span>
          </TextReveal>

          <Reveal delay={0.4}>
            <a
              href="#"
              className="inline-block px-10 py-4 bg-[#e2b93b] text-[#0a0a0a] hover:bg-[#e2b93b]/80 transition-colors duration-300 mt-14"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Book a call
            </a>
          </Reveal>
        </div>

        <LineDraw />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/20 hover:text-[#e2b93b] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p
            className="text-white/10"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            &copy; {new Date().getFullYear()} derondsgnr
          </p>
        </div>
      </footer>
    </SectionTransition>
  );
}

/* ─── EXPORT ──────────────────────────────────────────────────── */
export function HomepageDescent() {
  return (
    <main className="relative">
      <HeroDescent />
      <ProcessDescent />
      <WorkDescent />
      <PhilosophyDescent />
      <AboutDescent />
      <TestimonialsDescent />
      <FooterDescent />
    </main>
  );
}