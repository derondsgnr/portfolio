"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ScrambleText } from "./shared/scramble-text";
import { GlobalSidebar, SIDEBAR_WIDTH } from "./global-sidebar";
import type { Project } from "@/lib/content/projects";
import type { TestimonialItem } from "@/lib/content/testimonials";
import type { CraftItem } from "@/lib/content/craft";


/* ═══════════════════════════════════════════════════════════════
   TRANSMISSION — Dispatch sidebar + editorial rows + full sections
   Custom cursor · industry icons · about stats · video hero
   ═══════════════════════════════════════════════════════════════ */

// Profile image URL — set to your Cloudinary photo
const PROFILE_IMAGE = "";

// Detect video by extension so the hero renders <video> instead of <img>
function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

// ── Types ─────────────────────────────────────────────────────────────────

type BlogMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  readingTime: number;
};

type HeroCopy = { name?: string; philosophy?: string };
type AboutCopy = { headline?: string; headlineAccent?: string; bioParagraphs?: string[]; stats?: { label: string; value: string }[] };
type CtaCopy = { headline?: string; ctaPrimary?: string };
type AdminGlobal = { ctaButtonLabel: string };
type AdminCopy = { homepage?: { hero?: HeroCopy; about?: AboutCopy; cta?: CtaCopy } };

