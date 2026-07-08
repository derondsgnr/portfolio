"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const SHOW_THRESHOLD = 400;
const NEAR_BOTTOM_PADDING = 80;

/**
 * Site-wide floating scroll-to-top / scroll-to-bottom affordance. Fades in once
 * the page has scrolled past a threshold and fades out near the natural edges.
 */
export function ScrollAffordances() {
  const prefersReducedMotion = useReducedMotion();
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [visible, setVisible] = useState(false);

  const updateState = useCallback(() => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;
    setVisible(scrollY > SHOW_THRESHOLD);
    setAtTop(scrollY <= 0);
    setAtBottom(scrollY + innerHeight >= scrollHeight - NEAR_BOTTOM_PADDING);
  }, []);

  useEffect(() => {
    updateState();
    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const buttonClass =
    "flex h-9 w-9 items-center justify-center border border-[#ECFF95]/30 bg-[#121316]/85 text-[#ECFF95] backdrop-blur-sm transition-colors hover:border-[#ECFF95]/70 hover:bg-[#ECFF95]/10 disabled:cursor-default disabled:opacity-30 disabled:hover:border-[#ECFF95]/30 disabled:hover:bg-[#121316]/85";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-4 z-30 flex flex-col gap-2 md:right-8"
        >
          <button
            type="button"
            onClick={scrollToTop}
            disabled={atTop}
            aria-label="Scroll to top"
            className={buttonClass}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollToBottom}
            disabled={atBottom}
            aria-label="Scroll to bottom"
            className={buttonClass}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
