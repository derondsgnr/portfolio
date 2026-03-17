"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrambleText, CHARS } from "../shared/scramble-text";

export interface SynthesisHeroProps {
  name?: string;
  tagline?: string;
  philosophy?: string;
}

export function SynthesisHeroSection({
  name = "DERON",
  tagline = "PRODUCT_DESIGNER // BUILDER",
  philosophy = "Your product will be judged on how it looks before anyone uses it.",
}: SynthesisHeroProps) {
  const [decoded, setDecoded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scanY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setTimeout(() => setDecoded(true), 800);
  }, []);

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-end overflow-hidden pb-16 px-8">
      <motion.div
        className="absolute left-0 right-0 h-px z-10"
        style={{ top: scanY, background: "rgba(226,185,59,0.3)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: 0.02 }}
      >
        {Array.from({ length: 15 }).map((_, row) => (
          <div key={row} className="whitespace-nowrap" style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 2 }}>
            {Array.from({ length: 80 }).map((_, col) => (
              <span key={col}>{CHARS[Math.floor(Math.random() * CHARS.length)]}</span>
            ))}
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-32 left-8"
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          lineHeight: 2,
        }}
      >
        <p>SIG_001</p>
        <p>06&deg;31&apos;28.0&quot;N</p>
        <p>003&deg;22&apos;45.0&quot;E</p>
        <p>2025.03.16</p>
      </motion.div>
      <div className="relative z-10">
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
            mass: 3,
            delay: 0.3,
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(6rem, 20vw, 22rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            {decoded ? (
              <ScrambleText text={name} speed={40} />
            ) : (
              Array(name.length || 5)
                .fill(0)
                .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
                .join("")
            )}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 1, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="mt-4 flex items-center gap-6"
        >
          <div style={{ width: 80, height: 3, background: "#E2B93B" }} />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.3em",
              color: "#E2B93B",
              textTransform: "uppercase",
            }}
          >
            {tagline}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-12 max-w-lg"
        >
          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
              lineHeight: 1.8,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {philosophy}
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1 origin-left"
        style={{ background: "#E2B93B" }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 right-8"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.1em",
          textAlign: "right",
        }}
      >
        <p>SIGNAL: ACTIVE</p>
        <p>SCROLL TO RECEIVE</p>
      </motion.div>
    </section>
  );
}
