"use client";

import { useRef, useState } from "react";
import type { ServiceMediaRef } from "@/lib/content/services";

/* ═══════════════════════════════════════════════════════════════
   SERVICES MEDIA MARQUEE
   A slow horizontal crawl of media tiles (the "kinetic crawl" energy
   of the broadcast ticker, but carrying images/videos pulled from
   existing case study & craft uploads). Hovering pauses the crawl.
   Respects prefers-reduced-motion: falls back to a static strip.
   ═══════════════════════════════════════════════════════════════ */

export function ServicesMediaMarquee({
  media,
  reverse = false,
}: {
  media: ServiceMediaRef[];
  reverse?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const animName = useRef(`svc-marquee-${Math.random().toString(36).slice(2, 8)}`).current;

  if (!media || media.length === 0) return null;

  // Duplicate the list so the translateX loop is seamless.
  const loop = [...media, ...media];
  // Scale duration with count so density feels consistent.
  const duration = Math.max(18, media.length * 6);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        // Edge fade so tiles dissolve into the panel rather than hard-cut.
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ${animName} {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .${animName}-track { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div
        className={`${animName}-track`}
        style={{
          display: "flex",
          gap: 10,
          width: "max-content",
          animation: `${animName} ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {loop.map((m, i) => (
          <div
            key={`${m.url}-${i}`}
            aria-hidden={i >= media.length}
            style={{
              position: "relative",
              height: 150,
              flex: "0 0 auto",
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {m.type === "video" ? (
              <video
                src={m.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                style={{ height: "100%", width: "auto", display: "block", objectFit: "cover" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.url}
                alt=""
                loading="lazy"
                style={{ height: "100%", width: "auto", display: "block", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
