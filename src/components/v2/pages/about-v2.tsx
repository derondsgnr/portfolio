"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ScrambleText } from "../shared/scramble-text";
import { AboutGlobe } from "../about/about-globe";
import { FilmDeck, type FilmShow } from "../about/film-deck";
import { GameConsole } from "../about/game-console";

/* The globe (WebGL/cobe), cover-flow deck (drag) and CRT console (intervals)
   are client-only. We render identical placeholders on the server AND the
   first client render, then swap to the real widgets after mount — a plain
   state flip, no Suspense boundary. (next/dynamic { ssr:false } created
   Suspense fallbacks that crashed hydration with insertBefore inside the
   animating wrappers.) */

/* ═══════════════════════════════════════════════════════════════
   ABOUT — a built page, not a filled-in one.
   A sequence of crafted scenes (editorial → globe → obsession →
   film deck → console → warmth → CTA). The medium is the message:
   proof I design AND build, plus a real human reveal.
   Content hardcoded for the draft — wire to admin once it's blessed.
   ═══════════════════════════════════════════════════════════════ */

const GOLD = "#E2B93B";
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const SHOWS: FilmShow[] = [
  { title: "Interview with the Vampire", why: "Immortality as a relationship microscope — messy people problems that never die." },
  { title: "Shrinking", why: "Grief and therapy played for warmth, not pity." },
  { title: "The Midnight Gospel", why: "Psychedelic talks about death, the mind, and meaning." },
  { title: "Dark", why: "Cause and effect across generations — the patterns that refuse to stay buried." },
  { title: "The Big Bang Theory", why: "Comfort sitcom — my social-dynamics sandbox." },
];

const GENRES = ["Documentaries", "Thriller", "Anime & animation", "Horror", "Marvel & DC", "Sitcoms", "Dark & mind-bending"];
const GAMES = ["Halo", "God of War", "Mortal Kombat", "FIFA", "Call of Duty", "NBA 2K"];

function MonoLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: color ?? "rgba(255,255,255,0.4)", display: "block" }}>
      {children}
    </span>
  );
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AboutV2({ profileImage }: { profileImage?: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const heroIn = useInView(heroRef, { once: true, amount: 0.4 });
  // Client-only widgets mount after hydration (deterministic, no Suspense).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative" style={{ background: "#0A0A0A", minHeight: "100vh", overflow: "hidden" }}>
      {/* warm glow */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 620, background: "radial-gradient(75% 100% at 18% 0%, rgba(226,185,59,0.08), transparent 60%)", pointerEvents: "none" }} />

      {/* ── 1 · Statement ────────────────────────────────────── */}
      <section ref={heroRef as React.RefObject<HTMLElement>} className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 124, paddingBottom: 48 }}>
        <MonoLabel color={GOLD}>About — Deron</MonoLabel>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={heroIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)", color: "rgba(255,255,255,0.55)", marginTop: 26, marginBottom: 8 }}
        >
          Hi, I&apos;m Deron 👋
        </motion.p>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2.7rem, 8.5vw, 6.4rem)", lineHeight: 0.96, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#F2F0EC", maxWidth: "15ch" }}>
          I&apos;m obsessed with how{" "}
          <span style={{ color: GOLD }}>{heroIn ? <ScrambleText text="people" speed={28} /> : "people"}</span>{" "}
          work.
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroIn ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.05rem, 2.3vw, 1.5rem)", color: "rgba(255,255,255,0.62)", marginTop: 22, maxWidth: "40ch", lineHeight: 1.45 }}
        >
          So I design <span style={{ color: "#F0F0F0" }}>and build</span> things that actually work for them — usually for the people the world skips.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroIn ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.32)", marginTop: 26 }}
        >
          Also: one cat, zero consoles, and far too many shows open at once.
        </motion.p>
      </section>

      {/* ── 2 · Journey + photo ──────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" style={{ gap: 44, alignItems: "start", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 52 }}>
          <div>
            <MonoLabel>The short version</MonoLabel>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                "I'm a product designer and builder in Abuja. I design in Figma, I build in code, and I ship — close enough to the metal to validate what I'm making instead of tossing a pretty screen over the wall.",
                "Right now I'm building Dara, an AI finance assistant for Nigerian freelancers and SMEs (in beta). Most of my work lives where design, engineering and AI overlap — transport, fleet management, products for people the global software market quietly forgets.",
                "The thread through all of it is simple: I can't stop trying to understand people. Get that right and the product almost designs itself.",
              ].map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "15px", lineHeight: 1.78, color: "rgba(255,255,255,0.64)" }}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "#141414" }}>
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImage} alt="Deron" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.12) contrast(1.02)" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: "rgba(255,255,255,0.08)" }}>D</span>
                  </div>
                )}
              </div>
              <span aria-hidden style={{ position: "absolute", bottom: -1, right: -1, width: 26, height: 26, borderRight: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}`, borderBottomRightRadius: 12 }} />
              <span style={{ display: "block", marginTop: 12, fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                Abuja, NG — 9.07°N, 7.49°E
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3 · Globe ────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 64, paddingBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 48, alignItems: "center" }}>
          <Reveal>
            <MonoLabel color={GOLD}>Building for the world</MonoLabel>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.9rem, 4.4vw, 3.2rem)", lineHeight: 1.0, textTransform: "uppercase", color: "#F2F0EC", margin: "18px 0 18px", maxWidth: "16ch" }}>
              From Abuja, for everywhere the software skips.
            </h2>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: "46ch" }}>
              Transport, fleet management, and AI-integrated products built for emerging markets first — the riders, drivers, freelancers and small businesses the big software market treats as an afterthought.
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 20 }}>
              ⊙ Drag the globe to spin it
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {mounted ? <AboutGlobe /> : <div style={{ width: "100%", maxWidth: 460, aspectRatio: "1", margin: "0 auto" }} />}
          </Reveal>
        </div>
      </section>

      {/* ── 4 · The obsession (editorial break) ──────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 72, paddingBottom: 72, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Reveal>
          <MonoLabel color={GOLD}>The throughline</MonoLabel>
          <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)", lineHeight: 1.06, textTransform: "uppercase", color: "#F2F0EC", margin: "20px 0 0", maxWidth: "22ch" }}>
            I design because I can&apos;t stop trying to{" "}
            <span style={{ color: GOLD }}>understand people.</span>
          </p>
          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginTop: 24, maxWidth: "60ch" }}>
            Psychology, behaviour, the patterns we keep repeating — even from history&apos;s point of view. It&apos;s why I&apos;m always mid-show, why I obsess over the trust moments in a product, and honestly why the work is any good at all.
          </p>
        </Reveal>
      </section>

      {/* ── 5 · Film deck ────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 64, paddingBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-baseline justify-between flex-wrap" style={{ gap: 12, marginBottom: 6 }}>
          <MonoLabel color={GOLD}>There&apos;s always a show on</MonoLabel>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)" }}>Not a critic — a watcher</span>
        </div>
        <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: "50ch", margin: "10px 0 30px" }}>
          I don&apos;t review things — I just always have something playing, usually something about people. A few on heavy rotation:
        </p>
        <Reveal>
          {mounted ? <FilmDeck shows={SHOWS} /> : <div style={{ height: 360 }} />}
        </Reveal>
        <div className="flex flex-wrap" style={{ gap: 8, marginTop: 28 }}>
          {GENRES.map((g) => (
            <span key={g} style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 11px" }}>
              {g}
            </span>
          ))}
        </div>
      </section>

      {/* ── 6 · Console ──────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 64, paddingBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 48, alignItems: "center" }}>
          <Reveal>
            <MonoLabel color={GOLD}>Currently console-less</MonoLabel>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.7rem, 4vw, 2.8rem)", lineHeight: 1.02, textTransform: "uppercase", color: "#F2F0EC", margin: "18px 0 16px", maxWidth: "16ch" }}>
              Raised on these. Between consoles right now.
            </h2>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: "44ch" }}>
              Console, PC, mobile — I&apos;ll play all of it. Adventure, action, fantasy, the occasional sweaty FIFA night. I just don&apos;t own a console at the moment, which is a tragedy I&apos;m choosing to find funny. The PS5 wishlist stays open indefinitely.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {mounted ? <GameConsole games={GAMES} /> : <div style={{ height: 290 }} />}
          </Reveal>
        </div>
      </section>

      {/* ── 7 · Warmth (care + off the clock) ────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 64, paddingBottom: 72, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 44 }}>
          <Reveal>
            <MonoLabel color={GOLD}>What I quietly care about</MonoLabel>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.05rem, 2vw, 1.25rem)", lineHeight: 1.6, color: "rgba(255,255,255,0.68)", marginTop: 16, maxWidth: "40ch" }}>
              Mental and physical health — especially <span style={{ color: GOLD }}>women&apos;s health and autoimmune conditions</span>. The stuff the system tends to under-serve, dismiss, or get to last. The same instinct that pulls me toward designing for overlooked people.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <MonoLabel color={GOLD}>Off the clock</MonoLabel>
            <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(1.05rem, 2vw, 1.25rem)", lineHeight: 1.6, color: "rgba(255,255,255,0.68)", marginTop: 16, maxWidth: "40ch" }}>
              You&apos;ll find me with my <span style={{ color: GOLD }}>cat</span>, getting dragged outside by a friend who&apos;s far better at &quot;touch grass&quot; than I am, or quietly down a rabbit hole on some <span style={{ color: GOLD }}>design style</span> nobody asked me to learn.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 8 · CTA ──────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-10" style={{ paddingTop: 48, paddingBottom: 112, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.9rem, 4.6vw, 3.4rem)", lineHeight: 1.02, textTransform: "uppercase", color: "#F0F0F0", maxWidth: "20ch", marginBottom: 26 }}>
          Want to build something for the people usually skipped?
        </h2>
        <Link href="/#contact" style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0A0A0A", background: GOLD, padding: "14px 30px", display: "inline-block" }}>
          Let&apos;s talk →
        </Link>
      </section>
    </main>
  );
}
