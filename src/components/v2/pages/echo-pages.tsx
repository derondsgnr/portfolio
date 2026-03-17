import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   ECHO PAGES — Layered repetition creates depth and dimension.
   Everything echoes: type stacks, shadow copies, depth layers.
   ═══════════════════════════════════════════════════════════════ */

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function EchoWorkPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const layers = [
    { opacity: 0.03, y: useTransform(scrollYProgress, [0, 1], [0, -50]), scale: 1.15 },
    { opacity: 0.06, y: useTransform(scrollYProgress, [0, 1], [0, -25]), scale: 1.08 },
    { opacity: 1, y: useTransform(scrollYProgress, [0, 1], [0, 0]), scale: 1 },
  ];

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — echoed title */}
      <section ref={ref} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="relative">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              className={i < 2 ? "absolute inset-0" : "relative"}
              style={{ y: layer.y, scale: layer.scale }}
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
                WORK
              </span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-center mt-8 relative"
          >
            {[0.06, 0.12, 0.35].map((op, i) => (
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
                  transform: `translateY(${(i - 2) * 3}px)`,
                }}
              >
                {V2_PROJECTS.length} Selected Projects
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects — cards with shadow copies */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {V2_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative group cursor-pointer"
            >
              {/* Echo shadow copies */}
              <div className="absolute inset-0" style={{ transform: "translate(12px, 12px)", border: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }} />
              <div className="absolute inset-0" style={{ transform: "translate(6px, 6px)", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }} />

              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(0.4)" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#f0f0f0" }}>
                    {project.title}
                  </span>
                  <p className="mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.35)" }}>
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                  {project.category}
                </span>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", color: "#E2B93B", letterSpacing: "0.1em" }}>
                  {project.year}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Echo / Work</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function EchoCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero with rings */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.04, scale: 1 }}
            transition={{ delay: i * 0.2, duration: 1 }}
            className="absolute rounded-full border"
            style={{ width: `${i * 200 + 100}px`, height: `${i * 200 + 100}px`, borderColor: "rgba(226,185,59,0.2)" }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative text-center"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 15vw, 15rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0" }}>
            Craft
          </span>
          <p className="mt-8" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", lineHeight: 1.8, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.2)" }}>
            Resonances from the studio floor
          </p>
        </motion.div>
      </section>

      {/* Craft items — echoed thumbnails */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {V2_CRAFT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative group cursor-pointer"
            >
              {/* Echo copy */}
              <div className="absolute inset-0" style={{ transform: "translate(8px, 8px)", border: "1px solid rgba(255,255,255,0.03)" }} />

              <div className="relative overflow-hidden" style={{ aspectRatio: i % 3 === 0 ? "4/5" : "1/1", border: "1px solid rgba(255,255,255,0.05)" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(0.5)" }}
                />
              </div>
              <div className="mt-4">
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "#E2B93B" }}>
                  {item.category}
                </span>
                <span className="block mt-1" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                  {item.title}
                </span>
                <p className="mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.15)" }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Echo / Craft</span>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function EchoAboutPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — echoed name */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {[0.02, 0.04, 0.07, 1].map((op, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ delay: i * 0.15, duration: 1 }}
            className={i < 3 ? "absolute" : "relative"}
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(6rem, 20vw, 22rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              transform: `scale(${1 + (3 - i) * 0.05}) translateY(${(3 - i) * 5}px)`,
            }}
          >
            DERON
          </motion.span>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-24 text-center"
        >
          {[0.08, 0.15, 0.4].map((op, i) => (
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
                transform: `translateY(${(i - 2) * 3}px)`,
              }}
            >
              {V2_ABOUT.title}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Bio with echo rings behind */}
      <section className="relative py-48 px-8 flex items-center justify-center">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.03, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 1 }}
            className="absolute rounded-full border"
            style={{ width: `${i * 300 + 200}px`, height: `${i * 300 + 200}px`, borderColor: "rgba(226,185,59,0.2)" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-2xl text-center"
        >
          {V2_ABOUT.bio.map((p, i) => (
            <p
              key={i}
              className={i > 0 ? "mt-8" : ""}
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.9,
                fontWeight: 300,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {p}
            </p>
          ))}
        </motion.div>
      </section>

      {/* Stats — echoed values */}
      <section className="relative py-24 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {V2_ABOUT.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative"
            >
              {/* Echo behind */}
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1, color: "rgba(226,185,59,0.05)", transform: "scale(1.2)" }}
              >
                {stat.value}
              </span>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, color: "#E2B93B", display: "block", position: "relative" }}>
                {stat.value}
              </span>
              <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 px-8">
        <div className="max-w-3xl mx-auto">
          {V2_ABOUT.values.map((value, i) => (
            <motion.div
              key={value.word}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative mb-16 last:mb-0"
            >
              {/* Echo layers */}
              {[0.02, 0.04].map((op, j) => (
                <span
                  key={j}
                  className="absolute"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: `rgba(255,255,255,${op})`,
                    transform: `translate(${(1 - j) * 8}px, ${(1 - j) * 4}px)`,
                  }}
                >
                  {value.word}
                </span>
              ))}
              <span
                className="relative"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: i === 1 ? "#E2B93B" : "rgba(255,255,255,0.5)",
                  display: "inline-block",
                }}
              >
                {value.word}
              </span>
              <p className="mt-3 ml-4" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.2)" }}>
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="relative py-24 px-8 text-center">
        <div className="flex justify-center gap-10">
          {V2_ABOUT.socials.map((s) => (
            <a key={s.label} href={s.url} className="hover:text-[#E2B93B] transition-colors duration-300" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Echo / About</span>
      </div>
    </main>
  );
}
