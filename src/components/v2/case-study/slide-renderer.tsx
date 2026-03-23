import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import type { Slide, NarratorBlock } from "../../../types/case-study";
import { DeviceMockup } from "./device-mockup";
import { useScrambleText } from "../shared/scramble-text";

/* ─── Synthesis DNA helpers ──────────────────────────────────── */

function ScrambleHeading({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const display = useScrambleText(text, inView, 25);
  return (
    <h2 ref={ref} className={`text-white ${className}`} style={{ letterSpacing: "-0.02em" }}>
      {display}
    </h2>
  );
}

/* ─── Narrator Block ─────────────────────────────────────────── */
function NarratorStrip({ narrator }: { narrator: NarratorBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative border-l-2 border-[#E2B93B] pl-4 py-3"
    >
      {narrator.label && (
        <span
          className="block text-[10px] tracking-[0.2em] text-[#E2B93B] mb-2"
          style={{ fontFamily: "monospace" }}
        >
          {narrator.label}
        </span>
      )}
      <p className="text-[#999] text-sm" style={{ fontFamily: "monospace", lineHeight: 1.7 }}>
        {narrator.text}
      </p>
      {/* Future: character illustration slot */}
      {narrator.mood && (
        <span
          className="block text-[9px] tracking-[0.15em] text-[#444] mt-2"
          style={{ fontFamily: "monospace" }}
        >
          [{narrator.mood.toUpperCase()}]
        </span>
      )}
    </motion.div>
  );
}

/* ─── Slide wrapper with narrator ────────────────────────────── */
function SlideLayout({
  children,
  narrator,
  fullBleed = false,
}: {
  children: React.ReactNode;
  narrator?: NarratorBlock;
  fullBleed?: boolean;
}) {
  if (!narrator) {
    return <>{children}</>;
  }

  return (
    <div className={`grid gap-8 ${fullBleed ? "" : "lg:grid-cols-[1fr_280px]"}`}>
      <div>{children}</div>
      {!fullBleed && (
        <div className="hidden lg:flex flex-col justify-center">
          <NarratorStrip narrator={narrator} />
        </div>
      )}
      {/* Mobile narrator below content */}
      <div className="lg:hidden">
        <NarratorStrip narrator={narrator} />
      </div>
    </div>
  );
}

/* ─── Scan line overlay for images ───────────────────────────── */
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.02) 2px, rgba(226,185,59,0.02) 4px)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE TYPE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── COVER ──────────────────────────────────────────────────── */
function CoverSlideComponent({ slide }: { slide: Extract<Slide, { type: "cover" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      {/* Background hero image */}
      {slide.heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={slide.heroImage}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <ScanLines />
        </div>
      )}

      <div className="relative z-10 max-w-5xl">
        {/* Tags */}
        {slide.tags && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {slide.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.2em] text-[#E2B93B] border border-[#E2B93B]/30 px-3 py-1"
                style={{ fontFamily: "monospace" }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ScrambleHeading
            text={slide.headline}
            className="text-4xl md:text-6xl lg:text-8xl"
          />
        </motion.div>

        {/* Subtitle */}
        {slide.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-[#888] max-w-2xl"
            style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
          >
            {slide.subtitle}
          </motion.p>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex items-center gap-3"
        >
          <div className="w-px h-8 bg-[#E2B93B]/40" />
          <span className="text-[10px] tracking-[0.3em] text-[#555]" style={{ fontFamily: "monospace" }}>
            SCROLL TO EXPLORE
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── NARRATIVE ──────────────────────────────────────────────── */
function NarrativeSlideComponent({ slide }: { slide: Extract<Slide, { type: "narrative" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-3xl">
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl mb-8" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {slide.body.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-[#aaa]"
                style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.8 }}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {slide.annotation && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 border-l-2 border-[#E2B93B]/50 pl-4"
            >
              <p className="text-[#E2B93B]/80 text-sm" style={{ fontFamily: "monospace" }}>
                {slide.annotation}
              </p>
            </motion.div>
          )}
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── SINGLE MOCKUP ──────────────────────────────────────────── */
function SingleMockupSlideComponent({ slide }: { slide: Extract<Slide, { type: "single-mockup" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl"
          >
            <DeviceMockup device={slide.device}>
              <img
                src={slide.image}
                alt={slide.headline || "Screen mockup"}
                className="w-full h-auto"
              />
            </DeviceMockup>
            <ScanLines />

            {slide.annotation && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative md:absolute md:-right-4 lg:-right-64 md:top-1/2 md:-translate-y-1/2 max-w-[240px] bg-[#111] border border-[#E2B93B]/20 p-4 mt-4 md:mt-0 z-20"
              >
                <div className="w-2 h-2 bg-[#E2B93B] rounded-full mb-2" />
                <p className="text-xs text-[#999]" style={{ fontFamily: "monospace", lineHeight: 1.6 }}>
                  {slide.annotation}
                </p>
              </motion.div>
            )}
          </motion.div>

          {slide.caption && (
            <p className="text-[10px] text-[#555] mt-4 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
              {slide.caption}
            </p>
          )}
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── COMPARISON (Before/After) ──────────────────────────────── */
function ComparisonSlideComponent({ slide }: { slide: Extract<Slide, { type: "comparison" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, x)));
  };

  return (
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            ref={containerRef}
            className="relative max-w-4xl overflow-hidden cursor-col-resize select-none"
            onMouseMove={(e) => handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            style={{ aspectRatio: "16/10" }}
          >
            {/* After (full) */}
            <div className="absolute inset-0">
              <img src={slide.after.image} alt={slide.after.label} className="w-full h-full object-cover" />
            </div>

            {/* Before (clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img src={slide.before.image} alt={slide.before.label} className="w-full h-full object-cover" />
            </div>

            {/* Slider line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-[#E2B93B] z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#E2B93B] flex items-center justify-center">
                <span className="text-[#0A0A0A] text-xs">&#8596;</span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="text-[10px] tracking-[0.2em] text-white bg-[#0A0A0A]/80 px-2 py-1" style={{ fontFamily: "monospace" }}>
                {slide.before.label}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 z-10">
              <span className="text-[10px] tracking-[0.2em] text-white bg-[#0A0A0A]/80 px-2 py-1" style={{ fontFamily: "monospace" }}>
                {slide.after.label}
              </span>
            </div>

            <ScanLines />
          </motion.div>
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── INSIGHT ────────────────────────────────────────────────── */
function InsightSlideComponent({ slide }: { slide: Extract<Slide, { type: "insight" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl mb-10" />
          </motion.div>

          {slide.body && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#aaa] mb-10"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.8 }}
            >
              {slide.body}
            </motion.p>
          )}

          {/* Insight card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative bg-[#111] border border-[#E2B93B]/20 p-6 md:p-8"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#E2B93B] to-transparent" />
            <span
              className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-3"
              style={{ fontFamily: "monospace" }}
            >
              {slide.insightLabel}
            </span>
            <p className="text-white text-lg md:text-xl" style={{ lineHeight: 1.6 }}>
              {slide.insightText}
            </p>
          </motion.div>
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── METRIC ─────────────────────────────────────────────────── */
function MetricSlideComponent({ slide }: { slide: Extract<Slide, { type: "metric" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-5xl w-full">
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl" />
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {slide.metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="border-t border-[#E2B93B]/30 pt-4"
              >
                <span
                  className="text-3xl md:text-5xl text-white block mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {metric.value}
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] text-[#666] block"
                  style={{ fontFamily: "monospace" }}
                >
                  {metric.label}
                </span>
                {metric.delta && (
                  <span
                    className="text-[10px] text-[#E2B93B]/60 block mt-1"
                    style={{ fontFamily: "monospace" }}
                  >
                    {metric.delta}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── QUOTE ──────────────────────────────────────────────────── */
function QuoteSlideComponent({ slide }: { slide: Extract<Slide, { type: "quote" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[#E2B93B] text-6xl mb-6" style={{ fontFamily: "serif" }}>&ldquo;</div>
            <p
              className="text-2xl md:text-4xl text-white mb-8"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.4, fontStyle: "italic" }}
            >
              {slide.quote}
            </p>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[#E2B93B] text-sm">{slide.attribution}</span>
              {slide.role && (
                <span className="text-[10px] text-[#666] tracking-[0.15em]" style={{ fontFamily: "monospace" }}>
                  {slide.role}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── FLOW (horizontal scroll) ───────────────────────────────── */
function FlowSlideComponent({ slide }: { slide: Extract<Slide, { type: "flow" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center py-20">
      {slide.headline && (
        <div className="px-6 md:px-16 lg:px-24 mb-10">
          <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
        </div>
      )}

      {/* Swipe hint for mobile */}
      <div className="px-6 md:hidden mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E2B93B" strokeWidth="1.5" className="opacity-60">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className="text-[9px] tracking-[0.15em] text-[#E2B93B]/60" style={{ fontFamily: "monospace" }}>
          SWIPE TO EXPLORE
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4 md:gap-6 px-6 md:px-16 lg:px-24 pb-4" style={{ minWidth: "max-content" }}>
          {slide.screens.map((screen, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className={`flex-shrink-0 ${
                (screen.device || "phone") === "phone" ? "w-[200px] md:w-[260px]" : "w-[320px] md:w-[500px]"
              }`}
            >
              <DeviceMockup device={screen.device || "phone"}>
                <img src={screen.image} alt={screen.label || `Screen ${i + 1}`} className="w-full h-auto" />
              </DeviceMockup>
              {screen.label && (
                <p className="text-[10px] text-[#666] mt-3 text-center tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
                  {screen.label}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EMBED (iframe) ─────────────────────────────────────────── */
function EmbedSlideComponent({ slide }: { slide: Extract<Slide, { type: "embed" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl"
          >
            {isMobile ? (
              /* Mobile: fallback image + link */
              <div className="relative">
                <DeviceMockup device={slide.device || "browser"}>
                  <img src={slide.fallbackImage} alt="Demo preview" className="w-full h-auto" />
                </DeviceMockup>
                <a
                  href={slide.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[#E2B93B] text-sm hover:underline"
                  style={{ fontFamily: "monospace" }}
                >
                  Open live demo &rarr;
                </a>
              </div>
            ) : (
              /* Desktop: live iframe */
              <DeviceMockup device={slide.device || "browser"}>
                <div style={{ aspectRatio: "16/10" }}>
                  <iframe
                    src={slide.embedUrl}
                    title="Live demo"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </DeviceMockup>
            )}
          </motion.div>

          {slide.caption && (
            <p className="text-[10px] text-[#555] mt-4 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
              {slide.caption}
            </p>
          )}
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── VIDEO ──────────────────────────────────────────────────── */
function VideoSlideComponent({ slide }: { slide: Extract<Slide, { type: "video" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl cursor-pointer"
            onClick={() => {
              if (videoRef.current) {
                if (isPlaying) videoRef.current.pause();
                else videoRef.current.play();
                setIsPlaying(!isPlaying);
              }
            }}
          >
            <DeviceMockup device={slide.device || "none"}>
              {slide.videoUrl ? (
                <video
                  ref={videoRef}
                  src={slide.videoUrl}
                  poster={slide.posterImage}
                  className="w-full h-auto"
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="relative">
                  <img src={slide.posterImage} alt={slide.headline || "Video"} className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 rounded-full border-2 border-[#E2B93B] flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-[#E2B93B] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </DeviceMockup>
            <ScanLines />
          </motion.div>

          {slide.caption && (
            <p className="text-[10px] text-[#555] mt-4 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
              {slide.caption}
            </p>
          )}
        </div>
      </SlideLayout>
    </div>
  );
}

/* ─── MOCKUP GALLERY ─────────────────────────────────────────── */
function MockupGallerySlideComponent({ slide }: { slide: Extract<Slide, { type: "mockup-gallery" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <div className="flex flex-wrap items-end justify-center gap-8 md:gap-12">
            {slide.mockups.map((mockup, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 * i }}
                className={`flex flex-col items-center cursor-pointer group ${
                  mockup.device === "phone" ? "w-[180px] md:w-[220px]" :
                  mockup.device === "watch" ? "w-[120px] md:w-[150px]" :
                  "w-full max-w-[600px]"
                }`}
                onClick={() => setExpandedIdx(i)}
              >
                <div className="relative">
                  <DeviceMockup device={mockup.device}>
                    <img src={mockup.image} alt={mockup.label || `Mockup ${i + 1}`} className="w-full h-auto" />
                  </DeviceMockup>
                  {/* Expand affordance — always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6 md:items-center md:pb-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#E2B93B]/40 px-3 py-1.5 flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E2B93B" strokeWidth="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      <span className="text-[8px] md:text-[9px] tracking-[0.15em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
                        TAP TO EXPAND
                      </span>
                    </div>
                  </div>
                </div>
                {mockup.label && (
                  <p className="text-[10px] text-[#666] mt-3 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
                    {mockup.label}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </SlideLayout>

      {/* ─── Expanded overlay ─────────────────────────── */}
      <AnimatePresence>
        {expandedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setExpandedIdx(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:text-white hover:border-white transition-colors text-lg bg-[#0A0A0A]/80"
              onClick={() => setExpandedIdx(null)}
              aria-label="Close expanded view"
            >
              &times;
            </button>

            {/* Mobile close hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 md:hidden">
              <span className="text-[9px] tracking-[0.15em] text-[#555]" style={{ fontFamily: "monospace" }}>
                TAP OUTSIDE TO CLOSE
              </span>
            </div>

            {/* Nav arrows */}
            {expandedIdx > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#E2B93B] hover:text-[#E2B93B] transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpandedIdx(expandedIdx - 1); }}
                aria-label="Previous"
              >
                &#8592;
              </button>
            )}
            {expandedIdx < slide.mockups.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#E2B93B] hover:text-[#E2B93B] transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpandedIdx(expandedIdx + 1); }}
                aria-label="Next"
              >
                &#8594;
              </button>
            )}

            {/* Expanded mockup */}
            <motion.div
              key={expandedIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[85vh] max-w-[90vw] md:max-w-[500px] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <DeviceMockup device={slide.mockups[expandedIdx].device}>
                <img
                  src={slide.mockups[expandedIdx].image}
                  alt={slide.mockups[expandedIdx].label || "Expanded mockup"}
                  className="w-full h-auto"
                />
              </DeviceMockup>
              {slide.mockups[expandedIdx].label && (
                <p className="text-[11px] text-[#888] mt-4 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
                  {slide.mockups[expandedIdx].label}
                </p>
              )}
              <span className="text-[9px] tracking-[0.15em] text-[#444] mt-2" style={{ fontFamily: "monospace" }}>
                {expandedIdx + 1} / {slide.mockups.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SECTION BREAK ──────────────────────────────────────────── */
function SectionBreakSlideComponent({ slide }: { slide: Extract<Slide, { type: "section-break" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="min-h-[50vh] flex items-center justify-center px-6 py-20 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[15vw] text-[#111] select-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          {String(slide.actNumber).padStart(2, "0")}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center"
      >
        <span className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-4" style={{ fontFamily: "monospace" }}>
          ACT {String(slide.actNumber).padStart(2, "0")}
        </span>
        <ScrambleHeading text={slide.actTitle} className="text-4xl md:text-6xl" />
        {slide.subtitle && (
          <p className="text-[#666] mt-4 text-sm" style={{ fontFamily: "monospace" }}>
            {slide.subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}

/* ─── PROCESS ────────────────────────────────────────────────── */
function ProcessSlideComponent({ slide }: { slide: Extract<Slide, { type: "process" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" />
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {slide.artifacts.map((artifact, i) => (
              <motion.div
                key={artifact.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="group relative bg-[#111] border border-[#1a1a1a] overflow-hidden hover:border-[#E2B93B]/20 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={artifact.image}
                    alt={artifact.label}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <ScanLines />
                </div>
                <div className="p-4">
                  <span
                    className="text-[10px] tracking-[0.2em] text-[#E2B93B] block mb-2"
                    style={{ fontFamily: "monospace" }}
                  >
                    {artifact.label}
                  </span>
                  {artifact.description && (
                    <p className="text-xs text-[#888]" style={{ fontFamily: "monospace", lineHeight: 1.6 }}>
                      {artifact.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SlideLayout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SLIDE RENDERER
   ═══════════════════════════════════════════════════════════════ */

export function SlideRenderer({ slide }: { slide: Slide }) {
  const components: Record<Slide["type"], React.FC<{ slide: any }>> = {
    "cover": CoverSlideComponent,
    "narrative": NarrativeSlideComponent,
    "single-mockup": SingleMockupSlideComponent,
    "comparison": ComparisonSlideComponent,
    "insight": InsightSlideComponent,
    "metric": MetricSlideComponent,
    "quote": QuoteSlideComponent,
    "flow": FlowSlideComponent,
    "embed": EmbedSlideComponent,
    "video": VideoSlideComponent,
    "mockup-gallery": MockupGallerySlideComponent,
    "section-break": SectionBreakSlideComponent,
    "process": ProcessSlideComponent,
  };

  const Component = components[slide.type];
  if (!Component) return null;

  return <Component slide={slide} />;
}

export { ScrambleHeading, NarratorStrip, ScanLines };