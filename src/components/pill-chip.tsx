"use client";

import type { CSSProperties } from "react";
import { pillIconFor } from "@/lib/pill-icons";

type Variant = "chip" | "tag";

/**
 * Rounded dark chip + filled Phosphor icon (colored) + neutral white label.
 * No outline — just a solid surface, a colored icon, and white text.
 * - `chip` → label-size, surface-4, sentence case (nav/dashboard pills)
 * - `tag`  → mono uppercase, surface-3 (categories, tags, metadata)
 * State reads through color, not a border: when `active` is false (filter rest
 * state) the icon + label desaturate; the chip surface stays the same.
 */
export function PillChip({
  label,
  variant = "chip",
  active = true,
  className = "",
  style,
}: {
  label: string;
  variant?: Variant;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { Icon, color } = pillIconFor(label);
  const mono = variant === "tag";

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: mono ? 7 : 9,
    background: mono ? "var(--surface-3, #1e1f22)" : "var(--surface-4, #212225)",
    border: "none",
    borderRadius: 999,
    padding: mono ? "6px 12px" : "9px 15px 9px 12px",
    fontFamily: mono ? "monospace" : "var(--font-body)",
    fontSize: mono ? 11 : 15,
    fontWeight: mono ? 400 : 600,
    letterSpacing: mono ? "0.13em" : undefined,
    textTransform: mono ? "uppercase" : "none",
    color: active ? "var(--text-1, #f0f0f0)" : "var(--text-3, #6b6b6b)",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  return (
    <span className={className} style={{ ...base, ...style }}>
      <Icon size={mono ? 14 : 18} weight="fill" color={active ? color : "#4a4a4a"} />
      {label}
    </span>
  );
}
