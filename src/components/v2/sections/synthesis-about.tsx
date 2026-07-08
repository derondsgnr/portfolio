"use client";

import { motion } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";

export interface SynthesisAboutProps {
  label?: string;
  headline?: string;
  headlineAccent?: string;
  socialLinks?: { label: string; handle: string }[];
  bioParagraphs?: string[];
  stats?: { label: string; value: string }[];
}

const DEFAULT_SOCIAL = [
  { label: "Twitter / X", handle: "@derondsgnr" },
  { label: "LinkedIn", handle: "/in/derondsgnr" },
  { label: "Dribbble", handle: "/derondsgnr" },
  { label: "GitHub", handle: "/derondsgnr" },
];

const DEFAULT_BIO = [
  "I'm Deron — a designer who ships and builds. I start by prototyping to explore what's possible, test the problem, and pressure the solution until it's real. Then I go back and refine the finer details until they fit—interaction, motion, typography, and the moments people remember.",
  "I care that products are intuitive, and also delightful: users should leave with a feeling, not just a completed task. I've spent years with startups and teams at the intersection of design and product—thinking in systems, validating what we ship, and staying hungry to learn and push what's next.",
];

const DEFAULT_STATS = [
  { label: "YEARS", value: "5+" },
  { label: "PROJECTS", value: "40+" },
  { label: "CLIENTS", value: "25+" },
];

export function SynthesisAboutSection({
  label = "> ABOUT.DECODE()",
  headline = "Designer who",
  headlineAccent = "ships",
  socialLinks = DEFAULT_SOCIAL,
  bioParagraphs = DEFAULT_BIO,
  stats = DEFAULT_STATS,
}: SynthesisAboutProps) {
  return (
    <section className="relative py-32 px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "#ECFF95",
              }}
            >
              {label}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                display: "block",
                margin: 0,
              }}
            >
              {headline}
              <br />
              <span style={{ color: "#ECFF95" }}>{headlineAccent}</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 flex flex-col gap-3"
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              [CHANNELS]
            </span>
            {socialLinks.map((link) => (
              <div key={link.label} className="flex items-center gap-4 group cursor-pointer">
                <span
                  className="group-hover:text-[#ECFF95] transition-colors duration-300"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "rgba(236, 255, 149,0.5)",
                  }}
                >
                  {link.handle}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="md:col-span-7 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{
              borderLeft: "1px solid rgba(236, 255, 149,0.2)",
              paddingLeft: "2rem",
            }}
          >
            {bioParagraphs.map((text, i) => (
              <p
                key={i}
                className={i > 0 ? "mt-6" : ""}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.9,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <ScrambleText text={text} speed={i === 0 ? 4 : 3} />
              </p>
            ))}

            <div className="mt-10 flex gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <ScrambleText
                    text={stat.value}
                    speed={50}
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      lineHeight: 1,
                      color: "#ECFF95",
                      display: "block",
                    }}
                  />
                  <span
                    className="block mt-1"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    [{stat.label}]
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
