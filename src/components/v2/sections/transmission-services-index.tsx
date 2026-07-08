"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";
import { ServicesMediaMarquee } from "./services-media-marquee";
import { useIsMobile } from "@/components/ui/use-mobile";
import { DEFAULT_SERVICES, type ServiceItem } from "@/lib/content/defaults";

/* ═══════════════════════════════════════════════════════════════
   SERVICES — Variant B · Editorial Index
   Desktop: contents-page split — muted Anton list on the left, a
   detail panel on the right that swaps as you hover/focus an entry.
   Mobile: an accordion — tapping a service expands its detail + media
   crawl inline beneath the row, so nothing is off-screen.
   Detail = scramble name + "what you get" + scope + a kinetic media
   crawl pulled from existing case-study/craft uploads (set in admin).
   ═══════════════════════════════════════════════════════════════ */

function ServiceDetail({ service, showHeading = true }: { service: ServiceItem; showHeading?: boolean }) {
  const media = service.media ?? [];
  return (
    <div>
      {showHeading ? (
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
          <ScrambleText text={service.name} speed={18} />
        </h3>
      ) : null}

      <span
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#ECFF95",
          display: "block",
          marginBottom: 14,
        }}
      >
        What you get
      </span>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
        {service.gives.map((g) => (
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
            <span style={{ color: "rgba(236, 255, 149,0.7)", fontFamily: "monospace", fontSize: "12px" }}>
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
        {service.scope}
      </p>

      {media.length > 0 ? (
        <div style={{ marginTop: 28 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              display: "block",
              marginBottom: 12,
            }}
          >
            In the work
          </span>
          <ServicesMediaMarquee media={media} />
        </div>
      ) : null}
    </div>
  );
}

export function TransmissionServicesIndex({ services }: { services?: ServiceItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);

  const list = services && services.length > 0 ? services : DEFAULT_SERVICES;
  const safeActive = Math.min(active, list.length - 1);
  const current = list[safeActive];

  return (
    <motion.section
      id="services"
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", scrollMarginTop: 24 }}
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

      {isMobile ? (
        /* ── Mobile — accordion ──────────────────────────────── */
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {list.map((s, i) => {
            const on = i === safeActive;
            return (
              <div key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    width: "100%",
                    textAlign: "left",
                    padding: "18px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      color: on ? "#ECFF95" : "rgba(255,255,255,0.28)",
                      transition: "color 0.25s",
                      width: 22,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(1.3rem, 6vw, 2rem)",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      lineHeight: 1.04,
                      color: on ? "#F0F0F0" : "rgba(255,255,255,0.4)",
                      transition: "color 0.25s",
                    }}
                  >
                    {s.name}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: on ? 90 : 0, color: on ? "#ECFF95" : "rgba(255,255,255,0.3)" }}
                    transition={{ duration: 0.25 }}
                    style={{ marginLeft: "auto", fontSize: "13px", lineHeight: 1 }}
                  >
                    ›
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "2px 0 26px" }}>
                        <ServiceDetail service={s} showHeading={false} />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Desktop — split ─────────────────────────────────── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 0 }}>
          {/* Left — the index */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {list.map((s, i) => {
              const on = i === safeActive;
              return (
                <motion.button
                  key={s.id}
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
                      color: on ? "#ECFF95" : "rgba(255,255,255,0.28)",
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
                    style={{ marginLeft: "auto", color: "#ECFF95", fontSize: "12px" }}
                  >
                    ◂
                  </motion.span>
                </motion.button>
              );
            })}
          </div>

          {/* Right — the detail panel */}
          <div style={{ paddingLeft: 48, borderLeft: "1px solid rgba(255,255,255,0.06)", paddingTop: 28 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id ?? current?.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ServiceDetail service={current} showHeading />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.section>
  );
}
