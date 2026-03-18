"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT, V2_SERVICES_DETAILED } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   CIPHER PAGES — Encoded, then decoded. Hidden becomes visible.
   Text scrambles and resolves. Matrix decode aesthetic.
   ═══════════════════════════════════════════════════════════════ */

"use client";

import { ScrambleText, CHARS } from "../shared/scramble-text";
import { CipherBg } from "../shared/texture-layers";
import { ToolBadge } from "@/components/tool-badge";

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function CipherWorkPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <CipherBg opacity={0.025} />

      {/* Header */}
      <section className="relative z-[2] pt-32 pb-16 px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
            [PROJECTS.DECRYPT()]
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 16vw, 16rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            <ScrambleText text="WORK" speed={40} />
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6"
        >
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(226,185,59,0.3)" }}>
            [{V2_PROJECTS.length} PROJECTS FOUND — STATUS: DECRYPTED]
          </span>
        </motion.div>
      </section>

      {/* Projects — decode on scroll */}
      <section className="relative z-[2] px-8 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.03)" }}>
          {V2_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative group cursor-pointer bg-[#0A0A0A]"
              style={{ aspectRatio: "4/3" }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: hoveredId === project.id ? "grayscale(0) contrast(1.1)" : "grayscale(1) contrast(0.7) brightness(0.4)" }}
              />
              <div
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: hoveredId === project.id ? 0 : 0.6,
                  background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(10,10,10,0.5) 2px, rgba(10,10,10,0.5) 4px)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>[{project.id}]</span>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{project.year}</span>
                </div>
                <div>
                  <span className="transition-colors duration-300" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: hoveredId === project.id ? "#E2B93B" : "rgba(255,255,255,0.7)", display: "block" }}>
                    {project.title}
                  </span>
                  <span className="block mt-2" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                    {project.category}
                  </span>
                  <p className="mt-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="relative z-[2] py-8 px-8 flex justify-between" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}>
        <span>&copy; 2025 DERONDSGNR</span>
        <span>[END_ARCHIVE]</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function CipherCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <CipherBg opacity={0.025} />

      <section className="relative z-[2] pt-32 pb-16 px-8">
        <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
          [EXPERIMENTS.DECRYPT()]
        </span>
        <span className="block mt-8" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 16vw, 16rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0" }}>
          <ScrambleText text="CRAFT" speed={40} />
        </span>
        <p className="mt-6" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>
          DECODING EXPERIMENTAL FRAGMENTS...
        </p>
      </section>

      <section className="relative z-[2] px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          {V2_CRAFT_ITEMS.map((item, i) => (
            <div key={item.id}>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group cursor-pointer"
              >
                <div className="md:col-span-2 overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:grayscale-0"
                    style={{ filter: "grayscale(1) brightness(0.5)" }}
                  />
                </div>
                <div className="md:col-span-1">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B" }}>[{item.id.replace("c-", "")}]</span>
                </div>
                <div className="md:col-span-4">
                  <ScrambleText
                    text={item.title}
                    speed={20}
                    style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>[{item.category.toUpperCase()}]</span>
                </div>
                <div className="md:col-span-3">
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
          <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
        </div>
      </section>

      <div className="relative z-[2] py-8 px-8 flex justify-between" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}>
        <span>&copy; 2025 DERONDSGNR</span>
        <span>[END_EXPERIMENTS]</span>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function CipherAboutPage() {
  const [decoded, setDecoded] = useState(false);
  useEffect(() => { setTimeout(() => setDecoded(true), 500); }, []);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <CipherBg opacity={0.025} />

      {/* Hero */}
      <section className="relative z-[2] h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 16vw, 16rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            {decoded ? <ScrambleText text="DERON" speed={40} /> : Array(5).fill(0).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")}
          </span>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="mt-8">
            <span style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              <ScrambleText text="PRODUCT DESIGNER & BUILDER" speed={25} style={{ color: "#E2B93B" }} />
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }} className="mt-6">
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(226,185,59,0.3)" }}>
              [PROFILE: DECRYPTED]
            </span>
          </motion.div>
        </div>
      </section>

      {/* Bio — decodes on scroll */}
      <section className="relative z-[2] py-32 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
              [BIO.DECRYPT()]
            </span>
            {V2_ABOUT.bio.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className={i > 0 ? "mt-6" : "mt-4"}
                style={{ borderLeft: "1px solid rgba(226,185,59,0.15)", paddingLeft: "1.5rem" }}
              >
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.8, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
                  <ScrambleText text={p} speed={3} />
                </p>
              </motion.div>
            ))}
          </div>

          <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {V2_ABOUT.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <ScrambleText
                    text={stat.value}
                    speed={50}
                    style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1, color: "#E2B93B", display: "block" }}
                  />
                  <span className="block mt-2" style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
                    [{stat.label}]
                  </span>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="mb-12">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>[TOOLS.LIST()]</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {V2_ABOUT.tools.map((tool) => (
                  <span key={tool} className="inline-flex items-center gap-1.5" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 10px" }}>
                    <ToolBadge tool={tool} size={14} showLabel />
                  </span>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div>
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>[CHANNELS.DECRYPT()]</span>
              <div className="mt-3 space-y-3">
                {V2_ABOUT.socials.map((s) => (
                  <a key={s.label} href={s.url} className="flex items-center gap-3 group cursor-pointer">
                    <span className="group-hover:text-[#E2B93B] transition-colors duration-300" style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                      {s.label.toUpperCase()}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(226,185,59,0.5)" }}>
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — cipher decode */}
      <section className="relative z-[2] py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>[VALUES.DECRYPT()]</span>
          <div className="mt-8">
            {V2_ABOUT.values.map((v, i) => (
              <motion.div key={v.word} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.15)", width: 30 }}>{String(i).padStart(2, "0")}</span>
                    <ScrambleText
                      text={v.word}
                      speed={30}
                      style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: i === 1 ? "#E2B93B" : "rgba(255,255,255,0.6)" }}
                    />
                  </div>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(255,255,255,0.2)", maxWidth: "300px", textAlign: "right" }}>
                    {v.desc}
                  </span>
                </div>
              </motion.div>
            ))}
            <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
          </div>
        </div>
      </section>

      <div className="relative z-[2] py-8 px-8 flex justify-between" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}>
        <span>&copy; 2025 DERONDSGNR</span>
        <span>[END_OF_PROFILE]</span>
      </div>
    </main>
  );
}
