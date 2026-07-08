"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AboutGlobe } from "../about/about-globe";
import { FilmDeck } from "../about/film-deck";
import { GameConsole } from "../about/game-console";
import { WidgetBoundary } from "../about/widget-boundary";
import type { SocialLink } from "@/lib/content/global";
import type { AboutContent } from "@/lib/content/about";
import { DEFAULT_ABOUT } from "@/lib/content/defaults";

/* ═══════════════════════════════════════════════════════════════
   ABOUT — a letter, not a layout.
   One first-person voice, asymmetric rhythm, lean. All copy, media and
   per-section visibility come from `content` (content/about.json, edited
   at /admin/about). Wrap a word in *asterisks* to render it gold. Reveals
   are visible-by-default so the page can never blank out.
   ═══════════════════════════════════════════════════════════════ */

const GOLD = "#ECFF95";

/** Render text with *wrapped* spans in gold. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.length > 2 && p.startsWith("*") && p.endsWith("*") ? (
          <span key={i} style={{ color: GOLD }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/* Visible-by-default scroll reveal. Server + first client render show the
   content (opacity:1) — JS only hides-then-reveals on scroll, with a timed
   fallback so nothing can ever stay hidden. */
function Beat({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    const safety = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const hide = armed && !shown;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: hide ? 0 : 1,
        transform: hide ? "translateY(22px)" : "none",
        transition: `opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

function shortSocial(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("twitter") || l === "x") return "X";
  if (l.includes("linkedin")) return "LinkedIn";
  if (l.includes("dribbble")) return "Dribbble";
  if (l.includes("github")) return "GitHub";
  if (l.includes("instagram")) return "Instagram";
  if (l.includes("behance")) return "Behance";
  return label;
}

const body: React.CSSProperties = {
  fontFamily: "'Instrument Sans', sans-serif",
  fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.72)",
};

export function AboutV2({
  profileImage,
  socials = [],
  content = DEFAULT_ABOUT,
}: {
  profileImage?: string;
  socials?: SocialLink[];
  content?: AboutContent;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = content;
  const s = c.sections;

  return (
    <main className="relative" style={{ background: "#121316", minHeight: "100vh", overflowX: "hidden" }}>
      {/* microinteractions (CSS — hydration-safe) */}
      <style>{`
        .ab-life { transition: transform .25s ease; }
        .ab-life:hover { transform: translateX(5px); }
        .ab-life:hover .ab-life-name { color: #F2F0EC; }
        .ab-life:hover .ab-life-no { color: #ECFF95; }
        .ab-cta { transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
        .ab-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(236, 255, 149,0.28); background: #f0cf57; }
        .ab-cta .ab-cta-arrow { display:inline-block; transition: transform .2s ease; }
        .ab-cta:hover .ab-cta-arrow { transform: translateX(4px); }
        .ab-social { transition: color .2s ease; }
        .ab-social .ab-arrow { display:inline-block; transition: transform .2s ease; }
        .ab-social:hover .ab-arrow { transform: translate(3px,-3px); }
        .ab-genre { transition: border-color .2s ease, color .2s ease; }
        .ab-genre:hover { border-color: rgba(236, 255, 149,0.5); color: #F0F0F0; }
      `}</style>

      {/* warm glow */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 680, background: "radial-gradient(70% 100% at 15% 0%, rgba(236, 255, 149,0.09), transparent 60%)", pointerEvents: "none" }} />

      <div className="relative px-6 sm:px-8 md:px-12" style={{ maxWidth: 1180, margin: "0 auto", paddingTop: 120, paddingBottom: 120 }}>
        {/* ── Opening ─────────────────────────────────────────── */}
        <div className="relative" style={{ marginBottom: 72 }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            {c.location}
          </span>
          <div className="flex flex-col md:flex-row md:items-end" style={{ gap: 28, marginTop: 18 }}>
            <h1 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600, lineHeight: 1.05, color: "#F2F0EC", letterSpacing: "-0.01em" }}>
              {c.greeting} <span style={{ color: GOLD }}>👋</span>
            </h1>
            {profileImage ? (
              <div style={{ position: "relative", flexShrink: 0, width: 132, height: 160, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", transform: "rotate(-3deg)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profileImage} alt="Deron" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.15) contrast(1.02)" }} />
                <span aria-hidden style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderRight: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}` }} />
              </div>
            ) : null}
          </div>
        </div>

        {/* ── The hook ────────────────────────────────────────── */}
        <Beat style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.2rem, 6.5vw, 5rem)", lineHeight: 0.98, textTransform: "uppercase", color: "#F2F0EC", letterSpacing: "-0.01em", maxWidth: "18ch" }}>
            <Highlighted text={c.hook} />
          </p>
        </Beat>

        {/* ── Intro (pushed right) ────────────────────────────── */}
        {c.intro.map((para, i) => (
          <Beat key={i} style={{ ...body, maxWidth: "52ch", marginLeft: "auto", marginRight: 0, marginBottom: i === c.intro.length - 1 ? 64 : 30 }}>
            <p>
              <Highlighted text={para} />
            </p>
          </Beat>
        ))}

        {/* ── The many lives ──────────────────────────────────── */}
        {s.lives && (
          <>
            <Beat style={{ marginBottom: 18 }}>
              <p style={{ ...body, maxWidth: "44ch" }}>{c.livesIntro}</p>
            </Beat>
            <Beat style={{ marginBottom: 30 }}>
              <ul className="flex flex-wrap" style={{ listStyle: "none", padding: 0, margin: 0, gap: "10px 22px", maxWidth: "46ch" }}>
                {c.lives.map((l, i) => (
                  <li key={i} className="ab-life" style={{ display: "flex", alignItems: "baseline", gap: 8, cursor: "default" }}>
                    <span className="ab-life-no" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(236, 255, 149,0.7)", transition: "color .25s" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="ab-life-name" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1rem, 1.4vw, 1.25rem)", color: "rgba(255,255,255,0.62)", transition: "color .25s" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </Beat>
            <Beat style={{ ...body, maxWidth: "50ch", marginBottom: 96 }}>
              <p>{c.comics}</p>
            </Beat>
          </>
        )}

        {/* ── The peak ────────────────────────────────────────── */}
        <Beat style={{ ...body, maxWidth: "46ch", marginBottom: 22 }}>
          <p>{c.missionIntro}</p>
        </Beat>
        <Beat style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.4rem, 7.5vw, 5.6rem)", lineHeight: 0.96, textTransform: "uppercase", color: "#F2F0EC", letterSpacing: "-0.01em", maxWidth: "15ch" }}>
            <Highlighted text={c.peak} />
          </p>
        </Beat>

        {s.globe && (
          <>
            <Beat delay={0.05} style={{ marginBottom: 28 }}>
              <div className="md:translate-x-[8%]">
                <WidgetBoundary fallback={<div style={{ width: "100%", maxWidth: 440, aspectRatio: "1", margin: "0 auto" }} />}>
                  {mounted ? <AboutGlobe /> : <div style={{ width: "100%", maxWidth: 440, aspectRatio: "1", margin: "0 auto" }} />}
                </WidgetBoundary>
              </div>
            </Beat>
            <Beat style={{ textAlign: "center", marginBottom: 0 }}>
              <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                ⊙ Drag the globe — Abuja, out to everywhere the software skips
              </span>
            </Beat>
          </>
        )}

        <div style={{ marginBottom: 96 }} />

        {/* ── Dara ────────────────────────────────────────────── */}
        <Beat style={{ marginBottom: 96 }}>
          <p style={{ ...body, maxWidth: "48ch" }}>
            <Highlighted text={c.dara} />
            {c.daraTag ? (
              <span style={{ marginLeft: 12, fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>{c.daraTag}</span>
            ) : null}
          </p>
        </Beat>

        {/* ── Films ───────────────────────────────────────────── */}
        {s.films && (
          <>
            <Beat style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.04, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "20ch" }}>
                {c.midShow}
              </p>
            </Beat>
            <Beat delay={0.05} style={{ marginBottom: 16 }}>
              <WidgetBoundary fallback={<div style={{ height: 360 }} />}>
                {mounted ? <FilmDeck shows={c.films} /> : <div style={{ height: 360 }} />}
              </WidgetBoundary>
            </Beat>
            <Beat style={{ marginBottom: 96 }}>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {c.genres.map((g, i) => (
                  <span key={i} className="ab-genre" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 999, padding: "5px 11px", cursor: "default" }}>
                    {g}
                  </span>
                ))}
              </div>
            </Beat>
          </>
        )}

        {/* ── Console ─────────────────────────────────────────── */}
        {s.console && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px]" style={{ gap: 40, alignItems: "center", marginBottom: 96 }}>
            <Beat>
              <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.04, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "16ch" }}>
                {c.consoleHeading}
              </p>
              <p style={{ ...body, maxWidth: "40ch", marginTop: 16 }}>{c.consoleBody}</p>
            </Beat>
            <Beat delay={0.05}>
              <WidgetBoundary fallback={<div style={{ height: 290 }} />}>
                {mounted ? <GameConsole games={c.games} /> : <div style={{ height: 290 }} />}
              </WidgetBoundary>
            </Beat>
          </div>
        )}

        {/* ── Friend / cat ────────────────────────────────────── */}
        {s.friendCat && (
          <Beat style={{ ...body, maxWidth: "50ch", marginLeft: "auto", marginRight: 0, marginBottom: 64 }}>
            <p>
              <Highlighted text={c.friendCat} />
            </p>
          </Beat>
        )}

        {/* ── Health (quiet) ──────────────────────────────────── */}
        {s.health && (
          <Beat style={{ marginBottom: 110 }}>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", lineHeight: 1.5, color: "rgba(255,255,255,0.78)", maxWidth: "30ch" }}>
              <Highlighted text={c.health} />
            </p>
          </Beat>
        )}

        {/* ── Sign-off + socials ──────────────────────────────── */}
        <Beat>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 5.5vw, 4rem)", lineHeight: 0.98, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "20ch", marginBottom: 28 }}>
            <Highlighted text={c.signoff} />
          </p>
          <div className="flex flex-wrap items-center" style={{ gap: 14, marginBottom: 28 }}>
            <Link href="/#contact" className="ab-cta" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#121316", background: GOLD, padding: "14px 30px", display: "inline-block" }}>
              Let&apos;s talk <span className="ab-cta-arrow">→</span>
            </Link>
          </div>
          {socials.length > 0 ? (
            <div className="flex flex-wrap items-center" style={{ gap: 22 }}>
              <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Find me
              </span>
              {socials.map((soc) => (
                <a
                  key={soc.label}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-social"
                  style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  {shortSocial(soc.label)} <span className="ab-arrow" style={{ color: "rgba(255,255,255,0.25)" }}>↗</span>
                </a>
              ))}
            </div>
          ) : null}
        </Beat>
      </div>
    </main>
  );
}
