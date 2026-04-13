/**
 * ADMIN DASHBOARD — CONTROL ROOM
 * The command center for the admin panel.
 *
 * Left: Section health grid (13 sections) + quick actions
 * Right: Change log / version history with one-click Revert
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAdmin, formatHistoryTime } from "@/components/admin/admin-context";
import {
  LayoutDashboard, Type, Layers, Navigation, Globe,
  BookOpen, Zap, Palette, Image, Volume2, Search,
  Link2, Layout, ArrowUpRight, RotateCcw, Trash2,
  TrendingUp, FileText, Clock, MessageSquare, Bookmark, Mail,
  Rocket, CalendarClock, Users, Send, Bot, Brain,
} from "lucide-react";

// ─── Section definitions ───────────────────────────────────────────
const SECTIONS = [
  { key: "copy",           label: "Copy",           path: "/admin/copy",           index: 2,  icon: Type,           group: "content",  desc: "Hero, about, CTA text" },
  { key: "case-studies",   label: "Case Studies",   path: "/admin/case-studies",   index: 3,  icon: FileText,       group: "content",  desc: "Acts, slides, outcomes" },
  { key: "testimonials",   label: "Testimonials",   path: "/admin/testimonials",   index: 4,  icon: MessageSquare,  group: "content",  desc: "Homepage quotes, avatars, logos" },
  { key: "blog",           label: "Blog",           path: "/admin/blog",           index: 5,  icon: BookOpen,       group: "content",  desc: "Write & publish posts" },
  { key: "now",            label: "Now",            path: "/admin/now",            index: 6,  icon: Zap,            group: "content",  desc: "Status + activity log" },
  { key: "contacts",       label: "Contacts",       path: "/admin/contacts",       index: 7,  icon: Mail,           group: "content",  desc: "Contact form submissions" },
  { key: "comments",       label: "Comments",       path: "/admin/comments",       index: 8,  icon: MessageSquare,  group: "content",  desc: "Moderate reader comments" },
  { key: "bookmarks",      label: "Bookmarks",      path: "/admin/bookmarks",      index: 9,  icon: Bookmark,       group: "content",  desc: "Media inspiration board" },
  { key: "theme",          label: "Theme",          path: "/admin/theme",          index: 10, icon: Palette,        group: "style",    desc: "Fonts, colors, spacing" },
  { key: "media",          label: "Media",          path: "/admin/media",          index: 11, icon: Image,          group: "style",    desc: "Images + backgrounds" },
  { key: "sounds",         label: "Sounds",         path: "/admin/sounds",        index: 12, icon: Volume2,        group: "style",    desc: "Audio events" },
  { key: "nav",            label: "Navigation",     path: "/admin/nav",            index: 13, icon: Navigation,     group: "system",   desc: "Nav links + order" },
  { key: "global",         label: "Global",         path: "/admin/global",         index: 14, icon: Globe,          group: "system",   desc: "Footer + social links" },
  { key: "projects",       label: "Projects",       path: "/admin/projects",       index: 15, icon: Layers,         group: "system",   desc: "Work grid items" },
  { key: "meta",           label: "Meta / SEO",     path: "/admin/meta",           index: 16, icon: Search,         group: "system",   desc: "Title, OG, favicon" },
  { key: "integrations",   label: "Integrations",   path: "/admin/integrations",   index: 17, icon: Link2,          group: "system",   desc: "Analytics + GTM" },
  { key: "layout-builder", label: "Layout Builder", path: "/admin/layout-builder", index: 18, icon: Layout,         group: "system",   desc: "Section order + swaps" },
  { key: "growth",         label: "Growth OS",      path: "/admin/growth",         index: 19, icon: Rocket,         group: "growth",   desc: "Automation command center" },
  { key: "content-queue",  label: "Content Queue",  path: "/admin/content-queue",  index: 20, icon: CalendarClock,  group: "growth",   desc: "Plan and schedule text posts" },
  { key: "leads",          label: "Leads",          path: "/admin/leads",          index: 21, icon: Users,          group: "growth",   desc: "Pipeline and lead scoring" },
  { key: "outreach",       label: "Outreach",       path: "/admin/outreach",       index: 22, icon: Send,           group: "growth",   desc: "Cold message review queue" },
  { key: "automations",    label: "Automations",    path: "/admin/automations",    index: 23, icon: Bot,            group: "growth",   desc: "Workflow health and kill switch" },
  { key: "knowledge",      label: "Knowledge",      path: "/admin/knowledge",      index: 24, icon: Brain,          group: "growth",   desc: "Personal research vault + retrieval" },
];

const GROUP_LABELS: Record<string, string> = {
  content: "Content",
  growth: "Growth",
  style: "Style",
  system: "System",
};

// ─── SectionCard ──────────────────────────────────────────────────
function SectionCard({
  section,
  lastSaved,
  delay,
}: {
  section: (typeof SECTIONS)[0];
  lastSaved: number | null;
  delay: number;
}) {
  const Icon = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        href={section.path}
        className="group block relative p-4 bg-white/[0.02] border border-white/[0.06] hover:border-[#E2B93B]/20 hover:bg-white/[0.04] transition-all duration-200"
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={13} className="text-white/30 group-hover:text-[#E2B93B]/60 transition-colors" />
            <span className="text-[9px] tracking-[0.2em] text-white/20 font-['Instrument_Sans'] uppercase">
              {String(section.index).padStart(2, "0")}
            </span>
          </div>
          <ArrowUpRight
            size={11}
            className="text-white/10 group-hover:text-[#E2B93B]/40 transition-colors"
          />
        </div>

        {/* Section name */}
        <p className="text-[13px] font-['Instrument_Sans'] tracking-[0.04em] text-white/80 group-hover:text-white transition-colors mb-0.5">
          {section.label}
        </p>
        <p className="text-[10px] text-white/25 font-['Instrument_Sans']">{section.desc}</p>

        {/* Last saved */}
        {lastSaved && (
          <p className="mt-3 text-[9px] text-[#E2B93B]/40 font-['Instrument_Sans'] tracking-wider">
            Saved {formatHistoryTime(lastSaved)}
          </p>
        )}

        {/* Group badge */}
        <div
          className={`
            absolute top-3 right-8 text-[8px] tracking-[0.15em] uppercase font-['Instrument_Sans']
            ${section.group === "content" ? "text-white/10" : section.group === "growth" ? "text-[#E2B93B]/30" : section.group === "style" ? "text-purple-400/20" : "text-blue-400/20"}
          `}
        >
          {GROUP_LABELS[section.group]}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── ChangeLog ────────────────────────────────────────────────────
