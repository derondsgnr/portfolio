"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import type { Project } from "@/lib/content/projects";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function PersonalProjectsGrid({
  projects,
  className = "",
}: {
  projects: Project[];
  className?: string;
}) {
  const router = useRouter();
  if (projects.length === 0) return null;

  return (
    <section className={className}>
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(226,185,59,0.6)",
          }}
        >
          Personal Projects
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(226,185,59,0.1)" }} />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          {projects.length} built
        </span>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
            className="group cursor-pointer"
            onClick={() => router.push(`/work/${project.slug}`)}
          >
            <div
              className="relative overflow-hidden bg-[#111]"
              style={{
                aspectRatio: "4 / 3",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.15)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    No image
                  </span>
                </div>
              )}

              {/* Bottom gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.3) 45%, rgba(10,10,10,0) 70%)",
                }}
              />

              {/* Title + category at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p
                  className="transition-colors duration-300"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1.15,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {project.title}
                </p>
                <p
                  className="mt-1 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    letterSpacing: "0.16em",
                    color: "rgba(226,185,59,0.75)",
                    textTransform: "uppercase",
                  }}
                >
                  {project.category}
                </p>
              </div>

              {/* Gold corner tick on hover */}
              <div
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  width: 16,
                  height: 16,
                  borderTop: "1.5px solid #E2B93B",
                  borderRight: "1.5px solid #E2B93B",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