// Industry context lines with inline SVG icons
const CONTEXT_LINES = [
  {
    label: "Built for Fintech",
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <circle cx="5.5" cy="5.5" r="4.25" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 2.5v6M4 5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Built for Transport",
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Built for AI Products",
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <circle cx="5.5" cy="5.5" r="1.6" fill="currentColor" />
        <circle cx="1.5" cy="5.5" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="9.5" cy="5.5" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="5.5" cy="1.5" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="5.5" cy="9.5" r="1" fill="currentColor" opacity="0.4" />
        <line x1="3.1" y1="5.5" x2="2.5" y2="5.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="7.9" y1="5.5" x2="8.5" y2="5.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="5.5" y1="3.1" x2="5.5" y2="2.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="5.5" y1="7.9" x2="5.5" y2="8.5" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    label: "Built for Africa",
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path d="M5.5 1.5C3.29 1.5 1.5 3.29 1.5 5.5S3.29 9.5 5.5 9.5 9.5 7.71 9.5 5.5 7.71 1.5 5.5 1.5Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 1.5v8M1.5 5.5h8" stroke="currentColor" strokeWidth="0.7" opacity="0.35" />
      </svg>
    ),
  },
  {
    label: "Built for Startups",
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path d="M5.5 1.5L7 4.5H10L7.5 6.5L8.5 9.5L5.5 7.5L2.5 9.5L3.5 6.5L1 4.5H4L5.5 1.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Small category icons for project rows
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  "Product Design": (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <rect x="1" y="1.5" width="7" height="6" rx="0.8" stroke="currentColor" strokeWidth="1" />
      <path d="M1 3.5h7" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  ),
  "Design Engineering": (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <circle cx="4.5" cy="4.5" r="1.6" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 1v1.3M4.5 6.7V8M1 4.5h1.3M6.7 4.5H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  "UX/UI Design": (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
      <path d="M1 4.5C1 2.567 2.567 1 4.5 1S8 2.567 8 4.5 6.433 8 4.5 8 1 6.433 1 4.5Z" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 3v3M3 4.5h3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  ),
};

const DefaultCategoryIcon = (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
    <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
  </svg>
);

// ── Custom Cursor — Crosshair + Ghost Trail ───────────────────────────────

function TransmissionCursor() {
  const TRAIL = 7;
  const positions = useRef(Array(TRAIL).fill({ x: -200, y: -200 }));
  const [dots, setDots] = useState<{ x: number; y: number }[]>(Array(TRAIL).fill({ x: -200, y: -200 }));
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    let frame: number;
    const onMove = (e: MouseEvent) => {
      const p = { x: e.clientX, y: e.clientY };
      setPos(p);
      positions.current = [p, ...positions.current.slice(0, TRAIL - 1)];
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]") as HTMLElement | null;
      setHovered(!!el);
      setLabel(el?.dataset.cursorLabel ?? "");
    };
    const tick = () => {
      setDots([...positions.current]);
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const arm = hovered ? 6 : 14;
  const gap = hovered ? 5 : 3;

  return (
    <>
      {/* Ghost trail dots */}
      {dots.slice(1).map((p, i) => {
        const size = Math.max(1.5, 5 - i * 0.65);
        const opacity = (1 - (i + 1) / TRAIL) * 0.45;
        return (
          <div
            key={i}
            className="fixed top-0 left-0 pointer-events-none z-[9997]"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#E2B93B",
              opacity,
              transform: `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`,
            }}
          />
        );
      })}

      {/* Crosshair */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.25 }}
      >
        {/* Center dot */}
        <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "#E2B93B", transform: "translate(-1.5px,-1.5px)" }} />
        {/* Arms */}
        {([
          { top: -(arm + gap), left: -0.5, w: 1, h: arm },
          { top: gap,          left: -0.5, w: 1, h: arm },
          { top: -0.5, left: -(arm + gap), w: arm, h: 1 },
          { top: -0.5, left: gap,          w: arm, h: 1 },
        ] as { top: number; left: number; w: number; h: number }[]).map((s, i) => (
          <motion.div
            key={i}
            animate={{ width: s.w, height: s.h, top: s.top, left: s.left }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ position: "absolute", background: "#E2B93B", opacity: 0.88 }}
          />
        ))}
        {/* Hover bracket */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              style={{ position: "absolute", width: 24, height: 24, top: -12, left: -12, border: "1px solid rgba(226,185,59,0.5)", borderRadius: 2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{
              transform: `translate(${pos.x + 18}px, ${pos.y - 14}px)`,
              fontFamily: "monospace",
              fontSize: "7px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#E2B93B",
              background: "rgba(10,10,10,0.92)",
              padding: "3px 7px",
              border: "1px solid rgba(226,185,59,0.28)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────

function TransmissionHero({ projects, heroCopy }: { projects: Project[]; heroCopy: HeroCopy }) {
  const [ctxIdx, setCtxIdx] = useState(0);
  const featured = projects[0];

  useEffect(() => {
    const t = setInterval(() => setCtxIdx((i) => (i + 1) % CONTEXT_LINES.length), 2600);
    return () => clearInterval(t);
  }, []);

  const ctx = CONTEXT_LINES[ctxIdx];

  return (
    <section className="relative" style={{ height: "100vh" }}>
      {/* Full-bleed image or video */}
      <div className="absolute inset-0">
        {featured?.image && (
          isVideoUrl(featured.image) ? (
            <video
              src={featured.image}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.32)" }}
            />
          ) : (
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.32)" }}
              priority
            />
          )
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.2) 55%, rgba(10,10,10,0.78) 100%)",
          }}
        />
      </div>

      {/* Featured label — top right */}
      {featured && (
        <div
          className="absolute top-7 right-8"
          style={{
            fontFamily: "monospace",
            fontSize: "7.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          Featured → {featured.title}
        </div>
      )}

      {/* Hero copy — bottom left */}
      <div className="relative h-full flex flex-col justify-end px-14 pb-16">
        {/* Context line with icon */}
        <div className="mb-5">
          <AnimatePresence mode="wait">
            <motion.span
              key={ctxIdx}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.36 }}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#E2B93B",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#E2B93B", display: "flex", alignItems: "center" }}>
                {ctx.icon}
              </span>
              {ctx.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#F0F0F0",
            lineHeight: 1,
            marginBottom: 14,
          }}
        >
          {heroCopy.name ?? "Deron"}
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.76)",
            marginBottom: 32,
            maxWidth: 390,
            lineHeight: 1.65,
          }}
        >
          {heroCopy.philosophy ?? "Product designer & builder. I prototype to find what's real, then refine until it ships."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/work"
            data-cursor-label="EXPLORE"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              background: "#F0F0F0",
              padding: "12px 28px",
              display: "inline-block",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E2B93B")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F0F0")}
          >
            See all work
          </Link>
          <Link
            href="#contact"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.68)",
              border: "1px solid rgba(255,255,255,0.22)",
              padding: "12px 28px",
              display: "inline-block",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F0F0F0";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.68)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
            }}
          >
            Let's connect
          </Link>
        </motion.div>
      </div>

      {/* Scroll pulse */}
      <motion.div
        className="absolute bottom-7"
        style={{ left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 26, background: "rgba(255,255,255,0.12)" }}
        />
      </motion.div>
    </section>
  );
}

// ── Project Row ───────────────────────────────────────────────────────────

function TransmissionProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });
  const [hovered, setHovered] = useState(false);
  const catIcon = CATEGORY_ICONS[project.category] ?? DefaultCategoryIcon;

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="true"
      data-cursor-label="VIEW"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        minHeight: 400,
        cursor: "none",
      }}
    >
      {/* Image column */}
      <div className="relative overflow-hidden" style={{ minHeight: 400 }}>
        {project.image ? (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.52)" }}
            />
          </motion.div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#111111" }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                color: "rgba(255,255,255,0.04)",
                letterSpacing: "0.1em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Metadata column */}
      <div
        className="flex flex-col justify-between px-12 py-10"
        style={{ background: "#0D0D0D" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "7.5px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "monospace",
                fontSize: "7.5px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#E2B93B",
              }}
            >
              <span style={{ color: "#E2B93B", display: "flex", alignItems: "center" }}>
                {catIcon}
              </span>
              {project.category}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1.7rem, 2.8vw, 2.5rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#F0F0F0",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            <ScrambleText text={project.title} speed={25} />
          </h2>

          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.48)",
              maxWidth: 340,
            }}
          >
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.16)",
            }}
          >
            {project.year}
          </span>
          <Link
            href={`/work/${project.slug}`}
            data-cursor-label="CASE STUDY"
            style={{
              fontFamily: "monospace",
              fontSize: "8.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View case study →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ── About Strip ───────────────────────────────────────────────────────────

const ABOUT_STATS_FALLBACK = [
  { label: "Mode", value: "Remote" },
  { label: "Years", value: "2022 — now" },
  { label: "Industries", value: "Fintech, Transport, AI, Startups" },
  { label: "Shipped", value: "3 live products" },
  { label: "Available", value: "Yes" },
];

function TransmissionAbout({ aboutCopy }: { aboutCopy: AboutCopy }) {
  const stats = aboutCopy.stats?.length ? aboutCopy.stats : ABOUT_STATS_FALLBACK;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.14 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        className="px-14 pt-20 pb-16"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "7.5px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              display: "block",
              marginBottom: 20,
            }}
          >
            About
          </span>

          <p
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: "#F0F0F0",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {aboutCopy.headline ?? "Designer who"}{" "}
            <span style={{ color: "#E2B93B" }}>{aboutCopy.headlineAccent ?? "ships"}</span>
            {". Based in Nigeria, building for the world."}
          </p>

          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "14px",
              lineHeight: 1.78,
              color: "rgba(255,255,255,0.52)",
              marginBottom: 28,
            }}
          >
            {aboutCopy.bioParagraphs?.[0] ?? "I work at the intersection of product design and engineering. I prototype in code, design in Figma, and ship in whatever order makes sense. Right now building Dara — an AI finance assistant — and taking on select client work."}
          </p>

          <Link
            href="/about"
            data-cursor-label="ABOUT"
            style={{
              fontFamily: "monospace",
              fontSize: "8.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.38)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "10px 22px",
              display: "inline-block",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F0F0F0";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.38)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Full story →
          </Link>
        </div>

        <div style={{ paddingTop: 36 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 16,
                alignItems: "baseline",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                }}
              >
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────

function TransmissionTestimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.14 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-14 py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "7.5px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          display: "block",
          marginBottom: 24,
        }}
      >
        Testimonials
      </span>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
        {testimonials.slice(0, 2).map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: "#0D0D0D",
              padding: "32px 30px",
              borderLeft: i === 0 ? "2px solid #E2B93B" : "2px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "32px",
                color: "rgba(226,185,59,0.25)",
                lineHeight: 1,
                display: "block",
                marginBottom: 10,
              }}
              aria-hidden
            >
              "
            </span>

            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "13.5px",
                lineHeight: 1.78,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 22,
                fontStyle: "italic",
              }}
            >
              {t.quote}
            </p>

            <div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8.5px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#F0F0F0",
                  display: "block",
                  marginBottom: 2,
                }}
              >
                {t.name}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "7.5px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                }}
              >
                {t.role} · {t.company}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ── Writing Preview ───────────────────────────────────────────────────────

function TransmissionWriting({ posts }: { posts: BlogMeta[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-14 py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between mb-8">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "7.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Writing
        </span>
        <Link
          href="/blog"
          style={{
            fontFamily: "monospace",
            fontSize: "7.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E2B93B")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
        >
          All posts →
        </Link>
      </div>

      <div>
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href={`/blog/${post.slug}`}
              data-cursor-label="READ"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 20,
                padding: "15px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "padding-left 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.paddingLeft = "10px";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.paddingLeft = "0px";
              }}
            >
              <div className="flex items-baseline gap-4 min-w-0">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "7.5px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#E2B93B",
                    flexShrink: 0,
                  }}
                >
                  {post.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.68)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.title}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "7.5px",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.18)",
                  flexShrink: 0,
                }}
              >
                {post.readingTime}m
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ── Craft ─────────────────────────────────────────────────────────────────

