import { useState, useEffect } from "react";
import Link from "next/link";
import { V2_PROJECTS, V2_TESTIMONIALS, V2_PROCESS } from "./v2-data";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════════════════
   VOID — Negative space mastery. Silence is the design.
   The page breathes. Elements exist in isolation.
   Inspired by: Japanese ma (間) — the meaningful void.
   ═══════════════════════════════════════════════════════════════ */

function VoidLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      <div className="relative">
        {/* Expanding rectangle */}
        <motion.div
          className="border border-white/20"
          initial={{ width: 0, height: 1 }}
          animate={{
            width: progress * 3,
            height: Math.min(progress * 0.5, 2),
          }}
          style={{ originX: 0.5 }}
        />
        <motion.span
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {String(progress).padStart(3, "0")}
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ─── Character-by-character reveal ─────────────────────────── */
function CharReveal({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className} style={style}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function VoidHero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center">
      {/* Single word, massive, isolated */}
      <div className="text-center">
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(5rem, 18vw, 20rem)",
            letterSpacing: "0.15em",
            lineHeight: 0.85,
            color: "#f0f0f0",
            display: "block",
            textTransform: "uppercase",
          }}
        >
          <CharReveal text="DERON" stagger={0.12} />
        </span>
      </div>

      {/* Minimal descriptor — appears after name */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="mt-16"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.35em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        Product Designer & Builder
      </motion.p>

      {/* Statement piece */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.5 }}
        className="mt-8 max-w-xs text-center"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.8rem",
          lineHeight: 1.8,
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        Your product will be judged on how it looks before anyone uses it.
      </motion.p>

      {/* Single gold dot — center of void */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-24"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#E2B93B",
        }}
      />
    </section>
  );
}

/* ─── Process ────────────────────────────────────────────────── */
export function VoidProcess() {
  return (
    <section className="relative py-48 px-8">
      <div className="max-w-2xl mx-auto">
        {V2_PROCESS.map((word, i) => (
          <div key={word} className="relative mb-24 last:mb-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.8,
                ease: [0.77, 0, 0.175, 1],
                delay: i * 0.15,
              }}
              className="h-px origin-left mb-8"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div className="flex justify-between items-baseline">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                0{i + 1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4 + i * 0.15,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "-0.01em",
                }}
              >
                {word}
              </motion.span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Selected Work ──────────────────────────────────────────── */
export function VoidWork({ projects = V2_PROJECTS }: { projects?: typeof V2_PROJECTS } = {}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-8">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-32"
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.15)",
            textTransform: "uppercase",
          }}
        >
          Selected Work
        </span>
      </motion.div>

      {/* Full-bleed project list */}
      <div className="max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <Link key={project.id} href={`/work/${project.slug}`}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="relative cursor-pointer group"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Divider */}
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div className="py-12 flex items-baseline justify-between">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                {project.id}
              </span>
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color:
                    hoveredIdx === i
                      ? "#E2B93B"
                      : "rgba(255,255,255,0.8)",
                  transition: "color 0.5s ease",
                }}
              >
                {project.title}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                {project.category}
              </span>
            </div>

            {/* Expanding image on hover */}
            <AnimatePresence>
              {hoveredIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "50vh", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                  className="overflow-hidden"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(0.4) contrast(1.1)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </Link>
        ))}
        <div
          className="h-px"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </section>
  );
}

/* ─── Philosophy ─────────────────────────────────────────────── */
export function VoidPhilosophy() {
  const words = "I design products that feel inevitable. Not decorated. Not complicated. Inevitable.".split(" ");

  return (
    <section className="relative py-48 px-8 flex items-center justify-center min-h-screen">
      <div className="max-w-4xl text-center">
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
            lineHeight: 1.4,
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "-0.01em",
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="inline-block mr-[0.3em]"
              style={{
                color:
                  word === "inevitable." || word === "Inevitable."
                    ? "#E2B93B"
                    : undefined,
              }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ─── Testimonial ────────────────────────────────────────────── */
export function VoidTestimonial() {
  const [current, setCurrent] = useState(0);
  const t = V2_TESTIMONIALS[current];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % V2_TESTIMONIALS.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-48 px-8">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Giant quote mark */}
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "8rem",
                lineHeight: 0.5,
                color: "rgba(226, 185, 59, 0.15)",
                display: "block",
                marginBottom: "2rem",
              }}
            >
              &ldquo;
            </span>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.4rem)",
                lineHeight: 1.8,
                fontWeight: 300,
                color: "rgba(255,255,255,0.6)",
                fontStyle: "italic",
              }}
            >
              {t.quote}
            </p>
            <div className="mt-12">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#E2B93B",
                  textTransform: "uppercase",
                }}
              >
                {t.name}
              </span>
              <span
                className="block mt-1"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {t.role}, {t.company}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 justify-center mt-16">
          {V2_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i === current
                    ? "#E2B93B"
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA + Footer ───────────────────────────────────────────── */
export function VoidCTA() {
  return (
    <section className="relative py-48 px-8 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="text-center"
      >
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
          Let&rsquo;s talk
        </span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="h-0.5 origin-left mt-2"
          style={{ background: "#E2B93B" }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-12"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
        }}
      >
        Book a call &mdash; Cal.com
      </motion.p>

      {/* Footer */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-between px-8"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.12)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <span>Based in Lagos, NG</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function VoidVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <VoidLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <VoidHero />
          <VoidProcess />
          <VoidWork />
          <VoidPhilosophy />
          <VoidTestimonial />
          <VoidCTA />
        </motion.div>
      )}
    </main>
  );
}