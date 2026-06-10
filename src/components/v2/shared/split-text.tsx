"use client";

import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useMemo,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// Runs synchronously after DOM commit, before paint on the client.
// Falls back to useEffect during SSR (no-op there since hooks don't run on server).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const LINE_STAGGER = 0.12;
const LINE_DURATION = 0.82;
const INITIAL_COLOR = "#5a5a5a";
const FINAL_COLOR = "#F0F0F0";

// ─── SplitText ────────────────────────────────────────────────────────────────
// Line-by-line heading reveal. Each line clips up (overflow-hidden parent) from
// gray → white, staggered on scroll. HTML values render plainly. Respects
// prefers-reduced-motion.

export interface SplitTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  style?: React.CSSProperties;
  /** Additional delay before the first line (seconds). */
  delay?: number;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
}

export function SplitText({
  text,
  as: Tag = "h2",
  className = "",
  style,
  delay = 0,
  amount = 0.35,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lines, setLines] = useState<string[] | null>(null);
  const inView = useInView(containerRef as React.RefObject<Element>, {
    once: true,
    amount,
  });
  const prefersReducedMotion = useReducedMotion();
  const isHtml = text.trimStart().startsWith("<");
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  // Reset when text changes so we remeasure for the new content.
  useEffect(() => {
    setLines(null);
    wordRefs.current = [];
  }, [text]);

  // Measure word positions synchronously before paint so the user never sees
  // the invisible measuring phase. Runs every render but exits early once done.
  useIsomorphicLayoutEffect(() => {
    if (lines !== null || isHtml) return;
    const refs = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!refs.length) return;

    const map = new Map<number, string[]>();
    refs.forEach((span, i) => {
      const top = span.offsetTop;
      if (!map.has(top)) map.set(top, []);
      map.get(top)!.push(words[i]);
    });

    if (map.size) {
      setLines([...map.values()].map((ws) => ws.join(" ")));
    }
  });

  // Plain fallback: HTML content or reduced-motion preference.
  if (prefersReducedMotion || isHtml) {
    return React.createElement(Tag, { className, style }, text);
  }

  // ── Measuring phase ──────────────────────────────────────────────────────
  // Words are laid out invisibly so we can read their Y positions.
  if (lines === null) {
    return React.createElement(
      Tag,
      { ref: containerRef, className, style },
      <span aria-hidden style={{ visibility: "hidden", display: "block" }}>
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  // ── Animated phase ───────────────────────────────────────────────────────
  // Each line is wrapped in overflow:hidden so it clips the slide-up motion.
  return React.createElement(
    Tag,
    { ref: containerRef, className, style },
    lines.map((line, i) => (
      <span key={i} style={{ display: "block", overflow: "hidden" }}>
        <motion.span
          initial={{ y: "110%", color: INITIAL_COLOR }}
          animate={
            inView
              ? { y: 0, color: FINAL_COLOR }
              : { y: "110%", color: INITIAL_COLOR }
          }
          transition={{
            duration: LINE_DURATION,
            delay: delay + i * LINE_STAGGER,
            ease: EASE,
          }}
          style={{ display: "block", willChange: "transform" }}
        >
          {line}
        </motion.span>
      </span>
    ))
  );
}

// ─── RevealText ───────────────────────────────────────────────────────────────
// Block-level scroll reveal for body copy and supporting text.
// Fades up with a subtle defocus, staggered after any preceding SplitText
// heading via the `delay` prop.

export interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Delay in seconds — typically 0.2–0.4 to follow a heading. */
  delay?: number;
  amount?: number;
}

export function RevealText({
  children,
  className = "",
  style,
  delay = 0,
  amount = 0.25,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.72, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
