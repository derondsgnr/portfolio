import React from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useBooking } from "../booking-context";

/**
 * CASE STUDY CTA — "Interested in working together?"
 * Appears between the outcome section and comments.
 * Subtle, editorial — not salesy.
 */

export function CaseStudyCTA() {
  const { open } = useBooking();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative z-10 px-6 md:px-16 lg:px-24 py-20 overflow-hidden"
    >
      {/* Subtle spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(226,185,59,0.03) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <span
          className="text-[9px] tracking-[0.3em] text-[#E2B93B]/40 block mb-4"
          style={{ fontFamily: "monospace" }}
        >
          [INTERESTED?]
        </span>

        <h3
          className="text-2xl md:text-4xl text-white mb-3"
          style={{
            fontFamily: "'Anton', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          WANT SOMETHING LIKE THIS?
        </h3>

        <p
          className="text-[#666] text-sm mb-8 max-w-md mx-auto"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            lineHeight: 1.7,
          }}
        >
          Every project starts with a conversation. Let's talk about what you're building.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => open("book")}
            className="text-[10px] tracking-[0.2em] text-[#0A0A0A] bg-[#E2B93B] px-6 py-3 hover:bg-white transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            BOOK A CALL
          </button>
          <button
            onClick={() => open("message")}
            className="text-[10px] tracking-[0.2em] text-[#E2B93B]/70 hover:text-[#E2B93B] transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            OR SEND A MESSAGE &rarr;
          </button>
        </div>
      </motion.div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="h-px origin-center mt-16 mx-auto max-w-md"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(226,185,59,0.2), transparent)",
        }}
      />
    </div>
  );
}
