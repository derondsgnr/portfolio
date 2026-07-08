"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "motion/react";
import { ScrambleText } from "./shared/scramble-text";
import { SafeLink } from "@/components/safe-link";
import { GlobalSidebar } from "./global-sidebar";
import { PersonalProjectsGrid } from "./personal-projects-grid";
import { TransmissionServicesIndex } from "./sections/transmission-services-index";
import type { Project } from "@/lib/content/projects";
import type { TestimonialItem } from "@/lib/content/testimonials";
import type { CraftItem } from "@/lib/content/craft";
import type { ServiceItem } from "@/lib/content/services";


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

// ── Types ─────────────────────────────────────────────────────────────────────────

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

// ── Custom Cursor — Crosshair + Ghost Trail ───────────────────────────────────────────

function TransmissionCursor() {
  const TRAIL = 7;
  const trailSize = (i: number) => Math.max(1.5, 5 - i * 0.65);
  const positions = useRef(Array(TRAIL).fill({ x: -200, y: -200 }));
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  // Cursor position lives in motion values, not React state, so moving the
  // mouse never triggers a re-render. The crosshair follows a spring; the ghost
  // trail is written straight to the DOM. (The old version called setState on a
  // forever-running rAF loop, re-rendering the whole cursor ~60×/s and starving
  // the scroll thread — that was the "hooking" scroll.)
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const sx = useSpring(cursorX, { stiffness: 450, damping: 28, mass: 0.25 });
  const sy = useSpring(cursorY, { stiffness: 450, damping: 28, mass: 0.25 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      cursorX.set(x);
      cursorY.set(y);
      positions.current = [{ x, y }, ...positions.current.slice(0, TRAIL - 1)];
      // Position the trail dots imperatively — no React reconciliation per frame.
      for (let i = 0; i < TRAIL - 1; i++) {
        const el = trailRefs.current[i];
        if (!el) continue;
        const p = positions.current[i + 1];
        const s = trailSize(i);
        el.style.transform = `translate(${p.x - s / 2}px, ${p.y - s / 2}px)`;
      }
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]") as HTMLElement | null;
      const nextHovered = !!el;
      const nextLabel = el?.dataset.cursorLabel ?? "";
      // Only touch state when it actually changes, so a re-render happens on
      // hover transitions — not on every pixel of movement.
      setHovered((prev) => (prev === nextHovered ? prev : nextHovered));
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  const arm = hovered ? 6 : 14;
  const gap = hovered ? 5 : 3;

  return (
    <>
      {/* Ghost trail dots — transforms set imperatively in onMove */}
      {Array.from({ length: TRAIL - 1 }).map((_, i) => {
        const size = trailSize(i);
        const opacity = (1 - (i + 1) / TRAIL) * 0.45;
        return (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="fixed top-0 left-0 pointer-events-none z-[9997]"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#ECFF95",
              opacity,
              transform: "translate(-200px, -200px)",
            }}
          />
        );
      })}

      {/* Crosshair */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: sx, y: sy }}
      >
        {/* Center dot */}
        <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "#ECFF95", transform: "translate(-1.5px,-1.5px)" }} />
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
            style={{ position: "absolute", background: "#ECFF95", opacity: 0.88 }}
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
              style={{ position: "absolute", width: 24, height: 24, top: -12, left: -12, border: "1px solid rgba(236, 255, 149,0.5)", borderRadius: 2 }}
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
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
          >
            <span
              style={{
                position: "absolute",
                left: 18,
                top: -14,
                fontFamily: "monospace",
                fontSize: "7px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#ECFF95",
                background: "rgba(18, 19, 22,0.92)",
                padding: "3px 7px",
                border: "1px solid rgba(236, 255, 149,0.28)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────────

function TransmissionHero({ projects, heroCopy }: { projects: Project[]; heroCopy: HeroCopy }) {
  const [ctxIdx, setCtxIdx] = useState(0);
  const featured = projects[0];
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setCtxIdx((i) => (i + 1) % CONTEXT_LINES.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let anim: { destroy: () => void } | null = null;
    let cancelled = false;

    Promise.all([
      import("lottie-web"),
      fetch("/animations/scene_full.json").then((r) => r.json()),
    ]).then(([mod, animData]) => {
      if (cancelled || !lottieRef.current) return;
      anim = mod.default.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        // animationData = inline JSON: images are base64 data URIs (u:'', p:'data:...')
        // lottie-web resolves them as '' + '' + 'data:...' = valid — no path issues.
        animationData: animData,
        rendererSettings: {
          // xMidYMid slice = SVG equivalent of CSS object-fit: cover
          // scales the 1080×1080 animation to fill any viewport, cropping edges
          preserveAspectRatio: "xMidYMid slice",
          progressiveLoad: true,
        },
      });
    });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  const ctx = CONTEXT_LINES[ctxIdx];

  return (
    <section className="relative" style={{ height: "100dvh", minHeight: "100svh" }}>
      {/* Full-bleed Lottie animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={lottieRef}
          className="absolute inset-0 w-full h-full"
          style={{
            filter: "brightness(0.55)",
            // Isolate SVG repaints from the scroll compositor so the
            // lottie rAF loop doesn't cause scroll jank on the main thread
            contain: "layout style paint",
            willChange: "transform",
          }}
          aria-hidden="true"
        />
        {/* Text-aware gradient: only darkens where content lives.
            Bottom strip → solid (protects name + CTAs).
            Mid → fades quickly. Top → near-transparent (animation breathes). */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to top, rgba(18, 19, 22,0.92) 0%, rgba(18, 19, 22,0.7) 22%, rgba(18, 19, 22,0.28) 48%, rgba(18, 19, 22,0) 72%)",
              "linear-gradient(to right, rgba(18, 19, 22,0.45) 0%, rgba(18, 19, 22,0) 38%)",
            ].join(", "),
          }}
        />
      </div>

      {/* Hero copy — bottom left */}
      <div className="relative h-full flex flex-col justify-end px-6 pb-10 md:px-10 md:pb-16">
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
                color: "#ECFF95",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#ECFF95", display: "flex", alignItems: "center" }}>
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

        {/* Sub-copy — improved contrast */}
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
          <SafeLink
            href="/work"
            data-cursor-label="EXPLORE"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#121316",
              background: "#F0F0F0",
              padding: "12px 28px",
              display: "inline-block",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ECFF95")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F0F0")}
          >
            See all work
          </SafeLink>
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

