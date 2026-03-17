import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_TESTIMONIALS, V2_PROCESS, V2_SERVICES } from "./v2-data";

/* ═══════════════════════════════════════════════════════════════
   SIGNAL — Data transmission aesthetic. 
   Everything is a broadcast. Scan lines. Monospace labels.
   Coordinates and frequencies. The design IS the signal.
   ═══════════════════════════════════════════════════════════════ */

function SignalLoader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const msgs = [
    "ESTABLISHING CONNECTION...",
    "FREQ: 432.00 Hz",
    "LAT: 6.5244° N",
    "LNG: 3.3792° E",
    "SIGNAL LOCKED",
    "TRANSMITTING...",
    "READY",
  ];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < msgs.length) {
        setLines((prev) => [...prev, msgs[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-end p-8"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.03) 2px, rgba(226,185,59,0.03) 4px)",
        }}
      />
      <div>
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color:
                line === "READY"
                  ? "#E2B93B"
                  : "rgba(255,255,255,0.4)",
              lineHeight: 2,
            }}
          >
            &gt; {line}
          </motion.p>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "#E2B93B",
          }}
        >
          _
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function SignalHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scanY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px z-10"
        style={{ top: scanY, background: "rgba(226,185,59,0.4)" }}
      />

      {/* Coordinates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-32 left-8"
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          lineHeight: 2,
        }}
      >
        <p>SIG_001</p>
        <p>06°31&apos;28.0&quot;N</p>
        <p>003°22&apos;45.0&quot;E</p>
        <p>2025.03.16</p>
      </motion.div>

      {/* Main title — scan reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.3 }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(4rem, 14vw, 14rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            DERON
          </span>
        </motion.div>

        <motion.div
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.6 }}
          className="mt-4"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.5em",
              color: "#E2B93B",
              textTransform: "uppercase",
            }}
          >
            PRODUCT_DESIGNER // BUILDER
          </span>
        </motion.div>
      </div>

      {/* Status bar bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 px-8 flex justify-between"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.1em",
        }}
      >
        <span>SIGNAL: ACTIVE</span>
        <span
          style={{
            maxWidth: "280px",
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "10px",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(255,255,255,0.2)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Your product will be judged on how it looks before anyone uses it.
        </span>
        <span>SCROLL TO RECEIVE</span>
      </motion.div>
    </section>
  );
}

/* ─── Process ────────────────────────────────────────────────── */
function SignalProcess() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Horizontal ticker */}
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...V2_PROCESS, ...V2_PROCESS, ...V2_PROCESS, ...V2_PROCESS].map(
          (word, i) => (
            <span
              key={i}
              className="mx-8"
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(1rem, 2vw, 1.5rem)",
                letterSpacing: "0.3em",
                color:
                  i % 4 === 0
                    ? "#E2B93B"
                    : "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
              }}
            >
              /{String(i % 4 + 1).padStart(2, "0")} {word}
              <span style={{ color: "rgba(255,255,255,0.06)" }}>
                {" "}
                ........
              </span>
            </span>
          )
        )}
      </motion.div>

      {/* Wave decoration */}
      <motion.div
        className="mt-16 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.77, 0, 0.175, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(226,185,59,0.3), transparent)",
          originX: 0,
        }}
      />
    </section>
  );
}

/* ─── Work ───────────────────────────────────────────────────── */
function SignalWork() {
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
          &gt; SELECTED_TRANSMISSIONS
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {V2_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="relative group overflow-hidden cursor-pointer"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "grayscale(0.6) contrast(1.2)" }}
            />
            {/* Scan overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
              }}
            />
            {/* Info overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-between">
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
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
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
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em",
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

/* ─── Services ───────────────────────────────────────────────── */
function SignalServices() {
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
        </motion.div>

        {V2_SERVICES.map((service, i) => (
          <motion.div
            key={service}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="group cursor-pointer"
          >
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div className="py-6 flex items-center gap-8">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.15)",
                  letterSpacing: "0.1em",
                  width: "40px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="group-hover:text-[#E2B93B] transition-colors duration-300"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {service}
              </span>
              <motion.span
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#E2B93B",
                }}
              >
                ACTIVE &gt;
              </motion.span>
            </div>
          </motion.div>
        ))}
        <div
          className="h-px"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function SignalTestimonials() {
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

        {V2_TESTIMONIALS.slice(0, 3).map((t, i) => (
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
              {t.quote}
            </p>
            <p
              className="mt-4"
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              &mdash; {t.name.toUpperCase()} / {t.role.toUpperCase()}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
function SignalCTA() {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-48 px-8 flex flex-col items-center justify-center">
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
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            letterSpacing: "0.1em",
            color: "#E2B93B",
          }}
        >
          &gt; TRANSMIT
          <span style={{ opacity: blink ? 1 : 0 }}>_</span>
        </span>
        <p
          className="mt-6"
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.15em",
          }}
        >
          OPEN CHANNEL: CAL.COM/DERONDSGNR
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
        <span>END_TRANSMISSION</span>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────────────── */
export function SignalVariation() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <AnimatePresence>
        {!loaded && <SignalLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <SignalHero />
          <SignalProcess />
          <SignalWork />
          <SignalServices />
          <SignalTestimonials />
          <SignalCTA />
        </motion.div>
      )}
    </main>
  );
}