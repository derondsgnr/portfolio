/**
 * VARIATION 2 — "COLLISION"
 * DNA: Aristide. Intentional visual tension — elements overlap, collide, bleed.
 * Work images crop aggressively. Philosophy numbers are monumental and overlap text.
 * The about statement bleeds into the testimonial zone. Nothing is contained.
 * Transitions: Wipe-up reveals, elements sliding in from opposite directions.
 * Extreme cropping. Text as architecture. Controlled chaos.
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

/* ─── HERO: Name so large it crops, creating architecture ─────── */
function HeroCollision() {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Monumental background layer — crops off all edges */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <h1
          className="text-white/[0.035] uppercase whitespace-nowrap"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(22rem, 50vw, 60rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.75,
          }}
        >
          deron
        </h1>
      </motion.div>

      {/* Top bar — brutalist labels */}
      <div className="relative z-10 pt-24 md:pt-28 px-6 md:px-10 flex items-center justify-between">
        <Reveal delay={0.6}>
          <p
            className="text-[#e2b93b]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              letterSpacing: "-0.01em",
              fontWeight: 500,
            }}
          >
            [Product Designer & Builder]
          </p>
        </Reveal>
        <Reveal delay={0.8}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2b93b] animate-pulse" />
            <span
              className="text-white/50 hidden sm:inline"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "-0.01em",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Open to projects
            </span>
          </div>
        </Reveal>
      </div>

      {/* Readable name — overlaps the ghost, creates depth */}
      <div className="relative z-10 px-6 md:px-10 -mb-4">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
            }}
          >
            DERON
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:ml-[30%]"
        >
          <h1
            className="uppercase"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.85,
              WebkitTextStroke: "2px rgba(226,185,59,0.4)",
              color: "transparent",
            }}
          >
            DSGNR
          </h1>
        </motion.div>
      </div>

      {/* Statement — bottom right, dense brutalist block */}
      <div className="relative z-10 pb-10 md:pb-14 px-6 md:px-10">
        <div className="md:ml-auto md:max-w-md">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="h-[2px] bg-[#e2b93b]/30 origin-right mb-4"
          />
          <Reveal delay={0.9}>
            <p
              className="text-white/60"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Your product will be judged on how it looks — before anyone uses it.
              I make that judgment land in your favor.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── PROCESS: Fragmented, colliding sizes ────────────────────── */
