"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { BLOG_POSTS, getFeaturedPost } from "@/lib/data/blog-data";
import type { BlogPost, BlogCategory } from "@/types/blog";

/* ─── Helpers ─────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

/* ─── Featured Post Card ──────────────────────────────────────── */

function FeaturedCard({ post }: { post: BlogPost }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative group"
    >
      <Link href={`/blog/${post.slug}`} className="block" style={{ textDecoration: "none" }}>
        <div className="grid md:grid-cols-2 gap-0 items-stretch">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
            <img
              src={post.meta.cover}
              alt={post.meta.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700 scale-100 group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Scan overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(226,185,59,0.015) 3px, rgba(226,185,59,0.015) 4px)",
              }}
            />
            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span
                className="text-[9px] tracking-[0.25em] px-3 py-1.5 bg-[#E2B93B] text-[#0A0A0A]"
                style={{ fontFamily: "monospace" }}
              >
                FEATURED
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-0 md:border-l-0 p-8 md:p-12 flex flex-col justify-between group-hover:border-[#E2B93B]/20 transition-colors duration-500">
            <div>
              {/* Category + date */}
              <div className="flex items-center gap-3 mb-8">
                <span
                  className="text-[10px] tracking-[0.2em] text-[#E2B93B]"
                  style={{ fontFamily: "monospace" }}
                >
                  {post.meta.category.toUpperCase()}
                </span>
                <span className="text-[#2a2a2a]">·</span>
                <span
                  className="text-[10px] tracking-[0.1em] text-[#444]"
                  style={{ fontFamily: "monospace" }}
                >
                  {formatDate(post.meta.date)}
                </span>
                <span className="text-[#2a2a2a]">·</span>
                <span
                  className="text-[10px] tracking-[0.1em] text-[#444]"
                  style={{ fontFamily: "monospace" }}
                >
                  {post.meta.readingTime} MIN
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-none mb-6 group-hover:text-[#E2B93B] transition-colors duration-500"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.03em",
                }}
              >
                {post.meta.title}
              </h2>

              {/* Summary */}
              <p
                className="text-[#555] text-sm leading-relaxed"
                style={{ fontFamily: "monospace", lineHeight: 1.9 }}
              >
                {post.meta.summary}
              </p>
            </div>

            {/* Footer: tags + CTA */}
            <div className="flex items-end justify-between mt-10">
              <div className="flex flex-wrap gap-2">
                {post.meta.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.12em] px-2 py-1 border border-[#1a1a1a] text-[#333]"
                    style={{ fontFamily: "monospace" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                className="text-[11px] tracking-[0.15em] text-[#E2B93B] group-hover:gap-3 transition-all flex items-center gap-2"
                style={{ fontFamily: "monospace" }}
              >
                READ
                <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Post Card (grid) ────────────────────────────────────────── */

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block" style={{ textDecoration: "none" }}>
        {/* Cover */}
        <div className="relative overflow-hidden aspect-[16/10] mb-5">
          <img
            src={post.meta.cover}
            alt={post.meta.title}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[9px] tracking-[0.2em] px-2.5 py-1 bg-[#0a0a0a]/80 border border-[#E2B93B]/30 text-[#E2B93B]"
              style={{ fontFamily: "monospace" }}
            >
              {post.meta.category.toUpperCase()}
            </span>
          </div>
          {/* Reading time */}
          <div className="absolute bottom-3 right-3">
            <span
              className="text-[9px] tracking-[0.1em] px-2 py-1 bg-[#0a0a0a]/60 text-[#555]"
              style={{ fontFamily: "monospace" }}
            >
              {post.meta.readingTime} MIN
            </span>
          </div>
        </div>

        {/* Meta */}
        <span
          className="text-[9px] tracking-[0.1em] text-[#444] block mb-2"
          style={{ fontFamily: "monospace" }}
        >
          {formatDate(post.meta.date)}
        </span>

        {/* Title */}
        <h3
          className="text-white text-xl md:text-2xl uppercase leading-tight mb-3 group-hover:text-[#E2B93B] transition-colors duration-400"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.02em",
          }}
        >
          {post.meta.title}
        </h3>

        {/* Summary */}
        <p
          className="text-[#444] text-[12px] leading-relaxed mb-4"
          style={{ fontFamily: "monospace", lineHeight: 1.8 }}
        >
          {post.meta.summary.slice(0, 100)}…
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.meta.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[8px] tracking-[0.1em] px-2 py-0.5 border border-[#1a1a1a] text-[#333]"
              style={{ fontFamily: "monospace" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Blog Index ──────────────────────────────────────────────── */

const ALL_CATEGORIES: (BlogCategory | "All")[] = [
  "All",
  "Thinking",
  "Craft",
  "Process",
  "Case Notes",
  "Tools",
  "Industry",
  "Life",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");
  const featured = getFeaturedPost();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const filtered = BLOG_POSTS.filter((p) =>
    activeCategory === "All" ? true : p.meta.category === activeCategory
  );
  const nonFeatured = filtered.filter((p) => !p.meta.featured);

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

      {/* ── Hero header ──────────────────────────────────────── */}
      <div ref={heroRef} className="relative z-10 px-6 md:px-14 lg:px-20 pt-16 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-0">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-4"
              style={{ fontFamily: "monospace" }}
            >
              WRITING / {BLOG_POSTS.length} PIECES
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-7xl md:text-[9rem] lg:text-[12rem] uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              WRITING
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:max-w-xs md:pb-3"
          >
            <p
              className="text-[#444] text-sm leading-relaxed"
              style={{ fontFamily: "monospace", lineHeight: 1.9 }}
            >
              Notes from the intersection of design, code, and craft. Long-form thinking, not short-form takes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-8 h-px bg-gradient-to-r from-[#E2B93B] via-[#333] to-transparent origin-left"
        />
      </div>

      {/* ── Category filter ───────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-12">
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_CATEGORIES.map((cat) => {
            const hasPost =
              cat === "All" ||
              BLOG_POSTS.some((p) => p.meta.category === cat);
            if (!hasPost) return null;
            const active = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className="text-[10px] tracking-[0.15em] px-4 py-2 border transition-all duration-200"
                style={{
                  fontFamily: "monospace",
                  borderColor: active ? "#E2B93B" : "#1a1a1a",
                  color: active ? "#E2B93B" : "#444",
                  background: active ? "rgba(226,185,59,0.08)" : "transparent",
                }}
              >
                {cat.toUpperCase()}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Featured post ─────────────────────────────────────── */}
      {featured && (activeCategory === "All" || featured.meta.category === activeCategory) && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-16">
          <FeaturedCard post={featured} />
        </div>
      )}

      {/* ── Post grid ─────────────────────────────────────────── */}
      {nonFeatured.length > 0 && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <span
              className="text-[9px] tracking-[0.3em] text-[#333]"
              style={{ fontFamily: "monospace" }}
            >
              ALL PIECES
            </span>
            <div className="h-px flex-1 bg-[#111]" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {nonFeatured.map((post, i) => (
              <div
                key={post.slug}
                className={i === 0 ? "md:col-span-2" : ""}
              >
                <PostCard post={post} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 py-32 text-center">
          <span
            className="text-[10px] tracking-[0.2em] text-[#333]"
            style={{ fontFamily: "monospace" }}
          >
            NO PIECES IN THIS CATEGORY YET
          </span>
        </div>
      )}
    </div>
  );
}
