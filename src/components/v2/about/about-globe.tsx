"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import createGlobe, { type COBEOptions } from "cobe";

// cobe ships an `onRender` callback at runtime (see its README) but omits it
// from COBEOptions. Re-add it locally so the render loop stays typed.
type GlobeOptions = COBEOptions & { onRender: (state: Record<string, number>) => void };

/* Interactive dot-globe (cobe). Abuja is the origin; markers spread across
   emerging markets to signal "built here, for the world." Drag to spin.
   Gold markers on a warm-dark sphere — on-DNA. Labels surface in sequence
   as it turns. */

const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [9.0765, 7.3986], size: 0.11 }, // Abuja — origin
  { location: [6.5244, 3.3792], size: 0.05 }, // Lagos
  { location: [5.6037, -0.187], size: 0.045 }, // Accra
  { location: [-1.2921, 36.8219], size: 0.045 }, // Nairobi
  { location: [-26.2041, 28.0473], size: 0.045 }, // Johannesburg
  { location: [19.076, 72.8777], size: 0.045 }, // Mumbai
  { location: [-6.2088, 106.8456], size: 0.045 }, // Jakarta
  { location: [14.5995, 120.9842], size: 0.04 }, // Manila
  { location: [-23.5505, -46.6333], size: 0.045 }, // São Paulo
  { location: [19.4326, -99.1332], size: 0.045 }, // Mexico City
];

const SIGNALS = [
  { text: "Transport", pos: { top: "8%", left: "2%" } },
  { text: "Fleet management", pos: { top: "20%", right: "0%" } },
  { text: "AI for the underserved", pos: { bottom: "16%", left: "0%" } },
  { text: "Built from Abuja", pos: { bottom: "4%", right: "4%" } },
];

export function AboutGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerStartR = useRef(0);
  const rRef = useRef(0);
  const [active, setActive] = useState(0);

  // Cycle the surfacing labels.
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SIGNALS.length), 1900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let width = 0;
    let phi = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const options: GlobeOptions = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.36, 0.34, 0.3],
      markerColor: [0.886, 0.725, 0.231], // #E2B93B
      glowColor: [0.12, 0.1, 0.06],
      markers: MARKERS,
      onRender: (state) => {
        if (pointerInteracting.current === null) phi += 0.004;
        state.phi = phi + rRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };
    const globe = createGlobe(canvas, options);

    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 460, margin: "0 auto" }}>
      {/* Surfacing labels */}
      {SIGNALS.map((s, i) => (
        <AnimatePresence key={s.text}>
          {active === i ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "absolute",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 7,
                ...s.pos,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E2B93B", boxShadow: "0 0 8px #E2B93B" }} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#F0F0F0",
                  whiteSpace: "nowrap",
                }}
              >
                {s.text}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ))}

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          pointerStartR.current = rRef.current;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
          (e.currentTarget as HTMLCanvasElement).style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            rRef.current = pointerStartR.current + delta * 0.008;
          }
        }}
        style={{
          width: "100%",
          aspectRatio: "1",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
