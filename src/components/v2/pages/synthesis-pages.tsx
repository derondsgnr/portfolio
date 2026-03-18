"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRouter } from "next/navigation";
import { V2_PROJECTS, V2_ABOUT } from "../v2-data";
import type { CraftItem } from "@/lib/content/craft";
import type { Exploration } from "@/lib/content/explorations";
import type { MediaConfig } from "@/lib/content/media";
import type { PageCopy } from "@/lib/content/copy";
import { useBooking } from "../booking-context";
import { ToolBadges } from "@/components/tool-badge";
import { ToolBadges } from "@/components/tool-badge";

/* ═══════════════════════════════════════════════════════════════
   SYNTHESIS PAGES — Best-of mashup inner pages
   ═══════════════════════════════════════════════════════════════

   ARCHITECTURE
   ────────────
   Work  → Signal terminal hero + List/Grid toggle (SynthesisWorkPage)
   Craft → Synthesis gravity-drop hero + two-tab system (SynthesisCraftPage)
           Tab 1: "Projects" — structured mini case studies, Grid/List toggle
           Tab 2: "Graphics & Motion" — masonry gallery → full-screen viewer
   About → Signal scan-reveal hero + Cipher body (SynthesisAboutPage)

   CRAFT PAGE — EXPLORATION VIEWER (Aristide-inspired)
   ────────────────────────────────────────────────────
   Desktop:
     - Full-screen overlay with 250px right sidebar (numbered list + thumbnails)
     - Scroll/wheel navigates between items (400ms debounced cooldown)
     - Sidebar list scrolls normally (excluded from wheel hijack via [data-sidebar-list])
     - Direction-aware transitions (slides up/down based on nav direction)
     - Gold progress bar at top animates with position
     - ScrambleText decoder on ARCHIVE [03/12] counter
     - Adjacent image preloading for instant transitions
     - Hover states on sidebar items (background highlight + thumbnail border)
     - PREV/NEXT buttons with gold hover borders

   Mobile:
     - Top bar: Close (×) | gold counter pill (03/12) | ☰ list toggle
     - Full-screen media with swipe left/right gestures (50px threshold)
     - Bottom bar: title + metadata + horizontal thumbnail strip (auto-scrolls active)
     - ☰ opens spring-animated bottom sheet with full archive list + backdrop
     - Sheet dismisses on backdrop tap, item selection, or Escape

   Accessibility:
     - role="dialog" + aria-modal + aria-label on overlay
     - aria-live="polite" region announces item changes to screen readers
     - Focus trap (Tab cycles within viewer)
     - focus-visible gold outlines on all interactive elements
     - aria-selected/aria-current on active items
     - role="listbox"/role="option" on sidebar and mobile list
     - Keyboard: Enter/Space on gallery items + sidebar, Arrows + Escape in viewer
     - prefers-reduced-motion: all animations skip/instant

   Gallery (ExplorationsGallery):
     - Masonry layout (columns-2 md:columns-3)
     - Expand icon (⤢) on hover signals "opens viewer"
     - focus-visible ring on gallery cards (keyboard accessible)
     - role="list"/role="listitem" semantics

   ⚠️ GOTCHAS FOR CURSOR:
     1. Motion imports MUST be "motion/react" NOT "framer-motion" — fast_apply
        has a tendency to auto-change this. Always verify after edits.
     2. React hooks (useState, useEffect, useRef, useCallback) MUST stay in the
        top import — they get accidentally dropped during large edits.
     3. ScrambleText component (line ~34) is used both in page sections AND in
        the viewer sidebar header. Don't remove it thinking it's unused.
     4. usePrefersReducedMotion hook is shared by both gallery and viewer.
     5. The viewer uses [data-sidebar-list] and [data-thumb-strip] attributes
        to exclude scroll zones from the wheel-to-navigate handler. Don't
        remove these data attributes.
     6. Direction state (1 | -1) drives transition direction — set it BEFORE
        calling onNavigate when clicking sidebar items.
     7. Body scroll lock (overflow: hidden) is set/cleaned up in a useEffect.
        If you add another modal layer, be careful not to double-unlock.
     8. All viewer content data comes from V2_EXPLORATIONS in v2-data.ts.
        Gallery images use Unsplash URLs — replace with real assets.

   TODO (Cursor):
     - Lenis smooth scroll integration (wrap pages, not the viewer overlay)
     - Page transitions between routes (clip-path wipe or crossfade)
     - ✅ DONE: Case study routing wired at routes.ts:23 (/work/:slug → CaseStudyPage)
     - CMS integration for V2_EXPLORATIONS data (currently mock in v2-data.ts)
     - Replace placeholder Unsplash images with real project graphics/videos
     - Video playback in viewer (currently shows play button overlay only)
     - ✅ DONE: Cal.com embed lives in BookingDrawer (booking-drawer.tsx)

   TODO (Cursor) — REUSABILITY ARCHITECTURE:
     - Extract ALL page sections (hero, about, process, capabilities, work grid,
       testimonials, philosophy, footer, CTA) into standalone components in
       /src/app/components/v2/sections/
     - Each section component should accept props for its data (not import V2_DATA directly)
     - Create a section registry pattern so homepage variations can compose from
       a menu of sections: e.g., SynthesisHome = [SynthesisHero, SignalWork, CipherAbout]
     - The 8 variations (Void, Signal, Cipher, Drift, Echo, Fracture, Gravity, Synthesis)
       must ALL be preserved — they are portfolio pieces, not drafts
     - Inner pages (Work, Craft, About) should follow the same pattern:
       each variation's page is a composition of reusable section components
     - ScrambleText is duplicated 3x (v2-synthesis.tsx, synthesis-pages.tsx, and
       at least one other). Extract to /src/app/components/v2/shared/scramble-text.tsx
       and import everywhere. Do NOT remove — it's used in page sections AND the viewer.
   ═══════════════════════════════════════════════════════════════ */

