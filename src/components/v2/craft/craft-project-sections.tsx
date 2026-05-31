"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CraftDocument, CraftItem, CraftSection } from "@/lib/content/craft-model";
import { ScrambleText } from "../shared/scramble-text";
import { LottiePlayer } from "../shared/lottie-player";
import { VideoEmbedFrame } from "../shared/youtube-video-frame";
import { isPlayableVideoUrl, normalizeCloudinaryVideoUrl, getVideoEmbedUrl } from "@/lib/media-url";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ── Shared lightbox ──────────────────────────────────────────────────────────

export function CraftLightbox({
  item,
  onClose,
}: {
  item: CraftItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      key="craft-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: "rgba(10,10,10,0.96)",
        backdropFilter: "blur(10px)",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="relative flex flex-col items-center justify-center w-full h-full px-6 py-16 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex items-center justify-center transition-all duration-200"
          style={{
            width: 36, height: 36,
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace", fontSize: "18px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F0F0F0";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Media */}
        <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center">
          {item.lottieUrl ? (
            <LottiePlayer src={item.lottieUrl} loop className="w-full max-h-[75vh]" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }} />
          ) : getVideoEmbedUrl(item.videoUrl) ? (
            <div className="relative w-full max-w-4xl aspect-video" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
              <VideoEmbedFrame url={item.videoUrl!} title={item.title} className="absolute inset-0 w-full h-full border-0" />
            </div>
          ) : isPlayableVideoUrl(item.videoUrl) ? (
            <video
              src={normalizeCloudinaryVideoUrl(item.videoUrl)}
              autoPlay muted loop playsInline
              className="max-w-full max-h-[75vh] object-contain"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
            />
          ) : item.image?.trim() ? (
            <img
              src={item.image}
              alt={item.title}
              className="max-w-full max-h-[75vh] object-contain"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
            />
          ) : null}
        </div>

        {/* Label */}
        <div className="mt-6 text-center">
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#E2B93B",
              display: "block",
              marginBottom: 6,
            }}
          >
            {item.category}
          </span>
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(1rem, 3vw, 1.6rem)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#F0F0F0",
            }}
          >
            {item.title}
          </span>
          {item.description?.trim() ? (
            <p
              className="mt-3 max-w-lg mx-auto"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
              }}
            >
              {item.description}
            </p>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Clickable media wrappers ─────────────────────────────────────────────────

