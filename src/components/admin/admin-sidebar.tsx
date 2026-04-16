/**
 * ADMIN SIDEBAR
 * Fixed left rail navigation for the admin panel.
 * 220px wide, grouped by Content / Style / System.
 * Motion-animated gold sliding active indicator.
 * Mobile: hidden by default, hamburger overlay.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAdmin } from "./admin-context";
import {
  LayoutDashboard, Type, Layers, Navigation, Globe,
  BookOpen, Zap, Palette, Image, Volume2, Search,
  Link2, Layout, X, Menu, LogOut, ExternalLink,
  MessageSquare, Bookmark, FileText, Mail, Rocket,
  CalendarClock, Users, Send, Bot, Brain, Clapperboard, KeyRound,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

// ─── Navigation structure ──────────────────────────────────────────
const NAV_GROUPS = [
  {
    id: "content",
    label: "Content",
    items: [
      { number: 1,  label: "Dashboard",     path: "/admin",              icon: LayoutDashboard },
      { number: 2,  label: "Copy",          path: "/admin/copy",          icon: Type },
      { number: 3,  label: "Case Studies",  path: "/admin/case-studies",  icon: FileText },
      { number: 4,  label: "Testimonials",  path: "/admin/testimonials",  icon: MessageSquare },
      { number: 5,  label: "Contacts",     path: "/admin/contacts",      icon: Mail },
      { number: 6,  label: "Blog",          path: "/admin/blog",          icon: BookOpen },
      { number: 7,  label: "Now",           path: "/admin/now",           icon: Zap },
      { number: 8,  label: "Comments",      path: "/admin/comments",      icon: MessageSquare },
      { number: 9,  label: "Bookmarks",     path: "/admin/bookmarks",     icon: Bookmark },
      { number: 10, label: "Knowledge",     path: "/admin/knowledge",     icon: BookOpen },
    ],
  },
  {
    id: "style",
    label: "Style",
    items: [
      { number: 10, label: "Theme",         path: "/admin/theme",         icon: Palette },
      { number: 11, label: "Media",         path: "/admin/media",         icon: Image },
      { number: 12, label: "Sounds",        path: "/admin/sounds",        icon: Volume2 },
    ],
  },
  {
    id: "growth",
    label: "Growth OS",
    items: [
      { number: 19, label: "Growth OS",      path: "/admin/growth",        icon: Rocket },
      { number: 20, label: "Content Queue",  path: "/admin/content-queue", icon: CalendarClock },
      { number: 21, label: "Leads",          path: "/admin/leads",         icon: Users },
      { number: 22, label: "Outreach",       path: "/admin/outreach",      icon: Send },
      { number: 23, label: "Automations",    path: "/admin/automations",   icon: Bot },
      { number: 24, label: "Knowledge",      path: "/admin/knowledge",     icon: Brain },
      { number: 25, label: "Presentation Studio", path: "/admin/presentation-studio", icon: Clapperboard },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { number: 26, label: "Navigation",    path: "/admin/nav",           icon: Navigation },
      { number: 27, label: "Global",        path: "/admin/global",        icon: Globe },
      { number: 28, label: "Projects",      path: "/admin/projects",      icon: Layers },
      { number: 29, label: "Meta / SEO",    path: "/admin/meta",          icon: Search },
      { number: 30, label: "Integrations",  path: "/admin/integrations",  icon: Link2 },
      { number: 31, label: "Security",      path: "/admin/security",      icon: KeyRound },
      { number: 32, label: "Layout",        path: "/admin/layout-builder", icon: Layout },
    ],
  },
];

// ─── LogoutButton (server action form) ──────────────────────────────
function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-white/20 hover:text-red-400/60 transition-colors group"
      >
        <LogOut size={12} />
        <span className="text-[11px] font-['Instrument_Sans'] tracking-[0.08em] uppercase">
          Logout
        </span>
      </button>
    </form>
  );
}

// ─── NavItem ────────────────────────────────────────────────────────
function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_GROUPS)[0]["items"][0];
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200
        ${isActive
          ? "text-white"
          : "text-white/35 hover:text-white/70"
        }
      `}
    >
      {/* Active gold bar */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#E2B93B]"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      {/* Active bg highlight */}
      {isActive && (
        <span className="absolute inset-0 bg-white/[0.03]" />
      )}

      {/* Number */}
      <span
        className={`
          relative text-[9px] font-['Instrument_Sans'] tracking-widest w-4 shrink-0 text-right
          ${isActive ? "text-[#E2B93B]/60" : "text-white/15 group-hover:text-white/25"}
        `}
      >
        {String(item.number).padStart(2, "0")}
      </span>

      {/* Icon */}
      <Icon
        size={13}
        className={`relative shrink-0 ${isActive ? "text-[#E2B93B]" : ""}`}
      />

      {/* Label */}
      <span
        className={`
          relative text-[11px] font-['Instrument_Sans'] tracking-[0.08em] uppercase
          ${isActive ? "text-white" : ""}
        `}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ─── SidebarContent ────────────────────────────────────────────────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { history } = useAdmin();

  const currentPath = pathname ?? "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <div>
          <p className="font-['Anton'] text-[13px] tracking-[0.25em] text-white">ADMIN</p>
          <p className="text-[9px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] mt-0.5">
            derondsgnr
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Online indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
          </span>
          {/* Mobile close */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="mb-5">
            {/* Group label */}
            <p className="px-3 mb-1.5 text-[8px] tracking-[0.35em] text-[#E2B93B]/40 uppercase font-['Instrument_Sans']">
              {group.label}
            </p>

            {/* Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={
                    item.path === "/admin"
                      ? currentPath === "/admin"
                      : currentPath.startsWith(item.path)
                  }
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* History indicator */}
      {history.length > 0 && (
        <div className="mx-3 mb-3 px-3 py-2 bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[9px] tracking-[0.12em] text-white/25 font-['Instrument_Sans'] uppercase">
            {history.length} change{history.length !== 1 ? "s" : ""} logged
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 text-white/25 hover:text-white/60 transition-colors group"
        >
          <ExternalLink size={12} />
          <span className="text-[11px] font-['Instrument_Sans'] tracking-[0.08em] uppercase">
            View Site
          </span>
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}

// ─── AdminSidebar (desktop) ────────────────────────────────────────
export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-[#0A0A0A] border-r border-white/[0.06] z-40 hidden lg:flex flex-col">
      <SidebarContent />
    </aside>
  );
}

// ─── MobileAdminNav ────────────────────────────────────────────────
export function MobileAdminNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-white/[0.06] flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setOpen(true)}
          className="text-white/50 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>
        <span className="font-['Anton'] text-[12px] tracking-[0.25em] text-white">ADMIN</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
        </span>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 h-full w-[220px] bg-[#0A0A0A] border-r border-white/[0.06] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
