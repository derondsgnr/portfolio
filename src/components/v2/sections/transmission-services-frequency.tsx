"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ScrambleText, useScrambleText } from "../shared/scramble-text";

/* ═══════════════════════════════════════════════════════════════
   SERVICES — Variant A · Frequency Channels
   Services as broadcast channels. Frequencies scramble in on scroll.
   Hovering / focusing a row "tunes in": gold sweep, signal bars,
   and the description decodes via the ScrambleText hook.
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS = [
  { freq: "104.2", name: "Product Design", scope: "End-to-end product thinking — research through shipped pixels. Solo or embedded in your team." },
  { freq: "088.7", name: "Design Systems", scope: "Component libraries and tokens that keep a team aligned instead of redrawing the same button." },
  { freq: "121.5", name: "Build & Ship", scope: "Hands-on in the codebase — prototype to production with React/Next. Validation, not theatre." },
  { freq: "097.3", name: "Brand Identity", scope: "Visual language, type systems, and the through-line that makes a product feel like one thing." },
  { freq: "101.1", name: "AI Product Design", scope: "Human-first interfaces for AI products. Building Dara taught me where the trust actually breaks." },
  { freq: "113.9", name: "Interactive Prototypes", scope: "High-fidelity, clickable demos that carry the vision further than any deck ever will." },
];

function SignalBars({ active }: { active: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 11 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          animate={
            active
              ? { height: [3, 11, 5, 9, 4][i % 5] }
              : { height: 3 }
          }
          transition={{
            duration: 0.6,
            repeat: active ? Infinity : 0,
            repeatType: "reverse",
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          style={{ width: 2, background: active ? "#E2B93B" : "rgba(255,255,255,0.25)" }}
        />
      ))}
    </span>
  );
}

function ChannelRow({
  channel,
  index,
  inView,
}: {
  channel: (typeof CHANNELS)[number];
  index: number;
  inView: boolean;
}) {
  const [active, setActive] = useState(false);
  const decoded = useScrambleText(channel.scope, active, 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      data-cursor-label="TUNE IN"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 0",
        outline: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "34px 64px 1fr auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: active ? "#E2B93B" : "rgba(255,255,255,0.3)",
            transition: "color 0.25s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.42)",
          }}
        >
          ·<ScrambleText text={channel.freq} speed={28} />
        </span>

        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.15rem, 2.6vw, 1.7rem)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            color: active ? "#F0F0F0" : "rgba(255,255,255,0.72)",
            transition: "color 0.25s",
          }}
        >
          {channel.name}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SignalBars active={active} />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: active ? "#E2B93B" : "rgba(255,255,255,0.3)",
              transition: "color 0.25s",
              whiteSpace: "nowrap",
            }}
          >
            {active ? "▸ Live" : "Tune in"}
          </span>
        </span>
      </div>

      {/* Decoded scope — reveals on tune-in */}
      <motion.div
        initial={false}
        animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ overflow: "hidden" }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "12.5px",
            lineHeight: 1.7,
            letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.55)",
            paddingTop: 14,
            paddingLeft: 48,
            maxWidth: "62ch",
          }}
        >
          {decoded}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function TransmissionServicesFrequency() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Services
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Transmitting on {CHANNELS.length} channels
        </span>
      </div>

      <div>
        {CHANNELS.map((channel, i) => (
          <ChannelRow key={channel.name} channel={channel} index={i} inView={inView} />
        ))}
      </div>
    </motion.section>
  );
}