import { ScrambleText } from "../shared/scramble-text";
import { SignalGrid, ScanLines, CipherBgLayer } from "../shared/texture-layers";
import { useSiteConfig } from "@/contexts/site-config-context";
import { withSound, useSoundOnHover } from "@/hooks/useSound";

/* ─── View Toggle Pill ───────────────────────────────────────── */
function ViewToggle({ mode, onToggle, labelA, labelB }: { mode: "a" | "b"; onToggle: () => void; labelA: string; labelB: string }) {
  const onHover = useSoundOnHover("hover");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="flex items-center gap-1 px-1 py-0.5 rounded-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        onClick={withSound(() => mode !== "a" && onToggle())}
        onMouseEnter={onHover}
        className="px-3 py-1.5 rounded-full transition-all duration-300"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: mode === "a" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
          background: mode === "a" ? "#E2B93B" : "transparent",
        }}
      >
        {labelA}
      </button>
      <button
        onClick={withSound(() => mode !== "b" && onToggle())}
        onMouseEnter={onHover}
        className="px-3 py-1.5 rounded-full transition-all duration-300"
        style={{
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: mode === "b" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
          background: mode === "b" ? "#E2B93B" : "transparent",
        }}
      >
        {labelB}
      </button>
    </motion.div>
  );
}

/* ─── About page CTA with booking integration ──────────────── */
function AboutCTA({ copy }: { copy?: PageCopy }) {
  const { open } = useBooking();
  const onHover = useSoundOnHover("hover");
  const label = copy?.cta?.label ?? "[READY TO DECODE YOUR NEXT PROJECT?]";
  const headline = copy?.cta?.headline ?? "LET'S BUILD";
  const ctaPrimary = copy?.cta?.ctaPrimary ?? "BOOK A CALL";
  const ctaSecondary = copy?.cta?.ctaSecondary ?? "SEND A MESSAGE";
  const subtext = copy?.cta?.subtext ?? "FREE 30-MINUTE DISCOVERY CALL";
  return (
    <section className="relative z-[2] py-32 px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(226,185,59,0.06) 0%, transparent 70%)" }} />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.3em", color: "rgba(226,185,59,0.3)" }}>{label}</span>
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-6">
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.95, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            <ScrambleText text={headline} speed={40} />
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={withSound(() => open("book"))}
            onMouseEnter={onHover}
            className="text-[11px] tracking-[0.2em] text-[#0A0A0A] bg-[#E2B93B] px-8 py-3.5 hover:bg-white transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            {ctaPrimary}
          </button>
          <button
            onClick={withSound(() => open("message"))}
            onMouseEnter={onHover}
            className="text-[11px] tracking-[0.2em] text-[#E2B93B] border border-[#E2B93B]/30 px-8 py-3.5 hover:bg-[#E2B93B]/10 transition-colors duration-300"
            style={{ fontFamily: "monospace" }}
          >
            {ctaSecondary}
          </button>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-6" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)" }}>
          {subtext}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Fracture-style footer ──────────────────────────────────── */
