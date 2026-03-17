"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ScrambleText, CHARS } from "./shared/scramble-text";
import { SignalGrid, ScanLineOverlay, CipherAmbientGrid } from "./shared/texture-layers";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "motion/react";
import { withSound } from "@/hooks/useSound";
import {
  V2_PROJECTS,
  V2_TESTIMONIALS,
  V2_SERVICES_DETAILED,
  V2_PROCESS_DETAILED,
} from "./v2-data";
import { SynthesisHeroSection, SynthesisAboutSection, SynthesisCTASection } from "./sections";

/* ═══════════════════════════════════════════════════════════════
   SYNTHESIS — The best of all worlds, forged into one.
   
   DNA sourced from:
   • Cipher  → scramble text animations, project texture, philosophy
   • Signal  → grid bg, scan line, code syntax, testimonials, textures
   • Drift   → loader, spotlight footer
   • Fracture → "break apart" copy, misaligned footer text
   • Gravity  → hero spring-drop, ground line
   • Void    → project list (hover-reveal)
   • Echo    → (available for future mix)

   TODO (Cursor) — REUSABILITY REFACTOR:
     This file contains section components that are inlined:
       SynthesisLoader, SynthesisHeroSection (extracted), SynthesisAbout, SynthesisProcess,
       SynthesisCapabilities, SynthesisWork, SynthesisPhilosophy,
       SynthesisTestimonials, SynthesisCTA, SynthesisFooter

     These MUST be extracted to /src/app/components/v2/sections/ as standalone
     components that accept data via props. The goal:
       1. Any homepage variation can import and compose sections from ANY other variation
       2. All 8 variations (Void, Signal, Cipher, Drift, Echo, Fracture, Gravity, Synthesis)
          are preserved — they are portfolio pieces, not drafts
       3. ScrambleText + useScrambleText are duplicated 4x (v2-synthesis.tsx, synthesis-pages.tsx,
          v2-cipher.tsx, cipher-pages.tsx) — extract to /src/app/components/v2/shared/scramble-text.tsx
       4. Texture layers (SignalGrid, ScanLineOverlay, CipherAmbientGrid) should also be
          shared components — they're reused across variations
       5. Section components should NOT import from v2-data.ts directly — accept data as props
          so the same section can render different data in different contexts
   ═══════════════════════════════════════════════════════════════ */


/* ─── Drift Loader ──────────────────────────────────────────── */
function SynthesisLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const tickTimers: NodeJS.Timeout[] = [];
    [400, 800, 1200].forEach((ms) => {
      const t = setTimeout(() => {
        if (typeof window !== "undefined") {
          import("@/lib/sound").then(({ playSound, ensureAudioResumed }) => {
            ensureAudioResumed().then(() => playSound("loaderTick"));
          });
        }
      }, ms);
      tickTimers.push(t);
    });

    const timer = setTimeout(() => {
      tickTimers.forEach(clearTimeout);
      if (typeof window !== "undefined") {
        import("@/lib/sound").then(({ playSound, ensureAudioResumed }) => {
          ensureAudioResumed().then(() => playSound("loaderComplete"));
        });
      }
      onComplete();
    }, 1600);
    return () => {
      tickTimers.forEach(clearTimeout);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ x: "100%" }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: "100vw" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-1/2 h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #E2B93B, transparent)" }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, times: [0, 0.2, 0.7, 1] }}
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}
      >
        Initializing
      </motion.span>
    </motion.div>
  );
}

/* ─── Process — Signal syntax + real context ─────────────────── */
export function SynthesisProcess() {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#E2B93B",
            }}
          >
            &gt; HOW_I_WORK
          </span>
          <p
            className="mt-4 max-w-lg"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              fontWeight: 300,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Every project follows this rhythm. Four phases, each building on the last, 
            each with clear deliverables and checkpoints.
          </p>
        </motion.div>

        {V2_PROCESS_DETAILED.map((phase, i) => (
          <motion.div
            key={phase.word}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.15,
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 flex items-baseline gap-4">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.15)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.6)",
                  }}
                >
                  <ScrambleText text={phase.word} speed={25} />
                </span>
              </div>

              <div className="md:col-span-5">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: "#E2B93B",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  [{phase.label}]
                </span>
                <p
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {phase.description}
                </p>
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-2">
                {phase.deliverables.map((d) => (
                  <span
                    key={d}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "4px 8px",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    </section>
  );
}

/* ─── Service Icon map ───────────────────────────────────────── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  code: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "pen-tool": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  ),
  cpu: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  ),
  play: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
};

/* ─── Capabilities — with affordance descriptions ────────────── */
export function SynthesisCapabilities() {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#E2B93B",
            }}
          >
            &gt; CAPABILITIES_INDEX
          </span>
          <p
            className="mt-4 max-w-md"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.9rem",
              lineHeight: 1.8,
              fontWeight: 300,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            What I bring to the table. Each skill honed across 40+ projects.
          </p>
        </motion.div>

        {V2_SERVICES_DETAILED.map((service, i) => (
          <div key={service.name}>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.15)",
                    width: 30,
                    flexShrink: 0,
                  }}
                >
                  {String(i).padStart(2, "0")}
                </span>
                {/* Service icon */}
                <span className="text-[#E2B93B]/40 group-hover:text-[#E2B93B] transition-colors flex-shrink-0">
                  {SERVICE_ICONS[service.icon] || null}
                </span>
                <div>
                  <ScrambleText
                    text={service.name}
                    speed={20}
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.6)",
                      display: "block",
                    }}
                  />
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
              <motion.span
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex-shrink-0"
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#E2B93B",
                }}
              >
                ACTIVE &gt;
              </motion.span>
            </motion.div>
          </div>
        ))}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </section>
  );
}

