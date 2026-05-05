"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost, BlogCategory, BlogSeries } from "@/types/blog";
import { SeriesBadge } from "@/components/v2/blog/series-badge";

/* ─── Types ──────────────────────────────────────────────────── */

export interface BlogPageCopy {
  title: string;
  label: string;
  description: string;
}

export interface BlogPageProps {
  copy: BlogPageCopy;
  categories: (BlogCategory | "All")[];
  posts: BlogPost[];
  series: BlogSeries[];
}

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
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
            <Image
              src={post.meta.cover}
              alt={post.meta.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700 scale-100 group-hover:scale-105 transition-transform duration-1000"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(226,185,59,0.015) 3px, rgba(226,185,59,0.015) 4px)",
              }}
            />
            <div className="absolute top-4 left-4">
              <span
                className="text-[9px] tracking-[0.25em] px-3 py-1.5 bg-[#E2B93B] text-[#0A0A0A]"
                style={{ fontFamily: "monospace" }}
              >
                FEATURED
              </span>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-0 md:border-l-0 p-8 md:p-12 flex flex-col justify-between group-hover:border-[#E2B93B]/20 transition-colors duration-500">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span
                  className="text-[10px] tracking-[0.2em] text-[#E2B93B]"
                  style={{ fontFamily: "monospace" }}
                >
                  {post.meta.category.toUpperCase()}
                </span>
                <span className="text-[#2a2a2a]">·</span>
                <span className="text-[10px] tracking-[0.1em] text-[#444]" style={{ fontFamily: "monospace" }}>
                  {formatDate(post.meta.date)}
                </span>
                <span className="text-[#2a2a2a]">·</span>
                <span className="text-[10px] tracking-[0.1em] text-[#444]" style={{ fontFamily: "monospace" }}>
                  {post.meta.readingTime} MIN
                </span>
              </div>

              <h2
                className="text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-none mb-6 group-hover:text-[#E2B93B] transition-colors duration-500"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
              >
                {post.meta.title}
              </h2>

              <p className="text-[#555] text-sm leading-relaxed" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
                {post.meta.summary}
              </p>
            </div>

            <div className="flex items-end justify-between mt-10">
              <div className="flex flex-wrap gap-2">
                {post.meta.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[9px] tracking-[0.12em] px-2 py-1 border border-[#1a1a1a] text-[#333]" style={{ fontFamily: "monospace" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[11px] tracking-[0.15em] text-[#E2B93B] group-hover:gap-3 transition-all flex items-center gap-2" style={{ fontFamily: "monospace" }}>
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

function PostCard({
  post,
  index,
  seriesLookup,
}: {
  post: BlogPost;
  index: number;
  seriesLookup: Map<string, BlogSeries>;
}) {
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
        <div className="relative overflow-hidden aspect-[16/10] mb-5">
          <Image
            src={post.meta.cover}
            alt={post.meta.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[9px] tracking-[0.2em] px-2.5 py-1 bg-[#0a0a0a]/80 border border-[#E2B93B]/30 text-[#E2B93B]" style={{ fontFamily: "monospace" }}>
              {post.meta.category.toUpperCase()}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="text-[9px] tracking-[0.1em] px-2 py-1 bg-[#0a0a0a]/60 text-[#555]" style={{ fontFamily: "monospace" }}>
              {post.meta.readingTime} MIN
            </span>
          </div>
        </div>

        {post.meta.series && (() => {
          const s = seriesLookup.get(post.meta.series.slug);
          return s ? (
            <SeriesBadge seriesTitle={s.title} position={post.meta.series.position} total={s.posts.length} />
          ) : null;
        })()}

        <span className="text-[9px] tracking-[0.1em] text-[#444] block mb-2" style={{ fontFamily: "monospace" }}>
          {formatDate(post.meta.date)}
        </span>

        <h3
          className="text-white text-xl md:text-2xl uppercase leading-tight mb-3 group-hover:text-[#E2B93B] transition-colors duration-400"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          {post.meta.title}
        </h3>

        <p className="text-[#444] text-[12px] leading-relaxed mb-4" style={{ fontFamily: "monospace", lineHeight: 1.8 }}>
          {post.meta.summary.slice(0, 100)}…
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.meta.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[8px] tracking-[0.1em] px-2 py-0.5 border border-[#1a1a1a] text-[#333]" style={{ fontFamily: "monospace" }}>
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Blog Index ──────────────────────────────────────────────── */

export default function BlogPageClient({ copy, categories, posts, series }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");
  const [filterMode, setFilterMode] = useState<"category" | "series">("category");
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const featured = posts.find((post) => post.meta.featured) ?? posts[0];
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const allSeries = series;
  const seriesBySlug = new Map(allSeries.map((item) => [item.slug, item]));

  const filtered =
    filterMode === "series"
      ? activeSeries
        ? (seriesBySlug.get(activeSeries)?.posts ?? [])
            .map((slug) => posts.find((post) => post.slug === slug))
            .filter((post): post is BlogPost => Boolean(post))
        : []
      : posts.filter((p) =>
          activeCategory === "All" ? true : p.meta.category === activeCategory
        );
  const nonFeatured =
    filterMode === "series"
      ? filtered
      : filtered.filter((p) => !p.meta.featured);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
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
              {copy.label} / {posts.length} PIECES
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
              {copy.title}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:max-w-xs md:pb-3"
          >
            <p className="text-[#444] text-sm leading-relaxed" style={{ fontFamily: "monospace", lineHeight: 1.9 }}>
              {copy.description}
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

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const hasPost = cat === "All" || posts.some((p) => p.meta.category === cat);
            if (!hasPost) return null;
            const active = filterMode === "category" && activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => {
                  setFilterMode("category");
                  setActiveSeries(null);
                  setActiveCategory(cat);
                }}
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

          {allSeries.length > 0 && <div className="w-px h-5 bg-[#1a1a1a] mx-1" />}

          {allSeries.length > 0 && (
            <motion.button
              onClick={() => {
                if (filterMode === "series") {
                  setFilterMode("category");
                  setActiveSeries(null);
                  setActiveCategory("All");
                } else {
                  setFilterMode("series");
                  setActiveSeries(null);
                }
              }}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              className="text-[10px] tracking-[0.15em] px-4 py-2 border transition-all duration-200"
              style={{
                fontFamily: "monospace",
                borderColor: filterMode === "series" ? "#E2B93B" : "#1a1a1a",
                color: filterMode === "series" ? "#E2B93B" : "#444",
                background: filterMode === "series" ? "rgba(226,185,59,0.08)" : "transparent",
              }}
            >
              SERIES
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Series cards strip ─────────────────────────────────── */}
      {filterMode === "series" && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-12">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {allSeries.map((s) => {
              const isActive = activeSeries === s.slug;
              return (
                <motion.button
                  key={s.slug}
                  onClick={() => setActiveSeries(isActive ? null : s.slug)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex-shrink-0 flex items-center gap-4 border p-3 pr-6 transition-all duration-300 text-left"
                  style={{
                    borderColor: isActive ? "#E2B93B" : "#1a1a1a",
                    background: isActive ? "rgba(226,185,59,0.05)" : "#0d0d0d",
                  }}
                >
                  {s.cover && (
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden relative">
                      <Image src={s.cover} alt={s.title} fill sizes="56px" className="object-cover opacity-60" />
                    </div>
                  )}
                  <div>
                    <span className="text-white text-sm uppercase block leading-tight mb-1" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
                      {s.title}
                    </span>
                    <span className="text-[9px] tracking-[0.15em] text-[#555] block" style={{ fontFamily: "monospace" }}>
                      {s.posts.length} PARTS
                    </span>
                    <div className="w-20 h-px bg-[#1a1a1a] mt-2 relative">
                      <div className="absolute top-0 left-0 h-full bg-[#E2B93B]" style={{ width: "100%" }} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Featured post ─────────────────────────────────────── */}
      {filterMode === "category" && featured && (activeCategory === "All" || featured.meta.category === activeCategory) && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-16">
          <FeaturedCard post={featured} />
        </div>
      )}

      {/* ── Post grid ─────────────────────────────────────────── */}
      {nonFeatured.length > 0 && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-32">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[9px] tracking-[0.3em] text-[#333]" style={{ fontFamily: "monospace" }}>
              {filterMode === "series" && activeSeries
                ? seriesBySlug.get(activeSeries)?.title.toUpperCase() ?? "SERIES"
                : "ALL PIECES"}
            </span>
            <div className="h-px flex-1 bg-[#111]" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {nonFeatured.map((post, i) => (
              <div key={post.slug} className={i === 0 ? "md:col-span-2" : ""}>
                <PostCard post={post} index={i} seriesLookup={seriesBySlug} />
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="relative z-10 px-6 md:px-14 lg:px-20 py-32 text-center">
          <span className="text-[10px] tracking-[0.2em] text-[#333]" style={{ fontFamily: "monospace" }}>
            {filterMode === "series"
              ? activeSeries
                ? "NO PIECES IN THIS SERIES YET"
                : "SELECT A SERIES ABOVE"
              : "NO PIECES IN THIS CATEGORY YET"}
          </span>
        </div>
      )}
    </div>
  );
}
