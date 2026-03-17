"use client";

import { useState, useEffect } from "react";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  function toggle() {
    const next = !enabled;
    setSoundEnabled(next);
    setEnabled(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      className="p-2 text-white/40 hover:text-white transition-colors"
      style={{ fontFamily: "monospace", fontSize: "10px" }}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
