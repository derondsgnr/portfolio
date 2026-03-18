import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT, V2_SERVICES_DETAILED } from "../v2-data";
import { ToolBadge } from "@/components/tool-badge";

/* ═══════════════════════════════════════════════════════════════
   SIGNAL PAGES — Data transmission aesthetic applied to inner pages.
   Everything is a broadcast. Scan lines. Monospace labels.
   ═══════════════════════════════════════════════════════════════ */

function SignalScanOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.02) 2px, rgba(226,185,59,0.02) 4px)",
      }}
    />
  );
}

function SignalGridBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function SignalWorkPage() {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGridBg />
      <SignalScanOverlay />

      {/* Terminal header */}
      <section className="relative z-[2] pt-32 pb-16 px-8">
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#E2B93B",
            }}
          >
            &gt; ACCESSING WORK_ARCHIVE...
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8"
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(4rem, 12vw, 12rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            WORK
          </span>
        </motion.div>

        {/* Scan line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-8"
          style={{ background: "linear-gradient(90deg, rgba(226,185,59,0.4), transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 flex justify-between items-center"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            {V2_PROJECTS.length} TRANSMISSIONS FOUND
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "#E2B93B",
            }}
          >
            SIGNAL: ACTIVE{blink ? "_" : " "}
          </span>
        </motion.div>
      </section>

      {/* Project grid — 2-col signal style */}
      <section className="relative z-[2] px-8 pb-32">
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
              {/* Info */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>
                    FREQ_{project.id}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
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
                    style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}
                  >
                    {project.category}
                  </span>
                  <p
                    className="mt-3 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div
        className="relative z-[2] py-8 px-8 flex justify-between"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.1)",
          letterSpacing: "0.1em",
        }}
      >
        <span>&copy; 2025 DERONDSGNR</span>
        <span>END_ARCHIVE</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function SignalCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGridBg />
      <SignalScanOverlay />

      {/* Header */}
      <section className="relative z-[2] pt-32 pb-16 px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
            &gt; INTERCEPTED_SIGNALS
          </span>
        </motion.div>
        <motion.span
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.3, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="block mt-8"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(4rem, 12vw, 12rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#f0f0f0",
          }}
        >
          CRAFT
        </motion.span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
          }}
        >
          EXPERIMENTAL BROADCASTS // SIDE FREQUENCIES
        </motion.p>
      </section>

      {/* Craft items — data packet style */}
      <section className="relative z-[2] px-8 pb-32">
        <div className="max-w-5xl mx-auto">
          {V2_CRAFT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
              <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group cursor-pointer">
                {/* Thumbnail */}
                <div className="md:col-span-2">
                  <div className="overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ filter: "grayscale(0.7) contrast(1.1)" }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="md:col-span-1">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>
                    PKT_{item.id.replace("c-", "")}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <span
                    className="group-hover:text-[#E2B93B] transition-colors duration-300"
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                    [{item.category.toUpperCase()}]
                  </span>
                </div>

                {/* Description */}
                <div className="md:col-span-3">
                  <p
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.75rem",
                      lineHeight: 1.5,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
        </div>
      </section>

      {/* Footer */}
      <div
        className="relative z-[2] py-8 px-8 flex justify-between"
        style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}
      >
        <span>&copy; 2025 DERONDSGNR</span>
        <span>END_BROADCAST</span>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function SignalAboutPage() {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGridBg />
      <SignalScanOverlay />

      {/* System readout header */}
      <section className="relative z-[2] pt-32 pb-24 px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
            &gt; OPERATOR_PROFILE.READ()
          </span>
        </motion.div>
        <motion.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.3, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="block mt-8"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(4rem, 14vw, 14rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#f0f0f0",
          }}
        >
          DERON
        </motion.span>
        <motion.div
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ delay: 0.6, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="mt-4"
        >
          <span style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.5em", color: "#E2B93B", textTransform: "uppercase" }}>
            PRODUCT_DESIGNER // BUILDER
          </span>
        </motion.div>
      </section>

      {/* System data — terminal-style */}
      <section className="relative z-[2] px-8 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left — terminal bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ borderLeft: "1px solid rgba(226,185,59,0.2)", paddingLeft: "2rem" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em" }}>
              // BIOGRAPHY
            </span>
            {V2_ABOUT.bio.map((p, i) => (
              <p
                key={i}
                className={i > 0 ? "mt-6" : "mt-4"}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {p}
              </p>
            ))}
          </motion.div>

          {/* Right — system stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Coordinates */}
            <div className="mb-10" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", lineHeight: 2 }}>
              <p>LOCATION: {V2_ABOUT.location.toUpperCase()}</p>
              <p>LAT: {V2_ABOUT.coordinates.lat}</p>
              <p>LNG: {V2_ABOUT.coordinates.lng}</p>
              <p>STATUS: {V2_ABOUT.currently.toUpperCase()}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {V2_ABOUT.stats.map((stat) => (
                <div key={stat.label}>
                  <span
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      lineHeight: 1,
                      color: "#E2B93B",
                      display: "block",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="block mt-1"
                    style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="mb-10">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>
                &gt; TOOLS_STACK
              </span>
              <div className="flex flex-wrap gap-2 mt-3">
                {V2_ABOUT.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "4px 10px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <ToolBadge tool={tool} size={14} showLabel />
                  </span>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>
                &gt; CHANNELS
              </span>
              <div className="mt-3 space-y-2">
                {V2_ABOUT.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <span
                      className="group-hover:text-[#E2B93B] transition-colors duration-300"
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {s.label.toUpperCase()}
                    </span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(226,185,59,0.5)" }}
                    >
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-[2] py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
            &gt; CORE_VALUES
          </span>
          <div className="mt-8">
            {V2_ABOUT.values.map((v, i) => (
              <motion.div
                key={v.word}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="py-6 flex items-center gap-8">
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.15)", width: 30 }}>
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "clamp(1rem, 2vw, 1.5rem)",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      width: 120,
                    }}
                  >
                    {v.word}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {v.desc}
                  </span>
                </div>
              </motion.div>
            ))}
            <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="relative z-[2] py-8 px-8 flex justify-between"
        style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}
      >
        <span>&copy; 2025 DERONDSGNR</span>
        <span>END_PROFILE</span>
      </div>
    </main>
  );
}
