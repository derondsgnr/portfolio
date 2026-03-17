"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

export const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";

export function useScrambleText(text: string, trigger: boolean, speed = 30) {
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
      if (iteration > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return display;
}

export function ScrambleText({
  text,
  className,
  style,
  speed = 30,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const display = useScrambleText(text, inView, speed);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
