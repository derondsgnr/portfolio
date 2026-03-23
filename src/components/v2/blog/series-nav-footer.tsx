"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import type { BlogPost, BlogSeries } from "@/types/blog";

interface SeriesNavFooterProps {
  series: BlogSeries;
  currentPosition: number;
  prev?: BlogPost;
  next?: BlogPost;
}

export function SeriesNavFooter({
  series,
  currentPosition,
  prev,
  next,
}: SeriesNavFooterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (!prev && !next) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="border border-[#1a1a1a] mt-16"
    >
      {/* Header */}
      <div className="px-6 md:px-8 py-4 border-b border-[#111] flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.3em] text-[#444]"
          style={{ fontFamily: "monospace" }}
        >
          CONTINUE THE SERIES
        </span>
        <Link
          href={`/blog/series/${series.slug}`}
          className="text-[9px] tracking-[0.15em] text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors"
          style={{ fontFamily: "monospace", textDecoration: "none" }}
        >
          VIEW ALL {series.posts.length} PARTS →
        </Link>
      </div>

      {/* Prev / Next */}
      <div
        className={`grid ${prev && next ? "md:grid-cols-2" : "grid-cols-1"}`}
      >
        {prev && (
          <Link
            href={`/blog/${prev.slug}`}
            className={`group block p-6 md:p-8 ${next ? "md:border-r border-[#111]" : ""} hover:bg-[#0d0d0d] transition-colors`}
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] tracking-[0.1em] text-[#555] group-hover:text-[#E2B93B] transition-colors"
                style={{ fontFamily: "monospace" }}
              >
                ←
              </span>
              <span
                className="text-[9px] tracking-[0.2em] text-[#333]"
                style={{ fontFamily: "monospace" }}
              >
                PART {currentPosition - 1} OF {series.posts.length}
              </span>
            </div>
            <h4
              className="text-white text-lg md:text-xl uppercase leading-tight group-hover:text-[#E2B93B] transition-colors duration-300 mb-2"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.02em",
              }}
            >
              {prev.meta.title}
            </h4>
            <p
              className="text-[#444] text-[11px] leading-relaxed"
              style={{ fontFamily: "monospace" }}
            >
              {prev.meta.summary.slice(0, 90)}…
            </p>
          </Link>
        )}

        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group block p-6 md:p-8 hover:bg-[#0d0d0d] transition-colors"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-center gap-2 mb-3 md:justify-end">
              <span
                className="text-[9px] tracking-[0.2em] text-[#333]"
                style={{ fontFamily: "monospace" }}
              >
                PART {currentPosition + 1} OF {series.posts.length}
              </span>
              <span
                className="text-[9px] tracking-[0.1em] text-[#555] group-hover:text-[#E2B93B] transition-colors"
                style={{ fontFamily: "monospace" }}
              >
                →
              </span>
            </div>
            <h4
              className="text-white text-lg md:text-xl uppercase leading-tight group-hover:text-[#E2B93B] transition-colors duration-300 mb-2 md:text-right"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.02em",
              }}
            >
              {next.meta.title}
            </h4>
            <p
              className="text-[#444] text-[11px] leading-relaxed md:text-right"
              style={{ fontFamily: "monospace" }}
            >
              {next.meta.summary.slice(0, 90)}…
            </p>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
