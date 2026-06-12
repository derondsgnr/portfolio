"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";

/* ═══════════════════════════════════════════════════════════════
   SERVICES — Variant C · Broadcast Ticker
   A slow horizontal crawl of service names (emergency-broadcast
   energy). Hovering pauses the crawl and locks a service; a detail
   strip below decodes the scope via ScrambleText.
   ═══════════════════════════════════════════════════════════════ */

const SERVICES = [
  { name: "Product Design", scope: "End-to-end — research through shipped pixels." },
  { name: "Design Systems", scope: "Component libraries and tokens that keep a team aligned." },
  { name: "Build & Ship", scope: "Hands-on in the codebase. Prototype to production." },
  { name: "Brand Identity", scope: "Visual language and the through-line that ties it together." },
  { name: "AI Product Design", scope: "Human-first AI UX. Dara taught me where trust breaks." },
  { name: "Interactive Prototypes", scope: "Clickable demos that carry the vision past any deck." },
];

export function TransmissionServicesTicker() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Duplicate the list so the crawl loops seamlessly
  const loop = [...SERVICES, ...SERVICES];

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="py-14 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          display: "block",
          marginBottom: 28,
        }}
        className="px-6 sm:px-8 md:px-10"
      >
        Services / On air
      </span>

      {/* The crawl */}
      <div
        style={{
          position: "relative",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setActive(null);
        }}
      >
        <motion.div
          style={{ display: "flex", width: "max-content", willChange: "transform" }}
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {loop.map((s, i) => {
            const realIndex = i % SERVICES.length;
            const on = active === realIndex;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(realIndex)}
                onFocus={() => {
                  setPaused(true);
                  setActive(realIndex);
                }}
                data-cursor-label="HOLD"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "22px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    color: on ? "#E2B93B" : "rgba(255,255,255,0.55)",
                    transition: "color 0.2s",
                    whiteSpace: "nowrap",
                    paddingLeft: 28,
                  }}
                >
                  {s.name}
                </span>
                <span aria-hidden style={{ color: "#E2B93B", fontSize: "10px" }}>
                  ◦
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Detail strip */}
      <div
        className="px-6 sm:px-8 md:px-10"
        style={{ minHeight: 64, paddingTop: 20, display: "flex", alignItems: "center" }}
      >
        <AnimatePresence mode="wait">
          {active !== null ? (
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                lineHeight: 1.6,
                letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span style={{ color: "#E2B93B" }}>▸ </span>
              <ScrambleText text={SERVICES[active].scope} speed={8} />
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Hover to hold a channel
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
