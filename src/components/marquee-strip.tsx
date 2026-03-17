import { motion } from "motion/react";

const PROCESS_WORDS = [
  "Discover",
  "Define",
  "Design",
  "Deliver",
];

export function MarqueeStrip() {
  const content = PROCESS_WORDS.map((w, i) => (
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
  ));

  return (
    <div className="overflow-hidden py-8 md:py-12 border-y border-white/[0.04]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-8 md:gap-14 w-max"
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  );
}
