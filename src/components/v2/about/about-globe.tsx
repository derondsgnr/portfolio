"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";

/* Interactive dot-globe (cobe). Abuja origin + emerging-market markers; drag to
   spin. Labels are always mounted and just fade via opacity — no mount/unmount,
   so nothing can fight React's reconciler. createGlobe is guarded; if WebGL
   isn't available it simply renders the static dotted sphere fallback. */

// cobe exposes onRender at runtime but omits it from its types.
type GlobeOptions = COBEOptions & { onRender: (state: Record<string, number>) => void };

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
  { text: "Transport", pos: { top: "6%", left: "0%" } as React.CSSProperties },
  { text: "Fleet management", pos: { top: "26%", right: "-2%" } as React.CSSProperties },
  { text: "AI for the underserved", pos: { bottom: "20%", left: "-2%" } as React.CSSProperties },
  { text: "Built from Abuja", pos: { bottom: "2%", right: "2%" } as React.CSSProperties },
];

export function AboutGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerStartR = useRef(0);
  const rRef = useRef(0);
  const [active, setActive] = useState(0);

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
      markerColor: [0.886, 0.725, 0.231], // #ECFF95
      glowColor: [0.12, 0.1, 0.06],
      markers: MARKERS,
      onRender: (state) => {
        if (pointerInteracting.current === null) phi += 0.004;
        state.phi = phi + rRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    let globe: { destroy: () => void } | null = null;
    try {
      globe = createGlobe(canvas, options);
      requestAnimationFrame(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    } catch {
      // WebGL unavailable — leave the canvas blank; the section still reads fine.
    }

    return () => {
      try {
        globe?.destroy();
      } catch {
        /* noop */
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 440, margin: "0 auto" }}>
      {/* Always-mounted labels — only opacity changes. */}
      {SIGNALS.map((s, i) => (
        <div
          key={s.text}
          aria-hidden={active !== i}
          style={{
            position: "absolute",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: 7,
            opacity: active === i ? 1 : 0,
            transform: active === i ? "scale(1)" : "scale(0.94)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: "none",
            ...s.pos,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ECFF95", boxShadow: "0 0 8px #ECFF95" }} />
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
        </div>
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