function TransmissionCraft({ items }: { items: CraftItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const published = items.filter((i) => !i.status || i.status === "published").slice(0, 8);

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-14 py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between mb-8">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "7.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Craft
        </span>
        <Link
          href="/craft"
          style={{
            fontFamily: "monospace",
            fontSize: "7.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E2B93B")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
        >
          View all →
        </Link>
      </div>

      <div style={{ columns: "4", columnGap: "6px", gap: "6px" }}>
        {published.map((item, i) => (
          <CraftTile key={item.id} item={item} index={i} inView={inView} />
        ))}
      </div>
    </motion.section>
  );
}

function CraftTile({ item, index, inView }: { item: CraftItem; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const aspectRatio =
    item.width && item.height ? item.width / item.height : index % 3 === 0 ? 0.75 : 1.33;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="true"
      data-cursor-label="VIEW"
      style={{ breakInside: "avoid", marginBottom: 6, position: "relative", cursor: "none", overflow: "hidden", background: "#111111" }}
    >
      <Link href="/craft" style={{ display: "block", position: "relative" }}>
        <div style={{ position: "relative", paddingBottom: `${(1 / aspectRatio) * 100}%`, overflow: "hidden" }}>
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: hovered ? "brightness(0.55)" : "brightness(0.7)", transition: "filter 0.4s" }}
            />
          ) : item.image ? (
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: "center" }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                style={{ filter: hovered ? "brightness(0.55)" : "brightness(0.7)", transition: "filter 0.4s" }}
                sizes="(max-width: 1280px) 25vw, 20vw"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#1A1A1A" }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "24px", color: "rgba(255,255,255,0.06)" }}>{item.category}</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end"
              style={{ padding: "12px", background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)" }}
            >
              <span style={{ fontFamily: "monospace", fontSize: "6.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#E2B93B", display: "block", marginBottom: 3 }}>{item.category}</span>
              <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", color: "#F0F0F0", lineHeight: 1.3 }}>{item.title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────

function TransmissionCTA({ ctaCopy, ctaLabel }: { ctaCopy: CtaCopy; ctaLabel: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-14 py-32"
      style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "7.5px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          display: "block",
          marginBottom: 22,
        }}
      >
        Contact
      </span>

      <h2
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(2.5rem, 5vw, 5rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#F0F0F0",
          lineHeight: 1.05,
          maxWidth: 700,
          marginBottom: 32,
        }}
      >
        {ctaCopy.headline ?? "I'm the designer you call when you need to ship something real."}
      </h2>

      <Link
        href="#contact"
        data-cursor-label="BOOK"
        style={{
          fontFamily: "monospace",
          fontSize: "9.5px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#0A0A0A",
          background: "#E2B93B",
          padding: "14px 32px",
          display: "inline-block",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {ctaLabel}
      </Link>
    </motion.section>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────

export function TransmissionVariation({
  projects,
  testimonials,
  posts,
  craftItems,
  global: globalConfig,
  copy,
}: {
  projects: Project[];
  testimonials: TestimonialItem[];
  posts: BlogMeta[];
  craftItems: CraftItem[];
  global: AdminGlobal;
  copy: AdminCopy;
}) {
  const heroCopy = copy.homepage?.hero ?? {};
  const aboutCopy = copy.homepage?.about ?? {};
  const ctaCopy = copy.homepage?.cta ?? {};

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .transmission-root * { cursor: none !important; }
      `}</style>

      <TransmissionCursor />
      <GlobalSidebar />

      <main className="transmission-root" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <TransmissionHero projects={projects} heroCopy={heroCopy} />

        <div
          className="px-14 pt-20 pb-10 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "7.5px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Selected work
          </span>
          <Link
            href="/work"
            style={{
              fontFamily: "monospace",
              fontSize: "7.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E2B93B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
          >
            See all →
          </Link>
        </div>

        {projects.slice(0, 5).map((project, i) => (
          <TransmissionProjectRow key={project.id} project={project} index={i} />
        ))}

        <TransmissionAbout aboutCopy={aboutCopy} />
        <TransmissionCraft items={craftItems} />
        <TransmissionTestimonials testimonials={testimonials} />
        <TransmissionWriting posts={posts} />
        <TransmissionCTA ctaCopy={ctaCopy} ctaLabel={globalConfig.ctaButtonLabel} />
      </main>
    </div>
  );
}