// ── Project Row ───────────────────────────────────────────────────────────────────

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
  const router = useRouter();

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/work/${project.slug}`)}
      data-cursor="true"
      data-cursor-label="VIEW"
      className="grid grid-cols-1 md:grid-cols-2"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        cursor: "none",
      }}
    >
      {/* Image column */}
      <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
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
            style={{ background: "#17181C" }}
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
        className="flex flex-col justify-between px-6 py-8 md:px-10 md:py-10"
        style={{ background: "#16171B" }}
      >
        <div>
          {/* Index + category with icon */}
          <div className="flex items-center gap-2 mb-5">
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
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
                color: "#ECFF95",
              }}
            >
              <span style={{ color: "#ECFF95", display: "flex", alignItems: "center" }}>
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
              color: "rgba(255,255,255,0.65)",
              maxWidth: 340,
              marginBottom: 28,
            }}
          >
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between" style={{ paddingTop: 20 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {project.year}
          </span>
          <Link
            href={`/work/${project.slug}`}
            data-cursor-label="CASE STUDY"
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#ECFF95",
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

// ── About Strip ─────────────────────────────────────────────────────────────────

const ABOUT_STATS_FALLBACK = [
  { label: "Mode", value: "Remote" },
  { label: "Years", value: "2022 — now" },
  { label: "Industries", value: "Fintech, Transport, AI, Startups" },
  { label: "Shipped", value: "3 live products" },
  { label: "Available", value: "Yes" },
];

function TransmissionAbout({ aboutCopy, showFullStory = true }: { aboutCopy: AboutCopy; showFullStory?: boolean }) {
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
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-6 pt-16 pb-12 sm:px-8 md:px-10 md:pt-20 md:pb-16"
        style={{ alignItems: "start" }}
      >
        {/* Left — heading + bio */}
        <div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
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
            <span style={{ color: "#ECFF95" }}>{aboutCopy.headlineAccent ?? "ships"}</span>
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

          {showFullStory && (
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
          )}
        </div>

        {/* Right — stats grid */}
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
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
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

// ── Testimonials ──────────────────────────────────────────────────────────────

function TransmissionTestimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.14 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          display: "block",
          marginBottom: 24,
        }}
      >
        Testimonials
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1 }}>
        {testimonials.slice(0, 2).map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: "#16171B",
              padding: "32px 30px",
              borderLeft: i === 0 ? "2px solid #ECFF95" : "2px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Open-quote mark */}
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "32px",
                color: "rgba(236, 255, 149,0.25)",
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

// ── Writing Preview ─────────────────────────────────────────────────────────────

function TransmissionWriting({ posts }: { posts: BlogMeta[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between mb-8">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Writing
        </span>
        <Link
          href="/blog"
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ECFF95")}
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
                    color: "#ECFF95",
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
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.45)",
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

// ── Craft ───────────────────────────────────────────────────────────────────────

function TransmissionCraft({ items }: { items: CraftItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const published = items.filter((i) => !i.status || i.status === "published").slice(0, 8);
  const [selected, setSelected] = useState<CraftItem | null>(null);

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-6 py-14 sm:px-8 md:px-10 md:py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Craft
        </span>
        <Link
          href="/craft"
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ECFF95")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
        >
          View all →
        </Link>
      </div>

      {/* Masonry-style grid — responsive columns */}
      <div className="columns-2 sm:columns-3 md:columns-4" style={{ columnGap: "6px" }}>
        {published.map((item, i) => (
          <CraftTile key={item.id} item={item} index={i} inView={inView} onSelect={() => setSelected(item)} />
        ))}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="craft-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: "rgba(18, 19, 22,0.96)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative flex flex-col items-center justify-center w-full h-full px-6 py-16 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 flex items-center justify-center"
                style={{
                  width: 36, height: 36,
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "monospace", fontSize: "16px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#F0F0F0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                aria-label="Close"
              >
                ×
              </button>

              {/* Image */}
              <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center">
                {selected.videoUrl ? (
                  <video
                    src={selected.videoUrl}
                    autoPlay muted loop playsInline
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                ) : selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="max-w-full max-h-[75vh] object-contain"
                    style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
                  />
                ) : null}
              </div>

              {/* Title at bottom */}
              <div className="mt-6 text-center">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#ECFF95",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {selected.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1rem, 3vw, 1.6rem)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#F0F0F0",
                  }}
                >
                  {selected.title}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function CraftTile({ item, index, inView, onSelect }: { item: CraftItem; index: number; inView: boolean; onSelect: () => void }) {
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
      data-cursor-label="EXPAND"
      onClick={onSelect}
      style={{
        breakInside: "avoid",
        marginBottom: 6,
        position: "relative",
        cursor: "none",
        overflow: "hidden",
        background: "#17181C",
      }}
    >
      <div style={{ display: "block", position: "relative" }}>
        {/* Media */}
        <div
          style={{
            position: "relative",
            paddingBottom: `${(1 / aspectRatio) * 100}%`,
            overflow: "hidden",
          }}
        >
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
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#1D1E24" }}
            >
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "24px", color: "rgba(255,255,255,0.06)" }}>
                {item.category}
              </span>
            </div>
          )}
        </div>

        {/* Hover overlay — title + category */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-end"
              style={{ padding: "12px", background: "linear-gradient(to top, rgba(18, 19, 22,0.85) 0%, transparent 60%)" }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "6.5px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#ECFF95",
                  display: "block",
                  marginBottom: 3,
                }}
              >
                {item.category}
              </span>
              <span
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "11px",
                  color: "#F0F0F0",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────────────────

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
      className="px-6 py-20 sm:px-8 md:px-10 md:py-32"
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

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Link
          href="#contact"
          data-cursor-label="BOOK"
          style={{
            fontFamily: "monospace",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#121316",
            background: "#ECFF95",
            padding: "14px 32px",
            display: "inline-block",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {ctaLabel}
        </Link>

        <a
          href="https://contra.com/derondsgnr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "monospace",
            fontSize: "9.5px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "14px 32px",
            display: "inline-block",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ECFF95";
            e.currentTarget.style.borderColor = "#ECFF95";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        >
          Hire me on Contra →
        </a>
      </div>
    </motion.section>
  );
}

// ── Root Export ─────────────────────────────────────────────────────────────────

export function TransmissionVariation({
  projects,
  testimonials,
  posts,
  craftItems,
  services,
  hiddenPaths = [],
  global: globalConfig,
  copy,
}: {
  projects: Project[];
  testimonials: TestimonialItem[];
  posts: BlogMeta[];
  craftItems: CraftItem[];
  services: ServiceItem[];
  /** Nav paths flagged hidden — their homepage previews + page links are suppressed. */
  hiddenPaths?: string[];
  global: AdminGlobal;
  copy: AdminCopy;
}) {
  const heroCopy = copy.homepage?.hero ?? {};
  const aboutCopy = copy.homepage?.about ?? {};
  const ctaCopy = copy.homepage?.cta ?? {};
  const isHidden = (p: string) => hiddenPaths.includes(p);

  const caseStudyProjects = projects.filter((p) => !p.projectType || p.projectType === "case-study");
  const personalProjects = projects.filter((p) => p.projectType === "personal");

  return (
    <div style={{ background: "#121316", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .transmission-root * { cursor: none !important; }
      `}</style>

      <TransmissionCursor />
      <GlobalSidebar />

      <main className="transmission-root lg:ml-[260px]">
        <TransmissionHero projects={projects} heroCopy={heroCopy} />

        {!isHidden("/work") && (
          <>
            {/* Work section header */}
            <div
              className="px-6 pt-14 pb-8 sm:px-8 md:px-10 md:pt-20 md:pb-10 flex items-center justify-between"
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
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ECFF95")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
              >
                See all →
              </Link>
            </div>

            {caseStudyProjects.slice(0, 5).map((project, i) => (
              <TransmissionProjectRow key={project.id} project={project} index={i} />
            ))}

            {personalProjects.length > 0 && (
              <div
                className="px-6 sm:px-8 md:px-10 py-14 md:py-20"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <PersonalProjectsGrid projects={personalProjects} />
              </div>
            )}
          </>
        )}

        <TransmissionAbout aboutCopy={aboutCopy} showFullStory={!isHidden("/about")} />
        <TransmissionServicesIndex services={services} />
        {!isHidden("/craft") && <TransmissionCraft items={craftItems} />}
        <TransmissionTestimonials testimonials={testimonials} />
        {!isHidden("/blog") && <TransmissionWriting posts={posts} />}
        <TransmissionCTA ctaCopy={ctaCopy} ctaLabel={globalConfig.ctaButtonLabel} />
      </main>
    </div>
  );
}
