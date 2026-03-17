/**
 * WORK CARD COMPONENT — STUB (returns null)
 * ------------------------------------------
 * ⚠️  STATUS: This file was created as a spec but never implemented.
 *     Meanwhile, 3 different inline card implementations exist in the codebase:
 *
 *     1. v2-synthesis.tsx → SynthesisWork (Void-style hover-reveal list)
 *     2. synthesis-pages.tsx → WorkListView (terminal-style numbered list)
 *     3. synthesis-pages.tsx → WorkGridView (2-col grid with scan textures)
 *
 *     selected-work-section.tsx also has a ProjectCard, but that file is ORPHANED
 *     (never imported anywhere) — do not use it as reference.
 *
 * TODO (Cursor) — DECISION NEEDED BEFORE IMPLEMENTING:
 *   The original spec below assumed ONE unified WorkCard with a "variant" prop,
 *   but the existing implementations have fundamentally different interaction models
 *   (hover-reveal images vs. static grids vs. numbered lists). Options:
 *
 *   A) Keep 3 separate card components (current state minus the dead code)
 *   B) Build WorkCard with variants that match all 3 existing designs
 *   C) Build WorkCard with ONE design and convert all locations to use it
 *
 *   The owner should decide. Until then, the existing inline implementations work.
 *   The homepage → case study navigation works via SynthesisWork in v2-synthesis.tsx
 *   (hover a project title → image reveals → but no Link wrapper yet — ADD THIS).
 *
 *   Original spec preserved below for reference:
 *
 *   Props interface:
 *     interface WorkCardProps {
 *       title: string;
 *       category: string;
 *       thumbnail: string;
 *       slug: string;
 *       index: number;
 *       year?: string;
 *       description?: string;
 *       variant?: "list" | "card" | "minimal";
 *     }
 */

export function WorkCard() {
  // STUB — returns null. See decision needed above before implementing.
  return null;
}