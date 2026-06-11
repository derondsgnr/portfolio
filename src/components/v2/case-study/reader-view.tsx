"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import type { CaseStudy } from "../../../types/case-study";
import { SlideRenderer, ScrambleHeading, ScanLines, resolveBrowserUrl } from "./slide-renderer";
import { SplitText, RevealText } from "../shared/split-text";
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
  /** Hides the Cinematic toggle when false. */
  cinematicEnabled?: boolean;
  /** For cross-case-study navigation */
  allCaseStudies?: CaseStudy[];
  onSwitchCaseStudy?: (slug: string) => void;
}

export function ReaderView({
  caseStudy,
  onSwitchToCinematic,
  cinematicEnabled = false,
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
  const browserUrl = resolveBrowserUrl(caseStudy);

  // The meta header below already serves as the reader's cover (title, summary, tags
  // + unique client/role/duration). Cover slides are a Cinematic-mode concern, so we
  // skip them here to avoid repeating the same headline/subtitle/tags twice — but we
  // lift the cover's hero image into the meta header to keep the visual.
  const firstCover = allSlides.find((s) => s.type === "cover") as
    | Extract<typeof allSlides[number], { type: "cover" }>
    | undefined;
  const heroImage = firstCover?.heroImage || caseStudy.meta.cover || "";

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] pb-28 md:pb-24">
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
      {/* Offset to the content column on lg+ so it doesn't cover the global sidebar/logo. */}
      <div className="fixed top-[60px] lg:top-0 left-0 lg:left-[260px] right-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
        {/* Gold progress bar — overlaid on nav bar top edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#E2B93B] z-50 origin-left"
          style={{ scaleX }}
        />
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/work"
              className="shrink-0 text-[#666] hover:text-white transition-colors text-sm"
              aria-label="Back to work"
            >
              &larr;
            </Link>
            <span className="truncate min-w-0 text-[10px] text-[#E2B93B]" style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}>
              {caseStudy.meta.title}
            </span>
          </div>

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
                    ? "text-[#E2B93B] border-[#E2B93B]/50 bg-transparent"
                    : "text-[#555] border-[#222] bg-transparent"
                }`}
                style={{ fontFamily: "monospace" }}
              >
                {act.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Act side nav (desktop) ──────────────────── */}
      {/* No card or glass panel — labels sit directly on the page. A soft
          vignette behind them (invisible on the flat #0A0A0A background)
          adds contrast only where media scrolls underneath. Mobile keeps
          the act pills in the sticky header above. */}
      {hasMultipleActs && (
        <>
          <div
            className="hidden md:block fixed inset-y-0 right-0 w-56 z-30 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(10,10,10,0.6), transparent 75%)" }}
            aria-hidden
          />
          <motion.nav
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden md:flex fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3.5"
            aria-label="Section navigation"
          >
            {caseStudy.acts.map((act, i) => (
              <button
                key={i}
                onClick={() => actRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className={`group flex cursor-pointer items-center gap-3 text-right text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  activeAct === i ? "text-[#E2B93B]" : "text-white/35 hover:text-white/75"
                }`}
                style={{ fontFamily: "monospace", filter: "drop-shadow(0 1px 5px rgba(0,0,0,0.6))" }}
                aria-current={activeAct === i ? "true" : undefined}
              >
                <span className="whitespace-nowrap">{act.title}</span>
                <span className="relative h-px w-5 shrink-0 overflow-hidden bg-white/15">
                  <span className="absolute inset-0 origin-right scale-x-0 bg-white/40 transition-transform duration-300 group-hover:scale-x-100" />
                  {activeAct === i && (
                    <motion.span
                      layoutId="act-side-nav-indicator"
                      className="absolute inset-0 bg-[#E2B93B]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </span>
              </button>
            ))}
          </motion.nav>
        </>
      )}

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
            <span className="text-[10px] text-[#E2B93B]" style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}>
              {caseStudy.meta.client}
            </span>
            {caseStudy.meta.role && (
              <>
                <span className="text-[#333]">&mdash;</span>
                <span className="text-[10px] text-[#666]" style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}>
                  {caseStudy.meta.role}
                </span>
              </>
            )}
            {caseStudy.meta.duration && (
              <>
                <span className="text-[#333]">&mdash;</span>
                <span className="text-[10px] text-[#666]" style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}>
                  {caseStudy.meta.duration}
                </span>
              </>
            )}
          </div>
          <SplitText
            text={caseStudy.meta.title}
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl mb-4"
            style={{ letterSpacing: "-0.02em" }}
            amount={0.2}
          />
          <RevealText delay={0.32}>
            <p
              className="text-[#888] max-w-2xl"
              style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
            >
              {caseStudy.meta.summary}
            </p>
          </RevealText>

          <div className="flex flex-wrap gap-2 mt-6">
            {caseStudy.meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] text-[#555] border border-[#222] px-2 py-1"
                style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hero visual (lifted from the cover slide; cover slide itself is skipped below) */}
        {heroImage && (
          <div className="max-w-6xl mt-10 relative overflow-hidden border border-[#1a1a1a]">
            <img
              src={heroImage}
              alt={caseStudy.meta.title}
              className="w-full h-auto block"
              loading="eager"
            />
            <ScanLines />
          </div>
        )}
      </div>

      {/* ─── Slides (continuous scroll) ──────────────── */}
      <div className="relative z-10">
        {caseStudy.acts.map((act, actIndex) => (
          <div
            key={actIndex}
            ref={(el) => { actRefs.current[actIndex] = el; }}
            className="relative"
            style={{ scrollMarginTop: "100px" }}
          >
            {act.slides
              .filter((slide) => slide.type !== "cover")
              .map((slide) => (
                <div key={slide.id} className="relative">
                  <SlideRenderer slide={slide} browserUrl={browserUrl} />
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
                <div key={m.label} className="min-w-0 border-t border-[#E2B93B]/30 pt-4">
                  <span
                    className="text-3xl md:text-4xl text-white block mb-1 break-words [overflow-wrap:anywhere]"
                    style={{ letterSpacing: "-0.02em" }}
                  >
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

      {/* ─── View mode + demo (secondary controls — solid gold reserved for BOOK A CALL) ─── */}
      <div
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 md:left-auto md:right-6 md:translate-x-0"
        role="toolbar"
        aria-label="Case study view options"
      >
        {cinematicEnabled && (
          <button
            type="button"
            onClick={onSwitchToCinematic}
            className="flex items-center gap-2 border border-[#E2B93B]/40 bg-[#0A0A0A]/90 px-4 py-2 text-[10px] tracking-[0.2em] text-[#E2B93B] backdrop-blur-sm transition-colors hover:border-[#E2B93B]/70 hover:bg-[#E2B93B]/5"
            style={{ fontFamily: "monospace" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9l5 3-5 3V9z" />
            </svg>
            CINEMATIC
          </button>
        )}
        {caseStudy.liveDemoUrl && caseStudy.liveDemoUrl !== "#" && (
          <a
            href={caseStudy.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#E2B93B]/40 bg-[#0A0A0A]/90 px-4 py-2 text-[10px] tracking-[0.2em] text-[#E2B93B] backdrop-blur-sm transition-colors hover:border-[#E2B93B]/70 hover:bg-[#E2B93B]/5"
            style={{ fontFamily: "monospace" }}
          >
            LIVE DEMO &rarr;
          </a>
        )}
      </div>

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

/* ─── Next case studies footer ───────────────────────────────── */
// Shows up to two *related* studies as cards (thumbnail + title + summary).
// Relevance = shared tags with the current study; ties and shortfalls fall back
// to source order so we always surface two when the catalogue allows.
function NextCaseStudyFooter({
  currentSlug,
  allCaseStudies,
  onNavigate,
}: {
  currentSlug: string;
  allCaseStudies: CaseStudy[];
  onNavigate?: (slug: string) => void;
}) {
  const current = allCaseStudies.find((cs) => cs.slug === currentSlug);
  const others = allCaseStudies.filter((cs) => cs.slug !== currentSlug);
  if (!current || others.length === 0) return null;

  const currentTags = new Set((current.meta.tags || []).map((t) => t.toLowerCase()));
  const picks = others
    .map((cs, idx) => ({
      cs,
      idx,
      score: (cs.meta.tags || []).filter((t) => currentTags.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, 2)
    .map((s) => s.cs);

  if (picks.length === 0) return null;

  return (
    <div className="relative z-10 border-t border-[#1a1a1a] px-6 md:px-16 lg:px-24 py-16 md:py-24">
      <span className="text-[10px] tracking-[0.3em] text-[#555] block mb-8" style={{ fontFamily: "monospace" }}>
        {picks.length > 1 ? "NEXT CASE STUDIES" : "NEXT CASE STUDY"}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {picks.map((cs) => (
          <button
            key={cs.slug}
            onClick={() => onNavigate?.(cs.slug)}
            className="group text-left block"
          >
            <div className="relative overflow-hidden border border-[#1a1a1a] aspect-[16/10] bg-[#111]">
              {cs.meta.cover && (
                <img
                  src={cs.meta.cover}
                  alt={cs.meta.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/85 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="text-2xl md:text-3xl text-white group-hover:text-[#E2B93B] transition-colors"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {cs.meta.title}
                </h3>
                <p
                  className="text-[#666] mt-1 text-sm line-clamp-2"
                  style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                >
                  {cs.meta.summary}
                </p>
              </div>
              <span
                className="shrink-0 mt-2 text-[#555] transition-all group-hover:text-[#E2B93B] group-hover:translate-x-1"
                aria-hidden
              >
                &rarr;
              </span>
            </div>
            {(cs.meta.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {cs.meta.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] text-[#555] border border-[#222] px-2 py-1"
                    style={{ fontFamily: "monospace", letterSpacing: "var(--meta-tracking, 0.15em)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}