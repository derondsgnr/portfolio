"use client";

export type SoundType = "loaderComplete" | "loaderTick" | "click" | "hover" | "navigate" | "textReveal";

declare global {
  interface Window {
    __SOUNDS__?: Record<string, string>;
  }
}

let audioContext: AudioContext | null = null;
let textRevealLastPlayed = 0;
const TEXT_REVEAL_COOLDOWN_MS = 200;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

export async function ensureAudioResumed(): Promise<boolean> {
  const ctx = getContext();
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx.state === "running";
}

function getUrl(type: SoundType): string {
  const config = typeof window !== "undefined" ? window.__SOUNDS__ : undefined;
  if (!config) return "";
  return (config[type] ?? "") || "";
}

function playFromUrl(url: string): void {
  if (!url || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playSound(type: SoundType): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (type === "textReveal") {
    const now = Date.now();
    if (now - textRevealLastPlayed < TEXT_REVEAL_COOLDOWN_MS) return;
    textRevealLastPlayed = now;
  }

  const url = getUrl(type);
  if (!url) return;

  ensureAudioResumed().then(() => {
    playFromUrl(url);
  });
}
