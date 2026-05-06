"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { BlogPost } from "@/types/blog";
import { withSound, useSoundOnHover } from "@/hooks/useSound";

function formatJournalDate(iso: string): string {
  const t = new Date(`${iso}T12:00:00`).getTime();
  if (!Number.isFinite(t)) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(t);
}

export interface SynthesisJournalStripProps {
  posts?: BlogPost[];
  label?: string;
  title?: string;
  archiveLabel?: string;
  emptyHint?: string;
  maxPosts?: number;
}

export function SynthesisJournalStrip({
  posts = [],
  label = "> FROM_THE_JOURNAL",
  title = "WRITING",
  archiveLabel = "VIEW ALL",
  emptyHint = "Notes on design, build, and how products ship.",
  maxPosts = 2,
}: SynthesisJournalStripProps) {
  const onRowHover = useSoundOnHover("hover");
  const latest = posts.slice(0, maxPosts);
  const hasPosts = latest.length > 0;

  return (
    <section className="relative border-t border-[rgba(255,255,255,0.06)]" aria-labelledby="homepage-journal-heading">
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 lg:items-end"
        >
          <div className="lg:col-span-5">
            <span
              className="block"
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.28em",
                color: "#E2B93B",
              }}
            >
              {label}
            </span>
            <h2
              id="homepage-journal-heading"
              className="mt-4 text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none tracking-tight text-[#F0F0F0]"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h2>
            {!hasPosts && (
              <p
                className="mt-5 max-w-md"
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {emptyHint}
              </p>
            )}
            <div className="mt-8">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 transition-colors hover:border-[#E2B93B]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]"
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.55)",
                }}
                onClick={withSound(() => {})}
                onMouseEnter={onRowHover}
              >
                <span className="group-hover:text-[#E2B93B] transition-colors">{archiveLabel}</span>
                <span aria-hidden className="text-[#E2B93B] opacity-80 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            {hasPosts ? (
              <ul className="space-y-0 border border-[rgba(255,255,255,0.08)] bg-[rgba(17,17,17,0.6)]">
                {latest.map((post, i) => (
                  <li key={post.slug} className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col gap-1 px-5 py-5 transition-colors hover:bg-[rgba(255,255,255,0.03)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E2B93B]"
                      onClick={withSound(() => {})}
                      onMouseEnter={onRowHover}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "9px",
                          letterSpacing: "0.16em",
                          color: "rgba(255,255,255,0.28)",
                        }}
                      >
                        {formatJournalDate(post.meta.date)}
                        {post.meta.category ? (
                          <span className="text-[rgba(255,255,255,0.2)]"> · {post.meta.category}</span>
                        ) : null}
                      </span>
                      <span
                        className="text-[#F0F0F0] transition-colors group-hover:text-[#E2B93B]"
                        style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          fontSize: "1.05rem",
                          lineHeight: 1.35,
                          fontWeight: 450,
                        }}
                      >
                        <span className="mr-2 font-mono text-[10px] text-[rgba(255,255,255,0.15)] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {post.meta.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
