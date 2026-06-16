"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AboutGlobe } from "../about/about-globe";
import { FilmDeck, type FilmShow } from "../about/film-deck";
import { GameConsole } from "../about/game-console";
import { WidgetBoundary } from "../about/widget-boundary";
import type { SocialLink } from "@/lib/content/global";

/* ═══════════════════════════════════════════════════════════════
   ABOUT — a letter, not a layout.
   One first-person voice, asymmetric rhythm, lean. The heavy
   interactive set-pieces (globe / film deck / console) are behind
   FEATURES flags — currently OFF while we focus the page on copy +
   craft. Reveals are visible-by-default (server renders them shown,
   JS only enhances) so the page can never blank out again.
   ═══════════════════════════════════════════════════════════════ */

const GOLD = "#E2B93B";

/* Heavy interactive sections — globe + console off for now; film deck stays. */
const FEATURES = { globe: false, filmDeck: true, gameConsole: false };

const SHOWS: FilmShow[] = [
  { title: "Interview with the Vampire", why: "Immortality as a relationship microscope — messy people problems that never die." },
  { title: "Shrinking", why: "Grief and therapy played for warmth, not pity." },
  { title: "The Midnight Gospel", why: "Psychedelic talks about death, the mind, and meaning." },
  { title: "Dark", why: "Cause and effect across generations — the patterns that refuse to stay buried." },
  { title: "The Big Bang Theory", why: "Comfort sitcom — my social-dynamics sandbox." },
];
const GENRES = ["Documentaries", "Thriller", "Anime & animation", "Horror", "Marvel & DC", "Sitcoms", "Dark & mind-bending"];
const GAMES = ["Halo", "God of War", "Mortal Kombat", "FIFA", "Call of Duty", "NBA 2K"];
const LIVES = ["Digital marketing", "Code", "Ecommerce", "Music production", "Blogging", "Graphic design"];

/* Visible-by-default scroll reveal. Server + first client render show the
   content (opacity:1) — only after mount does JS hide-then-reveal on scroll,
   with a timed fallback so nothing can ever stay hidden. */
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

