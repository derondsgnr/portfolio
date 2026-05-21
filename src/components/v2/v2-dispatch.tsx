"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ScrambleText } from "./shared/scramble-text";
import type { Project } from "@/lib/content/projects";

/* ═══════════════════════════════════════════════════════════════
   DISPATCH — Fixed sidebar. Work is the hero.
   You see real work in the first second.
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

const CONTEXT_LINES = [
  "Built for Fintech",
  "Built for Transport",
  "Built for AI Products",
  "Built for Africa",
  "Built for Startups",
];

const SOCIALS = [
  { label: "X", href: "#" },
  { label: "LI", href: "#" },
  { label: "DR", href: "#" },
  { label: "GH", href: "#" },
];

function DispatchSidebar({ active }: { active: string }) {
  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 260,
        background: "#0A0A0A",
        borderRight: "1px solid rgba(255,255,255,0.06)",
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

      {/* Nav */}
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
              color: active === link.label ? "#F0F0F0" : "rgba(255,255,255,0.28)",
              padding: "10px 0",
              display: "block",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F0F0")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                active === link.label ? "#F0F0F0" : "rgba(255,255,255,0.28)")
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Identity */}
      <div className="px-8 pb-8">
        {/* Availability */}
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

        {/* Name + handle */}
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "13px",
            color: "#F0F0F0",
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          Deron
        </p>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.1em",
            marginBottom: 16,
          }}
        >
          @derondsgnr
        </p>

        {/* Socials */}
        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E2B93B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function DispatchHero({ projects }: { projects: Project[] }) {
  const [contextIdx, setContextIdx] = useState(0);
  const featured = projects[0];

  useEffect(() => {
    const t = setInterval(() => {
      setContextIdx((i) => (i + 1) % CONTEXT_LINES.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative" style={{ height: "100vh" }}>
      {/* Full-bleed project image */}
      <div className="absolute inset-0">
        {featured?.image && (
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.38)" }}
            priority
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.7) 100%)",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative h-full flex flex-col justify-end px-14 pb-16">
        {/* Context line */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={contextIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E2B93B",
              }}
            >
              {CONTEXT_LINES[contextIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

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
            marginBottom: 16,
          }}
        >
          Deron
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 32,
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          Product designer & builder. I prototype to find what's real, then refine until it ships.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/work"
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
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
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "12px 28px",
              display: "inline-block",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F0F0F0";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            Let's connect
          </Link>
        </motion.div>
      </div>

      {/* Featured project label */}
      {featured && (
        <div
          className="absolute top-8 right-8"
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Featured → {featured.title}
        </div>
      )}
    </section>
  );
}

function DispatchProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={ref as React.RefObject<HTMLElement>}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        minHeight: 420,
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
        {project.image && (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.6)" }}
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
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "rgba(255,255,255,0.04)",
                letterSpacing: "0.1em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div
        className="flex flex-col justify-between px-12 py-10"
        style={{ background: "#0D0D0D" }}
      >
        <div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "block",
              marginBottom: 16,
            }}
          >
            {String(index + 1).padStart(2, "0")} — {project.category}
          </span>

          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#F0F0F0",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            <ScrambleText text={project.title} speed={25} />
          </h2>

          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.45)",
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
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            {project.year}
          </span>
          <Link
            href={`/work/${project.slug}`}
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "gap 0.2s",
            }}
          >
            View case study →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function DispatchCTA() {
  return (
    <section
      id="contact"
      className="px-14 py-32"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          display: "block",
          marginBottom: 24,
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
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
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
    </section>
  );
}

export function DispatchVariation({ projects }: { projects: Project[] }) {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <DispatchSidebar active="Home" />

      {/* Main content offset by sidebar */}
      <main style={{ marginLeft: 260 }}>
        <DispatchHero projects={projects} />

        {/* Work label */}
        <div
          className="px-14 pt-20 pb-10 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Latest work
          </span>
          <Link
            href="/work"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E2B93B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            See all →
          </Link>
        </div>

        {/* Project rows */}
        {projects.slice(0, 5).map((project, i) => (
          <DispatchProjectRow key={project.id} project={project} index={i} />
        ))}

        <DispatchCTA />
      </main>
    </div>
  );
}
