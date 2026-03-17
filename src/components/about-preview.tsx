"use client";

import Link from "next/link";
import { Reveal, LineDraw, TextReveal } from "./motion-primitives";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function AboutPreview() {
  return (
    <section className="py-24 md:py-40 px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
        {/* Left column — big statement */}
        <div className="md:col-span-7 md:col-start-1">
          <Reveal>
            <p
              className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              About
            </p>
          </Reveal>

          <TextReveal>
            <h2 className="text-white mb-0" style={{ lineHeight: 1 }}>
              I don't just
            </h2>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h2
              className="mb-0"
              style={{
                lineHeight: 1,
                WebkitTextStroke: "1px rgba(226,185,59,0.3)",
                color: "transparent",
              }}
            >
              design products
            </h2>
          </TextReveal>
          <TextReveal delay={0.3}>
            <h2 className="text-white" style={{ lineHeight: 1 }}>
              I build them.
            </h2>
          </TextReveal>
        </div>

        {/* Right column — body copy, offset down */}
        <div className="md:col-span-4 md:col-start-9 md:pt-24">
          <Reveal delay={0.4}>
            <p
              className="text-white/50 text-[0.9rem] mb-8"
              style={{ fontFamily: "var(--font-body)", lineHeight: 1.8 }}
            >
              I'm not just a designer — I help founders think clearly,
              reduce complexity, and build products that feel right from day one.
              From strategy to interface, I move at the speed your startup needs.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-[#e2b93b]/70 hover:text-[#e2b93b] transition-colors duration-300"
            >
              <span
                className="text-[0.8rem] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                More about me
              </span>
              <motion.span
                className="inline-block"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </motion.span>
            </Link>
          </Reveal>
        </div>
      </div>

      <LineDraw className="mt-16 md:mt-24" delay={0.3} />
    </section>
  );
}
