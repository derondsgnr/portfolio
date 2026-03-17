"use client";

import { CHARS } from "./scramble-text";

export function SignalGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

export function ScanLineOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.012) 2px, rgba(226,185,59,0.012) 4px)",
      }}
    />
  );
}

export function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.012) 2px, rgba(226,185,59,0.012) 4px)",
      }}
    />
  );
}

export function CipherAmbientGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.015 }}
    >
      {Array.from({ length: 20 }).map((_, row) => (
        <div
          key={row}
          className="whitespace-nowrap"
          style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 2 }}
        >
          {Array.from({ length: 80 }).map((_, col) => (
            <span key={col}>
              {CHARS[Math.floor(Math.random() * CHARS.length)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CipherBg({ opacity = 0.015 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity }}
    >
      {Array.from({ length: 20 }).map((_, row) => (
        <div
          key={row}
          className="whitespace-nowrap"
          style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 2 }}
        >
          {Array.from({ length: 80 }).map((_, col) => (
            <span key={col}>
              {CHARS[Math.floor(Math.random() * CHARS.length)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CipherBgLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.015 }}
    >
      {Array.from({ length: 15 }).map((_, row) => (
        <div
          key={row}
          className="whitespace-nowrap"
          style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 2 }}
        >
          {Array.from({ length: 80 }).map((_, col) => (
            <span key={col}>
              {CHARS[Math.floor(Math.random() * CHARS.length)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
