"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { V2_TESTIMONIALS } from "./v2/v2-data";

export function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const total = V2_TESTIMONIALS.length;
  const testimonial = V2_TESTIMONIALS[current];

  const goNext = () => setCurrent((prev) => (prev + 1) % total);
  const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <section className="py-24 md:py-40 px-6 md:px-10 bg-[#0a0a0a]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4 min-h-[60vh] md:min-h-[50vh] items-start">
        {/* Left column */}
        <div className="md:col-span-5 md:col-start-1 flex flex-col justify-between h-full gap-12">
          {/* Counter */}
          <div>
            <span
              className="text-white block"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              {current + 1}/{total}
            </span>
          </div>

          {/* Quote */}
          <div className="flex-1 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-white/60 text-[0.9rem] md:text-[1rem] max-w-md"
                style={{ fontFamily: "var(--font-body)", lineHeight: 1.8 }}
              >
                "{testimonial.quote}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Attribution + arrows */}
          <div className="flex items-end justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-white/40 text-[0.7rem]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                <div>
                  <p
                    className="text-white text-[0.85rem]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-white/40 text-[0.75rem]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Right column — massive heading */}
        <div className="md:col-span-6 md:col-start-7 flex items-center">
          <div>
            <h2
              className="text-white"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              Trusted by
            </h2>
            <h2
              className="text-[#6b6b6b]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              founders &
            </h2>
            <h2
              className="text-[#6b6b6b]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              Collaborators
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}