/**
 * VARIATION 3 — "MONUMENT"
 * DNA: Lando Norris. Everything is cinematic and monumental. Each section
 * commands the full viewport. Typography at architectural scale — titles
 * feel like buildings. Full-bleed sections alternate between dark and
 * slightly-lighter zones for rhythm. Philosophy principles are each
 * their own "room." Testimonial quote fills the screen.
 * Transitions: Slow parallax reveals. Sections scale up from 0.96.
 * Deliberate pacing — the scroll feels like walking through a gallery.
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
  PROCESS_WORDS,
} from "../homepage-data";
import { useTestimonials } from "@/contexts/testimonials-context";
import { useSiteConfig } from "@/contexts/site-config-context";

/* ─── HERO: Full viewport, stacked, cinematic ─────────────────── */
function HeroMonument() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/60 pointer-events-none" />

      {/* Accent line — horizontal, bleeds across full width */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.5, delay: 0.8, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-[45%] left-0 w-full h-px bg-[#e2b93b]/[0.07] origin-left"
      />

      <div className="relative z-10 px-6 md:px-10 pb-12 md:pb-20">
        {/* Eyebrow — ultra wide tracking, tiny */}
        <Reveal delay={0.6}>
          <p
            className="text-[#e2b93b]/80 mb-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.55rem",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            Product Designer &amp; Builder
          </p>
        </Reveal>

        {/* Name — monument scale, each letter is architecture */}
        <div className="overflow-hidden">
          <TextReveal delay={0.15}>
            <h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(5rem, 18vw, 20rem)",
                lineHeight: 0.82,
                letterSpacing: "-0.02em",
              }}
            >
              DERON
            </h1>
          </TextReveal>
        </div>
        <div className="overflow-hidden md:ml-[5%]">
          <TextReveal delay={0.3}>
            <h1
              className="uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(5rem, 18vw, 20rem)",
                lineHeight: 0.82,
                letterSpacing: "-0.02em",
                WebkitTextStroke: "2px rgba(226,185,59,0.25)",
                color: "transparent",
              }}
            >
              DSGNR
            </h1>
          </TextReveal>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-14 md:mt-20 gap-8">
          <Reveal delay={0.9}>
            <p
              className="text-white/30 max-w-sm"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                lineHeight: 2.6,
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Your product will be judged on how it looks before anyone uses it.
            </p>
          </Reveal>

          <Reveal delay={1.1}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3"
            >
              <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
              <span
                className="text-white/15"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                }}
              >
                Scroll
              </span>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── PROCESS: Full-width spaced, monumental numbers ──────────── */
function ProcessMonument() {
  return (
    <SectionTransition mode="scale">
      <div className="py-20 md:py-32 px-6 md:px-10 bg-[#0d0d0d]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {PROCESS_WORDS.map((word, i) => (
            <Reveal key={word} delay={i * 0.1}>
              <div className="border-l border-white/[0.06] pl-4 md:pl-6">
                <span
                  className="text-[#e2b93b]/12 block"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(4rem, 8vw, 8rem)",
                    lineHeight: 0.82,
                    letterSpacing: "-0.02em",
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  className="text-white/30 mt-4 block"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                  }}
                >
                  {word}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionTransition>
  );
}

