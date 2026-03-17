import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CaseStudy, Slide } from "../../../types/case-study";
import { SlideRenderer, ScrambleHeading } from "./slide-renderer";

/**
 * CINEMATIC VIEWER — Full-viewport slide-by-slide mode
 *
 * Navigation:
 *   Desktop: scroll/wheel (debounced), arrow keys, sidebar list
 *   Mobile: swipe gestures (30px threshold), bottom bar, list sheet
 *   Escape exits back to /work
 *
 * UX: X button → /work (complete exit). "READER" button → reader mode.
 */

interface CinematicViewerProps {
  caseStudy: CaseStudy;
  onExit: () => void;
  /** Navigate completely out of the case study (e.g. to /work) */
  onNavigateBack?: () => void;
  allCaseStudies?: CaseStudy[];
  onSwitchCaseStudy?: (slug: string) => void;
  startSlideIndex?: number;
}

export function CinematicViewer({
  caseStudy,
  onExit,
  onNavigateBack,
  allCaseStudies = [],
  onSwitchCaseStudy,
  startSlideIndex = 0,
}: CinematicViewerProps) {
  const allSlides = caseStudy.acts.flatMap((act) => act.slides);
  const [currentIndex, setCurrentIndex] = useState(startSlideIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const cooldownRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = allSlides[currentIndex];
  const progress = ((currentIndex + 1) / allSlides.length) * 100;

  // Find which act this slide belongs to
  let slideCounter = 0;
  let currentAct = 0;
  for (let a = 0; a < caseStudy.acts.length; a++) {
    for (let s = 0; s < caseStudy.acts[a].slides.length; s++) {
      if (slideCounter === currentIndex) {
        currentAct = a;
        break;
      }
      slideCounter++;
    }
  }

  // Close handler: X goes to /work if available, otherwise falls back to reader
  const handleClose = useCallback(() => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      onExit();
    }
  }, [onNavigateBack, onExit]);

  const navigate = useCallback((dir: 1 | -1) => {
    if (cooldownRef.current) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= allSlides.length) return;

    cooldownRef.current = true;
    setDirection(dir);
    setCurrentIndex(next);

    setTimeout(() => { cooldownRef.current = false; }, 300);
  }, [currentIndex, allSlides.length]);

  const goToSlide = useCallback((idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, handleClose]);

  // Wheel navigation (debounced)
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-sidebar-list]") || target.closest("[data-mobile-list]")) return;

      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        navigate(e.deltaY > 0 ? 1 : -1);
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handler, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handler); };
  }, [navigate]);

  // Touch/swipe for mobile — lower threshold, track movement better
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    // Lower threshold for easier swiping (30px instead of 50px)
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
      navigate(dy < 0 ? 1 : -1);
    } else if (Math.abs(dx) > 30) {
      navigate(dx < 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Preload adjacent images
  useEffect(() => {
    [-1, 1].forEach((offset) => {
      const s = allSlides[currentIndex + offset];
      if (!s) return;
      const imgSrc = "heroImage" in s ? (s as any).heroImage :
                     "image" in s ? (s as any).image :
                     "posterImage" in s ? (s as any).posterImage : null;
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
      }
    });
  }, [currentIndex, allSlides]);

  const slideVariants = {
    enter: (d: number) => ({
      y: d > 0 ? "30%" : "-30%",
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({
      y: d > 0 ? "-30%" : "30%",
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${caseStudy.meta.title} — Cinematic view`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Top bar ─────────────────────────────────── */}
      <div className="relative z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b border-[#1a1a1a] bg-[#0A0A0A]/95 backdrop-blur-sm">
        {/* Gold progress bar — overlaid on top bar */}
        <motion.div
          className="absolute top-0 left-0 h-[3px] bg-[#E2B93B] z-10"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {/* Left: close + reader toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="text-[#666] hover:text-white transition-colors text-lg"
            aria-label="Close case study"
          >
            &times;
          </button>
          {/* Reader mode toggle */}
          <button
            onClick={onExit}
            className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors border border-[#222] hover:border-[#E2B93B]/30 px-2 py-1"
            style={{ fontFamily: "monospace" }}
          >
            READER
          </button>
          <span className="text-[10px] tracking-[0.2em] text-[#E2B93B] hidden md:block" style={{ fontFamily: "monospace" }}>
            {caseStudy.meta.title}
          </span>
        </div>

        {/* Center: counter */}
        <span className="text-[10px] tracking-[0.2em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
          {String(currentIndex + 1).padStart(2, "0")} / {String(allSlides.length).padStart(2, "0")}
        </span>

        {/* Right: act + sidebar toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.1em] text-[#555] hidden md:block" style={{ fontFamily: "monospace" }}>
            {caseStudy.acts[currentAct]?.title}
          </span>

          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden md:block text-[10px] tracking-[0.1em] text-[#555] hover:text-[#E2B93B] transition-colors border border-[#222] px-2 py-1"
            style={{ fontFamily: "monospace" }}
          >
            {showSidebar ? "HIDE" : "LIST"}
          </button>

          {/* Mobile list toggle */}
          <button
            onClick={() => setShowMobileList(!showMobileList)}
            className="md:hidden text-[#666] hover:text-white text-sm"
            aria-label="Show slide list"
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* ─── Main content area ───────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Slide content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <SlideRenderer slide={currentSlide} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows (desktop) */}
          <div className="hidden md:flex absolute bottom-6 right-6 gap-2 z-30">
            <button
              onClick={() => navigate(-1)}
              disabled={currentIndex === 0}
              className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#E2B93B] hover:text-[#E2B93B] disabled:opacity-20 disabled:hover:border-[#333] disabled:hover:text-[#666] transition-colors"
              aria-label="Previous slide"
            >
              &#8593;
            </button>
            <button
              onClick={() => navigate(1)}
              disabled={currentIndex === allSlides.length - 1}
              className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#E2B93B] hover:text-[#E2B93B] disabled:opacity-20 disabled:hover:border-[#333] disabled:hover:text-[#666] transition-colors"
              aria-label="Next slide"
            >
              &#8595;
            </button>
          </div>

          {/* Scroll hint (first slide only) */}
          {currentIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-center md:hidden"
            >
              <span className="text-[9px] tracking-[0.2em] text-[#555] block" style={{ fontFamily: "monospace" }}>
                SWIPE TO NAVIGATE
              </span>
            </motion.div>
          )}
        </div>

        {/* ─── Desktop sidebar ───────────────────────── */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block border-l border-[#1a1a1a] bg-[#0A0A0A] overflow-hidden"
            >
              <div
                data-sidebar-list
                className="h-full overflow-y-auto p-4 space-y-1"
              >
                {caseStudy.acts.map((act, actIdx) => {
                  let slideOffset = 0;
                  for (let a = 0; a < actIdx; a++) {
                    slideOffset += caseStudy.acts[a].slides.length;
                  }

                  return (
                    <div key={actIdx}>
                      <span
                        className="text-[9px] tracking-[0.3em] text-[#E2B93B] block py-2 px-2"
                        style={{ fontFamily: "monospace" }}
                      >
                        {act.title}
                      </span>
                      {act.slides.map((slide, slideIdx) => {
                        const globalIdx = slideOffset + slideIdx;
                        const isActive = globalIdx === currentIndex;
                        const label = "headline" in slide ? (slide as any).headline :
                                      "actTitle" in slide ? (slide as any).actTitle :
                                      `Slide ${globalIdx + 1}`;

                        return (
                          <button
                            key={slide.id}
                            onClick={() => goToSlide(globalIdx)}
                            className={`w-full text-left px-2 py-1.5 text-[11px] transition-colors flex items-center gap-2 ${
                              isActive
                                ? "text-[#E2B93B] bg-[#E2B93B]/5"
                                : "text-[#666] hover:text-[#999] hover:bg-[#111]"
                            }`}
                            style={{ fontFamily: "monospace" }}
                            aria-selected={isActive}
                          >
                            <span className="text-[9px] text-[#444] w-4 flex-shrink-0">
                              {String(globalIdx + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate" style={{ textTransform: "none" }}>
                              {label?.substring(0, 35)}{(label?.length || 0) > 35 ? "..." : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Mobile bottom bar ───────────────────────── */}
      <div className="md:hidden border-t border-[#1a1a1a] bg-[#0A0A0A] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#666] truncate flex-1" style={{ fontFamily: "monospace", textTransform: "none" }}>
            {"headline" in currentSlide ? (currentSlide as any).headline?.substring(0, 40) : `Slide ${currentIndex + 1}`}
          </span>
          <div className="flex gap-3 ml-3">
            <button
              onClick={() => navigate(-1)}
              disabled={currentIndex === 0}
              className="text-[#666] disabled:opacity-20 p-1"
              aria-label="Previous"
            >
              &#9664;
            </button>
            <button
              onClick={() => navigate(1)}
              disabled={currentIndex === allSlides.length - 1}
              className="text-[#666] disabled:opacity-20 p-1"
              aria-label="Next"
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile list sheet ───────────────────────── */}
      <AnimatePresence>
        {showMobileList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[110]"
              onClick={() => setShowMobileList(false)}
            />
            <motion.div
              data-mobile-list
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-[#111] border-t border-[#E2B93B]/20 rounded-t-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] tracking-[0.3em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
                    SLIDES
                  </span>
                  <button
                    onClick={() => setShowMobileList(false)}
                    className="text-[#666] text-lg"
                  >
                    &times;
                  </button>
                </div>

                {caseStudy.acts.map((act, actIdx) => {
                  let slideOffset = 0;
                  for (let a = 0; a < actIdx; a++) {
                    slideOffset += caseStudy.acts[a].slides.length;
                  }

                  return (
                    <div key={actIdx} className="mb-3">
                      <span className="text-[9px] tracking-[0.2em] text-[#E2B93B] block mb-1 px-2" style={{ fontFamily: "monospace" }}>
                        {act.title}
                      </span>
                      {act.slides.map((slide, slideIdx) => {
                        const globalIdx = slideOffset + slideIdx;
                        const isActive = globalIdx === currentIndex;
                        const label = "headline" in slide ? (slide as any).headline :
                                      "actTitle" in slide ? (slide as any).actTitle :
                                      `Slide ${globalIdx + 1}`;

                        return (
                          <button
                            key={slide.id}
                            onClick={() => {
                              goToSlide(globalIdx);
                              setShowMobileList(false);
                            }}
                            className={`w-full text-left px-2 py-2 text-sm flex items-center gap-3 ${
                              isActive ? "text-[#E2B93B] bg-[#E2B93B]/5" : "text-[#888]"
                            }`}
                            style={{ fontFamily: "monospace", textTransform: "none" }}
                          >
                            <span className="text-[9px] text-[#444] w-5 flex-shrink-0">
                              {String(globalIdx + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate">{label?.substring(0, 40)}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Aria live region ────────────────────────── */}
      <div className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {allSlides.length}:
        {"headline" in currentSlide ? ` ${(currentSlide as any).headline}` : ""}
      </div>
    </div>
  );
}