import { useState } from "react";
import { motion } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   FRACTURE PAGES — Break to reveal. Diagonals. Collisions.
   The grid shatters intentionally. Beauty in the break.
   ═══════════════════════════════════════════════════════════════ */

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function FractureWorkPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen overflow-hidden">
      {/* Hero — fractured title */}
      <section className="relative h-[70vh] flex items-center px-8">
        {/* Giant cropped background */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 0.03 }}
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
              whiteSpace: "nowrap",
            }}
          >
            WRK
          </span>
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ x: 80, opacity: 0, rotate: -2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="ml-[10vw]"
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
              SEL
            </span>
          </motion.div>
          <motion.div
            initial={{ x: -80, opacity: 0, rotate: 2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
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
              ECTED
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 ml-[10vw] flex items-center gap-4"
          >
            <div style={{ width: 60, height: 1, background: "#E2B93B", transform: "rotate(-30deg)" }} />
            <span
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Work Archive &mdash; {V2_PROJECTS.length} Projects
            </span>
          </motion.div>
        </div>
      </section>

      {/* Projects — broken, overlapping cards */}
      <section className="relative px-8 pb-32">
        <div className="relative max-w-6xl mx-auto">
          {V2_PROJECTS.map((project, i) => {
            const rotations = [-2, 1.5, -1, 2.5];
            const translateY = [0, -30, 20, -10];
            const widths = ["60%", "50%", "55%", "48%"];
            const lefts = ["0%", "42%", "8%", "48%"];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 80, rotate: rotations[i] * 2 }}
                whileInView={{ opacity: 1, y: translateY[i], rotate: rotations[i] }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative mb-8 group cursor-pointer"
                style={{
                  width: widths[i],
                  marginLeft: lefts[i],
                  zIndex: 4 - i,
                }}
              >
                <div className="overflow-hidden" style={{ aspectRatio: "16/10", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "grayscale(0.5)" }}
                  />
                </div>
                <div className="mt-4 flex justify-between items-baseline">
                  <div>
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
                    <p
                      className="mt-2 max-w-sm"
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: "0.8rem",
                        lineHeight: 1.6,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "#E2B93B" }}>
                    {project.year}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div
        className="py-8 px-8 flex justify-between"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.1)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <span>/ Fracture</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function FractureCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end px-8 pb-16">
        <div>
          <motion.div
            initial={{ x: 60, opacity: 0, rotate: -3 }}
            animate={{ x: 0, opacity: 1, rotate: -1.5 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(4rem, 14vw, 14rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#f0f0f0",
                transform: "rotate(-1.5deg)",
                display: "block",
              }}
            >
              Craft
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, rotate: 1 }}
            animate={{ opacity: 1, rotate: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-sm"
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
            Fragments of exploration. The messy, beautiful work that happens between projects.
          </motion.p>
        </div>
      </section>

      {/* Shattered masonry — items at different angles */}
      <section className="relative px-8 pb-32">
        <div className="max-w-6xl mx-auto relative">
          {V2_CRAFT_ITEMS.map((item, i) => {
            const angles = [-2, 1.5, -1, 2.5, -1.5, 2, -2.5, 1];
            const configs = [
              { w: "48%", ml: "0%", mt: 0 },
              { w: "40%", ml: "55%", mt: -40 },
              { w: "55%", ml: "10%", mt: 20 },
              { w: "38%", ml: "0%", mt: -20 },
              { w: "45%", ml: "50%", mt: 30 },
              { w: "42%", ml: "5%", mt: -10 },
              { w: "50%", ml: "40%", mt: 20 },
              { w: "40%", ml: "15%", mt: -30 },
            ];
            const c = configs[i % configs.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 60, rotate: angles[i] * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: angles[i] }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative mb-6 group cursor-pointer"
                style={{
                  width: c.w,
                  marginLeft: c.ml,
                  marginTop: c.mt,
                  zIndex: V2_CRAFT_ITEMS.length - i,
                }}
              >
                <div className="overflow-hidden" style={{ aspectRatio: i % 3 === 0 ? "4/5" : "16/10", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "grayscale(0.4)" }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "#E2B93B" }}>
                    {item.category}
                  </span>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                    {item.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function FractureAboutPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen overflow-hidden">
      {/* Hero — fractured name */}
      <section className="relative h-[70vh] flex items-center px-8">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 0.03 }}
          transition={{ duration: 1.5 }}
          className="absolute -right-[5vw] top-1/2 -translate-y-1/2 select-none pointer-events-none"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(15rem, 35vw, 40rem)", lineHeight: 0.8, color: "#fff", whiteSpace: "nowrap" }}>
            ABT
          </span>
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: -2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="ml-[15vw]"
          >
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4rem, 12vw, 12rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0" }}>
              DER
            </span>
          </motion.div>
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: 2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="-mt-4"
          >
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4rem, 12vw, 12rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#E2B93B" }}>
              ON
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 ml-[15vw] flex items-center gap-4"
          >
            <div style={{ width: 60, height: 1, background: "#E2B93B", transform: "rotate(-30deg)" }} />
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              {V2_ABOUT.title}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Bio — angled text blocks */}
      <section className="relative py-24 px-8">
        <div className="max-w-5xl mx-auto">
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
                fontSize: "1rem",
                lineHeight: 1.8,
                fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
                transform: "rotate(-1deg)",
              }}
            >
              {V2_ABOUT.bio[0]}
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
                fontSize: "1rem",
                lineHeight: 1.8,
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                transform: "rotate(1.5deg)",
              }}
            >
              {V2_ABOUT.bio[1]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values — scattered at angles */}
      <section className="relative py-24 px-8">
        <div className="max-w-5xl mx-auto">
          {V2_ABOUT.values.map((value, i) => {
            const angles = [-2, 1.5, -1, 2.5];
            const offsets = ["0%", "30%", "10%", "40%"];
            return (
              <motion.div
                key={value.word}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, rotate: angles[i] * 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: angles[i] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="mb-12"
                style={{ marginLeft: offsets[i] }}
              >
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: i === 1 ? "#E2B93B" : "rgba(255,255,255,0.15)",
                    display: "inline-block",
                    transform: `rotate(${angles[i]}deg)`,
                  }}
                >
                  {value.word}
                </span>
                <span
                  className="ml-4"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  {value.desc}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats + Social — offset */}
      <section className="relative py-24 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, rotate: -1 }}
            whileInView={{ opacity: 1, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-3 gap-8">
              {V2_ABOUT.stats.map((stat) => (
                <div key={stat.label} style={{ transform: "rotate(-1deg)" }}>
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, color: "#E2B93B" }}>
                    {stat.value}
                  </span>
                  <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 1.5 }}
            whileInView={{ opacity: 1, rotate: 1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {V2_ABOUT.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                className="hover:text-[#E2B93B] transition-colors duration-300"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transform: "rotate(1.5deg)",
                }}
              >
                / {s.label}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Fracture / About</span>
      </div>
    </main>
  );
}