/* ─── WORK: Cinematic full-bleed, one per viewport ────────────── */
function WorkMonument() {
  return (
    <section>
      {/* Section header */}
      <SectionTransition mode="fade-up">
        <div className="py-16 md:py-24 px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Reveal>
                <p
                  className="text-[#e2b93b]/80 mb-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.6em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                  }}
                >
                  Selected Projects
                </p>
              </Reveal>
              <TextReveal delay={0.1}>
                <h2
                  className="text-white uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(4rem, 10vw, 10rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.82,
                  }}
                >
                  WORK
                </h2>
              </TextReveal>
            </div>
            <Reveal delay={0.2}>
              <Link
                href="/work"
                className="text-white/30 hover:text-[#e2b93b] transition-colors duration-300 flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                View all
                <ArrowUpRight className="w-3 h-3" strokeWidth={1} />
              </Link>
            </Reveal>
          </div>
        </div>
      </SectionTransition>

      {/* Each project is its own cinematic moment */}
      {PROJECTS.map((project, i) => (
        <SectionTransition key={project.id} mode="scale">
          <Link href={`/work/${project.slug}`} className="block group relative">
            <div className="relative overflow-hidden">
              <ParallaxImage
                src={project.image}
                alt={project.title}
                className="w-full aspect-[16/9] md:aspect-[21/9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className="text-[#e2b93b]/40 block mb-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.5em",
                        textTransform: "uppercase",
                        fontWeight: 400,
                      }}
                    >
                      {project.id} — {project.category} — {project.year}
                    </span>
                    <h2
                      className="text-white uppercase group-hover:text-[#e2b93b] transition-colors duration-500"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(2rem, 5vw, 5rem)",
                        lineHeight: 0.85,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {project.title}
                    </h2>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight
                      className="w-8 h-8 text-[#e2b93b]"
                      strokeWidth={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </SectionTransition>
      ))}
    </section>
  );
}

/* ─── PHILOSOPHY: Each principle is its own room ──────────────── */
function PhilosophyMonument() {
  return (
    <section>
      <SectionTransition mode="fade-up">
        <div className="py-16 md:py-24 px-6 md:px-10">
          <Reveal>
            <p
              className="text-[#e2b93b]/80"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                letterSpacing: "0.6em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Philosophy &amp; Services
            </p>
          </Reveal>
        </div>
      </SectionTransition>

      {PRINCIPLES.map((p, i) => {
        const bgColors = ["#0a0a0a", "#0d0d0d", "#0a0a0a"];
        return (
          <SectionTransition key={p.number} mode="parallax">
            <div
              className="min-h-[60vh] md:min-h-[70vh] flex items-center px-6 md:px-10 py-20 md:py-32 relative overflow-hidden"
              style={{ background: bgColors[i] }}
            >
              {/* Giant number — background */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="absolute right-[-3%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(12rem, 25vw, 30rem)",
                  lineHeight: 0.8,
                  letterSpacing: "-0.02em",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.03)",
                }}
              >
                {p.number}
              </motion.div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
                <div>
                  <span
                    className="text-[#e2b93b]/25 block mb-5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.5rem",
                      letterSpacing: "0.5em",
                      textTransform: "uppercase",
                      fontWeight: 400,
                    }}
                  >
                    {p.number}
                  </span>
                  <TextReveal delay={0.1}>
                    <h2
                      className="text-white uppercase whitespace-pre-line"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "clamp(2.5rem, 5vw, 5rem)",
                        lineHeight: 0.9,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.title}
                    </h2>
                  </TextReveal>
                </div>

                <div className="flex flex-col justify-center">
                  <Reveal delay={0.2}>
                    <p
                      className="text-white/30 max-w-lg"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6rem",
                        lineHeight: 2.6,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {p.body}
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <span
                      className="text-[#e2b93b]/70 mt-8 inline-flex items-center gap-4"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.5em",
                        textTransform: "uppercase",
                        fontWeight: 400,
                      }}
                    >
                      <span className="w-10 h-px bg-[#e2b93b]/20" />
                      {p.service}
                    </span>
                  </Reveal>
                </div>
              </div>
            </div>
          </SectionTransition>
        );
      })}
    </section>
  );
}