function ProcessCollision() {
  const scales = ["clamp(3rem, 6vw, 6rem)", "clamp(1.5rem, 3vw, 3rem)", "clamp(2.5rem, 5vw, 5rem)", "clamp(1.8rem, 3.5vw, 3.5rem)"];
  return (
    <SectionTransition mode="wipe-up">
      <div className="py-14 md:py-20 px-6 md:px-10 border-y border-white/[0.06] relative overflow-hidden">
        {/* Giant arrow background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute right-[-5%] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(10rem, 20vw, 25rem)",
            color: "rgba(226,185,59,0.04)",
          }}
        >
          &rarr;
        </motion.div>

        <div className="relative z-10 flex flex-wrap items-end gap-x-6 gap-y-4 md:gap-x-8">
          {PROCESS_WORDS.map((word, i) => (
            <Reveal key={word} delay={i * 0.1}>
              <span className="flex items-end gap-2">
                <span
                  className="text-[#e2b93b]/40"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  /0{i + 1}
                </span>
                <span
                  className="text-white/15 uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: scales[i],
                    letterSpacing: "-0.04em",
                    lineHeight: 0.85,
                  }}
                >
                  {word}
                </span>
                {i < PROCESS_WORDS.length - 1 && (
                  <span
                    className="text-[#e2b93b]/20"
                    style={{ fontFamily: "var(--font-body)", fontSize: "1.5rem", fontWeight: 300 }}
                  >
                    /
                  </span>
                )}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}

/* ─── WORK: Overlapping cards, aggressive crops ───────────────── */
function WorkCollision() {
  return (
    <SectionTransition mode="fade-up">
      <section className="py-24 md:py-40 px-6 md:px-10 relative">
        {/* Header — brutalist label */}
        <div className="mb-16 md:mb-28">
          <Reveal>
            <p
              className="text-[#e2b93b]"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              [Selected Projects]
            </p>
          </Reveal>
          <TextReveal delay={0.1}>
            <h2
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(4rem, 10vw, 10rem)",
                letterSpacing: "-0.05em",
                lineHeight: 0.85,
              }}
            >
              WORK
            </h2>
          </TextReveal>
        </div>

        {/* Overlapping asymmetric grid */}
        <div className="relative">
          {PROJECTS.map((project, i) => {
            const positions = [
              "md:w-[65%] md:ml-0",
              "md:w-[55%] md:ml-[35%] md:-mt-24",
              "md:w-[70%] md:ml-[5%] md:-mt-16",
            ];
            const aspects = [
              "aspect-[4/5]",
              "aspect-[16/10]",
              "aspect-[3/4]",
            ];

            return (
              <SectionTransition key={project.id} mode="fade-up" delay={0.1}>
                <Link
                  href={`/work/${project.slug}`}
                  className={`block group relative z-[${10 - i}] mb-12 md:mb-0 ${positions[i]}`}
                >
                  <div className="relative overflow-hidden">
                    <ParallaxImage
                      src={project.image}
                      alt={project.title}
                      className={`w-full ${aspects[i]}`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />

                    {/* Info overlay — brutalist stacked label */}
                    <div className="absolute bottom-0 left-0 p-5 md:p-6">
                      <span
                        className="text-[#e2b93b]/60 block mb-1"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        /{project.id} — {project.category}
                      </span>
                      <h3
                        className="text-white uppercase"
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                          letterSpacing: "-0.03em",
                          lineHeight: 0.9,
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>

                    {/* Arrow — top right */}
                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <ArrowUpRight
                        className="w-6 h-6 text-[#e2b93b]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </Link>
              </SectionTransition>
            );
          })}
        </div>

        <Reveal delay={0.3} className="mt-16 md:mt-24">
          <Link
            href="/work"
            className="text-white/50 hover:text-[#e2b93b] transition-colors duration-300 inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            [View all work →]
          </Link>
        </Reveal>
      </section>
    </SectionTransition>
  );
}

/* ─── PHILOSOPHY: Monumental numbers overlap principle text ────── */
function PhilosophyCollision() {
  return (
    <SectionTransition mode="wipe-up">
      <section className="py-24 md:py-40 px-6 md:px-10">
        <Reveal>
          <p
            className="text-[#e2b93b] mb-16 md:mb-24"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            [Philosophy & Services]
          </p>
        </Reveal>

        {PRINCIPLES.map((p, i) => (
          <SectionTransition key={p.number} mode="fade-up">
            <div className="relative py-16 md:py-24 border-t border-white/[0.06]">
              {/* MASSIVE number — overlaps everything */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1 }}
                className="absolute top-4 md:top-0 left-0 md:left-[-2%] pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(8rem, 18vw, 20rem)",
                  lineHeight: 0.8,
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(255,255,255,0.04)",
                }}
              >
                {p.number}
              </motion.div>

              {/* Content — sits on top of the number */}
              <div className="relative z-10 md:grid md:grid-cols-12 md:gap-4 pt-8 md:pt-16">
                <div className="md:col-span-5 md:col-start-4">
                  <TextReveal delay={0.15 + i * 0.05}>
                    <h3
                      className="text-white uppercase whitespace-pre-line"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(2rem, 4vw, 4rem)",
                        lineHeight: 0.9,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {p.title}
                    </h3>
                  </TextReveal>
                </div>

                <div className="md:col-span-4 md:col-start-9 mt-6 md:mt-0 flex flex-col justify-end">
                  <Reveal delay={0.25 + i * 0.05}>
                    <p
                      className="text-white/50"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.body}
                    </p>
                  </Reveal>
                  <Reveal delay={0.35 + i * 0.05}>
                    <span
                      className="text-[#e2b93b] mt-5 inline-flex items-center gap-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      → {p.service}
                    </span>
                  </Reveal>
                </div>
              </div>
            </div>
          </SectionTransition>
        ))}
      </section>
    </SectionTransition>
  );
}

