/**
 * Design System Tokens
 * Single source of truth for colors, typography, spacing.
 * Used by admin, public pages, and UI components.
 */

export const tokens = {
  colors: {
    background: "#121316",
    foreground: "#f0f0f0",
    card: "#17181C",
    "card-foreground": "#f0f0f0",
    accent: "#ECFF95",
    "accent-foreground": "#121316",
    muted: "#1D1E24",
    "muted-foreground": "#9a9a9a",
    // Text hierarchy — use these instead of raw rgba values
    // All meet WCAG AA on #121316 background
    text: {
      primary: "#f0f0f0",                  // headings, main body
      secondary: "rgba(255,255,255,0.65)", // descriptions, important metadata
      tertiary: "rgba(255,255,255,0.45)",  // labels, year, category, timestamps
      ghost: "rgba(255,255,255,0.28)",     // decorative text only — not for information
      inactive: "rgba(255,255,255,0.50)",  // inactive tabs, toggles
      disabled: "rgba(255,255,255,0.18)",  // disabled states only
    },
    border: "rgba(255, 255, 255, 0.08)",
    "border-focus": "rgba(236, 255, 149, 0.5)",
    ring: "rgba(255, 255, 255, 0.2)",
    destructive: "#d4183d",
    input: {
      bg: "rgba(255, 255, 255, 0.03)",
      border: "rgba(255, 255, 255, 0.08)",
      text: "#ffffff",
      placeholder: "rgba(255, 255, 255, 0.2)",
    },
    status: {
      success: "#22c55e",
      warning: "#E5A94E",
      error: "#ef4444",
      muted: "rgba(255, 255, 255, 0.2)",
    },
    sidebar: {
      bg: "#16171B",
      foreground: "#f0f0f0",
      border: "rgba(255, 255, 255, 0.08)",
    },
    chart: ["oklch(0.646 0.222 41.116)", "oklch(0.6 0.118 184.704)", "oklch(0.398 0.07 227.392)", "oklch(0.828 0.189 84.429)", "oklch(0.769 0.188 70.08)"] as const,
  },
  typography: {
    fontHeading: "'Anton', sans-serif",
    fontBody: "'Instrument Sans', sans-serif",
    fontSize: "16px",
    label: "0.625rem",
    hint: "0.625rem",
    tracking: {
      label: "0.18em",
      legend: "0.2em",
      button: "0.12em",
    },
  },
  spacing: {
    radius: "0.625rem",
    input: { x: "1rem", y: "0.75rem" },
  },
} as const;
