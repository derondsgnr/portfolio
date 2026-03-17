"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { V2_PROJECTS, V2_TESTIMONIALS, V2_SERVICES } from "./v2-data";

/* ═══════════════════════════════════════════════════════════════
   CIPHER — Encoded, then decoded. The message reveals itself.
   Text scrambles and resolves. Hidden becomes visible.
   Inspired by: Matrix decode + editorial reveal moments.
   ═══════════════════════════════════════════════════════════════ */

import { ScrambleText, CHARS } from "./shared/scramble-text";

/* ─── Loader ─────────────────────────────────────────────────── */
function CipherLoader({ onComplete }: { onComplete: () => void }) {
  const [chars, setChars] = useState<string[]>(Array(60).fill(""));

  useEffect(() => {
    const timer = setInterval(() => {
      setChars((prev) =>
        prev.map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
      );
    }, 50);

    const done = setTimeout(() => {
      clearInterval(timer);
      setChars("DERON DSGNR — PORTFOLIO DECRYPTED — READY".split("").concat(Array(19).fill(" ")));
      setTimeout(onComplete, 600);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center p-8"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="flex flex-wrap justify-center gap-1 max-w-lg"
        style={{ fontFamily: "monospace", fontSize: "14px" }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              color:
                c === " "
                  ? "transparent"
                  : i < 11
                  ? "#E2B93B"
                  : "rgba(255,255,255,0.3)",
              width: "12px",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {c || "\u00A0"}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function CipherHero() {
  const [decoded, setDecoded] = useState(false);

  useEffect(() => {
    setTimeout(() => setDecoded(true), 500);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background cipher grid */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: 0.03 }}
      >
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className="whitespace-nowrap" style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 2 }}>
            {Array.from({ length: 80 }).map((_, col) => (
              <span key={col}>{CHARS[Math.floor(Math.random() * CHARS.length)]}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="relative text-center">
        {/* Main title — scramble decode */}
        <div>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(5rem, 16vw, 16rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            {decoded ? (
              <ScrambleText text="DERON" speed={40} />
            ) : (
              Array(5)
                .fill(0)
                .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
                .join("")
            )}
          </span>
        </div>

        {/* Subtitle decode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            <ScrambleText
              text="PRODUCT DESIGNER & BUILDER"
              speed={25}
              style={{ color: "#E2B93B" }}
            />
          </span>
        </motion.div>

        {/* Decoded status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-12 max-w-xs mx-auto"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.8rem",
              lineHeight: 1.8,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.2)",
              textAlign: "center",
            }}
          >
            Your product will be judged on how it looks before anyone uses it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="mt-6"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(226,185,59,0.3)",
            }}
          >
            [STATUS: DECRYPTED]
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Services — decode on scroll ────────────────────────────── */
function CipherServices() {
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
            [CAPABILITIES.DECRYPT()]
          </span>
        </motion.div>

        {V2_SERVICES.map((service, i) => (
          <div key={service}>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="py-8 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.15)",
                    width: 30,
                  }}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <ScrambleText
                  text={service}
                  speed={20}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "rgba(226,185,59,0.3)",
                }}
              >
                [ACTIVE]
              </span>
            </motion.div>
          </div>
        ))}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </section>
  );
}

/* ─── Work — grid with matrix decode hover ───────────────────── */
function CipherWork() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
          [PROJECTS.DECODE()]
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.03)" }}>
        {V2_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative group cursor-pointer bg-[#0A0A0A]"
            style={{ aspectRatio: "4/3" }}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                filter:
                  hoveredId === project.id
                    ? "grayscale(0) contrast(1.1)"
                    : "grayscale(1) contrast(0.7) brightness(0.4)",
              }}
            />

            {/* Matrix overlay on non-hovered */}
            <div
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: hoveredId === project.id ? 0 : 0.6,
                background:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(10,10,10,0.5) 2px, rgba(10,10,10,0.5) 4px)",
              }}
            />

            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "#E2B93B",
                    letterSpacing: "0.1em",
                  }}
                >
                  [{project.id}]
                </span>
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
              <div>
                <span
                  className="transition-colors duration-300"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color:
                      hoveredId === project.id
                        ? "#E2B93B"
                        : "rgba(255,255,255,0.7)",
                    display: "block",
                  }}
                >
                  {project.title}
                </span>
                <span
                  className="block mt-2"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {project.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Philosophy ─────────────────────────────────────────────── */
function CipherPhilosophy() {
  return (
    <section className="relative py-48 px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(226,185,59,0.3)",
              display: "block",
              marginBottom: "2rem",
            }}
          >
            [PHILOSOPHY.DECRYPT()]
          </span>
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              lineHeight: 1.6,
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <ScrambleText
              text="Every great product has a hidden message. My job is to decode what users really need — not what they say they want — and encode it into interfaces that feel effortless."
              speed={8}
            />
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-12"
          style={{ background: "rgba(226,185,59,0.15)" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-8"
        >
          {[
            { label: "YEARS", value: "5+" },
            { label: "PROJECTS", value: "40+" },
            { label: "CLIENTS", value: "25+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <ScrambleText
                text={stat.value}
                speed={50}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1,
                  color: "#E2B93B",
                  display: "block",
                }}
              />
              <span
                className="block mt-2"
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                [{stat.label}]
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function CipherTestimonials() {
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
            [TESTIMONIALS.DECRYPT()]
          </span>
        </motion.div>

        <div className="space-y-12">
          {V2_TESTIMONIALS.slice(0, 4).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "#E2B93B",
                    letterSpacing: "0.1em",
                  }}
                >
                  MSG_{String(t.id).padStart(3, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  [VERIFIED]
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.5)",
                  fontStyle: "italic",
                }}
              >
                <ScrambleText text={`"${t.quote}"`} speed={5} />
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.05em",
                  }}
                >
                  &mdash; {t.name.toUpperCase()}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  // {t.role}, {t.company}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
function CipherCTA() {
  return (
    <section className="relative py-48 px-8 flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(226,185,59,0.3)",
            display: "block",
            marginBottom: "1.5rem",
          }}
        >
          [READY TO DECODE YOUR NEXT PROJECT?]
        </span>
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#f0f0f0",
          }}
        >
          <ScrambleText text="LET'S DECODE" speed={40} />
        </span>
        <p
          className="mt-8"
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          CHANNEL: CAL.COM/DERONDSGNR
        </p>
      </motion.div>

      <div
        className="absolute bottom-8 left-0 right-0 px-8 flex justify-between"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.1)",
          letterSpacing: "0.1em",
        }}
      >
        <span>&copy; 2025 DERONDSGNR</span>
        <span>[END_OF_CIPHER]</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function CipherVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <CipherLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <CipherHero />
          <CipherServices />
          <CipherWork />
          <CipherPhilosophy />
          <CipherTestimonials />
          <CipherCTA />
        </motion.div>
      )}
    </main>
  );
}