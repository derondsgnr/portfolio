"use client";

import { motion } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";
import { useBooking } from "../booking-context";
import { withSound } from "@/hooks/useSound";

export interface SynthesisCTAProps {
  label?: string;
  headline?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  subtext?: string;
  copyrightLabel?: string;
  tagline?: string;
  socialLinks?: { label: string; url: string }[];
}

const DEFAULT_SOCIAL = [
  { label: "Twitter / X", url: "https://twitter.com/derondsgnr" },
  { label: "LinkedIn", url: "https://linkedin.com/in/derondsgnr" },
  { label: "Dribbble", url: "https://dribbble.com/derondsgnr" },
];

export function SynthesisCTASection({
  label = "[READY TO DECODE YOUR NEXT PROJECT?]",
  headline = "LET'S BUILD",
  ctaPrimary = "BOOK A CALL",
  ctaSecondary = "SEND A MESSAGE",
  subtext = "FREE 30-MINUTE DISCOVERY CALL",
  copyrightLabel = "DERONDSGNR",
  tagline = "Designed & built by hand",
  socialLinks = DEFAULT_SOCIAL,
}: SynthesisCTAProps) {
  const { open } = useBooking();

  return (
    <section id="cta" className="relative py-48 px-8 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(226,185,59,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "rgba(226,185,59,0.3)",
            }}
          >
            {label}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              display: "block",
            }}
          >
            <ScrambleText text={headline} speed={40} />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={withSound(() => open("book"))}
            className="text-[11px] tracking-[0.2em] text-[#0A0A0A] bg-[#E2B93B] px-8 py-3.5 hover:bg-white transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            {ctaPrimary}
          </button>
          <button
            onClick={withSound(() => open("message"))}
            className="text-[11px] tracking-[0.2em] text-[#E2B93B] border border-[#E2B93B]/30 px-8 py-3.5 hover:bg-[#E2B93B]/10 transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            {ctaSecondary}
          </button>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-center mt-10 mx-auto"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(226,185,59,0.4), transparent)",
            maxWidth: 300,
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {subtext}
        </motion.p>
      </div>

      <div className="mt-32 relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.1)",
              textTransform: "uppercase",
            }}
          >
            &copy; {new Date().getFullYear()} {copyrightLabel}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="flex justify-center mt-4"
          style={{ transform: "rotate(1deg)" }}
        >
          <span
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "10px",
              fontStyle: "italic",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.08)",
            }}
          >
            {tagline}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="flex justify-end gap-6 mt-4"
          style={{ transform: "rotate(1.5deg)" }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E2B93B] transition-colors"
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.1)",
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
