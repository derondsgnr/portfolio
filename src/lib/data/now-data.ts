/**
 * NOW PAGE DATA
 * =============
 * Static data for the /now page — Cursor handoff will replace
 * this with Supabase KV reads/writes via the admin panel.
 *
 * Data shapes match what the admin panel will POST to the server.
 * Keep types in sync with the server contract when wiring up.
 */

export type WorkStatus =
  | "deep-work"
  | "meetings"
  | "resting"
  | "sick"
  | "traveling"
  | "offline";

export type ActivityType =
  | "design"
  | "code"
  | "writing"
  | "planning"
  | "research";

export type TodoCategory =
  | "design"
  | "code"
  | "writing"
  | "admin"
  | "meeting";

export interface ActivityEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  type: ActivityType;
  description: string;
  tool?: string;         // "Figma" | "Cursor" | "Notion" etc.
  duration?: string;     // human-readable: "3h 20m"
}

export interface TodoItem {
  id: string;
  text: string;
  startTime?: string;    // "09:00"
  endTime?: string;      // "11:00"
  category: TodoCategory;
  completed: boolean;
}

// ─── Current State ────────────────────────────────────────────────
export const NOW_STATUS: WorkStatus = "deep-work";
export const NOW_STREAK = 12;
export const NOW_STREAK_START = "2026-03-07";
export const NOW_FOCUS = "Portfolio refresh — Now page + Blog system";
export const NOW_TOOLS_TODAY: string[] = ["Figma", "Cursor"];
export const NOW_DATE = "2026-03-18"; // update daily

// ─── Last 14 Days of Activity ─────────────────────────────────────
// Used for the heatmap grid. Most recent first.
export const NOW_ACTIVITY: ActivityEntry[] = [
  {
    id: "a-01",
    date: "2026-03-18",
    type: "design",
    description: "UI component audit, Now page layout wireframes",
    tool: "Figma",
    duration: "3h 20m",
  },
  {
    id: "a-02",
    date: "2026-03-18",
    type: "code",
    description: "Blog reader component + route wiring",
    tool: "Cursor",
    duration: "2h 10m",
  },
  {
    id: "a-03",
    date: "2026-03-17",
    type: "design",
    description: "Blog index editorial grid design",
    tool: "Figma",
    duration: "4h",
  },
  {
    id: "a-04",
    date: "2026-03-16",
    type: "code",
    description: "Case study engine fixes, reader view polish",
    tool: "Cursor",
    duration: "3h 45m",
  },
  {
    id: "a-05",
    date: "2026-03-15",
    type: "planning",
    description: "Portfolio roadmap + feature prioritization",
    tool: "Notion",
    duration: "1h 30m",
  },
  {
    id: "a-06",
    date: "2026-03-14",
    type: "design",
    description: "Synthesis homepage iteration — hero rework",
    tool: "Figma",
    duration: "5h",
  },
  {
    id: "a-07",
    date: "2026-03-13",
    type: "code",
    description: "Booking drawer + Cal.com embed integration",
    tool: "Cursor",
    duration: "2h",
  },
  {
    id: "a-08",
    date: "2026-03-12",
    type: "writing",
    description: "Blog post drafts — 'Designing in the Age of AI'",
    tool: "Notion",
    duration: "2h 30m",
  },
  {
    id: "a-09",
    date: "2026-03-11",
    type: "design",
    description: "Kora case study slide deck — brand slides",
    tool: "Figma",
    duration: "6h",
  },
  {
    id: "a-10",
    date: "2026-03-10",
    type: "code",
    description: "Case study cinematic viewer — slide transitions",
    tool: "Cursor",
    duration: "4h 30m",
  },
  {
    id: "a-11",
    date: "2026-03-09",
    type: "research",
    description: "Competitive analysis — Awwwards portfolio sites",
    tool: "Browser",
    duration: "2h",
  },
  {
    id: "a-12",
    date: "2026-03-08",
    type: "design",
    description: "V2 variation: Echo + Fracture exploration",
    tool: "Figma",
    duration: "4h",
  },
  {
    id: "a-13",
    date: "2026-03-07",
    type: "code",
    description: "Homepage routing fix, case study Link wrappers",
    tool: "Cursor",
    duration: "1h 30m",
  },
];

// ─── Today's Time Blocks ──────────────────────────────────────────
export const NOW_TODOS: TodoItem[] = [
  {
    id: "t-01",
    text: "Figma component system review",
    startTime: "09:00",
    endTime: "11:00",
    category: "design",
    completed: true,
  },
  {
    id: "t-02",
    text: "Blog reader component build",
    startTime: "11:00",
    endTime: "12:30",
    category: "code",
    completed: false,
  },
  {
    id: "t-03",
    text: "Now page + admin UI",
    startTime: "14:00",
    endTime: "16:00",
    category: "code",
    completed: false,
  },
  {
    id: "t-04",
    text: "Blog post draft — 'On AI and Design'",
    startTime: "16:00",
    endTime: "17:30",
    category: "writing",
    completed: false,
  },
  {
    id: "t-05",
    text: "Review + respond to client messages",
    startTime: "17:30",
    endTime: "18:00",
    category: "admin",
    completed: false,
  },
];

// ─── Status Display Config ────────────────────────────────────────
export const STATUS_CONFIG: Record<
  WorkStatus,
  { label: string; color: string; dot: string; emoji: string }
> = {
  "deep-work":  { label: "DEEP WORK",  color: "#22c55e", dot: "#22c55e", emoji: "⚡" },
  "meetings":   { label: "MEETINGS",   color: "#3b82f6", dot: "#3b82f6", emoji: "🎙" },
  "resting":    { label: "RESTING",    color: "#6b7280", dot: "#6b7280", emoji: "🌙" },
  "sick":       { label: "SICK",       color: "#ef4444", dot: "#ef4444", emoji: "🤒" },
  "traveling":  { label: "TRAVELING",  color: "#eab308", dot: "#eab308", emoji: "✈" },
  "offline":    { label: "OFFLINE",    color: "#374151", dot: "#374151", emoji: "○" },
};

// ─── Activity Type Config ─────────────────────────────────────────
export const ACTIVITY_CONFIG: Record<
  ActivityType,
  { label: string; color: string; bg: string }
> = {
  design:   { label: "DESIGN",   color: "#E2B93B", bg: "rgba(226,185,59,0.12)" },
  code:     { label: "CODE",     color: "#4DABF7", bg: "rgba(77,171,247,0.12)" },
  writing:  { label: "WRITING",  color: "#69DB7C", bg: "rgba(105,219,124,0.12)" },
  planning: { label: "PLANNING", color: "#DA77F2", bg: "rgba(218,119,242,0.12)" },
  research: { label: "RESEARCH", color: "#FFA94D", bg: "rgba(255,169,77,0.12)" },
};

// ─── Todo Category Config ─────────────────────────────────────────
export const TODO_CONFIG: Record<
  TodoCategory,
  { label: string; color: string; bg: string }
> = {
  design:  { label: "DESIGN",  color: "#E2B93B", bg: "rgba(226,185,59,0.1)" },
  code:    { label: "CODE",    color: "#4DABF7", bg: "rgba(77,171,247,0.1)" },
  writing: { label: "WRITING", color: "#69DB7C", bg: "rgba(105,219,124,0.1)" },
  admin:   { label: "ADMIN",   color: "#9CA3AF", bg: "rgba(156,163,175,0.1)" },
  meeting: { label: "MEETING", color: "#DA77F2", bg: "rgba(218,119,242,0.1)" },
};