function ClickableMedia({
  item,
  onSelect,
  className,
  style,
}: {
  item: CraftItem;
  onSelect: (item: CraftItem) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`cursor-pointer group/media ${className ?? ""}`}
      style={style}
      title={item.title}
    >
      {item.lottieUrl ? (
        <LottiePlayer src={item.lottieUrl} loop className="w-full h-full" />
      ) : isPlayableVideoUrl(item.videoUrl) ? (
        <video
          src={normalizeCloudinaryVideoUrl(item.videoUrl)}
          poster={item.image || undefined}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105"
        />
      ) : item.image?.trim() ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105"
          decoding="async"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-[#111] flex items-center justify-center">
          <span className="font-mono text-[9px] text-white/25 uppercase tracking-wider">No image</span>
        </div>
      )}
      {/* Expand hint on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            background: "rgba(10,10,10,0.6)",
            padding: "5px 10px",
            backdropFilter: "blur(4px)",
          }}
        >
          EXPAND
        </span>
      </div>
    </div>
  );
}

// ── Section components ───────────────────────────────────────────────────────

function EditorialCoverSection({
  section,
  onSelect,
}: {
  section: CraftSection;
  onSelect: (item: CraftItem) => void;
}) {
  const { items } = section;
  if (items.length === 0) return null;
  return (
    <div className="max-w-6xl mx-auto">
      {items.map((item, i) => {
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
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
            className="mb-16 group"
            style={{ marginLeft: p.ml, width: p.w }}
          >
            <div
              className="overflow-hidden relative border border-[rgba(255,255,255,0.08)] rounded-[0.625rem]"
              style={{ aspectRatio: p.aspect.replace("/", " / ") }}
            >
              <ClickableMedia
                item={item}
                onSelect={onSelect}
                className="absolute inset-0"
                style={{ filter: "grayscale(0.35)" }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(10,10,10,0.2) 3px, rgba(10,10,10,0.2) 4px)",
                }}
              />
              <div className="absolute top-4 left-4 pointer-events-none">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}>
                  EXP_{item.id.replace("c-", "")}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: "rgba(226,185,59,0.4)",
                  textTransform: "uppercase",
                }}
              >
                [{item.category}]
              </span>
              <span
                className="group-hover:text-white/60 transition-colors duration-300"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <ScrambleText text={item.title} speed={15} />
              </span>
            </div>
            <p
              className="mt-2 max-w-sm"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                fontWeight: 300,
                color: "rgba(255,255,255,0.15)",
              }}
            >
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function MasonrySection({
  section,
  cols,
  onSelect,
}: {
  section: CraftSection;
  cols: 2 | 3;
  onSelect: (item: CraftItem) => void;
}) {
  const { items } = section;
  if (items.length === 0) return null;
  const colClass = cols === 2 ? "columns-1 md:columns-2" : "columns-1 md:columns-2 lg:columns-3";
  return (
    <div className="max-w-6xl mx-auto">
      <div className={`${colClass} [column-gap:10px]`}>
        {items.map((item) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-2.5 break-inside-avoid"
          >
            <div className="border border-[rgba(255,255,255,0.08)] rounded-[0.625rem] overflow-hidden bg-[#0a0a0a]">
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => onSelect(item)}
                title={item.title}
              >
                {item.lottieUrl ? (
                  <LottiePlayer src={item.lottieUrl} loop className="w-full" />
                ) : isPlayableVideoUrl(item.videoUrl) ? (
                  <video
                    src={normalizeCloudinaryVideoUrl(item.videoUrl)}
                    poster={item.image || undefined}
                    playsInline
                    preload="metadata"
                    className="w-full h-auto block align-middle"
                  />
                ) : item.image?.trim() ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto block align-middle transition-transform duration-500 hover:scale-105"
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full min-h-[120px] bg-[#111] flex items-center justify-center">
                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-wider">No still</span>
                  </div>
                )}
                {/* Expand hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span
                    style={{
                      fontFamily: "monospace", fontSize: "8px",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      background: "rgba(10,10,10,0.6)",
                      padding: "5px 10px", backdropFilter: "blur(4px)",
                    }}
                  >
                    EXPAND
                  </span>
                </div>
              </div>
              <div className="px-3 py-2 flex flex-col gap-1 border-t border-[rgba(255,255,255,0.06)] sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className="tabular-nums"
                    style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}
                  >
                    [{item.category}]
                  </span>
                  {item.videoUrl && !isPlayableVideoUrl(item.videoUrl) ? (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] text-[#E2B93B]/85 hover:text-[#E2B93B] underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ▶ Video
                    </a>
                  ) : null}
                </div>
                <span
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.7rem",
                    lineHeight: 1.3,
                    color: "rgba(255,255,255,0.35)",
                    textAlign: "right",
                  }}
                >
                  {item.title}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function ListSection({
  section,
  onSelect,
}: {
  section: CraftSection;
  onSelect: (item: CraftItem) => void;
}) {
  const { items } = section;
  if (items.length === 0) return null;
  return (
    <div className="max-w-4xl mx-auto space-y-0">
      {items.map((item, i) => {
        const w = item.width;
        const h = item.height;
        const ratio = typeof w === "number" && typeof h === "number" && h > 0 ? `${w} / ${h}` : "1 / 1";
        return (
          <div key={item.id}>
            <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div
                className="md:col-span-2 overflow-hidden border border-[rgba(255,255,255,0.08)] rounded-[0.625rem] relative"
                style={{ aspectRatio: ratio }}
              >
                {item.lottieUrl ? (
                  <LottiePlayer src={item.lottieUrl} loop className="w-full h-full" />
                ) : isPlayableVideoUrl(item.videoUrl) ? (
                  <video
                    src={normalizeCloudinaryVideoUrl(item.videoUrl)}
                    poster={item.image || undefined}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    style={{ filter: "grayscale(1) brightness(0.5)" }}
                    playsInline
                    preload="metadata"
                  />
                ) : item.image?.trim() ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    style={{ filter: "grayscale(1) brightness(0.5)" }}
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                    <span className="font-mono text-[8px] text-white/20 uppercase">No img</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
                  [{item.category.toUpperCase()}]
                </span>
              </div>
              <div className="md:col-span-5">
                <ScrambleText
                  text={item.title}
                  className="group-hover:text-white/80 transition-colors"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
              <div className="md:col-span-3">
                <p
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          </div>
        );
      })}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

function SectionHeading({ section }: { section: CraftSection }) {
  if (!section.title?.trim()) return null;
  return (
    <div className="max-w-6xl mx-auto mb-8 px-1">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(226,185,59,0.55)" }}>
        {section.title}
      </h2>
      <div className="mt-3 h-px max-w-xl" style={{ background: "rgba(226,185,59,0.12)" }} />
    </div>
  );
}

/** Grid / masonry body for Craft Projects tab — one document, many sections, each layoutMode. */
export function CraftProjectSections({ document: doc }: { document: CraftDocument }) {
  const [selected, setSelected] = useState<CraftItem | null>(null);

  if (!doc.sections.length) return null;
  const visible = doc.sections.filter((s) => s.items.length > 0);
  if (!visible.length) return null;

  function renderSection(segment: CraftSection) {
    const mode = segment.layoutMode;
    switch (mode) {
      case "masonry-2":
        return <MasonrySection section={segment} cols={2} onSelect={setSelected} />;
      case "masonry-3":
        return <MasonrySection section={segment} cols={3} onSelect={setSelected} />;
      case "editorial-cover":
        return <EditorialCoverSection section={segment} onSelect={setSelected} />;
      case "list":
        return <ListSection section={segment} onSelect={setSelected} />;
    }
  }

  return (
    <>
      <div className="space-y-20 pb-8">
        {visible.map((section) => (
          <div key={section.id}>
            <SectionHeading section={section} />
            {renderSection(section)}
          </div>
        ))}
      </div>

      {/* Shared lightbox */}
      <AnimatePresence>
        {selected && (
          <CraftLightbox item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
