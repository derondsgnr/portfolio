"use client";

import type { InspirationRef, InspirationProvenance } from "@/types/presentation-studio";
import {
  PRESENTATION_STUDIO_QUEUE_KEY,
} from "@/types/presentation-studio";

function readQueueRaw(): InspirationRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRESENTATION_STUDIO_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => x && typeof (x as InspirationRef).id === "string") as InspirationRef[];
  } catch {
    return [];
  }
}

export function getInspirationQueue(): InspirationRef[] {
  return readQueueRaw();
}

export function setInspirationQueue(next: InspirationRef[]): void {
  try {
    localStorage.setItem(PRESENTATION_STUDIO_QUEUE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function enqueueInspirationRefs(refs: InspirationRef[]): number {
  const existing = readQueueRaw();
  const seen = new Set(existing.map((r) => `${r.provenance}:${r.id}`));
  let added = 0;
  for (const r of refs) {
    const key = `${r.provenance}:${r.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    existing.unshift({ ...r, addedAt: Date.now() });
    added += 1;
  }
  setInspirationQueue(existing);
  return added;
}

export function removeFromQueue(id: string, provenance: InspirationProvenance): void {
  const next = readQueueRaw().filter((r) => !(r.id === id && r.provenance === provenance));
  setInspirationQueue(next);
}

export function clearQueue(): void {
  setInspirationQueue([]);
}

/** Bookmark row → inspiration ref (thumbnail is the visual plate candidate) */
export function bookmarkToInspiration(b: {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  tags: string[];
  notes: string;
}): InspirationRef {
  return {
    id: b.id,
    provenance: "bookmark",
    url: b.url,
    thumbnailUrl: b.thumbnail || undefined,
    title: b.title,
    tags: b.tags,
    notes: b.notes,
    visualRoles: ["environment-plate", "mockup-reference"],
    addedAt: Date.now(),
  };
}

/** Knowledge item → ref (text-first; URL may be opened for stills) */
export function knowledgeToInspiration(k: {
  id: string;
  url: string;
  title: string;
  tags: string[];
  humanCard: string;
}): InspirationRef {
  return {
    id: k.id,
    provenance: "knowledge",
    url: k.url,
    title: k.title || k.url,
    tags: k.tags,
    notes: k.humanCard,
    visualRoles: ["palette-reference", "unspecified"],
    addedAt: Date.now(),
  };
}
