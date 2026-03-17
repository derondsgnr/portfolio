import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   DRIFT PAGES — Horizontal momentum meets vertical scroll.
   Everything slides, glides, drifts. Kinetic energy.
   ═══════════════════════════════════════════════════════════════ */

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function DriftWorkPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const x1 = useTransform(heroScroll, [0, 1], [0, -200]);
  const x2 = useTransform(heroScroll, [0, 1], [0, 200]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const scrollX = useTransform(scrollYProgress, [0, 1], ["5%", "-65%"]);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — drifting title */}
      <section ref={heroRef} className="relative h-[70vh] overflow-hidden flex items-center">
        <div className="w-full">
          <motion.div style={{ x: x1 }} className="flex items-baseline">
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
              Selected
            </motion.span>
          </motion.div>
          <motion.div style={{ x: x2 }} className="flex items-baseline justify-end">
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
              Work &rarr; {V2_PROJECTS.length} Projects
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* Horizontal scroll projects */}
      <section ref={scrollRef} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute top-8 left-8 z-10"
          >
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
              Scroll to drift &rarr;
            </span>
          </motion.div>

          <motion.div style={{ x: scrollX }} className="flex gap-8 pl-[5vw]">
            {V2_PROJECTS.map((project) => (
              <div key={project.id} className="flex-shrink-0 group cursor-pointer" style={{ width: "min(600px, 70vw)" }}>
                <div className="overflow-hidden" style={{ aspectRatio: "16/10", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(0.3) contrast(1.1)" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
                      {project.title}
                    </span>
                    <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>
                      {project.category}
                    </span>
                    <p className="mt-3 max-w-sm" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>
                      {project.description}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", color: "#E2B93B", letterSpacing: "0.1em" }}>
                    {project.year}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Drift / Work</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function DriftCraftPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden flex items-center">
        <div className="w-full px-8">
          <motion.span
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(5rem, 16vw, 16rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            Craft
          </motion.span>
          <motion.span
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="block mt-4 text-right"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#E2B93B",
            }}
          >
            Experiments in motion &rarr;
          </motion.span>
        </div>
      </section>

      {/* Horizontal infinite drift */}
      <section ref={scrollRef} className="relative" style={{ height: "250vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div style={{ x }} className="flex gap-6">
            {V2_CRAFT_ITEMS.map((item, i) => (
              <div key={item.id} className="flex-shrink-0 group cursor-pointer" style={{ width: "min(400px, 75vw)" }}>
                <div className="overflow-hidden" style={{ aspectRatio: i % 2 === 0 ? "4/5" : "3/2" }}>
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(0.3)" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="mt-4">
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "#E2B93B" }}>
                    {item.category}
                  </span>
                  <span className="block mt-1" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
                    {item.title}
                  </span>
                  <p className="mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Drift / Craft</span>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function DriftAboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const titleX = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — name drifts */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center">
        <div className="w-full">
          <motion.div style={{ x: nameX }}>
            <motion.span
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(6rem, 20vw, 22rem)",
                lineHeight: 0.8,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#f0f0f0",
                display: "block",
                whiteSpace: "nowrap",
              }}
            >
              Deron
            </motion.span>
          </motion.div>
          <motion.div style={{ x: titleX }} className="text-right">
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
              }}
            >
              {V2_ABOUT.title}
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
          <motion.span
            animate={{ x: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}
          >
            Scroll &rarr;
          </motion.span>
        </motion.div>
      </section>

      {/* Bio — sections drift from opposite sides */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-lg"
          >
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "1rem", lineHeight: 1.9, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
              {V2_ABOUT.bio[0]}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="max-w-lg ml-auto mt-16"
          >
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "1rem", lineHeight: 1.9, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
              {V2_ABOUT.bio[1]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats — drift in */}
      <section className="relative py-24 px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto flex justify-between">
          {V2_ABOUT.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center"
            >
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, color: "#E2B93B", display: "block" }}>
                {stat.value}
              </span>
              <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values — alternating drift */}
      <section className="relative py-24 px-8">
        <div className="max-w-5xl mx-auto">
          {V2_ABOUT.values.map((value, i) => (
            <motion.div
              key={value.word}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="py-8"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: i === 2 ? "#E2B93B" : "rgba(255,255,255,0.5)" }}>
                  {value.word}
                </span>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.2)", maxWidth: "300px", textAlign: "right" }}>
                  {value.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social links + footer */}
      <section className="relative py-24 px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center">
          {V2_ABOUT.socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.url}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="hover:text-[#E2B93B] transition-colors duration-300"
              style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
            >
              {s.label} &rarr;
            </motion.a>
          ))}
        </div>
      </section>

      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Drift / About</span>
      </div>
    </main>
  );
}
