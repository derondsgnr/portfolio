"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { useCaseStudyMedia } from "../case-study/case-study-media-context";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const SWIPE_THRESHOLD = 60;

/**
 * Case-study-wide media viewer. Rendered once per reader/cinematic view via
 * `CaseStudyMediaProvider` + `useCaseStudyMedia`. Portals to `document.body` so it
 * always covers the full viewport — including the global sidebar — regardless of
 * any `transform`/containing-block ancestors. Lets the reader page through every
 * expandable image in the study (not just the current slide's gallery).
 */
export function CaseStudyMediaLightbox() {
  const media = useCaseStudyMedia();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const openIndex = media?.openIndex ?? null;
  const open = openIndex !== null;
  const item = media && openIndex !== null ? media.items[openIndex] : undefined;

  useEffect(() => {
    if (!open || !media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") media.close();
      else if (e.key === "ArrowRight") media.next();
      else if (e.key === "ArrowLeft") media.prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, media]);

  if (!mounted || !media) return null;

  const { items } = media;
  const hasMultiple = items.length > 1;

  const contentMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { scale: 0.96, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.96, opacity: 0 } };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) media.next();
    else if (info.offset.x >= SWIPE_THRESHOLD) media.prev();
  };

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="case-study-media-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[300] flex items-center justify-center px-4 py-6 md:px-12 md:py-10"
          style={{ background: "rgba(18, 19, 22,0.97)", backdropFilter: "blur(12px)" }}
          onClick={() => media.close()}
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
        >
          {/* Position counter */}
          {hasMultiple && (
            <span
              className="absolute top-5 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-[320] text-[10px] tracking-[0.18em] text-white/40"
              style={{ fontFamily: "monospace" }}
            >
              {openIndex! + 1} / {items.length}
            </span>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              media.close();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[320] flex items-center gap-2 border border-[#ECFF95]/40 bg-[#121316]/80 px-3 py-2 text-[#ECFF95] backdrop-blur-sm transition-colors hover:bg-[#ECFF95] hover:text-[#121316]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            <span className="hidden md:inline text-[9px] tracking-[0.18em]" style={{ fontFamily: "monospace" }}>
              CLOSE
            </span>
          </button>

          {/* Prev/next — desktop arrows */}
          {hasMultiple && (
            <>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    media.prev();
                  }}
                  aria-label="Previous image"
                  className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[320] h-11 w-11 items-center justify-center border border-white/10 text-white/50 transition-colors hover:border-[#ECFF95] hover:text-[#ECFF95]"
                >
                  &#8592;
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  media.next();
                }}
                aria-label="Next image"
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[320] h-11 w-11 items-center justify-center border border-white/10 text-white/50 transition-colors hover:border-[#ECFF95] hover:text-[#ECFF95]"
              >
                &#8594;
              </button>
            </>
          )}

          {/* Media */}
          <motion.div
            key={openIndex}
            {...contentMotion}
            transition={{ duration: 0.28, ease: EASE }}
            drag={hasMultiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={hasMultiple ? handleDragEnd : undefined}
            className="relative flex w-[94vw] flex-col items-center justify-center sm:w-[88vw] md:w-[78vw]"
            style={{ height: "min(82vh, 1000px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-full max-w-full object-contain"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
              draggable={false}
            />
            {item.caption?.trim() && (
              <span
                className="mt-4 max-w-lg text-center text-[10px] tracking-[0.14em] text-white/45"
                style={{ fontFamily: "monospace" }}
              >
                {item.caption}
              </span>
            )}
          </motion.div>

          {/* Exit / browse hint */}
          <div className="absolute bottom-5 left-1/2 z-[310] -translate-x-1/2 text-center">
            <span className="text-[9px] tracking-[0.15em] text-white/30" style={{ fontFamily: "monospace" }}>
              {hasMultiple ? (
                <>
                  <span className="md:hidden">SWIPE OR TAP OUTSIDE TO CLOSE</span>
                  <span className="hidden md:inline">&larr; &rarr; TO BROWSE &middot; ESC OR TAP OUTSIDE TO CLOSE</span>
                </>
              ) : (
                <>
                  <span className="md:hidden">TAP OUTSIDE TO CLOSE</span>
                  <span className="hidden md:inline">ESC OR TAP OUTSIDE TO CLOSE</span>
                </>
              )}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