function ChangeLog() {
  const { history, revertTo, clearHistory } = useAdmin();
  const router = useRouter();

  const navigate = (path: string) => router.push(path);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-['Anton'] text-xl tracking-[0.06em] text-white uppercase">
            Change Log
          </h2>
          <p className="text-[10px] text-white/25 font-['Instrument_Sans'] tracking-wider mt-0.5">
            {history.length} entr{history.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            title="Clear all history"
            className="text-white/15 hover:text-red-400/50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 border border-white/[0.04]">
          <Clock size={24} className="text-white/10 mb-3" />
          <p className="text-[11px] text-white/20 font-['Instrument_Sans'] tracking-wider">
            No changes yet
          </p>
          <p className="text-[10px] text-white/10 font-['Instrument_Sans'] mt-1 max-w-[160px] leading-relaxed">
            Save any section to start tracking history
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="group flex items-start gap-3 p-3 border border-white/[0.05] hover:border-white/[0.10] hover:bg-white/[0.02] transition-all"
            >
              {/* Time */}
              <span className="text-[9px] font-['Instrument_Sans'] tracking-wider text-white/20 shrink-0 mt-0.5 tabular-nums">
                {formatHistoryTime(entry.timestamp)}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[8px] tracking-[0.15em] bg-[#E2B93B]/10 text-[#E2B93B]/70 font-['Instrument_Sans'] uppercase px-1.5 py-0.5">
                    {entry.sectionLabel}
                  </span>
                </div>
                <p className="text-[11px] font-['Instrument_Sans'] text-white/50 truncate">
                  {entry.label}
                </p>
              </div>

              {/* Revert */}
              <button
                onClick={() => revertTo(entry, navigate)}
                title={`Revert to: ${entry.label}`}
                className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[9px] font-['Instrument_Sans'] tracking-wider text-white/30 hover:text-[#E2B93B]/70 transition-all"
              >
                <RotateCcw size={10} />
                <span className="uppercase tracking-[0.1em]">Revert</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────
function QuickStats() {
  const { history } = useAdmin();
  const stats = [
    { label: "Sections",    value: "24",               icon: LayoutDashboard },
    { label: "Blog Posts",  value: "4",                icon: FileText },
    { label: "Changes",     value: String(history.length), icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="p-4 bg-white/[0.02] border border-white/[0.05]">
            <Icon size={13} className="text-white/20 mb-2" />
            <p className="font-['Anton'] text-2xl tracking-tight text-white">{stat.value}</p>
            <p className="text-[10px] text-white/30 font-['Instrument_Sans'] tracking-wider mt-0.5 uppercase">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { history } = useAdmin();

  // Compute last-saved time per section from history
  const lastSavedPerSection: Record<string, number> = {};
  for (const entry of history) {
    if (!lastSavedPerSection[entry.section]) {
      lastSavedPerSection[entry.section] = entry.timestamp;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-['Anton'] text-5xl lg:text-6xl tracking-[0.04em] text-white uppercase leading-none"
            >
              CONTROL
              <br />
              <span className="text-[#E2B93B]">ROOM</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm text-white/35 font-['Instrument_Sans'] mt-3"
            >
              Content management for derondsgnr.com
            </motion.p>
          </div>

          {/* System status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-right shrink-0"
          >
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#22c55e]/70 font-['Instrument_Sans'] uppercase">
                System Online
              </span>
            </div>
            <p className="text-[9px] text-white/15 font-['Instrument_Sans'] tracking-wider">
              {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        {/* Left: Stats + Section grid */}
        <div>
          {/* Quick stats */}
          <QuickStats />

          {/* Section grid header */}
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="font-['Anton'] text-lg tracking-[0.08em] text-white uppercase">
              Sections
            </h2>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Sections grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {SECTIONS.map((section, i) => (
              <SectionCard
                key={section.key}
                section={section}
                lastSaved={lastSavedPerSection[section.key] ?? null}
                delay={i * 0.04}
              />
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="text-[10px] tracking-[0.2em] text-white/25 font-['Instrument_Sans'] uppercase mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-['Instrument_Sans'] tracking-wider uppercase"
              >
                <BookOpen size={11} />
                New Blog Post
              </Link>
              <Link
                href="/admin/now"
                className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-['Instrument_Sans'] tracking-wider uppercase"
              >
                <Zap size={11} />
                Update Status
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-['Instrument_Sans'] tracking-wider uppercase"
              >
                <Layers size={11} />
                Add Project
              </Link>
              <Link
                href="/admin/growth"
                className="flex items-center gap-2 px-4 py-2.5 border border-[#E2B93B]/25 text-[#E2B93B]/65 hover:text-[#E2B93B] hover:border-[#E2B93B]/45 transition-all text-[11px] font-['Instrument_Sans'] tracking-wider uppercase"
              >
                <Rocket size={11} />
                Open Growth OS
              </Link>
              <Link
                href="/admin/knowledge"
                className="flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-[11px] font-['Instrument_Sans'] tracking-wider uppercase"
              >
                <Brain size={11} />
                Knowledge Vault
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Change log */}
        <div className="xl:border-l xl:border-white/[0.05] xl:pl-8">
          <ChangeLog />
        </div>
      </div>
    </div>
  );
}
