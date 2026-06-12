"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";

/* ═══════════════════════════════════════════════════════════════
   SERVICES — Variant B · Editorial Index
   Contents-page split. Muted Anton list on the left; one detail
   panel on the right that swaps as you hover / focus an entry —
   the name scrambles in, with a "what you get" mono list + scope.
   ═══════════════════════════════════════════════════════════════ */

const SERVICES = [
  {
    name: "Product Design",
    gives: ["Research → shipped pixels", "Flows, IA, journeys", "High-fidelity surface"],
    scope: "End-to-end, solo or embedded in your team.",
  },
  {
    name: "Design Systems",
    gives: ["Component library", "Design tokens", "Usage docs"],
    scope: "So the team stops redrawing the same button.",
  },
  {
    name: "Build & Ship",
    gives: ["React / Next implementation", "Prototype → production", "QA mindset"],
    scope: "Hands-on in the codebase. Validation, not theatre.",
  },
  {
    name: "Brand Identity",
    gives: ["Visual language", "Type system", "Brand through-line"],
    scope: "Makes the product feel like one coherent thing.",
  },
  {
    name: "AI Product Design",
    gives: ["Human-first AI UX", "Trust & confidence states", "Model-in-the-loop flows"],
    scope: "Building Dara taught me where trust actually breaks.",
  },
  {
    name: "Interactive Prototypes",
    gives: ["Clickable demos", "Real interactions", "Vision you can feel"],
    scope: "Carries further than any deck.",
  },
];

export function TransmissionServicesIndex() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const [active, setActive] = useState(0);
  const current = SERVICES[active];

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          display: "block",
          marginBottom: 36,
        }}
      >
        Services / Index
      </span>

      <div
        style={{ display: "grid", gap: 0 }}
        className="grid-cols-1 md:grid-cols-[1fr_1.05fr]"
      >
        {/* Left — the index */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <motion.button
                key={s.name}
                type="button"
                onHoverStart={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                data-cursor-label="OPEN"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                  textAlign: "left",
                  padding: "18px 0",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: on ? "#E2B93B" : "rgba(255,255,255,0.28)",
                    transition: "color 0.25s",
                    width: 22,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.3rem, 3vw, 2rem)",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1.04,
                    color: on ? "#F0F0F0" : "rgba(255,255,255,0.32)",
                    transition: "color 0.25s",
                  }}
                >
                  {s.name}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ opacity: on ? 1 : 0, x: on ? 0 : -6 }}
                  transition={{ duration: 0.25 }}
                  style={{ marginLeft: "auto", color: "#E2B93B", fontSize: "12px" }}
                >
                  ◂
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Right — the detail panel */}
        <div
          className="md:pl-12 md:border-l"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            paddingTop: 28,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h3
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  lineHeight: 0.98,
                  color: "#F0F0F0",
                  marginBottom: 24,
                }}
              >
                <ScrambleText text={current.name} speed={18} />
              </h3>

              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#E2B93B",
                  display: "block",
                  marginBottom: 14,
                }}
              >
                What you get
              </span>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {current.gives.map((g) => (
                  <li
                    key={g}
                    style={{
                      fontFamily: "'Instrument Sans', sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.72)",
                      display: "flex",
                      gap: 12,
                      padding: "5px 0",
                    }}
                  >
                    <span style={{ color: "rgba(226,185,59,0.7)", fontFamily: "monospace", fontSize: "12px" }}>
                      →
                    </span>
                    {g}
                  </li>
                ))}
              </ul>

              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  letterSpacing: "0.02em",
                  color: "rgba(255,255,255,0.45)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 16,
                  maxWidth: "46ch",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)" }}>SCOPE — </span>
                {current.scope}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
