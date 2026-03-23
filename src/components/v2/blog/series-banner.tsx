"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { BlogPost, BlogSeries } from "@/types/blog";

interface SeriesBannerProps {
  series: BlogSeries;
  currentPosition: number;
  prev?: BlogPost;
  next?: BlogPost;
}

export function SeriesBanner({
  series,
  currentPosition,
  prev,
  next,
}: SeriesBannerProps) {
  const total = series.posts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="border-y border-[#1a1a1a] bg-[#0d0d0d]"
    >
      <div className="px-6 md:px-14 lg:px-20 py-4 flex items-center justify-between gap-4">
        {/* Left: Series label + title */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-[9px] tracking-[0.25em] text-[#E2B93B] flex-shrink-0"
            style={{ fontFamily: "monospace" }}
          >
            SERIES
          </span>
          <span className="text-[#2a2a2a] flex-shrink-0">/</span>
          <Link
            href={`/blog/series/${series.slug}`}
            className="text-[11px] tracking-[0.1em] text-[#777] hover:text-[#E2B93B] transition-colors truncate"
            style={{ fontFamily: "monospace", textDecoration: "none" }}
          >
            {series.title.toUpperCase()}
          </Link>
        </div>

        {/* Center: Progress dots */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {Array.from({ length: total }, (_, i) => {
            const pos = i + 1;
            const isCurrent = pos === currentPosition;
            const isPast = pos < currentPosition;
            return (
              <motion.div
                key={i}
                className="relative"
                animate={{
                  scale: isCurrent ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isCurrent
                      ? "#E2B93B"
                      : isPast
                        ? "rgba(226,185,59,0.3)"
                        : "#333",
                  }}
                />
              </motion.div>
            );
          })}
          <span
            className="text-[9px] tracking-[0.1em] text-[#444] ml-2"
            style={{ fontFamily: "monospace" }}
          >
            {currentPosition}/{total}
          </span>
        </div>

        {/* Right: Prev/Next */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors"
              style={{ fontFamily: "monospace", textDecoration: "none" }}
            >
              ← PREV
            </Link>
          ) : (
            <span
              className="text-[10px] tracking-[0.15em] text-[#222]"
              style={{ fontFamily: "monospace" }}
            >
              ← PREV
            </span>
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors"
              style={{ fontFamily: "monospace", textDecoration: "none" }}
            >
              NEXT →
            </Link>
          ) : (
            <span
              className="text-[10px] tracking-[0.15em] text-[#222]"
              style={{ fontFamily: "monospace" }}
            >
              NEXT →
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
