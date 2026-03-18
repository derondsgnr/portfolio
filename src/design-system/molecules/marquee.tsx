"use client";

import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";

export interface MarqueeProps {
  children: React.ReactNode;
  /** Speed in seconds for one full cycle */
  duration?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * Horizontal scrolling marquee. Duplicates content for seamless loop.
 * Use with inline-flex children for horizontal layout.
 */
export function Marquee({
  children,
  duration = 20,
  className,
  contentClassName,
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className={cn("flex items-center w-max", contentClassName)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const PROCESS_WORDS = ["Discover", "Define", "Design", "Deliver"];

export function MarqueeStrip({ className }: { className?: string }) {
  const content = (
    <>
      {PROCESS_WORDS.map((w, i) => (
        <span key={`${w}-${i}`} className="flex items-center gap-8 md:gap-14">
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(226,185,59,0.12)",
            }}
          >
            {w}
          </span>
          <span
            className="text-[#e2b93b]/20 text-[1.5rem]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            →
          </span>
        </span>
      ))}
    </>
  );

  return (
    <Marquee
      className={cn("py-8 md:py-12 border-y border-white/[0.04]", className)}
      contentClassName="gap-8 md:gap-14"
    >
      {content}
    </Marquee>
  );
}
