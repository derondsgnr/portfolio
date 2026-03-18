import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { V2_PROJECTS, V2_PROCESS } from "./v2-data";
import { useTestimonials } from "@/contexts/testimonials-context";

/* ═══════════════════════════════════════════════════════════════
   FRACTURE — Break to reveal. Diagonals. Collisions.
   Inspired by: Aristide's cropped type + Lando's card fan.
   The grid shatters intentionally. Beauty in the break.
   ═══════════════════════════════════════════════════════════════ */

function FractureLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(onComplete, 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Crack lines */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={phase >= 1 ? { scaleY: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute left-1/2 top-0 bottom-0 w-px origin-center"
        style={{ background: "rgba(226,185,59,0.5)" }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={phase >= 2 ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-1/2 left-0 right-0 h-px origin-center"
        style={{ background: "rgba(226,185,59,0.5)" }}
      />
      {phase >= 3 && (
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 40, rotate: 45 }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 100,
            height: 100,
            background: "#0A0A0A",
            border: "1px solid rgba(226,185,59,0.3)",
          }}
        />
      )}
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
export function FractureHero() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center">
      {/* Giant cropped background text — like Aristide */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.04 }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute -left-[5vw] top-1/2 -translate-y-1/2 select-none pointer-events-none"
      >
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(15rem, 35vw, 40rem)",
            lineHeight: 0.8,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            color: "#fff",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          DRN
        </span>
      </motion.div>

      {/* Fractured name — split diagonally */}
      <div className="relative z-10 w-full px-8">
        <div className="flex flex-col items-start">
          {/* Top half — offset right */}
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: -2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            className="ml-[15vw]"
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(4rem, 12vw, 12rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#f0f0f0",
              }}
            >
              DER
            </span>
          </motion.div>

          {/* Bottom half — offset left with gold */}
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: 2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
            className="-mt-4"
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(4rem, 12vw, 12rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#E2B93B",
              }}
            >
              ON
            </span>
          </motion.div>
        </div>

        {/* Descriptor with diagonal slash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 ml-[15vw] flex items-center gap-4"
        >
          <div
            style={{
              width: 60,
              height: 1,
              background: "#E2B93B",
              transform: "rotate(-30deg)",
            }}
          />
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Product Designer & Builder
          </span>
        </motion.div>

        {/* Statement piece — fractured angle */}
        <motion.div
          initial={{ opacity: 0, rotate: 1 }}
          animate={{ opacity: 1, rotate: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-12 ml-[15vw] max-w-sm"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.25)",
              transform: "rotate(1deg)",
            }}
          >
            Your product will be judged on how it looks before anyone uses it.
          </p>
        </motion.div>
      </div>

      {/* Corner markers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute top-8 right-8"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
          textAlign: "right",
        }}
      >
        <p>Portfolio</p>
        <p>2024&mdash;2025</p>
      </motion.div>
    </section>
  );
}

/* ─── Process — scattered at angles ──────────────────────────── */
export function FractureProcess() {
  const angles = [-3, 2, -1.5, 3];
  const offsets = ["0%", "25%", "10%", "35%"];

  return (
    <section className="relative py-40 px-8">
      <div className="max-w-5xl mx-auto">
        {V2_PROCESS.map((word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, rotate: angles[i] * 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: angles[i] }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: i * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mb-6"
            style={{ marginLeft: offsets[i] }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.12)",
                display: "inline-block",
                transform: `rotate(${angles[i]}deg)`,
              }}
            >
              {word}
            </span>
            <span
              className="ml-4"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.15)",
                verticalAlign: "super",
              }}
            >
              /{String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

type WorkProject = { id: string; title: string; category: string; year: string; image: string };

/* ─── Work — broken/overlapping cards ────────────────────────── */
export function FractureWork({ projects }: { projects?: WorkProject[] } = {}) {
  const items = projects ?? V2_PROJECTS;
  return (
    <section className="relative py-32 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          / Selected Fractures
        </span>
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        {items.map((project, i) => {
          const rotations = [-2, 1.5, -1, 2.5];
          const translateY = [0, -30, 20, -10];
          const translateX = [0, 40, -20, 60];
          const widths = ["55%", "48%", "52%", "45%"];
          const lefts = ["0%", "45%", "5%", "50%"];

          return (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 80,
                rotate: rotations[i] * 2,
              }}
              whileInView={{
                opacity: 1,
                y: translateY[i],
                rotate: rotations[i],
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative mb-8 group cursor-pointer"
              style={{
                width: widths[i],
                marginLeft: lefts[i],
                transform: `translateX(${translateX[i]}px)`,
                zIndex: 4 - i,
              }}
            >
              <div
                className="overflow-hidden"
                style={{
                  aspectRatio: "16/10",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(0.5)" }}
                />
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {project.title}
                </span>
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    color: "#E2B93B",
                  }}
                >
                  {project.year}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Philosophy — angled text blocks ────────────────────────── */
export function FracturePhilosophy() {
  return (
    <section className="relative py-48 px-8">
      <div className="max-w-5xl mx-auto relative">
        {/* Giant background quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.03, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -right-10 select-none pointer-events-none"
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(10rem, 25vw, 25rem)",
              lineHeight: 0.8,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            &ldquo;
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -1 }}
          whileInView={{ opacity: 1, x: 0, rotate: -1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1.3,
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
              transform: "rotate(-1deg)",
            }}
          >
            I break things apart so they can come together{" "}
            <span style={{ color: "#E2B93B" }}>better</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 1.5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
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
              transform: "rotate(1.5deg)",
            }}
          >
            Every product starts fractured — competing ideas, unclear priorities,
            messy user flows. My job is to find the fault lines and rebuild with
            intention. The break is where the light gets in.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials — fanned cards (inspired by Lando socials) ── */
export function FractureTestimonials() {
  const [active, setActive] = useState(2);
  const testimonials = useTestimonials();

  return (
    <section className="relative py-32 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <span
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}
        >
          / Testimonials
        </span>
      </motion.div>

      <div className="relative flex justify-center items-center" style={{ height: "450px" }}>
        {testimonials.slice(0, 5).map((t, i) => {
          const offset = i - active;
          const rotation = offset * 8;
          const xOffset = offset * 60;
          const scale = i === active ? 1 : 0.85;
          const zIndex = 5 - Math.abs(offset);
          const opacity = i === active ? 1 : 0.4;

          return (
            <motion.div
              key={t.id}
              animate={{
                rotate: rotation,
                x: xOffset,
                scale,
                zIndex,
                opacity,
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute cursor-pointer"
              style={{
                width: "min(400px, 85vw)",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                padding: "2.5rem",
              }}
              onClick={() => setActive(i)}
            >
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.6)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: "#E2B93B" }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
export function FractureCTA() {
  return (
    <section className="relative py-48 px-8">
      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            Break
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "block",
            }}
          >
            Ground
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          Schedule via Cal.com
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
        <span>Twitter / X &mdash; LinkedIn &mdash; Dribbble</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function FractureVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <FractureLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <FractureHero />
          <FractureProcess />
          <FractureWork />
          <FracturePhilosophy />
          <FractureTestimonials />
          <FractureCTA />
        </motion.div>
      )}
    </main>
  );
}