/* ─── ABOUT: Statement that bleeds downward ──────────────────── */
function AboutCollision() {
  return (
    <SectionTransition mode="scale">
      <section className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
        {/* Background text — crops off right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 -translate-y-1/2 right-[-15%] pointer-events-none select-none hidden md:block"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(10rem, 22vw, 28rem)",
            lineHeight: 0.8,
            letterSpacing: "-0.05em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.025)",
            textTransform: "uppercase",
            writingMode: "vertical-lr",
          }}
        >
          BUILD
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <Reveal>
              <p
                className="text-[#e2b93b] mb-6"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                [About]
              </p>
            </Reveal>

            <TextReveal>
              <h2
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                }}
              >
                I DON'T JUST
              </h2>
            </TextReveal>
            <TextReveal delay={0.15}>
              <h2
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "2px rgba(226,185,59,0.4)",
                  color: "transparent",
                }}
              >
                DESIGN PRODUCTS
              </h2>
            </TextReveal>
            <TextReveal delay={0.3}>
              <h2
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                }}
              >
                I BUILD THEM.
              </h2>
            </TextReveal>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:pt-20">
            <Reveal delay={0.4}>
              <p
                className="text-white/50 mb-8"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                From strategy to interface, I move at the speed your startup
                needs. No fluff. No committee. Just sharp decisions and
                interfaces that earn trust on sight.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#e2b93b]/70 hover:text-[#e2b93b] transition-colors duration-300"
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  [More about me →]
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── TESTIMONIALS: Full-screen single quote ──────────────────── */
function TestimonialsCollision() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;
  const t = TESTIMONIALS[current];

  return (
    <SectionTransition mode="wipe-up">
      <section className="relative min-h-[70vh] flex items-center px-6 md:px-10 py-24 md:py-40 overflow-hidden">
        {/* Giant quote mark background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-10 left-[-5%] pointer-events-none select-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(15rem, 30vw, 40rem)",
            lineHeight: 0.7,
            letterSpacing: "-0.05em",
            color: "rgba(226,185,59,0.03)",
          }}
        >
          "
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 w-full">
          {/* Left — counter + quote */}
          <div className="md:col-span-6">
            <span
              className="text-white block mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
              }}
            >
              {current + 1}/{total}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p
                  className="text-white/60"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                    lineHeight: 1.6,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 mt-8">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <span
                      className="text-white/50 text-[0.7rem]"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
                    >
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-white"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-white/40"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.role} / {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setCurrent((p) => (p - 1 + total) % total)}
                className="w-10 h-10 rounded-full border-2 border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setCurrent((p) => (p + 1) % total)}
                className="w-10 h-10 rounded-full border-2 border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Right — massive heading */}
          <div className="md:col-span-5 md:col-start-8 flex items-center">
            <div>
              <h2
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                }}
              >
                Trusted by
              </h2>
              <h2
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.08)",
                  color: "transparent",
                }}
              >
                founders &
              </h2>
              <h2
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.08)",
                  color: "transparent",
                }}
              >
                Collaborators
              </h2>
            </div>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function FooterCollision() {
  return (
    <SectionTransition mode="fade-up">
      <footer id="cta" className="px-6 md:px-10 pt-24 md:pt-40 pb-8">
        <div className="mb-16 md:mb-24">
          <Reveal>
            <p
              className="text-[#e2b93b] mb-8"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              [Let's build something]
            </p>
          </Reveal>

          <div className="md:flex md:items-end md:justify-between md:gap-8">
            <div>
              <TextReveal>
                <h2
                  className="text-white uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.5rem, 6vw, 6rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                  }}
                >
                  FROM IDEA TO INTERFACE —
                </h2>
              </TextReveal>
              <TextReveal delay={0.15}>
                <h2
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.5rem, 6vw, 6rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    WebkitTextStroke: "1.5px rgba(255,255,255,0.08)",
                    color: "transparent",
                  }}
                >
                  AT YOUR SPEED.
                </h2>
              </TextReveal>
            </div>

            <Reveal delay={0.4} className="mt-8 md:mt-0 shrink-0">
              <a
                href="#"
                className="inline-block px-8 py-4 bg-[#e2b93b] text-[#0a0a0a] hover:bg-[#e2b93b]/80 transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}
              >
                Book a call
              </a>
            </Reveal>
          </div>
        </div>

        <LineDraw />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/35 hover:text-[#e2b93b] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p
            className="text-white/20"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 400,
              letterSpacing: "-0.01em",
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
export function HomepageCollision() {
  return (
    <main className="relative">
      <HeroCollision />
      <ProcessCollision />
      <WorkCollision />
      <PhilosophyCollision />
      <AboutCollision />
      <TestimonialsCollision />
      <FooterCollision />
    </main>
  );
}