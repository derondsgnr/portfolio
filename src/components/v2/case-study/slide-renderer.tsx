import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import type { Slide, NarratorBlock } from "../../../types/case-study";
import { DeviceMockup } from "./device-mockup";
import { useScrambleText } from "../shared/scramble-text";
import { LottiePlayer } from "../shared/lottie-player";
import parseHtml from "html-react-parser";

/** Renders rich-text HTML produced by the editor, or falls back to plain-text paragraph splitting. */
function RichBody({ text, className = "", style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const isHtml = text.trimStart().startsWith("<");
  if (isHtml) {
    return (
      <div className={`rte-body ${className}`} style={style}>
        {parseHtml(text)}
      </div>
    );
  }
  return (
    <>
      {text.split("\n\n").map((paragraph, i) => (
        <p key={i} className={className} style={style}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

/**
 * Inline-safe rich text for short fields (subtitle, caption, annotation).
 * Renders an HTML value with formatting (paragraphs collapse to inline via .rte-inline);
 * for plain text it returns the raw string so it can sit inside any element.
 */
function RichInline({ text }: { text: string }) {
  if (text.trimStart().startsWith("<")) {
    return <span className="rte-inline">{parseHtml(text)}</span>;
  }
  return <>{text}</>;
}

const CinematicContext = createContext(false);

/* ─── Synthesis DNA helpers ──────────────────────────────────── */

/**
 * ScrambleHeading — the signature char-by-char reveal.
 * Reserved for high-impact moments (cover, act breaks, outcome). Pass `scramble={false}`
 * for body-level headlines: they render plainly with a clean fade from the parent motion.
 * Scramble is also auto-disabled for rich-text (HTML) headings, which render formatted.
 */
function ScrambleHeading({ text, className = "", scramble = true }: { text: string; className?: string; scramble?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const isHtml = text.trimStart().startsWith("<");
  const canScramble = scramble && !isHtml;
  const display = useScrambleText(canScramble ? text : "", inView && canScramble, 25);
  return (
    <h2 ref={ref} className={`text-white ${className}`} style={{ letterSpacing: "-0.02em" }}>
      {isHtml ? <span className="rte-body">{parseHtml(text)}</span> : canScramble ? display : text}
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
  const cinematic = useContext(CinematicContext);
  if (!narrator || cinematic) {
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

const FIGMA_PLACEHOLDER_MARKER = "Missing%20Figma%20asset";

function isFigmaPlaceholderAsset(src?: string): boolean {
  return typeof src === "string" && src.includes(FIGMA_PLACEHOLDER_MARKER);
}

function CaseStudyImage({
  src,
  alt,
  className,
  wrapperClassName = "",
}: {
  src?: string;
  alt: string;
  className: string;
  wrapperClassName?: string;
}) {
  const showBadge = isFigmaPlaceholderAsset(src);
  return (
    <div className={`relative ${wrapperClassName}`}>
      <img src={src} alt={alt} className={className} />
      {showBadge && (
        <span
          className="absolute left-2 top-2 z-20 border border-[#E2B93B]/40 bg-[#0A0A0A]/85 px-2 py-1 text-[9px] tracking-[0.14em] text-[#E2B93B]"
          style={{ fontFamily: "monospace" }}
        >
          PLACEHOLDER ASSET
        </span>
      )}
    </div>
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
    <div ref={ref} className="relative min-h-screen flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      {/* Background hero image */}
      {slide.heroImage && (
        <div className="absolute inset-0 z-0">
          <CaseStudyImage src={slide.heroImage} alt="" className="w-full h-full object-cover opacity-15" wrapperClassName="w-full h-full" />
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
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-6 text-[#888] max-w-2xl"
            style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
          >
            <RichInline text={slide.subtitle} />
          </motion.p>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
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
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-3xl">
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl mb-8" scramble={false} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <RichBody
              text={slide.body}
              className="text-[#aaa]"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.8 }}
            />
          </motion.div>

          {slide.annotation && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 border-l-2 border-[#E2B93B]/50 pl-4"
            >
              <p className="text-[#E2B93B]/80 text-sm" style={{ fontFamily: "monospace" }}>
                <RichInline text={slide.annotation} />
              </p>
            </motion.div>
          )}

          {slide.references && slide.references.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span
                className="block mb-3"
                style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.15)" }}
              >
                [REFERENCES]
              </span>
              <div className="flex flex-col gap-1">
                {slide.references.map((ref) => (
                  <a
                    key={ref.url}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E2B93B] transition-colors duration-300"
                    style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}
                  >
                    ↗ {ref.label}
                  </a>
                ))}
              </div>
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
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative ${slide.device === "browser" ? "max-w-6xl w-full" : "max-w-4xl"}`}
          >
            <DeviceMockup device={slide.device}>
              <CaseStudyImage src={slide.image} alt={slide.headline || "Screen mockup"} className="w-full h-auto" wrapperClassName="w-full" />
            </DeviceMockup>
            <ScanLines />

            {slide.annotation && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative md:absolute md:-right-4 lg:-right-64 md:top-1/2 md:-translate-y-1/2 max-w-[240px] bg-[#111] border border-[#E2B93B]/20 p-4 mt-4 md:mt-0 z-20"
              >
                <div className="w-2 h-2 bg-[#E2B93B] rounded-full mb-2" />
                <p className="text-xs text-[#999]" style={{ fontFamily: "monospace", lineHeight: 1.6 }}>
                  <RichInline text={slide.annotation} />
                </p>
              </motion.div>
            )}
          </motion.div>

          {slide.caption && (
            <p className="text-[10px] text-[#555] mt-4 tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
              <RichInline text={slide.caption} />
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
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
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
              <CaseStudyImage src={slide.after.image} alt={slide.after.label} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
            </div>

            {/* Before (clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <CaseStudyImage src={slide.before.image} alt={slide.before.label} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
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
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl mb-10" scramble={false} />
          </motion.div>

          {slide.body && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#aaa] mb-10"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.8 }}
            >
              <RichBody text={slide.body} className="text-[#aaa]" style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.8 }} />
            </motion.div>
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
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-5xl w-full">
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl" scramble={false} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
            {slide.metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="min-w-0 border-t border-[#E2B93B]/30 pt-4"
              >
                <span
                  className="text-3xl md:text-5xl text-white block mb-2 break-words [overflow-wrap:anywhere]"
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
    <div ref={ref} className="min-h-[70vh] flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[#E2B93B] text-6xl mb-6" style={{ fontFamily: "serif" }}>&ldquo;</div>
            <div
              className="text-2xl md:text-4xl text-white mb-8"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.4, fontStyle: "italic" }}
            >
              <RichBody text={slide.quote} className="text-2xl md:text-4xl text-white" style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.4, fontStyle: "italic" }} />
            </div>
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
        <div className="px-6 sm:px-8 md:px-10 lg:px-16 mb-10">
          <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
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
        <div className="flex gap-4 md:gap-6 px-6 sm:px-8 md:px-10 lg:px-16 pb-4" style={{ minWidth: "max-content" }}>
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
                <CaseStudyImage src={screen.image} alt={screen.label || `Screen ${i + 1}`} className="w-full h-auto" wrapperClassName="w-full" />
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
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl w-full"
          >
            {isMobile ? (
              /* Mobile: fallback image + link */
              <div className="relative">
                <DeviceMockup device={slide.device || "browser"}>
                  <CaseStudyImage src={slide.fallbackImage} alt="Demo preview" className="w-full h-auto" wrapperClassName="w-full" />
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
              <RichInline text={slide.caption} />
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
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
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
                  <CaseStudyImage src={slide.posterImage} alt={slide.headline || "Video"} className="w-full h-auto" wrapperClassName="w-full" />
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
              <RichInline text={slide.caption} />
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
  const mockupCount = slide.mockups.length;

  // Keyboard nav + body scroll lock while the lightbox is open
  useEffect(() => {
    if (expandedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedIdx(null);
      else if (e.key === "ArrowRight") setExpandedIdx((v) => (v !== null && v < mockupCount - 1 ? v + 1 : v));
      else if (e.key === "ArrowLeft") setExpandedIdx((v) => (v !== null && v > 0 ? v - 1 : v));
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expandedIdx, mockupCount]);

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
            </motion.div>
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
            <div className="flex gap-3 md:gap-5 px-6 sm:px-8 md:px-10 lg:px-16 pb-4 items-end" style={{ minWidth: "max-content" }}>
              {slide.mockups.map((mockup, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className={`flex-shrink-0 flex flex-col items-center cursor-pointer group ${
                    mockup.device === "phone" ? "w-[230px] md:w-[300px]" :
                    mockup.device === "watch" ? "w-[150px] md:w-[200px]" :
                    "w-[400px] md:w-[680px]"
                  }`}
                  onClick={() => setExpandedIdx(i)}
                >
                  <div className="relative w-full">
                    <DeviceMockup device={mockup.device}>
                      <CaseStudyImage src={mockup.image} alt={mockup.label || `Mockup ${i + 1}`} className="w-full h-auto" wrapperClassName="w-full" />
                    </DeviceMockup>
                    {/* Expand affordance */}
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
          </motion.div>
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
              className="absolute top-3 right-3 md:top-5 md:right-5 z-20 flex items-center gap-2 border border-[#E2B93B]/50 bg-[#0A0A0A]/85 backdrop-blur-sm px-3 py-2 text-[#E2B93B] hover:bg-[#E2B93B] hover:text-[#0A0A0A] transition-colors"
              onClick={(e) => { e.stopPropagation(); setExpandedIdx(null); }}
              aria-label="Close expanded view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              <span className="hidden md:inline text-[9px] tracking-[0.18em]" style={{ fontFamily: "monospace" }}>
                CLOSE
              </span>
            </button>

            {/* Close hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <span className="text-[9px] tracking-[0.15em] text-[#555]" style={{ fontFamily: "monospace" }}>
                <span className="md:hidden">TAP OUTSIDE TO CLOSE</span>
                <span className="hidden md:inline">ESC OR TAP OUTSIDE TO CLOSE</span>
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
              className={`flex flex-col items-center max-h-[88vh] ${
                slide.mockups[expandedIdx].device === "phone" ? "w-[min(82vw,38vh)]" :
                slide.mockups[expandedIdx].device === "watch" ? "w-[min(70vw,32vh)]" :
                "w-[min(82vw,1100px)]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <DeviceMockup device={slide.mockups[expandedIdx].device}>
                <CaseStudyImage src={slide.mockups[expandedIdx].image} alt={slide.mockups[expandedIdx].label || "Expanded mockup"} className="w-full h-auto" wrapperClassName="w-full" />
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
            <RichInline text={slide.subtitle} />
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
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div>
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <ScrambleHeading text={slide.headline} className="text-2xl md:text-4xl" scramble={false} />
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
                  <CaseStudyImage src={artifact.image} alt={artifact.label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" wrapperClassName="w-full h-full" />
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

/* ─── LOTTIE ─────────────────────────────────────────────────── */
function LottieSlideComponent({ slide }: { slide: Extract<Slide, { type: "lottie" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="min-h-[70vh] flex items-center px-6 sm:px-8 md:px-10 lg:px-16 py-20">
      <SlideLayout narrator={slide.narrator}>
        <div className="max-w-5xl w-full">
          {slide.headline && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <ScrambleHeading text={slide.headline} className="text-3xl md:text-5xl mb-8" scramble={false} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: slide.headline ? 0.3 : 0 }}
            className="w-full"
          >
            <LottiePlayer
              src={slide.lottieUrl}
              loop={slide.loop ?? true}
              className="w-full"
            />
          </motion.div>

          {slide.caption && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-4 text-center"
              style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}
            >
              <RichInline text={slide.caption} />
            </motion.p>
          )}
        </div>
      </SlideLayout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SLIDE RENDERER
   ═══════════════════════════════════════════════════════════════ */

export function SlideRenderer({ slide, cinematic = false }: { slide: Slide; cinematic?: boolean }) {
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
    "lottie": LottieSlideComponent,
  };

  const Component = components[slide.type];
  if (!Component) return null;

  return (
    <CinematicContext.Provider value={cinematic}>
      <Component slide={slide} />
    </CinematicContext.Provider>
  );
}

export { ScrambleHeading, NarratorStrip, ScanLines };