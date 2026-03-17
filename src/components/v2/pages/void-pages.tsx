import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT, V2_SERVICES_DETAILED } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   VOID PAGES — Negative space mastery applied to inner pages.
   Silence is the design. Every element exists in isolation.
   ═══════════════════════════════════════════════════════════════ */

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function VoidWorkPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — single word, massive isolation */}
      <section className="h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center"
        >
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
            Work
          </span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-16"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
            }}
          >
            Selected Projects
          </motion.p>
        </motion.div>
      </section>

      {/* Projects — one at a time, massive breathing room */}
      <section className="relative pb-32">
        {V2_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="mb-48 last:mb-0"
          >
            {/* Thin divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
              className="h-px origin-left mx-8 mb-24"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />

            {/* Project number — isolated */}
            <div className="text-center mb-16">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.12)",
                  textTransform: "uppercase",
                }}
              >
                {project.id} / {String(V2_PROJECTS.length).padStart(2, "0")}
              </span>
            </div>

            {/* Project title — massive, centered */}
            <div className="text-center px-8">
              <motion.span
                whileHover={{ color: "#E2B93B" }}
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2.5rem, 8vw, 7rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#f0f0f0",
                  display: "block",
                  transition: "color 0.5s ease",
                }}
              >
                {project.title}
              </motion.span>
            </div>

            {/* Category — whisper quiet */}
            <div className="text-center mt-8">
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.15)",
                  textTransform: "uppercase",
                }}
              >
                {project.category} &mdash; {project.year}
              </span>
            </div>

            {/* Expanding image — appears in the void */}
            <AnimatePresence>
              {expandedId === project.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "60vh", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                  className="overflow-hidden mt-16 mx-8"
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

            {/* Description — appears below */}
            <AnimatePresence>
              {expandedId === project.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-center mt-12 max-w-md mx-auto"
                >
                  <p
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.85rem",
                      lineHeight: 1.8,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.35)",
                      fontStyle: "italic",
                    }}
                  >
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>

      {/* Gold dot — end of void */}
      <div className="flex justify-center pb-32">
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E2B93B" }} />
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function VoidCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center"
        >
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
            Craft
          </span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-16 max-w-xs mx-auto"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "0.8rem",
              lineHeight: 1.8,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            The work that feeds the work. Explorations, experiments, curiosities.
          </motion.p>
        </motion.div>
      </section>

      {/* Constellation layout — items float in void */}
      <section className="relative px-8 pb-48">
        <div className="max-w-6xl mx-auto">
          {V2_CRAFT_ITEMS.map((item, i) => {
            const positions = [
              { ml: "0%", mr: "auto", maxW: "45%", mt: 0 },
              { ml: "auto", mr: "0%", maxW: "40%", mt: -80 },
              { ml: "20%", mr: "auto", maxW: "50%", mt: 60 },
              { ml: "auto", mr: "5%", maxW: "35%", mt: -40 },
              { ml: "5%", mr: "auto", maxW: "42%", mt: 80 },
              { ml: "auto", mr: "10%", maxW: "38%", mt: -20 },
              { ml: "15%", mr: "auto", maxW: "48%", mt: 40 },
              { ml: "auto", mr: "0%", maxW: "40%", mt: -60 },
            ];
            const pos = positions[i % positions.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, delay: 0.1 }}
                className="mb-32 group cursor-pointer"
                style={{
                  marginLeft: pos.ml,
                  marginRight: pos.mr,
                  maxWidth: pos.maxW,
                  marginTop: pos.mt,
                }}
              >
                <div className="overflow-hidden" style={{ aspectRatio: i % 2 === 0 ? "4/5" : "3/2" }}>
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.8 }}
                    style={{ filter: "grayscale(0.5)" }}
                  />
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <span
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.3em",
                      color: "rgba(226,185,59,0.4)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ width: 20, height: 1, background: "rgba(255,255,255,0.08)" }} />
                  <span
                    className="group-hover:text-white/60 transition-colors duration-500"
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
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
export function VoidAboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dotScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 3, 1]);

  return (
    <main ref={ref} className="relative bg-[#0A0A0A] min-h-screen">
      {/* Name — isolated in void */}
      <section className="h-screen flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(5rem, 18vw, 20rem)",
            letterSpacing: "0.15em",
            lineHeight: 0.85,
            color: "#f0f0f0",
            textTransform: "uppercase",
          }}
        >
          Deron
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-20"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          {V2_ABOUT.title}
        </motion.p>

        <motion.div
          style={{ scale: dotScale }}
          className="mt-12"
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E2B93B" }} />
        </motion.div>
      </section>

      {/* Bio — centered, breathing */}
      <section className="py-48 px-8">
        <div className="max-w-lg mx-auto text-center">
          {V2_ABOUT.bio.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3, duration: 1.2 }}
              className={i > 0 ? "mt-8" : ""}
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.95rem",
                lineHeight: 2,
                fontWeight: 300,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Philosophy — isolated quote */}
      <section className="py-48 px-8 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-2xl"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1.3rem, 3vw, 2.5rem)",
            lineHeight: 1.5,
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {V2_ABOUT.philosophy.split(" ").map((word, wi) => (
            <motion.span
              key={wi}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: wi * 0.08, duration: 0.5 }}
              className="inline-block mr-[0.3em]"
              style={{
                color: word === "judged" ? "#E2B93B" : undefined,
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </section>

      {/* Values — one per section, isolated */}
      <section className="py-32 px-8">
        <div className="max-w-2xl mx-auto">
          {V2_ABOUT.values.map((value, i) => (
            <motion.div
              key={value.word}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mb-32 last:mb-0 text-center"
            >
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: "rgba(255,255,255,0.1)",
                  textTransform: "uppercase",
                }}
              >
                0{i + 1}
              </span>
              <span
                className="block mt-4"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {value.word}
              </span>
              <p
                className="mt-4 max-w-xs mx-auto"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.8rem",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social links — minimal */}
      <section className="py-32 px-8">
        <div className="text-center">
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.1)",
              textTransform: "uppercase",
            }}
          >
            Connect
          </span>
          <div className="flex justify-center gap-12 mt-8">
            {V2_ABOUT.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                className="hover:text-[#E2B93B] transition-colors duration-500"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="py-8 px-8 flex justify-between"
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.08)",
          textTransform: "uppercase",
        }}
      >
        <span>&copy; 2025 derondsgnr</span>
        <span>{V2_ABOUT.location}</span>
      </div>
    </main>
  );
}
