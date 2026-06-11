"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import type { Slide } from "../../../types/case-study";

export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
}

interface CaseStudyMediaContextValue {
  items: MediaItem[];
  openIndex: number | null;
  openAt: (src?: string) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const CaseStudyMediaContext = createContext<CaseStudyMediaContextValue | null>(null);

/** Walks a flat slide list (in render order) and collects every expandable image. */
function buildMediaItems(slides: Slide[]): MediaItem[] {
  const items: MediaItem[] = [];
  const push = (src: string | undefined, alt: string, caption?: string) => {
    if (!src?.trim()) return;
    items.push({ src, alt, caption });
  };

  slides.forEach((slide) => {
    switch (slide.type) {
      case "single-mockup":
        push(slide.image, slide.headline || "Screen mockup", slide.caption);
        break;
      case "mockup-gallery":
        slide.mockups.forEach((m, i) => push(m.image, m.label || `Mockup ${i + 1}`, m.label));
        break;
      case "flow":
        slide.screens.forEach((s, i) => push(s.image, s.label || `Screen ${i + 1}`, s.label));
        break;
      case "process":
        slide.artifacts.forEach((a) => push(a.image, a.label, a.description || a.label));
        break;
      case "embed":
        push(slide.fallbackImage, slide.headline || "Demo preview");
        break;
      default:
        break;
    }
  });

  return items;
}

/**
 * Case-study-wide media index for the shared lightbox. Wrap a reader/viewer with
 * this once, passing every slide in render order (across all acts) — `CaseStudyImage`
 * and the mockup gallery then call `openAt(src)` instead of managing their own
 * overlays, and the viewer can page through every expandable image in the study.
 */
export function CaseStudyMediaProvider({ slides, children }: { slides: Slide[]; children: React.ReactNode }) {
  const items = useMemo(() => buildMediaItems(slides), [slides]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (src?: string) => {
      if (!src?.trim()) return;
      const idx = items.findIndex((item) => item.src === src);
      if (idx !== -1) setOpenIndex(idx);
    },
    [items]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((v) => (v !== null && items.length ? (v + 1) % items.length : v));
  }, [items.length]);
  const prev = useCallback(() => {
    setOpenIndex((v) => (v !== null && items.length ? (v - 1 + items.length) % items.length : v));
  }, [items.length]);

  const value = useMemo(
    () => ({ items, openIndex, openAt, close, next, prev }),
    [items, openIndex, openAt, close, next, prev]
  );

  return <CaseStudyMediaContext.Provider value={value}>{children}</CaseStudyMediaContext.Provider>;
}

/** Returns `null` outside a `CaseStudyMediaProvider` — callers should treat that as "no shared lightbox available". */
export function useCaseStudyMedia(): CaseStudyMediaContextValue | null {
  return useContext(CaseStudyMediaContext);
}
