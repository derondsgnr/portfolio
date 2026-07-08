"use client";

import { useEffect, useState } from "react";

/* A little CRT "GAME SELECT" console. The selector blinks down the games I was
   raised on; the footer pulses the running joke (PS5: applications open).
   Pure CSS — scanlines, vignette, gold phosphor glow. */

export function GameConsole({ games }: { games: string[] }) {
  const [sel, setSel] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSel((i) => (i + 1) % games.length), 1300);
    return () => clearInterval(t);
  }, [games.length]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        padding: 14,
        background: "linear-gradient(160deg, #1D1E24, #16171B)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Screen */}
      <div
        style={{
          position: "relative",
          borderRadius: 10,
          overflow: "hidden",
          padding: "20px 20px 18px",
          minHeight: 220,
          background: "radial-gradient(120% 120% at 50% 0%, rgba(236, 255, 149,0.08), transparent 55%), #080808",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(236, 255, 149,0.12)",
        }}
      >
        {/* scanlines */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0px, rgba(0,0,0,0.32) 1px, transparent 1px, transparent 3px)",
            mixBlendMode: "multiply",
          }}
        />
        {/* header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.22em", color: "#ECFF95" }}>
            GAME SELECT
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ECFF95", boxShadow: "0 0 8px #ECFF95", opacity: blink ? 1 : 0.3 }} />
            <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}>PWR</span>
          </span>
        </div>

        {/* game list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          {games.map((g, i) => {
            const on = i === sel;
            return (
              <li
                key={g}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "monospace",
                  fontSize: "12.5px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: on ? "#F0F0F0" : "rgba(255,255,255,0.28)",
                  transition: "color 0.2s",
                }}
              >
                <span style={{ color: "#ECFF95", width: 12, opacity: on ? 1 : 0 }}>▸</span>
                {g}
              </li>
            );
          })}
        </ul>

        {/* footer joke */}
        <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: blink ? "#ECFF95" : "rgba(236, 255, 149,0.4)",
              transition: "color 0.2s",
            }}
          >
            ▸ Insert PS5 — applications open
          </span>
        </div>
      </div>

      {/* knobs */}
      <div className="flex items-center" style={{ gap: 8, marginTop: 12, paddingLeft: 4 }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#222", border: "1px solid rgba(255,255,255,0.08)" }} />
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#222", border: "1px solid rgba(255,255,255,0.08)" }} />
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
          DERON—64
        </span>
      </div>
    </div>
  );
}
