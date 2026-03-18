"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "motion/react";
import { playSound } from "@/lib/sound";

export const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";

export function useScrambleText(text: string, trigger: boolean, speed = 30, onComplete?: () => void) {
  const [display, setDisplay] = useState(
    text.replace(/[^ ]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iteration) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration += 1;
      if (iteration > text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [trigger, text, speed, onComplete]);

  return display;
}

export function ScrambleText({
  text,
  className,
  style,
  speed = 30,
  onReveal,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  onReveal?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const handleComplete = useCallback(() => {
    playSound("textReveal");
    onReveal?.();
  }, [onReveal]);
  const display = useScrambleText(text, inView, speed, handleComplete);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
