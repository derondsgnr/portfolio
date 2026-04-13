export type QueueStatus = "draft" | "ready" | "scheduled" | "posted" | "needs-review" | "failed";
export type LeadStage = "new" | "qualified" | "contacted" | "replying" | "won";
export type OutreachStatus = "queued" | "sent" | "replied" | "paused";
export type AutomationHealth = "healthy" | "warning" | "paused";

export interface ContentQueueItem {
  id: string;
  channel: "linkedin" | "x" | "reddit";
  title: string;
  tone: string;
  scheduledFor: string;
  status: QueueStatus;
}

export interface LeadItem {
  id: string;
  company: string;
  contact: string;
  source: "reddit" | "linkedin" | "x" | "referral";
  score: number;
  stage: LeadStage;
  nextAction: string;
}

export interface OutreachItem {
  id: string;
  lead: string;
  channel: "email" | "reddit-dm" | "linkedin-dm";
  uniqueness: number;
  risk: number;
  status: OutreachStatus;
}

export interface AutomationItem {
  id: string;
  name: string;
  cadence: string;
  health: AutomationHealth;
  lastRun: string;
  throughput: string;
}

export interface GrowthSettings {
  killSwitch: boolean;
  lastUpdated: string;
}

export interface GrowthState {
  contentQueue: ContentQueueItem[];
  leads: LeadItem[];
  outreachQueue: OutreachItem[];
  automations: AutomationItem[];
  settings: GrowthSettings;
}

const CONTENT_QUEUE: ContentQueueItem[] = [
  { id: "cq-01", channel: "linkedin", title: "How I moved from Figma to shipping code", tone: "Founder story", scheduledFor: "Today, 18:30", status: "scheduled" },
  { id: "cq-02", channel: "x", title: "Design constraint that made my portfolio faster", tone: "Tactical", scheduledFor: "Tue, 09:00", status: "ready" },
  { id: "cq-03", channel: "reddit", title: "Case study teardown for indie SaaS onboarding", tone: "Educational", scheduledFor: "Tue, 20:00", status: "needs-review" },
  { id: "cq-04", channel: "linkedin", title: "3 lessons after 90 days of AI-assisted building", tone: "Reflective", scheduledFor: "Wed, 17:00", status: "draft" },
];

const LEADS: LeadItem[] = [
  { id: "ld-01", company: "Metrica Labs", contact: "Ifeanyi N.", source: "linkedin", score: 86, stage: "qualified", nextAction: "Send first outreach" },
  { id: "ld-02", company: "Sora Health", contact: "Mina T.", source: "reddit", score: 79, stage: "new", nextAction: "Research product + pain points" },
  { id: "ld-03", company: "DeltaPay", contact: "Ayo O.", source: "x", score: 73, stage: "contacted", nextAction: "Prepare follow-up #1" },
  { id: "ld-04", company: "Nexus Studio", contact: "Amaka E.", source: "referral", score: 92, stage: "replying", nextAction: "Book intro call" },
];

const OUTREACH_QUEUE: OutreachItem[] = [
  { id: "oq-01", lead: "Metrica Labs", channel: "email", uniqueness: 88, risk: 22, status: "queued" },
  { id: "oq-02", lead: "Sora Health", channel: "reddit-dm", uniqueness: 81, risk: 48, status: "paused" },
  { id: "oq-03", lead: "DeltaPay", channel: "linkedin-dm", uniqueness: 84, risk: 35, status: "sent" },
  { id: "oq-04", lead: "Nexus Studio", channel: "email", uniqueness: 93, risk: 18, status: "replied" },
];

const AUTOMATIONS: AutomationItem[] = [
  { id: "au-01", name: "Daily Text Post Builder", cadence: "08:00 daily", health: "healthy", lastRun: "2h ago", throughput: "1/1 posted" },
  { id: "au-02", name: "Comment Reply Assistant", cadence: "hourly", health: "healthy", lastRun: "35m ago", throughput: "6 drafts" },
  { id: "au-03", name: "Lead Harvest (Reddit + LinkedIn)", cadence: "every 6h", health: "warning", lastRun: "1h ago", throughput: "12 leads, 2 flagged" },
  { id: "au-04", name: "Cold Outreach Sequencer", cadence: "11:30 daily", health: "paused", lastRun: "yesterday", throughput: "paused by user" },
];

export const DEFAULT_GROWTH_STATE: GrowthState = {
  contentQueue: CONTENT_QUEUE,
  leads: LEADS,
  outreachQueue: OUTREACH_QUEUE,
  automations: AUTOMATIONS,
  settings: {
    killSwitch: false,
    lastUpdated: new Date().toISOString(),
  },
};
