import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_TESTIMONIALS, V2_PROCESS } from "./v2-data";

/* ═══════════════════════════════════════════════════════════════
   ECHO — Layered repetition creates depth and dimension.
   Everything echoes: type stacks, shadow copies, depth layers.
   Inspired by: Cosmos floating images + stacked depth.
   ═══════════════════════════════════════════════════════════════ */

function EchoLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Concentric rings pulsing outward */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: "rgba(226,185,59,0.15)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: [0, 400],
            height: [0, 400],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.5em",
          color: "rgba(226,185,59,0.5)",
          textTransform: "uppercase",
        }}
      >
        Echo
      </motion.span>
    </motion.div>
  );
}

/* ─── Hero — stacked/echoed title creating depth ─────────────── */
function EchoHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const layers = [
    { opacity: 0.03, y: useTransform(scrollYProgress, [0, 1], [0, -50]), scale: 1.15 },
    { opacity: 0.05, y: useTransform(scrollYProgress, [0, 1], [0, -30]), scale: 1.1 },
    { opacity: 0.08, y: useTransform(scrollYProgress, [0, 1], [0, -15]), scale: 1.05 },
    { opacity: 1, y: useTransform(scrollYProgress, [0, 1], [0, 0]), scale: 1 },
  ];

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="relative">
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            className={i < 3 ? "absolute inset-0" : "relative"}
            style={{
              y: layer.y,
              scale: layer.scale,
            }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(5rem, 15vw, 15rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: `rgba(240,240,240,${layer.opacity})`,
                display: "block",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              DERON
            </span>
          </motion.div>
        ))}

        {/* Subtitle — echoes too */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8 relative"
        >
          {[0.06, 0.12, 0.4].map((op, i) => (
            <span
              key={i}
              className={i < 2 ? "absolute inset-0" : "relative"}
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: `rgba(226,185,59,${op})`,
                display: "block",
                transform: `translateY(${(i - 2) * 3}px) scale(${1 + (2 - i) * 0.02})`,
              }}
            >
              Product Designer & Builder
            </span>
          ))}
        </motion.div>

        {/* Statement piece — echoed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 text-center"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.8rem",
              lineHeight: 1.8,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.2)",
              maxWidth: "320px",
              margin: "0 auto",
            }}
          >
            Your product will be judged on how it looks before anyone uses it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Process — echoed/repeated words ────────────────────────── */
function EchoProcess() {
  return (
    <section className="relative py-40 px-8">
      <div className="max-w-5xl mx-auto">
        {V2_PROCESS.map((word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="relative mb-20 last:mb-0"
          >
            {/* Echo layers */}
            {[0.02, 0.04, 0.07].map((op, j) => (
              <span
                key={j}
                className="absolute"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: `rgba(255,255,255,${op})`,
                  transform: `translate(${(2 - j) * 8}px, ${(2 - j) * 4}px)`,
                }}
              >
                {word}
              </span>
            ))}
            {/* Front layer */}
            <span
              className="relative"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(2rem, 6vw, 5rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.6)",
                display: "inline-block",
              }}
            >
              {word}
            </span>
            <span
              className="ml-4"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.15)",
                verticalAlign: "super",
              }}
            >
              0{i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Work — cards with shadow copies ────────────────────────── */
function EchoWork() {
  return (
    <section className="relative py-32 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-20"
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
          Selected Echoes
        </span>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {V2_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative group cursor-pointer"
          >
            {/* Shadow copies behind */}
            <div
              className="absolute inset-0"
              style={{
                transform: "translate(12px, 12px)",
                border: "1px solid rgba(255,255,255,0.03)",
                background: "rgba(255,255,255,0.01)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                transform: "translate(6px, 6px)",
                border: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(255,255,255,0.01)",
              }}
            />

            {/* Main card */}
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "4/3",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "grayscale(0.4)" }}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "#f0f0f0",
                  }}
                >
                  {project.title}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.1em",
                }}
              >
                {project.category}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  color: "#E2B93B",
                  letterSpacing: "0.1em",
                }}
              >
                {project.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Philosophy — pull quote with echo rings ────────────────── */
function EchoPhilosophy() {
  return (
    <section className="relative py-48 px-8 flex items-center justify-center min-h-[80vh]">
      {/* Background rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.03, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2, duration: 1 }}
          className="absolute rounded-full border"
          style={{
            width: `${i * 300 + 200}px`,
            height: `${i * 300 + 200}px`,
            borderColor: "rgba(226,185,59,0.2)",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative text-center max-w-3xl"
      >
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            lineHeight: 1.5,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Good design{" "}
          <span style={{ fontStyle: "italic", color: "#E2B93B" }}>resonates</span>.
          <br />
          It echoes in how users feel,
          <br />
          how teams build, how products{" "}
          <span style={{ fontStyle: "italic", color: "#E2B93B" }}>endure</span>.
        </p>
      </motion.div>
    </section>
  );
}

/* ─── Testimonials — stacked cards with peek ─────────────────── */
function EchoTestimonials() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="relative py-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(5rem, 10vw, 8rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.08)",
                display: "block",
              }}
            >
              {current + 1}/{V2_TESTIMONIALS.length}
            </span>
            <span
              className="block mt-4"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Trusted by
              <br />
              <span style={{ color: "#E2B93B" }}>Builders</span>
            </span>
          </motion.div>

          {/* Right: stacked cards */}
          <div className="relative" style={{ height: 320 }}>
            {V2_TESTIMONIALS.map((t, i) => {
              const offset = i - current;
              if (offset < 0 || offset > 2) return null;
              return (
                <motion.div
                  key={t.id}
                  animate={{
                    y: offset * 12,
                    scale: 1 - offset * 0.04,
                    opacity: offset === 0 ? 1 : 0.3,
                    zIndex: 5 - offset,
                  }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-x-0 top-0 cursor-pointer p-8"
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onClick={() => setCurrent((c) => (c + 1) % V2_TESTIMONIALS.length)}
                >
                  <p
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.55)",
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
function EchoCTA() {
  return (
    <section className="relative py-48 px-8 flex flex-col items-center justify-center">
      {/* Pulsing rings behind CTA */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 200 + i * 80,
            height: 200 + i * 80,
            border: "1px solid rgba(226,185,59,0.06)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative text-center"
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
          Resonate
        </span>
        <p
          className="mt-6"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          Schedule a conversation &mdash; Cal.com
        </p>
      </motion.div>

      <div
        className="absolute bottom-8 left-0 right-0 px-8 flex justify-between"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.1)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <span>Echo / V2</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function EchoVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <EchoLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <EchoHero />
          <EchoProcess />
          <EchoWork />
          <EchoPhilosophy />
          <EchoTestimonials />
          <EchoCTA />
        </motion.div>
      )}
    </main>
  );
}