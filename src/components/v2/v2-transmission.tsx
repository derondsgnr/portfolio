"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { siX, siGithub, siDribbble } from "simple-icons";
import { ScrambleText } from "./shared/scramble-text";
import type { Project } from "@/lib/content/projects";
import type { TestimonialItem } from "@/lib/content/testimonials";

// LinkedIn dropped from simple-icons v16 — path from the official spec
const SI_LINKEDIN =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

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

// ── Static data ───────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

const SOCIALS = [
  { label: "X", path: () => siX.path, href: "https://x.com/derondsgnr" },
  { label: "LinkedIn", path: () => SI_LINKEDIN, href: "#" },
  { label: "Dribbble", path: () => siDribbble.path, href: "#" },
  { label: "GitHub", path: () => siGithub.path, href: "https://github.com/derondsgnr" },
];

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

// ── Custom Cursor ─────────────────────────────────────────────────────────

function TransmissionCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        setIsHovered(true);
        setLabel(el.dataset.cursorLabel ?? "");
      } else {
        setIsHovered(false);
        setLabel("");
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Core dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: "spring", stiffness: 600, damping: 32, mass: 0.2 }}
        style={{ width: 8, height: 8, borderRadius: "50%", background: "#E2B93B" }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: pos.x - (isHovered ? 22 : 16),
          y: pos.y - (isHovered ? 22 : 16),
          width: isHovered ? 44 : 32,
          height: isHovered ? 44 : 32,
          opacity: isHovered ? 0.55 : 0.22,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.6 }}
        style={{
          borderRadius: "50%",
          border: "1px solid #E2B93B",
        }}
      />

      {/* Cursor label */}
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

// ── Sidebar ───────────────────────────────────────────────────────────────

function TransmissionSidebar() {
  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 260,
        background: "#0A0A0A",
        borderRight: "1px solid rgba(255,255,255,0.055)",
      }}
    >
      {/* Logo */}
      <div className="px-8 pt-8 pb-6">
        <Link href="/">
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "22px",
              letterSpacing: "0.08em",
              color: "#E2B93B",
              textTransform: "uppercase",
            }}
          >
            D/
          </span>
        </Link>
      </div>

      {/* Nav — vertically centered */}
      <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
              padding: "10px 0",
              display: "block",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F0F0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Identity — bottom */}
      <div className="px-8 pb-8">
        {/* Availability pulse */}
        <div className="flex items-center gap-2 mb-5">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              display: "block",
              boxShadow: "0 0 6px #4ade80",
              animation: "pulse 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Available for work
          </span>
        </div>

        {/* Profile image + name row */}
        <div className="flex items-center gap-3 mb-5">
          {PROFILE_IMAGE ? (
            <Image
              src={PROFILE_IMAGE}
              alt="Deron"
              width={38}
              height={38}
              style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "14px",
                  color: "#E2B93B",
                  letterSpacing: "0.04em",
                }}
              >
                D
              </span>
            </div>
          )}
          <div>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "13px",
                color: "#F0F0F0",
                fontWeight: 500,
                marginBottom: 1,
              }}
            >
              Deron
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              @derondsgnr
            </p>
          </div>
        </div>

        {/* Social icons — brand SVGs in bordered squares */}
        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              aria-label={s.label}
              style={{
                width: 36,
                height: 36,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E2B93B";
                e.currentTarget.style.borderColor = "#E2B93B";
                e.currentTarget.style.background = "rgba(226,185,59,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width={14}
                height={14}
                aria-hidden
              >
                <path d={s.path()} />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────

function TransmissionHero({ projects }: { projects: Project[] }) {
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
          Deron
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
          Product designer & builder. I prototype to find what's real, then refine until it ships.
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
          {/* Index + category with icon */}
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

const ABOUT_STATS = [
  { label: "Mode", value: "Remote" },
  { label: "Years", value: "2022 — now" },
  { label: "Industries", value: "Fintech, Transport, AI, Startups" },
  { label: "Shipped", value: "3 live products" },
  { label: "Available", value: "Yes" },
];

function TransmissionAbout() {
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
        {/* Left — heading + bio */}
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
            Designer who ships. Based in Nigeria, building for the world.
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
            I work at the intersection of product design and engineering. I
            prototype in code, design in Figma, and ship in whatever order makes
            sense. Right now building Dara — an AI finance assistant — and taking
            on select client work.
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

        {/* Right — stats grid */}
        <div style={{ paddingTop: 36 }}>
          {ABOUT_STATS.map((stat, i) => (
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
            {/* Open-quote mark */}
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

// ── CTA ───────────────────────────────────────────────────────────────────

function TransmissionCTA() {
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
        I'm the designer you call when you need to ship something real.
      </h2>

      <Link
        href="mailto:deronation1@gmail.com"
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
        Book a call
      </Link>
    </motion.section>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────

export function TransmissionVariation({
  projects,
  testimonials,
  posts,
}: {
  projects: Project[];
  testimonials: TestimonialItem[];
  posts: BlogMeta[];
}) {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .transmission-root * { cursor: none !important; }
      `}</style>

      <TransmissionCursor />
      <TransmissionSidebar />

      <main className="transmission-root" style={{ marginLeft: 260 }}>
        <TransmissionHero projects={projects} />

        {/* Work section header */}
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
          <TransmissionProjectRow
            key={project.id}
            project={project}
            index={i}
          />
        ))}

        <TransmissionAbout />
        <TransmissionTestimonials testimonials={testimonials} />
        <TransmissionWriting posts={posts} />
        <TransmissionCTA />
      </main>
    </div>
  );
}
