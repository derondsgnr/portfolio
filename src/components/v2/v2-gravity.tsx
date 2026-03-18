import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_PROCESS } from "./v2-data";
import { useTestimonials } from "@/contexts/testimonials-context";

/* ═══════════════════════════════════════════════════════════════
   GRAVITY — Everything has weight. Elements drop, settle, ground.
   Heavy typography sinks. Sections rise against gravity.
   Inspired by: Damn Good's bold presence + monumental scale.
   ═══════════════════════════════════════════════════════════════ */

function GravityLoader({ onComplete }: { onComplete: () => void }) {
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    setTimeout(() => setDropped(true), 300);
    setTimeout(onComplete, 1800);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      {/* Heavy dot drops */}
      <motion.div
        initial={{ y: -200 }}
        animate={dropped ? { y: 0 } : {}}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          mass: 2,
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#E2B93B",
        }}
      />
      {/* Impact ripple */}
      {dropped && (
        <motion.div
          initial={{ width: 16, height: 2, opacity: 0.6 }}
          animate={{ width: 200, height: 2, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute"
          style={{
            background: "rgba(226,185,59,0.4)",
            borderRadius: "50%",
            top: "calc(50% + 8px)",
          }}
        />
      )}
    </motion.div>
  );
}

/* ─── Hero — name drops with weight ──────────────────────────── */
export function GravityHero() {
  return (
    <section className="relative h-screen flex flex-col justify-end overflow-hidden pb-16 px-8">
      {/* Massive name drops from above — sits heavy at bottom */}
      <div className="relative">
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
            mass: 3,
            delay: 0.3,
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(6rem, 20vw, 22rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            DERON
          </span>
        </motion.div>

        {/* Subtitle settles in */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1.5,
            delay: 0.8,
          }}
          className="mt-4 flex items-center gap-6"
        >
          <div
            style={{ width: 80, height: 3, background: "#E2B93B" }}
          />
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Product Designer & Builder
          </span>
        </motion.div>
      </div>

      {/* Statement piece */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="absolute bottom-24 right-8 max-w-sm"
      >
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.85rem",
            lineHeight: 1.8,
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.3)",
            textAlign: "right",
          }}
        >
          Your product will be judged on how it looks before anyone uses it.
        </p>
      </motion.div>

      {/* Ground line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1 origin-left"
        style={{ background: "#E2B93B" }}
      />
    </section>
  );
}

/* ─── Process — words fall in sequence ───────────────────────── */
export function GravityProcess() {
  return (
    <section className="relative py-40 px-8">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
        {V2_PROCESS.map((word, i) => (
          <motion.div
            key={word}
            initial={{ y: -150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              mass: 2,
              delay: i * 0.2,
            }}
            className="text-center"
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.15)",
                display: "block",
              }}
            >
              {word}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
              className="h-0.5 origin-center mt-4"
              style={{
                background:
                  i === 2
                    ? "rgba(226,185,59,0.5)"
                    : "rgba(255,255,255,0.06)",
              }}
            />
            <span
              className="block mt-3"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
              }}
            >
              Phase {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

type WorkProject = { id: string; title: string; category: string; year: string; image: string };

/* ─── Work — heavy stacking blocks ───────────────────────────── */
export function GravityWork({ projects }: { projects?: WorkProject[] } = {}) {
  const items = projects ?? V2_PROJECTS;
  return (
    <section className="relative py-32 px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Selected <span style={{ color: "#E2B93B" }}>Work</span>
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-2">
        {items.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ y: -80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              mass: 2,
              delay: i * 0.1,
            }}
            className="relative group cursor-pointer overflow-hidden"
            style={{
              height: "min(500px, 60vh)",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              style={{ filter: "grayscale(0.3) brightness(0.6)" }}
            />

            {/* Heavy bottom bar */}
            <div
              className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end"
              style={{
                background: "linear-gradient(to top, rgba(10,10,10,0.95), transparent)",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#f0f0f0",
                    display: "block",
                  }}
                >
                  {project.title}
                </span>
                <span
                  className="block mt-2"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                  }}
                >
                  {project.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "10px",
                    color: "#E2B93B",
                    letterSpacing: "0.1em",
                  }}
                >
                  {project.year}
                </span>
                <div
                  style={{
                    width: 40,
                    height: 3,
                    background: "#E2B93B",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Philosophy — heavy bold text with weight ───────────────── */
export function GravityPhilosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="relative py-48 px-8 overflow-hidden">
      {/* Giant background number */}
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
          &amp;
        </span>
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              display: "block",
            }}
          >
            Products with
            <br />
            <span style={{ color: "#E2B93B" }}>Gravitational</span>
            <br />
            Pull
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 max-w-lg"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.8,
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          I design products that pull users in. Not through tricks or dark patterns,
          but through clarity, craft, and conviction. The weight of good design is
          felt, not seen.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Testimonials — grounded cards that rise ─────────────────── */
export function GravityTestimonials() {
  const testimonials = useTestimonials();
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            What They Say
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ y: 100 + i * 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                mass: 2,
                delay: i * 0.15,
              }}
              className="p-8"
              style={{
                background: "#111",
                borderBottom: "3px solid #E2B93B",
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                className="mt-8 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#E2B93B",
                    display: "block",
                  }}
                >
                  {t.name}
                </span>
                <span
                  className="block mt-1"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t.role}, {t.company}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA — heavy gold bar ───────────────────────────────────── */
export function GravityCTA() {
  return (
    <section className="relative py-32 px-8">
      {/* Gold ground bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
          mass: 3,
        }}
        className="max-w-6xl mx-auto p-16 text-center"
        style={{
          background: "#E2B93B",
        }}
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            display: "block",
          }}
        >
          Let&rsquo;s Build
        </span>
        <p
          className="mt-4"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            color: "rgba(10,10,10,0.6)",
            textTransform: "uppercase",
          }}
        >
          Book a call &mdash; Cal.com/derondsgnr
        </p>
      </motion.div>

      {/* Footer */}
      <div
        className="max-w-6xl mx-auto mt-16 flex justify-between"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.1)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <div className="flex gap-6">
          <span>Twitter/X</span>
          <span>LinkedIn</span>
          <span>Dribbble</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function GravityVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <GravityLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <GravityHero />
          <GravityProcess />
          <GravityWork />
          <GravityPhilosophy />
          <GravityTestimonials />
          <GravityCTA />
        </motion.div>
      )}
    </main>
  );
}