export function AboutV2({ profileImage, socials = [] }: { profileImage?: string; socials?: SocialLink[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative" style={{ background: "#0A0A0A", minHeight: "100vh", overflowX: "hidden" }}>
      {/* microinteractions (CSS — hydration-safe) */}
      <style>{`
        .ab-life { transition: transform .25s ease; }
        .ab-life:hover { transform: translateX(5px); }
        .ab-life:hover .ab-life-name { color: #F2F0EC; }
        .ab-life:hover .ab-life-no { color: #E2B93B; }
        .ab-cta { transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
        .ab-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(226,185,59,0.28); background: #f0cf57; }
        .ab-cta .ab-cta-arrow { display:inline-block; transition: transform .2s ease; }
        .ab-cta:hover .ab-cta-arrow { transform: translateX(4px); }
        .ab-social { transition: color .2s ease; }
        .ab-social .ab-arrow { display:inline-block; transition: transform .2s ease; }
        .ab-social:hover .ab-arrow { transform: translate(3px,-3px); }
        .ab-genre { transition: border-color .2s ease, color .2s ease; }
        .ab-genre:hover { border-color: rgba(226,185,59,0.5); color: #F0F0F0; }
        .ab-emph { transition: color .2s ease; }
      `}</style>

      {/* warm glow */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 680, background: "radial-gradient(70% 100% at 15% 0%, rgba(226,185,59,0.09), transparent 60%)", pointerEvents: "none" }} />

      <div className="relative px-6 sm:px-8 md:px-12" style={{ maxWidth: 1180, margin: "0 auto", paddingTop: 120, paddingBottom: 120 }}>
        {/* ── Opening ─────────────────────────────────────────── */}
        <div className="relative" style={{ marginBottom: 72 }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Abuja, NG · 9.07°N 7.49°E
          </span>
          <div className="flex flex-col md:flex-row md:items-end" style={{ gap: 28, marginTop: 18 }}>
            <h1 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600, lineHeight: 1.05, color: "#F2F0EC", letterSpacing: "-0.01em" }}>
              Hi, I&apos;m Deron <span style={{ color: GOLD }}>👋</span>
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
            Most people learn to read a room. I had to{" "}
            <span style={{ color: GOLD }}>reverse-engineer</span> one.
          </p>
        </Beat>

        {/* ── Psychology (pushed right) ───────────────────────── */}
        <Beat style={{ ...body, maxWidth: "52ch", marginLeft: "auto", marginRight: 0, marginBottom: 30 }}>
          <p>
            Social cues never came easily — people would say one thing and mean the opposite, and I needed to know <em style={{ color: "rgba(255,255,255,0.92)", fontStyle: "italic" }}>why</em>. So I started watching. Collecting patterns. Working out what people actually meant, so I&apos;d know how to meet them.
          </p>
        </Beat>
        <Beat style={{ ...body, maxWidth: "52ch", marginLeft: "auto", marginRight: 0, marginBottom: 64 }}>
          <p>
            That itch became a stack of psychology books. Then neuroscience — emotion is the layer sitting under every decision. Then anthropology, sociology, anything that explained how people work. It&apos;s also why I obsess over how a product <span className="ab-emph" style={{ color: GOLD }}>feels</span>, not just whether it works.
          </p>
        </Beat>

        {/* ── The many lives (left) ───────────────────────────── */}
        <Beat style={{ marginBottom: 18 }}>
          <p style={{ ...body, maxWidth: "44ch" }}>I&apos;ve lived a few lives to get here —</p>
        </Beat>
        <Beat style={{ marginBottom: 30 }}>
          <ul className="flex flex-wrap" style={{ listStyle: "none", padding: 0, margin: 0, gap: "10px 22px", maxWidth: "46ch" }}>
            {LIVES.map((l, i) => (
              <li key={l} className="ab-life" style={{ display: "flex", alignItems: "baseline", gap: 8, cursor: "default" }}>
                <span className="ab-life-no" style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(226,185,59,0.7)", transition: "color .25s" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="ab-life-name" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1rem, 1.4vw, 1.25rem)", color: "rgba(255,255,255,0.62)", transition: "color .25s" }}>{l}</span>
              </li>
            ))}
          </ul>
        </Beat>
        <Beat style={{ ...body, maxWidth: "50ch", marginBottom: 96 }}>
          <p>
            As a kid I drew and wrote my own comics. I was always going to make things — product design just finally gave the creativity somewhere to point.
          </p>
        </Beat>

        {/* ── The peak ────────────────────────────────────────── */}
        <Beat style={{ ...body, maxWidth: "46ch", marginBottom: 22 }}>
          <p>
            And it pointed somewhere specific. The deeper I went, the clearer it got: technology quietly leaves people behind. Not fast enough, not abled enough, not enough access — and the future moves on without you.
          </p>
        </Beat>
        <Beat style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.4rem, 7.5vw, 5.6rem)", lineHeight: 0.96, textTransform: "uppercase", color: "#F2F0EC", letterSpacing: "-0.01em", maxWidth: "15ch" }}>
            I build so <span style={{ color: GOLD }}>fewer people</span> get left.
          </p>
        </Beat>

        {FEATURES.globe && (
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
            Right now that&apos;s <span style={{ color: "#F0F0F0", fontWeight: 600 }}>Dara</span> — an AI finance assistant for Nigerian freelancers and small businesses.
            <span style={{ marginLeft: 12, fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>● beta · still learning</span>
          </p>
        </Beat>

        {/* ── Mid-show ────────────────────────────────────────── */}
        <Beat style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.04, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "20ch" }}>
            Off the clock, I&apos;m mid-show. I watch for the people, never the plot.
          </p>
        </Beat>
        {FEATURES.filmDeck && (
          <Beat delay={0.05} style={{ marginBottom: 16 }}>
            <WidgetBoundary fallback={<div style={{ height: 360 }} />}>
              {mounted ? <FilmDeck shows={SHOWS} /> : <div style={{ height: 360 }} />}
            </WidgetBoundary>
          </Beat>
        )}
        <Beat style={{ marginBottom: 96 }}>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {GENRES.map((g) => (
              <span key={g} className="ab-genre" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 999, padding: "5px 11px", cursor: "default" }}>
                {g}
              </span>
            ))}
          </div>
        </Beat>

        {/* ── Console ─────────────────────────────────────────── */}
        <div className={FEATURES.gameConsole ? "grid grid-cols-1 md:grid-cols-[1fr_360px]" : ""} style={{ gap: 40, alignItems: "center", marginBottom: 96 }}>
          <Beat>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.04, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "16ch" }}>
              I&apos;m also mourning the console I don&apos;t own.
            </p>
            <p style={{ ...body, maxWidth: "40ch", marginTop: 16 }}>
              Console, PC, mobile — I&apos;ll play all of it. Raised on these. The PS5 wishlist stays open indefinitely.
            </p>
          </Beat>
          {FEATURES.gameConsole && (
            <Beat delay={0.05}>
              <WidgetBoundary fallback={<div style={{ height: 290 }} />}>
                {mounted ? <GameConsole games={GAMES} /> : <div style={{ height: 290 }} />}
              </WidgetBoundary>
            </Beat>
          )}
        </div>

        {/* ── Friend / cat ────────────────────────────────────── */}
        <Beat style={{ ...body, maxWidth: "50ch", marginLeft: "auto", marginRight: 0, marginBottom: 64 }}>
          <p>
            The rest of the time I&apos;m getting dragged outside by a friend who&apos;s better at rest than I am. My <span className="ab-emph" style={{ color: GOLD }}>cat</span> supervises all of it.
          </p>
        </Beat>

        {/* ── Health (quiet) ──────────────────────────────────── */}
        <Beat style={{ marginBottom: 110 }}>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", lineHeight: 1.5, color: "rgba(255,255,255,0.78)", maxWidth: "30ch" }}>
            I care, maybe too much, about how people are actually doing — mental health, and the physical stuff the system gets to last. Especially <span className="ab-emph" style={{ color: GOLD }}>women&apos;s health and autoimmune</span>. Same reflex that makes me build for the overlooked.
          </p>
        </Beat>

        {/* ── Sign-off + socials ──────────────────────────────── */}
        <Beat>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 5.5vw, 4rem)", lineHeight: 0.98, textTransform: "uppercase", color: "#F2F0EC", maxWidth: "20ch", marginBottom: 28 }}>
            If you&apos;ve read this far — hi. Let&apos;s build something for the people usually <span style={{ color: GOLD }}>skipped</span>. :)
          </p>
          <div className="flex flex-wrap items-center" style={{ gap: 14, marginBottom: 28 }}>
            <Link href="/#contact" className="ab-cta" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0A0A0A", background: GOLD, padding: "14px 30px", display: "inline-block" }}>
              Let&apos;s talk <span className="ab-cta-arrow">→</span>
            </Link>
          </div>
          {socials.length > 0 ? (
            <div className="flex flex-wrap items-center" style={{ gap: 22 }}>
              <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Find me
              </span>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-social"
                  style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  {shortSocial(s.label)} <span className="ab-arrow" style={{ color: "rgba(255,255,255,0.25)" }}>↗</span>
                </a>
              ))}
            </div>
          ) : null}
        </Beat>
      </div>
    </main>
  );
}
