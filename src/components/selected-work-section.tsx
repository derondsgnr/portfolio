import { motion } from "motion/react";
import { Reveal, StaggerContainer, StaggerItem, ParallaxImage, LineDraw } from "./motion-primitives";
import { ArrowUpRight } from "lucide-react";
"use client";

import Link from "next/link";

/*
 * ⚠️  ORPHANED FILE — SelectedWorkSection is exported but never imported anywhere.
 *     This is V1 code. The V2 homepage (Synthesis) uses its own inline SynthesisWork
 *     section in v2-synthesis.tsx, and inner pages use WorkListView/WorkGridView in
 *     synthesis-pages.tsx. Do NOT refactor this file — it's dead code.
 *
 *     If resurrecting for V1, import from homepage-data.ts (not a local copy).
 *     If building the reusable WorkCard, look at the V2 implementations instead.
 *
 * (Previous TODOs removed — they pointed to v2-data.ts integration which doesn't
 *  apply since this file is unused.)
 */
const PROJECTS = [
  {
    id: "01",
    title: "Project Alpha",
    category: "Product Design",
    year: "2025",
    slug: "project-alpha",
    image:
      "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcHJvZHVjdCUyMGRlc2lnbiUyMGludGVyZmFjZSUyMG1vY2t1cHxlbnwxfHx8fDE3NzM2MTQ3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "02",
    title: "Project Beta",
    category: "Web Design & Dev",
    year: "2025",
    slug: "project-beta",
    image:
      "https://images.unsplash.com/photo-1622212993957-6d4631a0ba8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMGFwcCUyMGRlc2lnbiUyMG1vYmlsZXxlbnwxfHx8fDE3NzM2MTQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "03",
    title: "Project Gamma",
    category: "AI Product System",
    year: "2024",
    slug: "project-gamma",
    image:
      "https://images.unsplash.com/photo-1750056393349-dfaf647f7400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwd2Vic2l0ZSUyMGRlc2lnbiUyMG1vZGVybnxlbnwxfHx8fDE3NzM2MTQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <Link href={`/work/${project.slug}`}>
      {/* ✅ DONE: Case study routing wired — Link to /work/:slug works via routes.ts:23 */}
      <motion.article
        className={`group cursor-pointer ${
          isEven ? "md:ml-0 md:mr-[20%]" : "md:ml-[25%] md:mr-0"
        }`}
      >
        {/* Image container */}
        <div className="relative overflow-hidden mb-5">
          <ParallaxImage
            src={project.image}
            alt={project.title}
            className={`w-full ${isEven ? "aspect-[4/5] md:aspect-[3/4]" : "aspect-[16/10] md:aspect-[16/9]"}`}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <ArrowUpRight className="w-10 h-10 text-[#e2b93b]" strokeWidth={1} />
            </motion.div>
          </div>
        </div>

        {/* Info row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-[#e2b93b]/50 text-[0.75rem] tracking-[0.2em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.id}
              </span>
              <span
                className="text-white/20 text-[0.75rem]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                /
              </span>
              <span
                className="text-white/50 text-[0.75rem] uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.category}
              </span>
            </div>
            <h3 className="text-white group-hover:text-[#e2b93b] transition-colors duration-300">
              {project.title}
            </h3>
          </div>
          <span
            className="text-white/30 text-[0.75rem] mt-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.year}
          </span>
        </div>
      </motion.article>
    </Link>
  );
}

export function SelectedWorkSection() {
  return (
    <section className="py-24 md:py-40 px-6 md:px-10">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 md:mb-24">
        <div>
          <Reveal>
            <p
              className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.3em] mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Selected Projects
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-white">Work</h2>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <Link
            href="/work"
            className="text-white/40 hover:text-[#e2b93b] text-[0.8rem] uppercase tracking-[0.15em] transition-colors duration-300 flex items-center gap-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>

      <LineDraw className="mb-16 md:mb-24" />

      {/* Project cards — asymmetric layout */}
      {/* TODO (Cursor): Replace these inline cards with <WorkCard> from work-card.tsx (implement WorkCard first — it's currently a stub) */}
      <StaggerContainer className="space-y-20 md:space-y-32">
        {PROJECTS.map((project, i) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} index={i} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}