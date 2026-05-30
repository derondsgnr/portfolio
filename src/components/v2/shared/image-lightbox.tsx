"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Fullscreen image lightbox. Shared by case-study slides and any other surface
 * that needs click-to-expand. Closes on Escape, backdrop click, or the close
 * button; locks body scroll while open and respects reduced-motion.
 */
export function ImageLightbox({
  open,
  onClose,
  src,
  alt,
  caption,
}: {
  open: boolean;
  onClose: () => void;
  src?: string;
  alt: string;
  caption?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const contentMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { scale: 0.96, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.96, opacity: 0 },
      };

  return (
    <AnimatePresence>
      {open && src?.trim() && (
        <motion.div
          key="image-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-16 md:px-16"
          style={{ background: "rgba(10,10,10,0.96)", backdropFilter: "blur(10px)" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 z-[210] flex items-center justify-center transition-all duration-200 hover:border-[#E2B93B] hover:text-[#F0F0F0]"
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
              fontSize: "18px",
            }}
          >
            ×
          </button>

          <motion.div
            {...contentMotion}
            transition={{ duration: 0.28, ease: EASE }}
            className="relative flex max-h-full max-w-6xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] max-w-full object-contain"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
            />
            {caption?.trim() && (
              <span
                className="mt-4 max-w-lg text-center text-[10px] tracking-[0.14em] text-white/45"
                style={{ fontFamily: "monospace" }}
              >
                {caption}
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