/* ─── ABOUT: Monumental statement, simple ─────────────────────── */
function AboutMonument() {
  return (
    <SectionTransition mode="scale">
      <section className="min-h-[60vh] flex items-center px-6 md:px-10 py-24 md:py-40">
        <div className="w-full">
          <Reveal>
            <p
              className="text-[#e2b93b]/80 mb-10"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                letterSpacing: "0.6em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              About
            </p>
          </Reveal>

          <TextReveal>
            <h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 9vw, 10rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              I DON'T JUST
            </h1>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1
              className="uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 9vw, 10rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
                WebkitTextStroke: "2px rgba(226,185,59,0.25)",
                color: "transparent",
              }}
            >
              DESIGN
            </h1>
          </TextReveal>
          <TextReveal delay={0.3}>
            <h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 9vw, 10rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              I BUILD.
            </h1>
          </TextReveal>

          <Reveal delay={0.5} className="mt-12 md:mt-16 md:ml-auto md:max-w-md md:text-right">
            <p
              className="text-white/25"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                lineHeight: 2.6,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              From strategy to interface, I move at the speed your startup
              needs.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-4 text-[#e2b93b]/50 hover:text-[#e2b93b] transition-colors duration-300 mt-6"
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                Full Story
              </span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1} />
            </Link>
          </Reveal>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── TESTIMONIALS: Quote fills the screen ────────────────────── */
function TestimonialsMonument() {
  const [current, setCurrent] = useState(0);
  const testimonials = useTestimonials();
  const total = testimonials.length;
  const t = testimonials[current];

  return (
    <SectionTransition mode="fade">
      <section className="relative min-h-[80vh] flex items-center px-6 md:px-10 py-24 md:py-40 bg-[#0d0d0d]">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left — counter + navigation */}
          <div className="md:col-span-2">
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              {current + 1}/{total}
            </span>

            <div className="flex items-center gap-3 mt-6">
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

          {/* Center — massive quote in heading font */}
          <div className="md:col-span-7 md:col-start-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p
                  className="text-white/40 uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 mt-12">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center">
                    <span
                      className="text-white/30"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.15em",
                        fontWeight: 400,
                      }}
                    >
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-white/60"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontWeight: 400,
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-white/20"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        fontWeight: 400,
                      }}
                    >
                      {t.role} — {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — section title */}
          <div className="md:col-span-3 md:col-start-10 hidden md:flex md:items-start md:justify-end">
            <div className="text-right">
              <h2
                className="text-white uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 4rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                }}
              >
                Trusted
              </h2>
              <h2
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 4rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                  color: "transparent",
                }}
              >
                by
              </h2>
              <h2
                className="uppercase"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 4rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                  color: "transparent",
                }}
              >
                founders
              </h2>
            </div>
          </div>
        </div>
      </section>
    </SectionTransition>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function FooterMonument() {
  const { global } = useSiteConfig();
  const socialLinks = global.socialLinks;
  const copyright = global.footerCopyright ?? `© ${new Date().getFullYear()} DERONDSGNR`;
  return (
    <SectionTransition mode="fade-up">
      <footer id="cta" className="px-6 md:px-10 pt-24 md:pt-40 pb-8">
        <div className="mb-16 md:mb-24">
          <Reveal>
            <p
              className="text-[#e2b93b]/80 mb-10"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                letterSpacing: "0.6em",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Let's Build Something
            </p>
          </Reveal>

          <TextReveal>
            <h1
              className="text-white uppercase"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 8vw, 8rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              BOOK A CALL.
            </h1>
          </TextReveal>

          <Reveal delay={0.3}>
            <a
              href="#"
              className="inline-block px-12 py-4 bg-[#e2b93b] text-[#0a0a0a] hover:bg-[#e2b93b]/80 transition-colors duration-300 mt-12"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.55rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Schedule Now
            </a>
          </Reveal>
        </div>

        <WipeDivider />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  className="text-white/20 hover:text-[#e2b93b] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
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
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {copyright}
          </p>
        </div>
      </footer>
    </SectionTransition>
  );
}

/* ─── EXPORT ──────────────────────────────────────────────────── */
export function HomepageMonument() {
  return (
    <main className="relative">
      <HeroMonument />
      <ProcessMonument />
      <WorkMonument />
      <PhilosophyMonument />
      <AboutMonument />
      <TestimonialsMonument />
      <FooterMonument />
    </main>
  );
}