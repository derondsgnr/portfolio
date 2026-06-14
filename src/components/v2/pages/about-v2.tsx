"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";

/* ═══════════════════════════════════════════════════════════════
   ABOUT — Fusion (dark, but warmer)
   Editorial statement → journey narrative + photo → culture bento.
   Spine: "obsessed with how people work." Every card is evidence of
   the same curiosity. Dark brutalist DNA, gold accent, but human.
   Content is hardcoded here for the draft — wire to admin once the
   design is blessed.
   ═══════════════════════════════════════════════════════════════ */

const GOLD = "#E2B93B";

const SHOWS: { title: string; why: string; cover?: string }[] = [
  { title: "Interview with the Vampire", why: "Immortality as a relationship microscope — messy people problems that never die." },
  { title: "Shrinking", why: "Grief and therapy played for warmth, not pity." },
  { title: "The Midnight Gospel", why: "Psychedelic talks about death, the mind, and meaning." },
  { title: "The Big Bang Theory", why: "Comfort sitcom — my social-dynamics sandbox." },
];

const GENRES = [
  "Documentaries", "Thriller", "Anime & animation", "Horror",
  "Marvel & DC", "Sitcoms", "Dark & mind-bending",
];

const GAMES = ["Halo", "God of War", "Mortal Kombat", "FIFA", "Call of Duty", "NBA 2K"];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ── Shared label ──────────────────────────────────────────────
function MonoLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: "10px",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: color ?? "rgba(255,255,255,0.4)",
        display: "block",
      }}
    >
      {children}
    </span>
  );
}

