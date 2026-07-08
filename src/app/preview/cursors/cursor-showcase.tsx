"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Cursor 1: Current — Gold Dot + Ring ───────────────────────────────────
function CursorDotRing() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement).closest("a,button,[data-cursor]") as HTMLElement | null;
      setHovered(!!el);
      setLabel(el?.dataset.cursorLabel ?? "");
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: "spring", stiffness: 600, damping: 32, mass: 0.2 }}
        style={{ width: 8, height: 8, borderRadius: "50%", background: "#ECFF95" }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{ x: pos.x - (hovered ? 22 : 16), y: pos.y - (hovered ? 22 : 16), width: hovered ? 44 : 32, height: hovered ? 44 : 32, opacity: hovered ? 0.6 : 0.22 }}
        transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.6 }}
        style={{ borderRadius: "50%", border: "1px solid #ECFF95" }} />
      <AnimatePresence>
        {label && (
          <motion.div key={label} className="fixed top-0 left-0 pointer-events-none z-[9999]"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{ transform: `translate(${pos.x + 18}px, ${pos.y - 14}px)`, fontFamily: "monospace", fontSize: "7px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#ECFF95", background: "rgba(18, 19, 22,0.92)", padding: "3px 7px", border: "1px solid rgba(236, 255, 149,0.28)", whiteSpace: "nowrap" }}>
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Cursor 2: Crosshair Reticle ───────────────────────────────────────────
function CursorCrosshair() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      setHovered(!!el);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  const arm = hovered ? 6 : 14;
  const gap = hovered ? 5 : 3;
  return (
    <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.3 }}
      style={{ position: "fixed" }}>
      <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "#ECFF95", transform: "translate(-1.5px,-1.5px)" }} />
      {[
        { top: -(arm + gap), left: -0.5, w: 1, h: arm },
        { top: gap, left: -0.5, w: 1, h: arm },
        { top: -0.5, left: -(arm + gap), w: arm, h: 1 },
        { top: -0.5, left: gap, w: arm, h: 1 },
      ].map((s, i) => (
        <motion.div key={i} animate={{ width: s.w, height: s.h, top: s.top, left: s.left }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{ position: "absolute", background: "#ECFF95", opacity: 0.85 }} />
      ))}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            style={{ position: "absolute", width: 24, height: 24, top: -12, left: -12, border: "1px solid rgba(236, 255, 149,0.5)", borderRadius: 2 }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Cursor 3: Ghost Trail ─────────────────────────────────────────────────
function CursorGhostTrail() {
  const TRAIL = 7;
  const positions = useRef(Array(TRAIL).fill({ x: -200, y: -200 }));
  const [dots, setDots] = useState(Array(TRAIL).fill({ x: -200, y: -200 }));
  useEffect(() => {
    let frame: number;
    const onMove = (e: MouseEvent) => {
      positions.current = [{ x: e.clientX, y: e.clientY }, ...positions.current.slice(0, TRAIL - 1)];
    };
    const tick = () => { setDots([...positions.current]); frame = requestAnimationFrame(tick); };
    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frame); };
  }, []);
  return (
    <>
      {dots.map((p, i) => {
        const size = Math.max(2, 10 - i * 1.1);
        const opacity = (1 - i / TRAIL) * (i === 0 ? 1 : 0.55);
        return (
          <div key={i} className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ width: size, height: size, borderRadius: "50%", background: i === 0 ? "#ECFF95" : "rgba(236, 255, 149,0.7)", opacity, transform: `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`, transition: i === 0 ? "none" : `transform ${i * 0.03}s linear` }} />
        );
      })}
    </>
  );
}