/* ─── Void-style projects + Cipher texture ───────────────────── */
export function SynthesisWork({ projects = V2_PROJECTS }: { projects?: typeof V2_PROJECTS }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "#E2B93B",
          }}
        >
          &gt; SELECTED_WORK.MAP()
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <Link key={project.id} href={`/work/${project.slug}`} onClick={withSound(() => {}, "navigate")}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="py-10 flex items-baseline justify-between">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: hoveredIdx === i ? "#E2B93B" : "rgba(255,255,255,0.15)",
                    transition: "color 0.3s",
                  }}
                >
                  [{project.id}]
                </span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: hoveredIdx === i ? "#E2B93B" : "rgba(255,255,255,0.8)",
                    transition: "color 0.5s ease",
                  }}
                >
                  <ScrambleText text={project.title} speed={20} />
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                  }}
                >
                  {project.category}
                </span>
              </div>

              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "50vh", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                    className="overflow-hidden relative"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      style={{ filter: "grayscale(0.3) contrast(1.1)" }}
                    />
                    {/* Cipher scan-line texture */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(10,10,10,0.4) 2px, rgba(10,10,10,0.4) 4px)",
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "9px",
                          color: "#E2B93B",
                          letterSpacing: "0.1em",
                        }}
                      >
                        FREQ_{project.id}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "9px",
                          color: "rgba(255,255,255,0.3)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {project.year}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    </section>
  );
}

/* ─── Philosophy — Fracture copy + Cipher decode ─────────────── */
export function SynthesisPhilosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="relative py-48 px-8 overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute right-0 top-0 select-none pointer-events-none"
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(15rem, 40vw, 45rem)",
            lineHeight: 0.8,
            color: "rgba(255,255,255,0.02)",
            display: "block",
          }}
        >
          &ldquo;
        </span>
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(226,185,59,0.3)",
            }}
          >
            [PHILOSOPHY.DECRYPT()]
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1.4,
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
            }}
          >
            <ScrambleText
              text="I break things apart so they can come together"
              speed={8}
            />{" "}
            <span style={{ color: "#E2B93B" }}>
              <ScrambleText text="better" speed={8} />
            </span>
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md ml-auto mt-16"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <ScrambleText
              text="Every great product has a hidden message. My job is to decode what users really need — not what they say they want — and encode it into interfaces that feel effortless."
              speed={5}
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-16"
          style={{ background: "rgba(226,185,59,0.15)" }}
        />
      </div>
    </section>
  );
}

/* ─── Signal-style Testimonials — left-border vertical list ──── */
export function SynthesisTestimonials() {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#E2B93B",
            }}
          >
            &gt; INCOMING_SIGNALS
          </span>
        </motion.div>

        {V2_TESTIMONIALS.slice(0, 4).map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="mb-16 last:mb-0"
            style={{
              borderLeft: "1px solid rgba(226,185,59,0.2)",
              paddingLeft: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}
            >
              SIG_{String(t.id).padStart(3, "0")} // {t.company.toUpperCase()}
            </p>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <ScrambleText text={t.quote} speed={5} />
            </p>
            <div className="mt-4 flex items-center gap-3">
              {/* Avatar */}
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#333]"
                />
              )}
              <div>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  &mdash; {t.name.toUpperCase()} / {t.role.toUpperCase()}
                </p>
                {/* Company badge */}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] text-[7px]"
                    style={{ fontFamily: "monospace" }}
                  >
                    {t.company.charAt(0)}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.2)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {t.company}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
type LandingProp = {
  hero: { name: string; tagline: string; philosophy: string };
  about: { label: string; headline: string; headlineAccent: string; bioParagraphs: string[]; stats: { label: string; value: string }[] };
  cta: { label: string; headline: string; ctaPrimary: string; ctaSecondary: string; subtext: string; tagline: string };
};

export function SynthesisVariation({ projects, landing }: { projects?: typeof V2_PROJECTS; landing?: LandingProp } = {}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      {/* Signal global textures */}
      <SignalGrid />
      <ScanLineOverlay />
      <CipherAmbientGrid />

      <AnimatePresence>
        {!loaded && <SynthesisLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-[2]"
        >
          <SynthesisHeroSection name={landing?.hero.name} tagline={landing?.hero.tagline} philosophy={landing?.hero.philosophy} />
          <SynthesisAboutSection
            label={landing?.about.label}
            headline={landing?.about.headline}
            headlineAccent={landing?.about.headlineAccent}
            bioParagraphs={landing?.about.bioParagraphs}
            stats={landing?.about.stats}
          />
          <SynthesisCapabilities />
          <SynthesisProcess />
          <SynthesisWork projects={projects} />
          <SynthesisPhilosophy />
          <SynthesisTestimonials />
          <SynthesisCTASection
            label={landing?.cta.label}
            headline={landing?.cta.headline}
            ctaPrimary={landing?.cta.ctaPrimary}
            ctaSecondary={landing?.cta.ctaSecondary}
            subtext={landing?.cta.subtext}
            tagline={landing?.cta.tagline}
          />
        </motion.div>
      )}
    </main>
  );
}