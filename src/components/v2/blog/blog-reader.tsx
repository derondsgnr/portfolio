"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useInView } from "motion/react";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import type { Slide } from "@/types/case-study";
import { SlideRenderer } from "../case-study/slide-renderer";
import { getRelatedPosts } from "@/lib/data/blog-data";

/**
 * BLOG READER
 * Reuses SlideRenderer from the case study engine with blog-specific chrome:
 * Editorial masthead, reading progress bar, TOC from section-break slides,
 * author bio, related posts.
 */

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function extractTOC(
  slides: Slide[]
): { id: string; title: string; number: number }[] {
  return slides
    .filter((s) => s.type === "section-break")
    .map((s) => {
      const sb = s as Extract<Slide, { type: "section-break" }>;
      return { id: sb.id, title: sb.actTitle, number: sb.actNumber };
    });
}

function TOCSidebar({
  toc,
  activeSection,
}: {
  toc: { id: string; title: string; number: number }[];
  activeSection: string;
}) {
  if (!toc.length) return null;

  return (
    <div className="sticky top-24 space-y-1">
      <span
        className="text-[9px] tracking-[0.25em] text-[#444] block mb-4"
        style={{ fontFamily: "monospace" }}
      >
        IN THIS PIECE
      </span>
      {toc.map((item) => {
        const active = activeSection === item.id;
        return (
          <motion.a
            key={item.id}
            href={`#${item.id}`}
            animate={{ x: active ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 py-2 group transition-colors"
            style={{ textDecoration: "none" }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span
              className="text-[9px] transition-colors flex-shrink-0"
              style={{
                fontFamily: "monospace",
                color: active ? "#E2B93B" : "#333",
              }}
            >
              {String(item.number).padStart(2, "0")}
            </span>
            <span
              className="text-[11px] leading-snug transition-colors"
              style={{
                fontFamily: "monospace",
                color: active ? "#E2B93B" : "#444",
              }}
            >
              {item.title}
            </span>
            {active && (
              <motion.div
                layoutId="toc-indicator"
                className="w-1 h-1 rounded-full bg-[#E2B93B] flex-shrink-0"
              />
            )}
          </motion.a>
        );
      })}
    </div>
  );
}

function RelatedPosts({ slug }: { slug: string }) {
  const posts = getRelatedPosts(slug, 3);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (!posts.length) return null;

  return (
    <div ref={ref} className="border-t border-[#111] pt-20 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span
          className="text-[9px] tracking-[0.3em] text-[#444] block mb-10"
          style={{ fontFamily: "monospace" }}
        >
          MORE WRITING
        </span>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
              style={{ textDecoration: "none" }}
            >
              <div className="relative overflow-hidden aspect-[16/9] mb-4">
                <img
                  src={post.meta.cover}
                  alt={post.meta.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[9px] tracking-[0.2em] px-2.5 py-1 bg-[#0a0a0a]/80 text-[#E2B93B] border border-[#E2B93B]/30"
                    style={{ fontFamily: "monospace" }}
                  >
                    {post.meta.category.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
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
              </div>

              <h3
                className="text-white text-base leading-snug group-hover:text-[#E2B93B] transition-colors duration-300 mb-2"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
              >
                {post.meta.title}
              </h3>

              <p
                className="text-[#555] text-[12px] leading-relaxed"
                style={{ fontFamily: "monospace" }}
              >
                {post.meta.summary.slice(0, 80)}…
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AuthorBio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="border border-[#1a1a1a] p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 mt-20"
    >
      <div className="w-14 h-14 border border-[#E2B93B]/30 bg-[#E2B93B]/5 flex-shrink-0 flex items-center justify-center">
        <span
          className="text-[11px] tracking-[0.1em] text-[#E2B93B]"
          style={{ fontFamily: "monospace" }}
        >
          D
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-white text-sm"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}
          >
            Deron
          </span>
          <span
            className="text-[10px] tracking-[0.15em] text-[#444]"
            style={{ fontFamily: "monospace" }}
          >
            @derondsgnr
          </span>
        </div>
        <p
          className="text-[#555] text-[12px] leading-relaxed mb-4 max-w-lg"
          style={{ fontFamily: "monospace" }}
        >
          Product designer and builder based in Lagos. I work at the intersection of design and engineering — which means I don&apos;t just hand off Figma files. I build what I design.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-[10px] tracking-[0.15em] text-[#E2B93B]/70 hover:text-[#E2B93B] transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            MORE ABOUT →
          </Link>
          <Link
            href="/work"
            className="text-[10px] tracking-[0.15em] text-[#444] hover:text-[#666] transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            SEE WORK →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function BlogReader({ post }: { post: BlogPost }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const toc = extractTOC(post.slides);
  const [activeSection, setActiveSection] = useState(toc[0]?.id || "");
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-toc-id");
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [post.slug]);

  const registerSection = (id: string, el: HTMLDivElement | null) => {
    if (el) sectionRefs.current.set(id, el);
  };

  const renderSlide = (slide: Slide) => {
    if (slide.type === "section-break") {
      return (
        <div
          key={slide.id}
          id={slide.id}
          data-toc-id={slide.id}
          ref={(el) => registerSection(slide.id, el)}
        >
          <SlideRenderer slide={slide} />
        </div>
      );
    }
    return <SlideRenderer key={slide.id} slide={slide} />;
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen">
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

      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#111]">
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#E2B93B] z-50 origin-left"
          style={{ scaleX }}
        />
        <div className="flex items-center justify-between px-5 md:px-10 py-3">
          <Link
            href="/blog"
            className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#E2B93B] transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            ← WRITING
          </Link>
          <span
            className="text-[10px] tracking-[0.15em] text-[#E2B93B] hidden md:block"
            style={{ fontFamily: "monospace" }}
          >
            {post.meta.category.toUpperCase()} · {post.meta.readingTime} MIN READ
          </span>
          <Link
            href="/"
            className="text-[10px] tracking-[0.15em] text-[#444] hover:text-white transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            derondsgnr
          </Link>
        </div>
      </div>

      <div ref={heroRef} className="relative z-10 pt-24">
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <motion.img
            src={post.meta.cover}
            alt={post.meta.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={heroInView ? { scale: 1, opacity: 0.4 } : {}}
            transition={{ duration: 1.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-8 left-6 md:left-14 lg:left-20 flex items-center gap-4"
          >
            <span
              className="text-[10px] tracking-[0.25em] px-3 py-1.5 border border-[#E2B93B]/40 text-[#E2B93B] bg-[#0A0A0A]/60"
              style={{ fontFamily: "monospace" }}
            >
              {post.meta.category.toUpperCase()}
            </span>
            <span
              className="text-[10px] tracking-[0.15em] text-[#555]"
              style={{ fontFamily: "monospace" }}
            >
              {formatDate(post.meta.date)}
            </span>
            <span
              className="text-[10px] tracking-[0.15em] text-[#444]"
              style={{ fontFamily: "monospace" }}
            >
              {post.meta.readingTime} MIN READ
            </span>
          </motion.div>
        </div>

        <div className="relative z-10 px-6 md:px-14 lg:px-20 -mt-4 md:-mt-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-8xl uppercase text-white leading-none mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.03em",
            }}
          >
            {post.meta.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row md:items-start gap-6 pb-10 border-b border-[#111]"
          >
            <p
              className="text-[#666] text-sm leading-relaxed max-w-xl"
              style={{ fontFamily: "monospace", lineHeight: 1.9 }}
            >
              {post.meta.summary}
            </p>

            <div className="flex flex-wrap gap-2 md:ml-auto flex-shrink-0">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.15em] px-2.5 py-1 border border-[#1a1a1a] text-[#444]"
                  style={{ fontFamily: "monospace" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        {toc.length > 0 ? (
          <div className="flex">
            <div className="hidden lg:block w-64 flex-shrink-0 px-10 pt-16">
              <TOCSidebar toc={toc} activeSection={activeSection} />
            </div>

            <div className="flex-1 min-w-0">
              {post.slides.map((slide) => renderSlide(slide))}
            </div>
          </div>
        ) : (
          <div>{post.slides.map((slide) => renderSlide(slide))}</div>
        )}
      </div>

      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-32">
        <AuthorBio />
        <RelatedPosts slug={post.slug} />
      </div>
    </div>
  );
}
