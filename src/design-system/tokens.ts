/**
 * Design System Tokens
 * Single source of truth for colors, typography, spacing.
 * Used by admin, public pages, and UI components.
 */

export const tokens = {
  colors: {
    background: "#0a0a0a",
    foreground: "#f0f0f0",
    card: "#111111",
    "card-foreground": "#f0f0f0",
    accent: "#e2b93b",
    "accent-foreground": "#0a0a0a",
    muted: "#1a1a1a",
    "muted-foreground": "#9a9a9a",
    border: "rgba(255, 255, 255, 0.08)",
    "border-focus": "rgba(226, 185, 59, 0.5)",
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
      warning: "#e2b93b",
      error: "#ef4444",
      muted: "rgba(255, 255, 255, 0.2)",
    },
    sidebar: {
      bg: "#0f0f0f",
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
