"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import type { CaseStudy } from "../../../types/case-study";
import { SlideRenderer, ScrambleHeading, ScanLines } from "./slide-renderer";
import { CommentsSection } from "./comments-section";
import { CaseStudyCTA } from "./case-study-cta";

/**
 * READER VIEW — Continuous scroll mode (default)
 * 
 * All slides render as sections in a single scrollable page.
 * Progress bar at top. Act navigation in sidebar (desktop) / top pills (mobile).
 * 
 * This is the default view. Users can switch to Cinematic mode via CTA.
 *
 * TODO (Cursor):
 *   - Add scroll-to-top when navigating between case studies (useEffect on slug change)
 *   - Mobile: case study switcher is hidden behind md:block — needs a mobile-accessible
 *     version (bottom sheet or slide-out menu, similar to ExplorationViewer mobile list)
 *   - Image loading states: add skeleton pulse placeholders while images load
 *   - Error boundary: wrap SlideRenderer in an error boundary so one broken slide
 *     doesn't crash the entire case study
 *   - Share functionality: add a share button (Web Share API with clipboard fallback)
 *     that copies the current case study URL
 *   - CaseStudyCTA appears between outcome and comments — positioning is correct
 */

interface ReaderViewProps {
  caseStudy: CaseStudy;
  onSwitchToCinematic: () => void;
  /** For cross-case-study navigation */
  allCaseStudies?: CaseStudy[];
  onSwitchCaseStudy?: (slug: string) => void;
}

