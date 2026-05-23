"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useScrambleText } from "./shared/scramble-text";
import type { Project } from "@/lib/content/projects";

/* ═══════════════════════════════════════════════════════════════
   INDEX — No hero. The work IS the page.
   Editorial directory. Text is the architecture.
   Hover a row → image panel responds.
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

const DISCIPLINES = [
  "Product Design",
  "Interaction",
  "Systems",
  "AI Interfaces",
  "Build & Ship",
];

function IndexTopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10"
      style={{
        height: 56,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link href="/">
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.12em",
            color: "#E2B93B",
            textTransform: "uppercase",
          }}
        >
          Deron
        </span>
      </Link>
      <nav className="flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F0F0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function IndexHeader() {
  const [discIdx, setDiscIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setDiscIdx((i) => (i + 1) % DISCIPLINES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div ref={ref} className="pt-56 pb-16 px-10">
      {/* Massive name */}
      <h1
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: "clamp(5rem, 14vw, 14rem)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: "#F0F0F0",
          lineHeight: 0.88,
          marginBottom: 32,
        }}
      >
        Deron
        <br />
        <span style={{ color: "rgba(255,255,255,0.08)" }}>Dsgnr</span>
      </h1>

      {/* Meta bar */}
      <div
        className="flex items-center gap-6 flex-wrap"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: 20,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={discIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E2B93B",
            }}
          >
            {DISCIPLINES[discIdx]}
          </motion.span>
        </AnimatePresence>
        <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 10 }}>·</span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Nigeria, Remote
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 10 }}>·</span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          40+ Projects · 5 Years
        </span>
      </div>
    </div>
  );
}

function ProjectRowScramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [hovered, setHovered] = useState(false);
  const display = useScrambleText(text, inView || hovered, 22);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {display}
    </span>
  );
}

function IndexProjectList({
  projects,
  onHover,
}: {
  projects: Project[];
  onHover: (project: Project | null) => void;
}) {
  return (
    <div>
      {/* Column headers */}
      <div
        className="px-10 py-3 grid"
        style={{
          gridTemplateColumns: "3rem 1fr auto auto",
          gap: "0 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {["No.", "Project", "Category", "Year"].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {projects.map((project, i) => (
        <ProjectRow
          key={project.id}
          project={project}
          index={i}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

function ProjectRow({
  project,
  index,
  onHover,
}: {
  project: Project;
  index: number;
  onHover: (p: Project | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        ref={ref}
        href={`/work/${project.slug}`}
        className="block px-10 py-6 grid"
        style={{
          gridTemplateColumns: "3rem 1fr auto auto",
          gap: "0 2rem",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
          transition: "background 0.2s",
        }}
        onMouseEnter={() => {
          setHovered(true);
          onHover(project);
        }}
        onMouseLeave={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: hovered ? "#E2B93B" : "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
            transition: "color 0.2s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.4rem, 2.5vw, 2.4rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: hovered ? "#F0F0F0" : "rgba(255,255,255,0.75)",
            transition: "color 0.2s",
          }}
        >
          <ProjectRowScramble text={project.title} />
        </span>

        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          {project.category}
        </span>

        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.12em",
            color: hovered ? "#E2B93B" : "rgba(255,255,255,0.18)",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {project.year} →
        </span>
      </Link>
    </motion.div>
  );
}

function IndexImagePanel({ project }: { project: Project | null }) {
  return (
    <div
      className="sticky top-0 h-screen flex items-center justify-center"
      style={{ background: "#0D0D0D" }}
    >
      <AnimatePresence mode="wait">
        {project ? (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full h-full"
            style={{ maxWidth: "90%", maxHeight: "70vh", margin: "auto" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.75)" }}
            />
            {/* Project overlay info */}
            <div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{
                background:
                  "linear-gradient(transparent, rgba(10,10,10,0.85))",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#E2B93B",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {project.category} · {project.year}
              </span>
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#F0F0F0",
                }}
              >
                {project.title}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.03)",
                display: "block",
                lineHeight: 1,
              }}
            >
              Work
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.12)",
                marginTop: 16,
                display: "block",
              }}
            >
              Hover a project
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IndexCTA() {
  return (
    <section
      id="contact"
      className="px-10 py-32"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-2xl">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            display: "block",
            marginBottom: 20,
          }}
        >
          Let's work
        </span>
        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#F0F0F0",
            lineHeight: 1.05,
            marginBottom: 32,
          }}
        >
          Got a problem worth solving? I ship.
        </h2>
        <Link
          href="mailto:deronation1@gmail.com"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#E2B93B",
            padding: "14px 32px",
            display: "inline-block",
          }}
        >
          Start a conversation →
        </Link>
      </div>
    </section>
  );
}

export function IndexVariation({ projects }: { projects: Project[] }) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <IndexTopBar />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* Left: scrollable content */}
        <div>
          <IndexHeader />
          <IndexProjectList projects={projects} onHover={setHoveredProject} />
          <IndexCTA />
        </div>

        {/* Right: sticky image panel — desktop only */}
        <div className="hidden lg:block" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
          <IndexImagePanel project={hoveredProject} />
        </div>
      </div>
    </div>
  );
}
