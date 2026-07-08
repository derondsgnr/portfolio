"use client";

import type { CSSProperties } from "react";
import { getToolIcon } from "@/lib/tool-logos";
import { pillFor } from "@/lib/pill-palette";

/** Inline brand logo (or a colored monogram fallback for unmapped tools). */
export function ToolBadge({
  tool,
  size = 20,
  showLabel = false,
  className = "",
}: {
  tool: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title={tool}>
      <ToolGlyph tool={tool} size={size} />
      {showLabel && <span>{tool}</span>}
    </span>
  );
}

/** Just the mark — brand SVG when known, else a monogram chip in a stable hue. */
export function ToolGlyph({ tool, size = 20 }: { tool: string; size?: number }) {
  const icon = getToolIcon(tool);
  if (icon) {
    return (
      <svg
        role="img"
        aria-label={icon.title}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={icon.hex}
        style={{ display: "block", flex: "none" }}
      >
        <path d={icon.path} />
      </svg>
    );
  }
  // Fallback: first letter, colored deterministically.
  const color = pillFor(tool);
  return (
    <span
      aria-label={tool}
      style={{
        display: "grid",
        placeItems: "center",
        width: size,
        height: size,
        flex: "none",
        borderRadius: 4,
        background: `${color}22`,
        color,
        fontFamily: "monospace",
        fontSize: Math.round(size * 0.6),
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {tool.trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Rounded dark chip + brand logo + white label — matches <PillChip>. */
export function ToolChip({
  tool,
  className = "",
  style,
}: {
  tool: string;
  className?: string;
  style?: CSSProperties;
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "var(--surface-3, #1e1f22)",
    border: "none",
    borderRadius: 999,
    padding: "6px 12px 6px 10px",
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "var(--text-1, #f0f0f0)",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <span className={className} style={{ ...base, ...style }}>
      <ToolGlyph tool={tool} size={14} />
      {tool}
    </span>
  );
}

/** Inline list of tool badges (logo + name) for compact display. */
export function ToolBadges({ tools, size = 16, className = "" }: { tools: string[]; size?: number; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {tools.map((tool) => (
        <ToolBadge key={tool} tool={tool} size={size} showLabel />
      ))}
    </span>
  );
}
