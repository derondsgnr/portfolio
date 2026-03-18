"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconButton } from "../atoms/icon-button";
import { cn } from "@/components/ui/utils";

export interface Testimonial {
  id: string | number;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string | null;
  companyLogo?: string | null;
}

export interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  heading?: { line1: string; line2: string; line3?: string };
  className?: string;
}

export function TestimonialsCarousel({
  testimonials,
  heading = {
    line1: "Trusted by",
    line2: "founders &",
    line3: "Collaborators",
  },
  className,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const testimonial = testimonials[current];

  const goNext = () => setCurrent((prev) => (prev + 1) % total);
  const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);

  if (!total) return null;

  return (
    <section
      className={cn(
        "py-24 md:py-40 px-6 md:px-10",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4 min-h-[60vh] md:min-h-[50vh] items-start">
        {/* Left column */}
        <div className="md:col-span-5 md:col-start-1 flex flex-col justify-between h-full gap-12">
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
                &quot;{testimonial.quote}&quot;
              </motion.p>
            </AnimatePresence>
          </div>

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
                  {testimonial.companyLogo && (
                    <img
                      src={testimonial.companyLogo}
                      alt={testimonial.company}
                      className="ml-3 h-6 w-auto object-contain opacity-70"
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <IconButton
                onClick={goPrev}
                aria-label="Previous testimonial"
              >
                <ArrowLeft strokeWidth={1.5} />
              </IconButton>
              <IconButton
                onClick={goNext}
                aria-label="Next testimonial"
              >
                <ArrowRight strokeWidth={1.5} />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-6 md:col-start-7 flex items-center">
          <div>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              {heading.line1}
            </h2>
            <h2
              className="text-[#6b6b6b]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
            >
              {heading.line2}
            </h2>
            {heading.line3 && (
              <h2
                className="text-[#6b6b6b]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 6rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                {heading.line3}
              </h2>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