// ── Cursor 4: Magnetic Blob ───────────────────────────────────────────────
function CursorMagneticBlob() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [trail, setTrail] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const lastPos = useRef({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const stretch = Math.min(1 + speed * 0.04, 2.2);
      const angle = Math.atan2(dy, dx);
      setScale({ x: Math.cos(angle) !== 0 ? stretch : 1 / stretch, y: Math.sin(angle) !== 0 ? stretch : 1 / stretch });
      setPos({ x: e.clientX, y: e.clientY });
      lastPos.current = { x: e.clientX, y: e.clientY };
      const el = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      setHovered(!!el);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useEffect(() => {
    let id: number;
    const lerp = () => {
      setTrail(prev => ({ x: prev.x + (pos.x - prev.x) * 0.12, y: prev.y + (pos.y - prev.y) * 0.12 }));
      id = requestAnimationFrame(lerp);
    };
    id = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(id);
  }, [pos]);
  return (
    <>
      <div className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#ECFF95", transform: `translate(${pos.x - 3}px, ${pos.y - 3}px)` }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{ scaleX: hovered ? 1.8 : scale.x, scaleY: hovered ? 1.8 : scale.y, opacity: hovered ? 0.18 : 0.25 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ width: hovered ? 44 : 28, height: hovered ? 44 : 28, borderRadius: "50%", background: "rgba(236, 255, 149,0.35)", border: "1px solid rgba(236, 255, 149,0.5)", transform: `translate(${trail.x - (hovered ? 22 : 14)}px, ${trail.y - (hovered ? 22 : 14)}px)` }} />
    </>
  );
}

// ── Cursor 5: Glitch ──────────────────────────────────────────────────────
function CursorGlitch() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [glitching, setGlitching] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      setHovered(!!el);
    };
    window.addEventListener("mousemove", onMove);
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 80 + Math.random() * 120);
      }
    }, 1800);
    return () => { window.removeEventListener("mousemove", onMove); clearInterval(glitchInterval); };
  }, []);
  const offset1 = glitching ? (Math.random() * 6 - 3) : 0;
  const offset2 = glitching ? (Math.random() * 6 - 3) : 0;
  return (
    <>
      <div className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ width: hovered ? 12 : 8, height: hovered ? 12 : 8, borderRadius: "50%", background: "rgba(255,50,50,0.7)", transform: `translate(${pos.x - 4 + offset1}px, ${pos.y - 4}px)`, transition: "width 0.15s, height 0.15s", mixBlendMode: "screen", opacity: glitching ? 0.9 : 0 }} />
      <div className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ width: hovered ? 12 : 8, height: hovered ? 12 : 8, borderRadius: "50%", background: "rgba(50,200,255,0.7)", transform: `translate(${pos.x - 4 + offset2}px, ${pos.y - 4}px)`, transition: "width 0.15s, height 0.15s", mixBlendMode: "screen", opacity: glitching ? 0.9 : 0 }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ x: pos.x - (hovered ? 6 : 4), y: pos.y - (hovered ? 6 : 4), width: hovered ? 12 : 8, height: hovered ? 12 : 8 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{ borderRadius: "50%", background: "#ECFF95" }} />
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{ x: pos.x - (hovered ? 20 : 14), y: pos.y - (hovered ? 20 : 14), width: hovered ? 40 : 28, height: hovered ? 40 : 28, opacity: hovered ? 0.5 : 0.18, borderColor: glitching ? "rgba(50,200,255,0.8)" : "#ECFF95" }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
        style={{ borderRadius: "50%", border: "1px solid #ECFF95" }} />
    </>
  );
}

// ── Showcase Page ─────────────────────────────────────────────────────────
const CURSORS = [
  { id: "dot-ring", label: "Dot + Ring", desc: "Gold dot + lagging halo, label on hover", Component: CursorDotRing },
  { id: "crosshair", label: "Crosshair", desc: "Reticle arms retract to bracket on hover", Component: CursorCrosshair },
  { id: "trail", label: "Ghost Trail", desc: "Comet tail of fading dots", Component: CursorGhostTrail },
  { id: "blob", label: "Magnetic Blob", desc: "Stretches with velocity, swells on hover", Component: CursorMagneticBlob },
  { id: "glitch", label: "Glitch", desc: "Random RGB split bursts, ring on hover", Component: CursorGlitch },
];

export function CursorShowcase() {
  const [active, setActive] = useState("dot-ring");
  const ActiveCursor = CURSORS.find(c => c.id === active)!.Component;

  return (
    <div style={{ background: "#121316", minHeight: "100vh", cursor: "none" }}>
      <style>{`* { cursor: none !important; }`}</style>
      <ActiveCursor />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 40px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 8 }}>
          CURSOR PREVIEW
        </p>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: "#F0F0F0", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 48 }}>
          PICK YOUR CURSOR
        </h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 64 }}>
          {CURSORS.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} data-cursor="true"
              style={{ padding: "10px 20px", border: `1px solid ${active === c.id ? "#ECFF95" : "rgba(255,255,255,0.1)"}`, background: active === c.id ? "rgba(236, 255, 149,0.08)" : "transparent", color: active === c.id ? "#ECFF95" : "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.2s" }}>
              {c.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginBottom: 56 }}>
            {CURSORS.find(c => c.id === active)?.desc}
          </motion.p>
        </AnimatePresence>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 48 }}>
          <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 32 }}>
            HOVER THESE TO TEST INTERACTIONS
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
            {["View project", "Read case study", "Book a call", "See all work"].map(label => (
              <button key={label} data-cursor="true" data-cursor-label={label.toUpperCase().split(" ")[0]}
                style={{ padding: "14px 28px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.6)", fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ECFF95"; e.currentTarget.style.color = "#F0F0F0"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                {label}
              </button>
            ))}
          </div>

          <div data-cursor="true" data-cursor-label="OPEN"
            style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "32px", background: "#111", marginBottom: 24 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(236, 255, 149,0.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.16em", color: "#ECFF95", textTransform: "uppercase", marginBottom: 8 }}>PRODUCT DESIGN</p>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, color: "#F0F0F0", textTransform: "uppercase", letterSpacing: "0.04em" }}>SAMPLE PROJECT CARD</p>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Hover this card — it counts as an interactive element.</p>
          </div>

          <a href="#" data-cursor-label="LINK"
            style={{ fontFamily: "monospace", fontSize: 11, color: "#ECFF95", letterSpacing: "0.14em", textTransform: "uppercase", borderBottom: "1px solid rgba(236, 255, 149,0.3)", paddingBottom: 2 }}
            onClick={e => e.preventDefault()}>
            Sample link — hover me
          </a>
        </div>

        <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 80 }}>
          Tell me which one you want and I&apos;ll swap it in.
        </p>
      </div>
    </div>
  );
}
