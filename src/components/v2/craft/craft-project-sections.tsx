"use client";

import { motion } from "motion/react";
import type { CraftDocument, CraftItem, CraftSection } from "@/lib/content/craft-model";
import { ScrambleText } from "../shared/scramble-text";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function CraftImageIntrinsic({ item }: { item: CraftItem }) {
  const w = item.width;
  const h = item.height;
  const hasDims = typeof w === "number" && typeof h === "number" && w > 0 && h > 0;
  return (
    <img
      src={item.image}
      alt={item.title}
      width={hasDims ? w : undefined}
      height={hasDims ? h : undefined}
      className="w-full h-auto block align-middle"
      decoding="async"
      loading="lazy"
    />
  );
}

function EditorialCoverSection({ section }: { section: CraftSection }) {
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
              <img
                src={item.image}
                alt={item.title}
                width={item.width ?? 900}
                height={item.height ?? 600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "grayscale(0.35)" }}
                decoding="async"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(10,10,10,0.2) 3px, rgba(10,10,10,0.2) 4px)",
                }}
              />
              <div className="absolute top-4 left-4">
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

function MasonrySection({ section, cols }: { section: CraftSection; cols: 2 | 3 }) {
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
              <CraftImageIntrinsic item={item} />
              <div className="px-3 py-2 flex items-start justify-between gap-2 border-t border-[rgba(255,255,255,0.06)]">
                <span
                  className="tabular-nums"
                  style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B", letterSpacing: "0.1em" }}
                >
                  [{item.category}]
                </span>
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

function ListSection({ section }: { section: CraftSection }) {
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
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group"
            >
              <div className="md:col-span-2 overflow-hidden border border-[rgba(255,255,255,0.08)] rounded-[0.625rem]" style={{ aspectRatio: ratio }}>
                <img
                  src={item.image}
                  alt={item.title}
                  width={w ?? undefined}
                  height={h ?? undefined}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:grayscale-0"
                  style={{ filter: "grayscale(1) brightness(0.5)" }}
                />
              </div>
              <div className="md:col-span-1">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#E2B93B" }}>
                  [{item.id.replace("c-", "")}]
                </span>
              </div>
              <div className="md:col-span-4">
                <ScrambleText
                  text={item.title}
                  speed={20}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>
                  [{item.category.toUpperCase()}]
                </span>
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

function renderSection(segment: CraftSection) {
  const mode = segment.layoutMode;
  switch (mode) {
    case "masonry-2":
      return <MasonrySection section={segment} cols={2} />;
    case "masonry-3":
      return <MasonrySection section={segment} cols={3} />;
    case "editorial-cover":
      return <EditorialCoverSection section={segment} />;
    case "list":
      return <ListSection section={segment} />;
  }
}

/** Grid / masonry body for Craft Projects tab — one document, many sections, each layoutMode. */
export function CraftProjectSections({ document: doc }: { document: CraftDocument }) {
  if (!doc.sections.length) return null;
  const visible = doc.sections.filter((s) => s.items.length > 0);
  if (!visible.length) return null;

  return (
    <div className="space-y-20 pb-8">
      {visible.map((section) => (
        <div key={section.id}>
          <SectionHeading section={section} />
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
}