// ── Bento card shell ──────────────────────────────────────────
function Card({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      style={{
        background: "#101010",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "22px 22px 24px",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.25s, background 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(226,185,59,0.35)";
        e.currentTarget.style.background = "#121212";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "#101010";
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Treated poster ────────────────────────────────────────────
function Poster({ show }: { show: { title: string; why: string; cover?: string } }) {
  return (
    <div className="group" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "2 / 3",
          overflow: "hidden",
          borderRadius: 8,
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {show.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={show.cover}
            alt={show.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Duotone-ish treatment so posters read as one cohesive set.
              filter: "grayscale(0.45) contrast(1.05) brightness(0.82)",
              transition: "filter 0.35s",
            }}
            className="group-hover:!grayscale-0 group-hover:!brightness-100"
          />
        ) : (
          // Placeholder until a cover is dropped in (uploadable via admin later).
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(226,185,59,0.10), transparent 60%), #141414",
            }}
          >
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.1,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {show.title}
            </span>
          </div>
        )}
        {/* Gold wash overlay — fades on hover */}
        <div
          className="transition-opacity duration-300 group-hover:opacity-0"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.65) 100%), linear-gradient(180deg, rgba(226,185,59,0.08), transparent 50%)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div>
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#F0F0F0",
            lineHeight: 1.25,
            marginBottom: 4,
          }}
        >
          {show.title}
        </p>
        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {show.why}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export function AboutV2({ profileImage }: { profileImage?: string }) {
  const statementRef = useRef<HTMLElement>(null);
  const statementInView = useInView(statementRef, { once: true, amount: 0.4 });

  return (
    <main className="relative" style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Subtle warm glow — keeps it dark but less cold */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 560,
          background:
            "radial-gradient(80% 100% at 20% 0%, rgba(226,185,59,0.07), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 1 · Editorial statement ──────────────────────────── */}
      <section
        ref={statementRef as React.RefObject<HTMLElement>}
        className="relative px-6 sm:px-8 md:px-10"
        style={{ paddingTop: 120, paddingBottom: 40 }}
      >
        <MonoLabel color={GOLD}>About — Deron</MonoLabel>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={statementInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
            color: "rgba(255,255,255,0.55)",
            marginTop: 28,
            marginBottom: 10,
          }}
        >
          Hi, I&apos;m Deron.
        </motion.p>
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2.6rem, 8vw, 6rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#F2F0EC",
            maxWidth: "16ch",
          }}
        >
          I&apos;m obsessed with how{" "}
          <span style={{ color: GOLD }}>
            {statementInView ? <ScrambleText text="people" speed={28} /> : "people"}
          </span>{" "}
          work.
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={statementInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1.05rem, 2.4vw, 1.5rem)",
            color: "rgba(255,255,255,0.6)",
            marginTop: 22,
            maxWidth: "34ch",
            lineHeight: 1.4,
          }}
        >
          So I build things that actually work <span style={{ color: "#F0F0F0" }}>for them.</span>
        </motion.p>
      </section>

      {/* ── 2 · Journey + photo ──────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div
          className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]"
          style={{ gap: 40, alignItems: "start", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 48 }}
        >
          {/* Narrative */}
          <div>
            <MonoLabel>The short version</MonoLabel>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                "I'm a product designer and builder in Abuja. I design in Figma, build in code, and ship — close enough to the metal to validate what I'm making, not just hand off a pretty screen.",
                "Right now I'm building Dara, an AI finance assistant for Nigerian freelancers and SMEs (in beta). Most of my work sits at the intersection of design, engineering, and AI — transport, fleet management, products for people the global software market usually skips.",
                "The thread through all of it: I'm obsessed with how people work. Behaviour, psychology, the patterns — even historically. Understanding people deeply is the only reason any of the products are good.",
              ].map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Photo — brutalist framed */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                overflow: "hidden",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "#141414",
              }}
            >
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt="Deron"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(0.15) contrast(1.02)",
                  }}
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: "rgba(255,255,255,0.08)" }}>
                    D
                  </span>
                </div>
              )}
            </div>
            {/* gold corner tick */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 26,
                height: 26,
                borderRight: `2px solid ${GOLD}`,
                borderBottom: `2px solid ${GOLD}`,
                borderBottomRightRadius: 12,
              }}
            />
            <MonoLabel>
              <span style={{ display: "block", marginTop: 12, color: "rgba(255,255,255,0.35)" }}>
                Abuja, NG — 9.07°N, 7.49°E
              </span>
            </MonoLabel>
          </motion.div>
        </div>
      </section>

      {/* ── 3 · Culture bento ────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingBottom: 80 }}>
        <MonoLabel color={GOLD}>What makes me, me</MonoLabel>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 12, marginTop: 22 }}
        >
          {/* Psychology — the spine */}
          <Card className="sm:col-span-2 lg:col-span-2">
            <MonoLabel color={GOLD}>The obsession</MonoLabel>
            <h3
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "clamp(1.5rem, 3.4vw, 2.4rem)",
                lineHeight: 1.02,
                textTransform: "uppercase",
                color: "#F0F0F0",
                margin: "16px 0 12px",
              }}
            >
              How people work
            </h3>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.58)",
                maxWidth: "52ch",
              }}
            >
              Psychology, human behaviour, and the patterns we keep repeating — even from history&apos;s point of
              view. It&apos;s why I&apos;m always mid-show, why I sweat the trust moments in a product, and why I
              design at all.
            </p>
          </Card>

          {/* Now building */}
          <Card delay={0.05}>
            <MonoLabel color={GOLD}>Now building</MonoLabel>
            <h3
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "1.9rem",
                textTransform: "uppercase",
                color: "#F0F0F0",
                margin: "16px 0 10px",
              }}
            >
              Dara
            </h3>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "13.5px", lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
              An AI finance assistant for Nigerian freelancers &amp; SMEs.
            </p>
            <span
              style={{
                marginTop: "auto",
                paddingTop: 16,
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              ● In beta
            </span>
          </Card>

          {/* Film — feature card */}
          <Card className="sm:col-span-2 lg:col-span-3" delay={0.05}>
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <MonoLabel color={GOLD}>There&apos;s always a show on</MonoLabel>
              <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)" }}>
                Not a critic — a watcher
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 16 }}>
              {SHOWS.map((s) => (
                <Poster key={s.title} show={s} />
              ))}
            </div>
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 20 }}>
              {GENRES.map((g) => (
                <span
                  key={g}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 999,
                    padding: "5px 11px",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          </Card>

          {/* Based in */}
          <Card delay={0.05}>
            <MonoLabel color={GOLD}>Based in</MonoLabel>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.9rem", textTransform: "uppercase", color: "#F0F0F0", margin: "16px 0 10px" }}>
              Abuja → the world
            </h3>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "13.5px", lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
              Building for transport, fleet management, and AI-integrated products that improve life for the
              people most software skips.
            </p>
          </Card>

          {/* Gamer */}
          <Card delay={0.1}>
            <MonoLabel color={GOLD}>Gamer</MonoLabel>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.5rem", lineHeight: 1.05, textTransform: "uppercase", color: "#F0F0F0", margin: "16px 0 10px" }}>
              Taking applications<br />for a PS5
            </h3>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
              Console-less for now, but raised on adventure, action &amp; fantasy.
            </p>
            <div className="flex flex-wrap" style={{ gap: 6, marginTop: 14 }}>
              {GAMES.map((g) => (
                <span key={g} style={{ fontFamily: "monospace", fontSize: "9.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>
                  {g}
                  <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 2px 0 6px" }}>/</span>
                </span>
              ))}
            </div>
          </Card>

          {/* Cares about — health */}
          <Card delay={0.15}>
            <MonoLabel color={GOLD}>Cares about</MonoLabel>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "1.5rem", lineHeight: 1.05, textTransform: "uppercase", color: "#F0F0F0", margin: "16px 0 10px" }}>
              Mental &amp; physical health
            </h3>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>
              Especially women&apos;s health and autoimmune conditions — the stuff the system under-serves.
            </p>
          </Card>

          {/* Off the clock */}
          <Card className="sm:col-span-2 lg:col-span-3" delay={0.05}>
            <MonoLabel color={GOLD}>Off the clock</MonoLabel>
            <p
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.7)",
                marginTop: 14,
                maxWidth: "60ch",
              }}
            >
              You&apos;ll find me with my <span style={{ color: GOLD }}>cat</span>, getting dragged outside by a
              friend who&apos;s better at &quot;touch grass&quot; than I am, or quietly going down a rabbit hole on
              some <span style={{ color: GOLD }}>new design style</span> nobody asked me to learn.
            </p>
          </Card>
        </div>
      </section>

      {/* ── 4 · CTA ──────────────────────────────────────────── */}
      <section
        className="relative px-6 sm:px-8 md:px-10"
        style={{ paddingTop: 40, paddingBottom: 110, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
            lineHeight: 1.02,
            textTransform: "uppercase",
            color: "#F0F0F0",
            maxWidth: "20ch",
            marginBottom: 26,
          }}
        >
          Want to build something for the people usually skipped?
        </h2>
        <Link
          href="/#contact"
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: GOLD,
            padding: "14px 30px",
            display: "inline-block",
          }}
        >
          Let&apos;s talk →
        </Link>
      </section>
    </main>
  );
}
