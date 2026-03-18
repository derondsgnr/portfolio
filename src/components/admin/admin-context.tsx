"use client";

/**
 * ADMIN CONTEXT
 * Manages version history for all admin sections.
 * History is stored in localStorage under "admin_history".
 * Each save pushes a snapshot. Dashboard can revert to any entry.
 *
 * Auth is server-side (middleware + cookie). Layout is only rendered when authenticated.
 * - No login() — handled by middleware
 * - isAuthenticated: always true when in layout
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "admin_history";
const MAX_HISTORY = 50;

// ─── Types ─────────────────────────────────────────────────────────
export interface HistoryEntry {
  id: string;
  section: string;      // route key, e.g. "copy"
  sectionLabel: string; // display label, e.g. "Copy"
  timestamp: number;    // Date.now()
  label: string;        // human readable, e.g. "Saved homepage hero"
  snapshot: unknown;    // JSON-serializable state snapshot
}

export interface PendingRevert {
  section: string;
  snapshot: unknown;
}

export interface AdminContextType {
  history: HistoryEntry[];
  pushHistory: (
    section: string,
    sectionLabel: string,
    label: string,
    snapshot: unknown
  ) => void;
  revertTo: (entry: HistoryEntry, navigateFn: (path: string) => void) => void;
  clearHistory: () => void;
  pendingRevert: PendingRevert | null;
  clearPendingRevert: () => void;
  isAuthenticated: boolean;
}

// ─── Context ───────────────────────────────────────────────────────
const AdminContext = createContext<AdminContextType | null>(null);

// ─── Provider ──────────────────────────────────────────────────────
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingRevert, setPendingRevert] = useState<PendingRevert | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[];
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore storage errors
    }
  }, [history]);

  const pushHistory = useCallback(
    (section: string, sectionLabel: string, label: string, snapshot: unknown) => {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        section,
        sectionLabel,
        timestamp: Date.now(),
        label,
        snapshot,
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    },
    []
  );

  const revertTo = useCallback(
    (entry: HistoryEntry, navigateFn: (path: string) => void) => {
      setPendingRevert({ section: entry.section, snapshot: entry.snapshot });
      navigateFn(`/admin/${entry.section}`);
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const clearPendingRevert = useCallback(() => {
    setPendingRevert(null);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        history,
        pushHistory,
        revertTo,
        clearHistory,
        pendingRevert,
        clearPendingRevert,
        isAuthenticated: true, // middleware guards layout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

// ─── Format timestamp ──────────────────────────────────────────────
export function formatHistoryTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
