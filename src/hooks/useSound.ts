"use client";

import { useCallback, useEffect } from "react";
import { playSound, ensureAudioResumed } from "@/lib/sound";
import type { SoundType } from "@/lib/sound";

export function useSound(type: SoundType) {
  return useCallback(() => playSound(type), [type]);
}

export function useSoundOnClick(type: SoundType = "click") {
  const sound = useSound(type);
  return useCallback(
    (e: React.MouseEvent) => {
      ensureAudioResumed();
      sound();
    },
    [sound]
  );
}

export function useSoundOnHover(type: SoundType = "hover") {
  const sound = useSound(type);
  return useCallback(() => {
    ensureAudioResumed();
    sound();
  }, [sound]);
}

/** Plain wrapper for callbacks — play sound then run. Use for onClick handlers. */
export function withSound<T extends (...args: unknown[]) => void>(
  fn: T,
  type: SoundType = "click"
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    ensureAudioResumed();
    playSound(type);
    fn(...args);
  };
}

/** Wraps a click handler to play sound and arm audio. Use for buttons/links. */
export function useClickWithSound<T extends (...args: unknown[]) => void>(
  handler: T,
  type: SoundType = "click"
): T {
  const sound = useSound(type);
  return useCallback(
    ((...args: unknown[]) => {
      ensureAudioResumed();
      sound();
      handler(...args);
    }) as T,
    [handler, sound]
  );
}

export function useArmAudio() {
  useEffect(() => {
    const arm = () => ensureAudioResumed();
    window.addEventListener("click", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("click", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);
}
