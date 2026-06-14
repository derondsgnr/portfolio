"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* Cover-flow deck of films — drag, click a side cover, or use the arrows to
   flip through. The centre cover is "now playing"; its note reads below.
   Posters carry a duotone treatment so they read as one cohesive set;
   placeholders stand in until real covers are uploaded. */

export type FilmShow = { title: string; why: string; cover?: string };

function PosterFace({ show, active }: { show: FilmShow; active: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 10,
        overflow: "hidden",
        background: "#161616",
        border: active ? "1px solid rgba(226,185,59,0.5)" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: active ? "0 24px 60px rgba(0,0,0,0.55)" : "0 12px 30px rgba(0,0,0,0.4)",
      }}
    >
      {show.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={show.cover}
          alt={show.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: active ? "grayscale(0.1) contrast(1.03)" : "grayscale(0.5) brightness(0.7)",
            transition: "filter 0.4s",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 14,
            background: "radial-gradient(120% 80% at 50% 0%, rgba(226,185,59,0.12), transparent 60%), #141414",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.1,
              color: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
            }}
          >
            {show.title}
          </span>
        </div>
      )}
    </div>
  );
}

export function FilmDeck({ shows }: { shows: FilmShow[] }) {
  const [index, setIndex] = useState(0);
  const count = shows.length;
  const wrap = (i: number) => ((i % count) + count) % count;
  const go = (dir: number) => setIndex((i) => wrap(i + dir));
  const active = shows[index];

  return (
    <div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) go(1);
          else if (info.offset.x > 50) go(-1);
        }}
        style={{
          position: "relative",
          height: 280,
          perspective: 1200,
          cursor: "grab",
          touchAction: "pan-y",
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {shows.map((s, i) => {
          let offset = i - index;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const abs = Math.abs(offset);
          const visible = abs <= 2;
          return (
            <motion.button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={s.title}
              animate={{
                x: offset * 116,
                rotateY: offset * -22,
                scale: offset === 0 ? 1 : 0.82,
                opacity: visible ? (offset === 0 ? 1 : 0.5) : 0,
                zIndex: 20 - abs,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              style={{
                position: "absolute",
                left: "50%",
                top: 4,
                width: 184,
                height: 272,
                marginLeft: -92,
                background: "none",
                border: "none",
                padding: 0,
                transformStyle: "preserve-3d",
                pointerEvents: visible ? "auto" : "none",
                cursor: offset === 0 ? "default" : "pointer",
              }}
            >
              <div style={{ width: "100%", height: "100%", aspectRatio: "2 / 3" }}>
                <PosterFace show={s} active={offset === 0} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active note + controls */}
      <div className="flex items-end justify-between" style={{ marginTop: 18, gap: 20 }}>
        <div style={{ minHeight: 64, flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#F0F0F0",
                  marginBottom: 4,
                }}
              >
                {active.title}
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "13.5px",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "44ch",
                }}
              >
                {active.why}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? "Previous" : "Next"}
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                background: "none",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "monospace",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E2B93B";
                e.currentTarget.style.borderColor = "rgba(226,185,59,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              }}
            >
              {d < 0 ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
