"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPost, BlogSeries } from "@/types/blog";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export default function SeriesPage({
  series,
  posts,
}: {
  series: BlogSeries | null;
  posts: BlogPost[];
}) {
  if (!series) return notFound();
  const totalReadingTime = posts.reduce(
    (sum, p) => sum + p.meta.readingTime,
    0
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Signal grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative z-10 px-6 md:px-14 lg:px-20 pt-16 pb-16"
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link
            href="/blog"
            className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors"
            style={{ fontFamily: "monospace", textDecoration: "none" }}
          >
            ← WRITING
          </Link>
        </motion.div>

        {/* Series label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-4"
          style={{ fontFamily: "monospace" }}
        >
          SERIES / {posts.length} PARTS · {totalReadingTime} MIN TOTAL
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[9rem] uppercase leading-none text-white mb-8"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
          }}
        >
          {series.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#555] text-sm leading-relaxed max-w-xl mb-10"
          style={{ fontFamily: "monospace", lineHeight: 1.9 }}
        >
          {series.description}
        </motion.p>

        {/* CTA */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href={`/blog/${posts[0].slug}`}
              className="inline-block text-[10px] tracking-[0.2em] px-6 py-3 border border-[#E2B93B] text-[#E2B93B] hover:bg-[#E2B93B] hover:text-[#0a0a0a] transition-all duration-300"
              style={{ fontFamily: "monospace", textDecoration: "none" }}
            >
              START READING →
            </Link>
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-12 h-px bg-gradient-to-r from-[#E2B93B] via-[#333] to-transparent origin-left"
        />
      </div>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-32">
        <div className="relative">
          {/* Gold connecting line */}
          <div
            className="absolute left-[15px] md:left-[19px] top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, #E2B93B, rgba(226,185,59,0.2) 80%, transparent)",
            }}
          />

          {posts.map((post, i) => (
            <TimelineItem key={post.slug} post={post} index={i} total={posts.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  post,
  index,
  total,
}: {
  post: BlogPost;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-12 md:pl-16 pb-12 last:pb-0"
    >
      {/* Dot */}
      <div
        className="absolute left-[11px] md:left-[15px] top-1 w-[9px] h-[9px] rounded-full border-2 border-[#E2B93B] bg-[#0a0a0a]"
      />

      {/* Position number */}
      <span
        className="text-[9px] tracking-[0.2em] text-[#E2B93B]/50 block mb-2"
        style={{ fontFamily: "monospace" }}
      >
        PART {index + 1} OF {total}
      </span>

      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        style={{ textDecoration: "none" }}
      >
        {/* Title */}
        <h2
          className="text-white text-2xl md:text-3xl uppercase leading-tight mb-3 group-hover:text-[#E2B93B] transition-colors duration-300"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.02em",
          }}
        >
          {post.meta.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[9px] tracking-[0.1em] text-[#444]"
            style={{ fontFamily: "monospace" }}
          >
            {formatDate(post.meta.date)}
          </span>
          <span className="text-[#2a2a2a]">·</span>
          <span
            className="text-[9px] tracking-[0.1em] text-[#444]"
            style={{ fontFamily: "monospace" }}
          >
            {post.meta.readingTime} MIN READ
          </span>
          <span className="text-[#2a2a2a]">·</span>
          <span
            className="text-[9px] tracking-[0.15em] px-2 py-0.5 border border-[#1a1a1a] text-[#333]"
            style={{ fontFamily: "monospace" }}
          >
            {post.meta.category.toUpperCase()}
          </span>
        </div>

        {/* Summary */}
        <p
          className="text-[#555] text-[12px] leading-relaxed max-w-lg"
          style={{ fontFamily: "monospace", lineHeight: 1.8 }}
        >
          {post.meta.summary}
        </p>

        {/* Read CTA */}
        <span
          className="text-[10px] tracking-[0.15em] text-[#444] group-hover:text-[#E2B93B] transition-colors mt-4 inline-flex items-center gap-2"
          style={{ fontFamily: "monospace" }}
        >
          READ
          <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">
            →
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
