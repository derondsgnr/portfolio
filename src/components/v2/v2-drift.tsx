import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_TESTIMONIALS, V2_PROCESS } from "./v2-data";

/* ═══════════════════════════════════════════════════════════════
   DRIFT — Horizontal momentum meets vertical scroll.
   Everything slides, glides, drifts. Kinetic energy.
   Inspired by: editorial horizontal scroll + parallax layers.
   ═══════════════════════════════════════════════════════════════ */

function DriftLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ x: "100%" }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      {/* Line drifts across */}
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
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}
      >
        Drift
      </motion.span>
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function DriftHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center">
      {/* Drifting title lines */}
      <div className="w-full">
        <motion.div
          style={{ x: x1 }}
          className="flex items-baseline"
        >
          <motion.span
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(5rem, 16vw, 16rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              whiteSpace: "nowrap",
            }}
          >
            DERON
          </motion.span>
        </motion.div>

        <motion.div
          style={{ x: x2 }}
          className="flex items-baseline justify-end"
        >
          <motion.span
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.05em",
              color: "#E2B93B",
              whiteSpace: "nowrap",
            }}
          >
            Product Designer & Builder
          </motion.span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.2)",
            maxWidth: "260px",
            textAlign: "center",
          }}
        >
          Your product will be judged on how it looks before anyone uses it.
        </span>
        <motion.div
          animate={{ x: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Scroll &rarr;
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Process — words drift at different speeds ──────────────── */
export function DriftProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const speeds = [
    useTransform(scrollYProgress, [0, 1], [200, -200]),
    useTransform(scrollYProgress, [0, 1], [-150, 150]),
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    useTransform(scrollYProgress, [0, 1], [-180, 180]),
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {V2_PROCESS.map((word, i) => (
        <motion.div
          key={word}
          style={{ x: speeds[i] }}
          className="py-4"
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.06)",
              whiteSpace: "nowrap",
            }}
          >
            {word} &mdash; {word} &mdash; {word} &mdash; {word}
          </span>
        </motion.div>
      ))}
    </section>
  );
}

type WorkProject = { id: string; title: string; category: string; year: string; image: string };

/* ─── Work — horizontal scroll section ───────────────────────── */
export function DriftWork({ projects }: { projects?: WorkProject[] } = {}) {
  const items = projects ?? V2_PROJECTS;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 left-8 z-10"
        >
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Selected Work &rarr;
          </span>
        </motion.div>

        <motion.div style={{ x }} className="flex gap-8 pl-[5vw]">
          {items.map((project, i) => (
            <div
              key={project.id}
              className="flex-shrink-0 group cursor-pointer"
              style={{ width: "min(600px, 70vw)" }}
            >
              <div
                className="overflow-hidden"
                style={{
                  aspectRatio: "16/10",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(0.3) contrast(1.1)" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="mt-6 flex justify-between items-end">
                <div>
                  <span
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {project.title}
                  </span>
                  <span
                    className="block mt-2"
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>
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
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Philosophy — two columns drift in from opposite sides ──── */
export function DriftPhilosophy() {
  return (
    <section className="relative py-48 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#f0f0f0",
            }}
          >
            Design is
            <br />
            <span style={{ color: "#E2B93B" }}>momentum</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="flex items-end"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.9,
              fontWeight: 300,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            I don&apos;t believe in static design. Products should feel alive, responsive,
            in motion. Every interaction is a conversation &mdash; fluid, natural,
            inevitable. I design the feeling of forward.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials — horizontal momentum carousel ────────────── */
export function DriftTestimonials() {
  return (
    <section className="relative py-32 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-8 mb-16"
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          What they say &rarr;
        </span>
      </motion.div>

      {/* Auto-scrolling testimonial strip */}
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-8"
      >
        {[...V2_TESTIMONIALS, ...V2_TESTIMONIALS].map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="flex-shrink-0 p-8"
            style={{
              width: "min(450px, 80vw)",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.04)",
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
            <div className="mt-6">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#E2B93B",
                  letterSpacing: "0.05em",
                }}
              >
                {t.name}
              </span>
              <span
                className="block mt-1"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {t.role}, {t.company}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
export function DriftCTA() {
  return (
    <section className="relative py-48 px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            Let&rsquo;s
          </span>
        </motion.div>
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "block",
            }}
          >
            Move
          </span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-8 mx-auto"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(226,185,59,0.4), transparent)",
            maxWidth: 300,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          Book via Cal.com
        </motion.p>
      </div>

      <div
        className="mt-32 flex justify-between"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.1)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <span>Drift / V2</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function DriftVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <DriftLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <DriftHero />
          <DriftProcess />
          <DriftWork />
          <DriftPhilosophy />
          <DriftTestimonials />
          <DriftCTA />
        </motion.div>
      )}
    </main>
  );
}