"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useScrambleText } from "./shared/scramble-text";
import type { Project } from "@/lib/content/projects";

/* ═══════════════════════════════════════════════════════════════
   BROADCAST — Split screen. Fixed left narrates.
   Right scrolls through the work.
   Left reacts to what you're looking at.
   ═══════════════════════════════════════════════════════════════ */

const DISCIPLINES = [
  "Product Design",
  "Interaction Design",
  "Systems Thinking",
  "AI Interfaces",
  "Build & Ship",
];

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

function BroadcastTopBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
      style={{
        height: 52,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Link href="/">
        <span
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.1em",
            color: "#E2B93B",
            textTransform: "uppercase",
          }}
        >
          D/
        </span>
      </Link>
      <nav className="flex items-center gap-7">
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
    </div>
  );
}

function DisciplineScramble() {
  const [idx, setIdx] = useState(0);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setTrigger(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % DISCIPLINES.length);
        setTrigger(true);
      }, 100);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const display = useScrambleText(DISCIPLINES[idx], trigger, 30);

  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#E2B93B",
      }}
    >
      {display}
    </span>
  );
}

function BroadcastLeft({
  activeProject,
  progress,
}: {
  activeProject: Project | null;
  progress: number;
}) {
  return (
    <div
      className="fixed top-0 left-0 h-screen flex flex-col"
      style={{
        width: "42vw",
        paddingTop: 52,
        background: "#0A0A0A",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        zIndex: 30,
      }}
    >
      {/* Main editorial content */}
      <div className="flex-1 flex flex-col justify-center px-12">
        {/* Discipline cycling */}
        <div className="mb-8">
          <DisciplineScramble />
        </div>

        {/* Name — massive */}
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(4rem, 7vw, 8rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 0.9,
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#F0F0F0" }}>Deron</span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.07)" }}>Dsgnr</span>
        </h1>

        {/* Contextual annotation — updates per project */}
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#E2B93B",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {activeProject.category} · {activeProject.year}
              </span>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: 340,
                  marginBottom: 16,
                }}
              >
                {activeProject.description.length > 120
                  ? activeProject.description.slice(0, 120) + "…"
                  : activeProject.description}
              </p>
              <Link
                href={`/work/${activeProject.slug}`}
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#E2B93B",
                }}
              >
                Open case study →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.3)",
                  maxWidth: 320,
                }}
              >
                Product designer & builder. I prototype to find what's real, then refine until it ships.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div
        className="px-12 pb-8 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}
      >
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 48,
              height: 1,
              background: "rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                background: "#E2B93B",
                width: `${progress * 100}%`,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#4ade80",
              display: "block",
              boxShadow: "0 0 5px #4ade80",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Available
          </span>
        </div>
      </div>
    </div>
  );
}

function BroadcastProjectCard({
  project,
  index,
  onVisible,
}: {
  project: Project;
  index: number;
  onVisible: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(project);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [project, onVisible]);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ minHeight: "90vh", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative flex-1" style={{ minHeight: 480 }}>
        {project.image && (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.55)" }}
            />
          </motion.div>
        )}
        {!project.image && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#111111" }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "6rem",
                color: "rgba(255,255,255,0.03)",
                letterSpacing: "0.1em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Number overlay */}
        <div
          className="absolute top-6 left-6"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {String(index + 1).padStart(2, "0")} / 08
        </div>
      </div>

      {/* Card metadata */}
      <div
        className="px-8 py-7 flex items-end justify-between"
        style={{
          background: "#0D0D0D",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#F0F0F0",
              lineHeight: 1.05,
              marginBottom: 6,
            }}
          >
            {project.title}
          </h2>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {project.category}
          </span>
        </div>

        <Link
          href={`/work/${project.slug}`}
          style={{
            width: 44,
            height: 44,
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            color: "#F0F0F0",
            fontSize: 16,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E2B93B";
            e.currentTarget.style.borderColor = "#E2B93B";
            e.currentTarget.style.color = "#0A0A0A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "#F0F0F0";
          }}
        >
          →
        </Link>
      </div>
    </div>
  );
}

function BroadcastRight({
  projects,
  onProjectVisible,
}: {
  projects: Project[];
  onProjectVisible: (p: Project) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed right-0 top-0 h-screen overflow-y-scroll"
      style={{
        width: "58vw",
        paddingTop: 52,
      }}
    >
      {projects.map((project, i) => (
        <BroadcastProjectCard
          key={project.id}
          project={project}
          index={i}
          onVisible={onProjectVisible}
        />
      ))}

      {/* CTA */}
      <div
        id="contact"
        className="px-8 py-24"
        style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
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
          Next step
        </span>
        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#F0F0F0",
            lineHeight: 1.05,
            maxWidth: 500,
            marginBottom: 28,
          }}
        >
          I'm the designer you call when you need to ship something real.
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
          Book a call
        </Link>
      </div>
    </div>
  );
}

export function BroadcastVariation({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(projects[0] ?? null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleProjectVisible = useCallback((p: Project) => {
    setActiveProject(p);
  }, []);

  useEffect(() => {
    const rightEl = document.querySelector("[data-broadcast-right]") as HTMLElement | null;
    if (!rightEl) return;
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = rightEl;
      setScrollProgress(scrollTop / (scrollHeight - clientHeight) || 0);
    };
    rightEl.addEventListener("scroll", handler);
    return () => rightEl.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: "#0A0A0A", height: "100vh", overflow: "hidden" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <BroadcastTopBar />
      <BroadcastLeft activeProject={activeProject} progress={scrollProgress} />

      {/* Right scrollable pane */}
      <div
        data-broadcast-right=""
        className="fixed right-0 top-0 h-screen overflow-y-scroll"
        style={{ width: "58vw", paddingTop: 52 }}
        onScroll={(e) => {
          const el = e.currentTarget;
          setScrollProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0);
        }}
      >
        {projects.map((project, i) => (
          <BroadcastProjectCard
            key={project.id}
            project={project}
            index={i}
            onVisible={handleProjectVisible}
          />
        ))}

        {/* CTA */}
        <div
          id="contact"
          className="px-8 py-24"
          style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
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
            Next step
          </span>
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#F0F0F0",
              lineHeight: 1.05,
              maxWidth: 500,
              marginBottom: 28,
            }}
          >
            I'm the designer you call when you need to ship something real.
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
            Book a call
          </Link>
        </div>
      </div>
    </div>
  );
}