function SynthesisFooter() {
  const { global } = useSiteConfig();
  const socialLinks = global.socialLinks;
  const copyright = global.footerCopyright ?? `© ${new Date().getFullYear()} DERONDSGNR`;
  return (
    <div className="relative z-[2] py-8 px-8">
      <motion.div style={{ transform: "rotate(-1.5deg)" }}>
        <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{copyright}</span>
      </motion.div>
      <div className="flex justify-end gap-6 mt-4" style={{ transform: "rotate(1.5deg)" }}>
        {(socialLinks ?? []).map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#E2B93B] transition-colors" style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORK PAGE — Signal hero + toggle: List (Synthesis) / Grid (Signal)
   ═══════════════════════════════════════════════════════════════ */

function SignalWorkHero({ projects = V2_PROJECTS, copy }: { projects?: typeof V2_PROJECTS; copy?: PageCopy }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, []);

  const accessLabel = copy?.hero?.accessLabel ?? "> ACCESSING WORK_ARCHIVE...";
  const title = copy?.hero?.title ?? "WORK";
  const countSuffix = copy?.hero?.countSuffix ?? "TRANSMISSIONS FOUND";
  const activeLabel = copy?.hero?.activeLabel ?? "SIGNAL: ACTIVE";

  return (
    <section className="relative z-[2] pt-32 pb-16 px-8">
      <motion.div
        initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
          {accessLabel}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8"
      >
        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4rem, 12vw, 12rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
          <ScrambleText text={title} speed={40} />
        </span>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
        className="h-px origin-left mt-8"
        style={{ background: "linear-gradient(90deg, rgba(226,185,59,0.4), transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 flex justify-between items-center"
      >
        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
          {projects.length} {countSuffix}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B" }}>
          {activeLabel}{blink ? "_" : " "}
        </span>
      </motion.div>
    </section>
  );
}

/* Synthesis list view (hover-reveal, cipher scramble) */
function WorkListView({ projects = V2_PROJECTS }: { projects?: typeof V2_PROJECTS }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative cursor-pointer group"
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          onClick={withSound(() => (project as any).slug && router.push(`/work/${(project as any).slug}`), "navigate")}
        >
          <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="py-10 flex items-baseline justify-between">
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: hoveredIdx === i ? "#E2B93B" : "rgba(255,255,255,0.15)", transition: "color 0.3s" }}>
              [{project.id}]
            </span>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: hoveredIdx === i ? "#E2B93B" : "rgba(255,255,255,0.8)", transition: "color 0.5s ease" }}>
              <ScrambleText text={project.title} speed={20} />
            </span>
            <div className="text-right">
              <span className="block" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                {project.category}
              </span>
              <span className="block mt-1" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.1)" }}>
                {project.year}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {hoveredIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "50vh", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                className="overflow-hidden relative"
              >
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" style={{ filter: "grayscale(0.3) contrast(1.1)" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(10,10,10,0.4) 2px, rgba(10,10,10,0.4) 4px)" }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", lineHeight: 1.6, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
                    {project.description}
                  </p>
                </div>
                <div className="absolute top-4 left-4">
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>FREQ_{project.id}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