export function ReaderView({
  caseStudy,
  onSwitchToCinematic,
  allCaseStudies = [],
  onSwitchCaseStudy,
}: ReaderViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Scroll to top when case study slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [caseStudy.slug]);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeAct, setActiveAct] = useState(0);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showProjectNav, setShowProjectNav] = useState(false);

  // Track active act on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = actRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveAct(idx);
          }
        });
      },
      { threshold: 0.3 }
    );

    actRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [caseStudy]);

  const allSlides = caseStudy.acts.flatMap((act) => act.slides);
  const hasMultipleActs = caseStudy.acts.length > 1;

  return (
    <div ref={containerRef} className="relative bg-[#0A0A0A] min-h-screen">
      {/* ─── Signal grid + scan lines (Synthesis DNA) ──── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── Sticky header bar (minimal) ─────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        {/* Gold progress bar — overlaid on nav bar top edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#E2B93B] z-50 origin-left"
          style={{ scaleX }}
        />
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Left: back + title */}
          <div className="flex items-center gap-3">
            <Link
              href="/work"
              className="text-[#666] hover:text-white transition-colors text-sm"
              aria-label="Back to work"
            >
              &larr;
            </Link>
            <span className="text-[10px] tracking-[0.2em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
              {caseStudy.meta.title}
            </span>
          </div>

          {/* Center: act nav (desktop only) */}
          {hasMultipleActs && (
            <div className="hidden md:flex items-center gap-1">
              {caseStudy.acts.map((act, i) => (
                <button
                  key={i}
                  onClick={() => actRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
                  className={`text-[10px] tracking-[0.15em] px-3 py-1 transition-colors ${
                    activeAct === i
                      ? "text-[#E2B93B] bg-[#E2B93B]/10"
                      : "text-[#555] hover:text-[#999]"
                  }`}
                  style={{ fontFamily: "monospace" }}
                >
                  {act.title}
                </button>
              ))}
            </div>
          )}

          {/* Right: switch (desktop only) */}
          <div className="flex items-center gap-3">
            {allCaseStudies.length > 1 && (
              <button
                onClick={() => setShowProjectNav(!showProjectNav)}
                className="hidden md:block text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors px-2 py-1 border border-[#222] hover:border-[#E2B93B]/30"
                style={{ fontFamily: "monospace" }}
              >
                SWITCH
              </button>
            )}
          </div>
        </div>

        {/* Mobile act pills */}
        {hasMultipleActs && (
          <div className="flex md:hidden overflow-x-auto px-4 pb-2 gap-2 scrollbar-hide">
            {caseStudy.acts.map((act, i) => (
              <button
                key={i}
                onClick={() => actRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
                className={`flex-shrink-0 text-[9px] tracking-[0.15em] px-3 py-1 border transition-colors ${
                  activeAct === i
                    ? "text-[#E2B93B] border-[#E2B93B]/40 bg-[#E2B93B]/10"
                    : "text-[#555] border-[#222]"
                }`}
                style={{ fontFamily: "monospace" }}
              >
                {act.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Project switcher bottom sheet ────────────── */}
      {showProjectNav && allCaseStudies.length > 1 && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowProjectNav(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-[#E2B93B]/20 rounded-t-2xl max-h-[60vh] overflow-y-auto"
          >
            <div className="p-6">
              <span className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-4" style={{ fontFamily: "monospace" }}>
                CASE STUDIES
              </span>
              {allCaseStudies.map((cs) => (
                <button
                  key={cs.slug}
                  onClick={() => {
                    onSwitchCaseStudy?.(cs.slug);
                    setShowProjectNav(false);
                  }}
                  className={`w-full text-left p-3 border-b border-[#1a1a1a] flex items-center gap-4 hover:bg-[#1a1a1a] transition-colors ${
                    cs.slug === caseStudy.slug ? "bg-[#E2B93B]/5" : ""
                  }`}
                >
                  <img
                    src={cs.meta.cover}
                    alt={cs.meta.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <span className={`text-sm block ${cs.slug === caseStudy.slug ? "text-[#E2B93B]" : "text-white"}`}>
                      {cs.meta.title}
                    </span>
                    <span className="text-[10px] text-[#666]" style={{ fontFamily: "monospace" }}>
                      {cs.meta.tags.slice(0, 2).join(" / ")}
                    </span>
                  </div>
                  {cs.slug === caseStudy.slug && (
                    <span className="ml-auto text-[10px] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
                      CURRENT
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* ─── Case study meta header ──────────────────── */}
      <div className="pt-32 md:pt-40 px-6 md:px-16 lg:px-24 pb-8 border-b border-[#1a1a1a]">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-[10px] tracking-[0.2em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
              {caseStudy.meta.client}
            </span>
            {caseStudy.meta.role && (
              <>
                <span className="text-[#333]">&mdash;</span>
                <span className="text-[10px] tracking-[0.1em] text-[#666]" style={{ fontFamily: "monospace" }}>
                  {caseStudy.meta.role}
                </span>
              </>
            )}
            {caseStudy.meta.duration && (
              <>
                <span className="text-[#333]">&mdash;</span>
                <span className="text-[10px] tracking-[0.1em] text-[#666]" style={{ fontFamily: "monospace" }}>
                  {caseStudy.meta.duration}
                </span>
              </>
            )}
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            {caseStudy.meta.title}
          </h1>
          <p
            className="text-[#888] max-w-2xl"
            style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
          >
            {caseStudy.meta.summary}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {caseStudy.meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] tracking-[0.15em] text-[#555] border border-[#222] px-2 py-1"
                style={{ fontFamily: "monospace" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Slides (continuous scroll) ──────────────── */}
      <div className="relative z-10">
        {caseStudy.acts.map((act, actIndex) => (
          <div
            key={actIndex}
            ref={(el) => { actRefs.current[actIndex] = el; }}
            className="relative"
          >
            {act.slides.map((slide) => (
              <div key={slide.id} className="relative">
                <SlideRenderer slide={slide} />
                {/* Divider between slides */}
                <div className="mx-6 md:mx-16 lg:mx-24">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ─── Outcome section ─────────────────────────── */}
      {caseStudy.outcome && (
        <div className="relative z-10 px-6 md:px-16 lg:px-24 py-20 border-t border-[#1a1a1a]">
          <div className="max-w-4xl">
            <ScrambleHeading text="OUTCOME" className="text-3xl md:text-5xl mb-12" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
              {caseStudy.outcome.metrics.map((m) => (
                <div key={m.label} className="border-t border-[#E2B93B]/30 pt-4">
                  <span className="text-3xl md:text-4xl text-white block mb-1" style={{ letterSpacing: "-0.02em" }}>
                    {m.value}
                  </span>
                  <span className="text-[10px] text-[#666] tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {caseStudy.outcome.testimonial && (
              <div className="border-l-2 border-[#E2B93B]/40 pl-6">
                <p
                  className="text-lg md:text-xl text-[#ccc] mb-4"
                  style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.6, fontStyle: "italic" }}
                >
                  &ldquo;{caseStudy.outcome.testimonial}&rdquo;
                </p>
                {caseStudy.outcome.testimonialAuthor && (
                  <span className="text-[10px] text-[#666] tracking-[0.1em]" style={{ fontFamily: "monospace" }}>
                    &mdash; {caseStudy.outcome.testimonialAuthor}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Live demo floating button ───────────────── */}
      {caseStudy.liveDemoUrl && caseStudy.liveDemoUrl !== "#" && (
        <a
          href={caseStudy.liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#E2B93B] text-[#0A0A0A] px-4 py-2 text-[10px] tracking-[0.2em] hover:bg-white transition-colors shadow-lg"
          style={{ fontFamily: "monospace" }}
        >
          LIVE DEMO &rarr;
        </a>
      )}

      {/* ─── Floating cinematic mode button (bottom) ──── */}
      <button
        onClick={onSwitchToCinematic}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#E2B93B] text-[#0A0A0A] px-5 py-2.5 text-[10px] tracking-[0.2em] hover:bg-white transition-colors shadow-lg flex items-center gap-2"
        style={{ fontFamily: "monospace" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" />
        </svg>
        CINEMATIC MODE
      </button>

      {/* ─── Interested CTA ────────────────────────── */}
      <CaseStudyCTA />

      {/* ─── Comments section ──────────────────────── */}
      <CommentsSection slug={caseStudy.slug} />

      {/* ─── Next case study footer ──────────────────── */}
      {allCaseStudies.length > 1 && (
        <NextCaseStudyFooter
          currentSlug={caseStudy.slug}
          allCaseStudies={allCaseStudies}
          onNavigate={onSwitchCaseStudy}
        />
      )}
    </div>
  );
}

/* ─── Next case study footer ─────────────────────────────────── */
function NextCaseStudyFooter({
  currentSlug,
  allCaseStudies,
  onNavigate,
}: {
  currentSlug: string;
  allCaseStudies: CaseStudy[];
  onNavigate?: (slug: string) => void;
}) {
  const currentIdx = allCaseStudies.findIndex((cs) => cs.slug === currentSlug);
  const nextIdx = (currentIdx + 1) % allCaseStudies.length;
  const next = allCaseStudies[nextIdx];

  if (!next || next.slug === currentSlug) return null;

  return (
    <div className="relative z-10 border-t border-[#1a1a1a]">
      <button
        onClick={() => onNavigate?.(next.slug)}
        className="w-full text-left px-6 md:px-16 lg:px-24 py-16 md:py-24 group hover:bg-[#111] transition-colors"
      >
        <span className="text-[10px] tracking-[0.3em] text-[#555] block mb-4" style={{ fontFamily: "monospace" }}>
          NEXT CASE STUDY
        </span>
        <h3
          className="text-4xl md:text-6xl text-white group-hover:text-[#E2B93B] transition-colors"
          style={{ letterSpacing: "-0.02em" }}
        >
          {next.meta.title}
        </h3>
        <p className="text-[#666] mt-2 text-sm" style={{ fontFamily: "monospace" }}>
          {next.meta.summary}
        </p>
      </button>
    </div>
  );
}