"use client";

export type SoundType = "loaderComplete" | "loaderTick" | "click" | "hover" | "navigate";

const STORAGE_KEY = "portfolio_sound_enabled";

let audioContext: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "false") return false;
  if (stored === "true") return true;
  return true;
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

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

function playTone(
  freq: number,
  duration: number,
  type: "sine" | "square" | "sawtooth" = "sine",
  volume = 0.15,
  attack = 0.01,
  release = 0.05
) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - release);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playSound(type: SoundType): void {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = getContext();
  if (!ctx) return;

  switch (type) {
    case "loaderComplete":
      // Ascending resolution — "ready" feel
      [220, 277, 330, 440].forEach((f, i) => {
        setTimeout(
          () => playTone(f, 0.12, "sine", 0.12, 0.02, 0.06),
          i * 80
        );
      });
      break;
    case "loaderTick":
      playTone(400, 0.04, "sine", 0.06, 0.005, 0.02);
      break;
    case "click":
      playTone(600, 0.06, "sine", 0.08, 0.01, 0.03);
      break;
    case "hover":
      playTone(500, 0.03, "sine", 0.04, 0.005, 0.015);
      break;
    case "navigate":
      playTone(350, 0.08, "sine", 0.1, 0.02, 0.04);
      break;
  }
}