/* Signal grid view (2-col with scan textures) */
function WorkGridView({ projects = V2_PROJECTS }: { projects?: typeof V2_PROJECTS }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.15, ease: [0.77, 0, 0.175, 1] }}
          className="relative group overflow-hidden cursor-pointer"
          style={{ aspectRatio: "4/3" }}
          onClick={withSound(() => (project as any).slug && router.push(`/work/${(project as any).slug}`), "navigate")}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: "grayscale(0.6) contrast(1.2)" }}
          />
          {/* Scan overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)" }} />
          {/* Info */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex justify-between">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>FREQ_{project.id}</span>
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{project.year}</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
                {project.title}
              </span>
              <span className="block mt-2" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                {project.category}
              </span>
              <p className="mt-3 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
                {project.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SynthesisWorkPage({ projects, copy }: { projects?: typeof V2_PROJECTS; copy?: PageCopy } = {}) {
  const [view, setView] = useState<"a" | "b">("a");

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGrid />
      <ScanLines />
      <CipherBgLayer />

      <SignalWorkHero projects={projects} copy={copy} />

      {/* Toggle + content */}
      <section className="relative z-[2] px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-12">
            <ViewToggle
              mode={view}
              onToggle={() => setView(view === "a" ? "b" : "a")}
              labelA="List"
              labelB="Grid"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {view === "a" ? <WorkListView projects={projects} /> : <WorkGridView projects={projects} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <SynthesisFooter />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CRAFT PAGE — Synthesis hero + toggle: Grid (asymmetric) / List (Cipher)
   ═══════════════════════════════════════════════════════════════ */

function SynthesisCraftHero({ copy, heroBackground }: { copy?: PageCopy; heroBackground?: string }) {
  const label = copy?.hero?.label ?? "> EXPERIMENTS.MAP()";
  return (
    <section className="relative z-[2] pt-32 pb-16 px-8 overflow-hidden">
      {heroBackground && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative z-10">
        <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
          {label}
        </span>
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 12, mass: 3, delay: 0.3 }}
          className="mt-8"
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 16vw, 16rem)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            <ScrambleText text="CRAFT" speed={40} />
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 max-w-md"
          style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.25)" }}
        >
          The work between the work. Explorations, side frequencies, experiments in form.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-8"
          style={{ background: "linear-gradient(90deg, rgba(226,185,59,0.4), transparent)" }}
        />
      </div>
    </section>
  );
}

/* Synthesis asymmetric grid view */
function CraftGridView({ craftItems }: { craftItems: CraftItem[] }) {
  if (craftItems.length === 0) return null;
  return (
    <div className="max-w-6xl mx-auto">
      {craftItems.map((item, i) => {
        const positions = [
          { ml: "0%", w: "50%", aspect: "4/5" },
          { ml: "45%", w: "45%", aspect: "3/2" },
          { ml: "10%", w: "55%", aspect: "16/10" },
          { ml: "0%", w: "38%", aspect: "1/1" },
          { ml: "50%", w: "42%", aspect: "4/3" },
          { ml: "5%", w: "48%", aspect: "4/5" },
          { ml: "40%", w: "50%", aspect: "3/2" },
          { ml: "15%", w: "45%", aspect: "16/10" },
        ];
        const p = positions[i % positions.length];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-16 group cursor-pointer"
            style={{ marginLeft: p.ml, width: p.w }}
          >
            <div className="overflow-hidden relative" style={{ aspectRatio: p.aspect }}>
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "grayscale(0.4)" }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(10,10,10,0.2) 3px, rgba(10,10,10,0.2) 4px)" }} />
              <div className="absolute top-4 left-4">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>EXP_{item.id.replace("c-", "")}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(226,185,59,0.4)", textTransform: "uppercase" }}>[{item.category}]</span>
              <span className="group-hover:text-white/60 transition-colors duration-300" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>
                <ScrambleText text={item.title} speed={15} />
              </span>
            </div>
            <p className="mt-2 max-w-sm" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.15)" }}>
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* Cipher-style list view */
function CraftListView({ craftItems }: { craftItems: CraftItem[] }) {
  if (craftItems.length === 0) return null;
  return (
    <div className="max-w-4xl mx-auto">
      {craftItems.map((item, i) => (
        <div key={item.id}>
          <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group cursor-pointer"
          >
            <div className="md:col-span-2 overflow-hidden" style={{ aspectRatio: "1/1" }}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:grayscale-0"
                style={{ filter: "grayscale(1) brightness(0.5)" }}
              />
            </div>
            <div className="md:col-span-1">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B" }}>[{item.id.replace("c-", "")}]</span>
            </div>
            <div className="md:col-span-4">
              <ScrambleText
                text={item.title}
                speed={20}
                style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}
              />
            </div>
            <div className="md:col-span-2">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>[{item.category.toUpperCase()}]</span>
            </div>
            <div className="md:col-span-3">
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.75rem", lineHeight: 1.5, fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        </div>
      ))}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

/* ─── Explorations masonry gallery ───────────────────────────── */
/* ─── Reduced motion hook (shared by gallery + viewer — do not remove) ── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Gallery with open affordance ───────────────────────────── */
function ExplorationsGallery({ explorations, onOpen }: { explorations: Exploration[]; onOpen: (index: number) => void }) {
  const reduced = usePrefersReducedMotion();
  if (explorations.length === 0) return null;
  return (
    <div className="columns-2 md:columns-3 gap-3" role="list" aria-label="Graphics and motion explorations">
      {explorations.map((item, i) => (
        <motion.div
          key={item.id}
          role="listitem"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className="mb-3 break-inside-avoid group cursor-pointer"
          onClick={() => onOpen(i)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(i); } }}
          tabIndex={0}
          aria-label={`${item.title} — ${item.category}${item.type === "video" ? " (motion)" : ""}. Press Enter to view.`}
        >
          <div className="relative overflow-hidden">
            <img
              src={item.image}
              alt=""
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "grayscale(0.3)" }}
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(10,10,10,0.15) 3px, rgba(10,10,10,0.15) 4px)" }} />
            {/* Video indicator */}
            {item.type === "video" && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(226,185,59,0.3)" }}>
                <div className="w-0 h-0" style={{ borderLeft: "5px solid #E2B93B", borderTop: "3px solid transparent", borderBottom: "3px solid transparent" }} />
                <span style={{ fontFamily: "monospace", fontSize: "8px", color: "#E2B93B", letterSpacing: "0.1em" }}>MOTION</span>
              </div>
            )}
            {/* Expand affordance icon — visible on hover */}
            <div
              className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(226,185,59,0.25)" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 3.5V1h2.5M6.5 1H9v2.5M9 6.5V9H6.5M3.5 9H1V6.5" stroke="#E2B93B" strokeWidth="1" />
              </svg>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)" }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", color: "#E2B93B" }}>[{item.id.replace("ex-", "")}] {item.category.toUpperCase()}</span>
                <span className="block mt-1" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>{item.title}</span>
              </div>
            </div>
            {/* Focus ring */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity" style={{ boxShadow: "inset 0 0 0 2px #E2B93B" }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Full-screen Aristide-style media viewer ────────────────── */
function ExplorationViewer({ explorations, activeIndex, onClose, onNavigate }: { explorations: Exploration[]; activeIndex: number; onClose: () => void; onNavigate: (index: number) => void }) {
  const item = explorations[activeIndex];
  if (!item) return null;
  const listRef = useRef<HTMLDivElement>(null);
  const mobileThumbRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const prevIndex = useRef(activeIndex);
  const [showMobileList, setShowMobileList] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduced = usePrefersReducedMotion();

  const goNext = useCallback(() => {
    if (activeIndex < explorations.length - 1) { setDirection(1); onNavigate(activeIndex + 1); }
  }, [activeIndex, explorations.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) { setDirection(-1); onNavigate(activeIndex - 1); }
  }, [activeIndex, onNavigate]);

  // Track direction for click navigation in sidebar
  useEffect(() => {
    if (activeIndex > prevIndex.current) setDirection(1);
    else if (activeIndex < prevIndex.current) setDirection(-1);
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  // Focus trap
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    el.focus();
    const focusable = el.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"]), a[href]');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [showMobileList]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { showMobileList ? setShowMobileList(false) : onClose(); }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose, showMobileList]);

  // Scroll / wheel to navigate (debounced)
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-sidebar-list]")) return;
      e.preventDefault();
      if (scrollCooldown.current) return;
      scrollCooldown.current = true;
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
      setTimeout(() => { scrollCooldown.current = false; }, 400);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [goNext, goPrev]);

  // Touch swipe for mobile
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-sidebar-list]") || target.closest("[data-thumb-strip]")) return;
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(e.changedTouches[0].clientY - touchStart.current.y);
      if (absDx > 50 && absDx > absDy) {
        if (dx < 0) goNext(); else goPrev();
      }
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Preload adjacent images
  useEffect(() => {
    const preload = (idx: number) => {
      if (idx >= 0 && idx < explorations.length) {
        const img = new Image();
        img.src = explorations[idx].image;
      }
    };
    preload(activeIndex + 1);
    preload(activeIndex - 1);
  }, [activeIndex, explorations]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const el = mobileThumbRef.current?.querySelector(`[data-thumb="${activeIndex}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  useEffect(() => { setShowMobileList(false); }, [activeIndex]);

  // Screen reader live region
  const srAnnounce = `${item.title}, ${item.category}, ${activeIndex + 1} of ${explorations.length}`;

  // Progress fraction
  const progress = (activeIndex + 1) / explorations.length;

  // Direction-aware media transitions
  const mediaVariants = reduced
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: direction * 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: direction * -20 },
      };

  return (
    <motion.div
      ref={viewerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Exploration viewer — ${item.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.1 : 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col md:flex-row outline-none"
      style={{ background: "#0A0A0A" }}
    >
      {/* SR live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">{srAnnounce}</div>

      {/* Progress bar — thin gold line at top */}
      <div className="absolute top-0 left-0 right-0 z-[115] h-[2px]" style={{ background: "rgba(255,255,255,0.03)" }}>
        <motion.div
          className="h-full"
          style={{ background: "#E2B93B" }}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
        />
      </div>

      {/* Signal grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,185,59,0.008) 2px, rgba(226,185,59,0.008) 4px)" }} />

      {/* ═══ MOBILE TOP BAR ═══ */}
      <div className="md:hidden relative z-[110] flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={onClose}
          aria-label="Close viewer"
          className="w-8 h-8 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B]"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>×</span>
        </button>
        <div className="px-3 py-1 rounded-full" style={{ background: "rgba(226,185,59,0.1)", border: "1px solid rgba(226,185,59,0.2)" }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#E2B93B", letterSpacing: "0.15em" }}>
            {String(activeIndex + 1).padStart(2, "0")}/{String(explorations.length).padStart(2, "0")}
          </span>
        </div>
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          aria-label={showMobileList ? "Close item list" : "Browse all items"}
          aria-expanded={showMobileList}
          className="w-8 h-8 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B]"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "10px", color: showMobileList ? "#E2B93B" : "rgba(255,255,255,0.6)" }}>{showMobileList ? "×" : "☰"}</span>
        </button>
      </div>

      {/* ═══ DESKTOP CLOSE ═══ */}
      <button
        onClick={onClose}
        aria-label="Close viewer (Escape)"
        className="hidden md:flex absolute top-6 right-6 z-[110] w-10 h-10 items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#E2B93B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B]"
        style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.3)" }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>×</span>
      </button>

      {/* Title bleed — desktop only */}
      <div className="hidden md:block absolute top-12 left-8 z-[1] pointer-events-none overflow-hidden" style={{ maxWidth: "60vw" }}>
        <motion.span
          key={item.title}
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 0.04, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4rem, 10vw, 10rem)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#fff", display: "block", whiteSpace: "nowrap" }}
        >
          {item.title}
        </motion.span>
      </div>

      {/* ═══ MAIN MEDIA ═══ */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-16 relative z-[2] min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            initial={mediaVariants.initial}
            animate={mediaVariants.animate}
            exit={mediaVariants.exit}
            transition={{ duration: reduced ? 0.1 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex items-center justify-center"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          >
            <img
              src={item.image}
              alt={`${item.title} — ${item.category} exploration`}
              className="max-w-full max-h-[60vh] md:max-h-[75vh] object-contain"
              style={{ filter: item.type === "video" ? "none" : "grayscale(0.15)" }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(10,10,10,0.08) 3px, rgba(10,10,10,0.08) 4px)" }} />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(226,185,59,0.4)" }}>
                  <div className="w-0 h-0 ml-1" style={{ borderLeft: "10px solid #E2B93B", borderTop: "6px solid transparent", borderBottom: "6px solid transparent" }} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop scroll hint */}
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: activeIndex === 0 ? 0.8 : 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex absolute bottom-20 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
        >
          <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>SCROLL TO NAVIGATE</span>
          <motion.div animate={reduced ? {} : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 1, height: 12, background: "rgba(226,185,59,0.4)" }} />
        </motion.div>

        {/* Desktop metadata — improved contrast */}
        <motion.div
          key={`meta-${activeIndex}`}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden md:flex absolute bottom-8 left-16 right-[280px] items-center gap-8"
        >
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>[{item.category.toUpperCase()}]</span>
          <span className="inline-flex items-center gap-2" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>TOOLS: <ToolBadges tools={item.tools} size={12} className="text-[#888]" /></span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{item.date}</span>
        </motion.div>
      </div>

      {/* ═══ MOBILE BOTTOM BAR ═══ */}
      <div className="md:hidden relative z-[110] flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-4 py-3">
          <span className="block" style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.2rem", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#f0f0f0" }}>{item.title}</span>
          <div className="flex items-center gap-4 mt-2">
            <span style={{ fontFamily: "monospace", fontSize: "8px", color: "#E2B93B", letterSpacing: "0.15em" }}>[{item.category.toUpperCase()}]</span>
            <span className="inline-flex items-center gap-1.5" style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
            <ToolBadges tools={item.tools} size={10} />
          </span>
            <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>{item.date}</span>
          </div>
        </div>
        <div ref={mobileThumbRef} data-thumb-strip className="flex gap-1.5 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {explorations.map((exp, i) => (
            <button
              key={exp.id}
              data-thumb={i}
              onClick={() => onNavigate(i)}
              aria-label={`View ${exp.title}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className="flex-shrink-0 cursor-pointer transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B]"
              style={{ width: 44, height: 44, border: i === activeIndex ? "2px solid #E2B93B" : "2px solid rgba(255,255,255,0.06)", opacity: i === activeIndex ? 1 : 0.5 }}
            >
              <img src={exp.image} alt="" className="w-full h-full object-cover" style={{ filter: i === activeIndex ? "none" : "grayscale(1)" }} />
            </button>
          ))}
        </div>
        <div className="text-center pb-2">
          <span style={{ fontFamily: "monospace", fontSize: "7px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.2em" }}>← SWIPE TO NAVIGATE →</span>
        </div>
      </div>

      {/* ═══ MOBILE FULL LIST (slide-up sheet) ═══ */}
      <AnimatePresence>
        {showMobileList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[119]"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowMobileList(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="listbox"
              aria-label="Exploration archive list"
              className="md:hidden fixed inset-x-0 bottom-0 z-[120] overflow-y-auto"
              style={{ background: "rgba(10,10,10,0.98)", maxHeight: "70vh", borderTop: "1px solid rgba(226,185,59,0.2)" }}
            >
              <div className="flex justify-center py-3">
                <div className="w-10 h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
              </div>
              <div className="px-4 pb-2">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.2em" }}>ARCHIVE [{String(activeIndex + 1).padStart(2, "0")}/{String(explorations.length).padStart(2, "0")}]</span>
              </div>
              {explorations.map((exp, i) => (
                <div
                  key={exp.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => { onNavigate(i); setShowMobileList(false); }}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200"
                  style={{ background: i === activeIndex ? "rgba(226,185,59,0.1)" : "transparent", borderLeft: i === activeIndex ? "2px solid #E2B93B" : "2px solid transparent" }}
                >
                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden" style={{ border: i === activeIndex ? "1px solid rgba(226,185,59,0.3)" : "1px solid transparent" }}>
                    <img src={exp.image} alt="" className="w-full h-full object-cover" style={{ filter: i === activeIndex ? "none" : "grayscale(1) brightness(0.5)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.05em", color: i === activeIndex ? "#E2B93B" : "rgba(255,255,255,0.35)" }}>
                      {String(i + 1).padStart(2, "0")} — {exp.title}
                    </span>
                    <span className="block mt-0.5" style={{ fontFamily: "monospace", fontSize: "8px", color: i === activeIndex ? "rgba(226,185,59,0.5)" : "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>{exp.category}</span>
                  </div>
                  {exp.type === "video" && (
                    <div className="w-0 h-0 flex-shrink-0" style={{ borderLeft: "4px solid rgba(226,185,59,0.4)", borderTop: "2.5px solid transparent", borderBottom: "2.5px solid transparent" }} />
                  )}
                </div>
              ))}
              <div className="h-8" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ DESKTOP RIGHT PANEL ═══ */}
      <nav
        className="hidden md:flex w-[250px] flex-col border-l"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
        aria-label="Exploration archive"
      >
        <div className="px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <ScrambleText
            key={activeIndex}
            text={`ARCHIVE [${String(activeIndex + 1).padStart(2, "0")}/${String(explorations.length).padStart(2, "0")}]`}
            speed={25}
            style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.2em" }}
          />
        </div>
        <div ref={listRef} data-sidebar-list className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }} role="listbox" aria-label="Exploration items">
          {explorations.map((exp, i) => (
            <div
              key={exp.id}
              data-index={i}
              role="option"
              aria-selected={i === activeIndex}
              aria-label={`${exp.title} — ${exp.category}`}
              onClick={() => { setDirection(i > activeIndex ? 1 : -1); onNavigate(i); }}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDirection(i > activeIndex ? 1 : -1); onNavigate(i); } }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B] focus-visible:outline-offset-[-2px]"
              style={{
                background: i === activeIndex ? "rgba(226,185,59,0.1)" : "transparent",
                borderLeft: i === activeIndex ? "2px solid #E2B93B" : "2px solid transparent",
              }}
              onMouseEnter={(e) => { if (i !== activeIndex) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (i !== activeIndex) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div className="w-10 h-10 flex-shrink-0 overflow-hidden transition-all duration-300" style={{ border: i === activeIndex ? "1px solid rgba(226,185,59,0.3)" : "1px solid transparent" }}>
                <img src={exp.image} alt="" className="w-full h-full object-cover transition-all duration-300" style={{ filter: i === activeIndex ? "none" : "grayscale(1) brightness(0.4)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate transition-colors duration-200" style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.05em", color: i === activeIndex ? "#E2B93B" : "rgba(255,255,255,0.35)" }}>
                  {String(i + 1).padStart(2, "0")} — {exp.title}
                </span>
                <span className="block mt-0.5 transition-colors duration-200" style={{ fontFamily: "monospace", fontSize: "8px", color: i === activeIndex ? "rgba(226,185,59,0.5)" : "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>{exp.category}</span>
              </div>
              {exp.type === "video" && (
                <div className="w-0 h-0 flex-shrink-0" style={{ borderLeft: "4px solid rgba(226,185,59,0.4)", borderTop: "2.5px solid transparent", borderBottom: "2.5px solid transparent" }} />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 py-4 flex gap-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous item"
            className="flex-1 py-2 cursor-pointer transition-all duration-200 hover:border-[#E2B93B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B] disabled:hover:border-[rgba(255,255,255,0.08)]"
            style={{ border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace", fontSize: "9px", color: activeIndex === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", letterSpacing: "0.1em", background: "transparent" }}
          >
            ← PREV
          </button>
          <button
            onClick={goNext}
            disabled={activeIndex === explorations.length - 1}
            aria-label="Next item"
            className="flex-1 py-2 cursor-pointer transition-all duration-200 hover:border-[#E2B93B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2B93B] disabled:hover:border-[rgba(255,255,255,0.08)]"
            style={{ border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace", fontSize: "9px", color: activeIndex === explorations.length - 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", letterSpacing: "0.1em", background: "transparent" }}
          >
            NEXT →
          </button>
        </div>
      </nav>
    </motion.div>
  );
}

export function SynthesisCraftPage({ copy, craftItems = [], explorations = [], media }: { copy?: PageCopy; craftItems?: CraftItem[]; explorations?: Exploration[]; media?: MediaConfig } = {}) {
  const [tab, setTab] = useState<"projects" | "explorations">("projects");
  const [view, setView] = useState<"a" | "b">("a");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGrid />
      <ScanLines />
      <CipherBgLayer />

      <SynthesisCraftHero copy={copy} heroBackground={media?.heroBackground} />

      <section className="relative z-[2] px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* ─── Inline toolbar: tabs left, view toggle right ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex items-center justify-between mb-12 flex-wrap gap-4"
          >
            {/* Tab switcher */}
            <div
              className="flex items-center gap-1 px-1 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => setTab("projects")}
                className="px-3 py-1.5 rounded-full transition-all duration-300"
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: tab === "projects" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
                  background: tab === "projects" ? "#E2B93B" : "transparent",
                }}
              >
                Projects
              </button>
              <button
                onClick={() => setTab("explorations")}
                className="px-3 py-1.5 rounded-full transition-all duration-300"
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: tab === "explorations" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
                  background: tab === "explorations" ? "#E2B93B" : "transparent",
                }}
              >
                Graphics & Motion
              </button>
            </div>

            {/* View toggle — only on Projects tab */}
            {tab === "projects" && (
              <ViewToggle
                mode={view}
                onToggle={() => setView(view === "a" ? "b" : "a")}
                labelA="Grid"
                labelB="List"
              />
            )}

            {/* Item count — only on Explorations tab */}
            {tab === "explorations" && (
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
                {explorations.length} ARTIFACTS INDEXED
              </span>
            )}
          </motion.div>

          {/* ─── Tab content ─── */}
          <AnimatePresence mode="wait">
            {tab === "projects" ? (
              <motion.div
                key={`projects-${view}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {view === "a" ? <CraftGridView craftItems={craftItems} /> : <CraftListView craftItems={craftItems} />}
              </motion.div>
            ) : (
              <motion.div
                key="explorations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ExplorationsGallery explorations={explorations} onOpen={(i) => setViewerIndex(i)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <SynthesisFooter />

      {/* Full-screen viewer overlay */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <ExplorationViewer
            explorations={explorations}
            activeIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onNavigate={(i) => setViewerIndex(i)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT PAGE — Signal hero + Cipher body
   ══════════════════════════════════════════════════════════════ */

export function SynthesisAboutPage({ copy }: { copy?: PageCopy } = {}) {
  const [decoded, setDecoded] = useState(false);
  useEffect(() => { setTimeout(() => setDecoded(true), 500); }, []);

  const heroLabel = copy?.hero?.label ?? "> OPERATOR_PROFILE.READ()";
  const heroName = copy?.hero?.name ?? "DERON";
  const heroTagline = copy?.hero?.tagline ?? "PRODUCT_DESIGNER // BUILDER";

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      <SignalGrid />
      <ScanLines />
      <CipherBgLayer />

      {/* ── Signal-style hero ───────────────────────────────── */}
      <section className="relative z-[2] pt-32 pb-24 px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
            {heroLabel}
          </span>
        </motion.div>
        <motion.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.3, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="block mt-8"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(4rem, 14vw, 14rem)", lineHeight: 0.85, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#f0f0f0" }}
        >
          {decoded ? <ScrambleText text={heroName} speed={40} /> : "?????"}
        </motion.span>
        <motion.div
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ delay: 0.6, duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="mt-4"
        >
          <span style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.5em", color: "#E2B93B", textTransform: "uppercase" }}>
            {heroTagline}
          </span>
        </motion.div>

        {/* Signal status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 flex justify-between"
          style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}
        >
          <span>LOCATION: {V2_ABOUT.location.toUpperCase()} // LAT: {V2_ABOUT.coordinates.lat} // LNG: {V2_ABOUT.coordinates.lng}</span>
          <span>STATUS: {V2_ABOUT.currently.toUpperCase()}</span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="h-px origin-left mt-6"
          style={{ background: "linear-gradient(90deg, rgba(226,185,59,0.4), transparent)" }}
        />
      </section>

      {/* ── Cipher-style body ───────────────────────────────── */}
      <section className="relative z-[2] py-16 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left — bio decodes */}
          <div>
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>
              [BIO.DECRYPT()]
            </span>
            {V2_ABOUT.bio.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className={i > 0 ? "mt-6" : "mt-4"}
                style={{ borderLeft: "1px solid rgba(226,185,59,0.15)", paddingLeft: "1.5rem" }}
              >
                <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.8, fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
                  <ScrambleText text={p} speed={3} />
                </p>
              </motion.div>
            ))}

            {/* Social links — Cipher style */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12"
            >
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>[CHANNELS.DECRYPT()]</span>
              <div className="mt-3 space-y-3">
                {V2_ABOUT.socials.map((s) => (
                  <a key={s.label} href={s.url} className="flex items-center gap-3 group cursor-pointer">
                    <span className="group-hover:text-[#E2B93B] transition-colors duration-300" style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                      {s.label.toUpperCase()}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(226,185,59,0.5)" }}>
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — stats, tools, values */}
          <div>
            {/* Scramble stats */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {V2_ABOUT.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <ScrambleText
                    text={stat.value}
                    speed={50}
                    style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1, color: "#E2B93B", display: "block" }}
                  />
                  <span className="block mt-2" style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
                    [{stat.label}]
                  </span>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="mb-12">
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.15em" }}>[TOOLS.LIST()]</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {V2_ABOUT.tools.map((tool) => (
                  <span key={tool} className="inline-flex items-center gap-1.5" style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 10px" }}>
                    <ToolBadge tool={tool} size={14} showLabel />
                  </span>
                ))}
              </div>
            </div>

            {/* Location detail */}
            <div className="mb-12 p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex justify-between items-start mb-4">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>NODE_INFO</span>
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>[VERIFIED]</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", lineHeight: 2 }}>
                <p>HANDLE: @{V2_ABOUT.handle}</p>
                <p>LOCATION: {V2_ABOUT.location.toUpperCase()}</p>
                <p>LAT: {V2_ABOUT.coordinates.lat}</p>
                <p>LNG: {V2_ABOUT.coordinates.lng}</p>
                <p>STATUS: <span style={{ color: "#E2B93B" }}>{V2_ABOUT.currently.toUpperCase()}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — Cipher decode style */}
      <section className="relative z-[2] py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", color: "#E2B93B" }}>[VALUES.DECRYPT()]</span>
          <div className="mt-8">
            {V2_ABOUT.values.map((v, i) => (
              <motion.div key={v.word} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
                <div className="py-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.15)", width: 30 }}>{String(i).padStart(2, "0")}</span>
                    <ScrambleText
                      text={v.word}
                      speed={30}
                      style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: i === 1 ? "#E2B93B" : "rgba(255,255,255,0.6)" }}
                    />
                  </div>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(255,255,255,0.2)", maxWidth: "300px", textAlign: "right" }}>
                    {v.desc}
                  </span>
                </div>
              </motion.div>
            ))}
            <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
          </div>
        </div>
      </section>

      {/* Philosophy / CTA */}
      <AboutCTA copy={copy} />

      <SynthesisFooter />
    </main>
  );
}