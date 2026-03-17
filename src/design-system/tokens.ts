/**
 * Design System Tokens
 * Formalized from theme.css for programmatic use.
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
    "muted-foreground": "#6b6b6b",
    border: "rgba(255, 255, 255, 0.08)",
    ring: "rgba(255, 255, 255, 0.2)",
  },
  typography: {
    fontHeading: "'Anton', sans-serif",
    fontBody: "'Instrument Sans', sans-serif",
    fontSize: "16px",
  },
  spacing: {
    radius: "0.625rem",
  },
} as const;
