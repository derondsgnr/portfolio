"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import {
  type GithubPatReminder,
  daysUntilDue,
  formatReminderDateValue,
  isOverdue,
  nextDueDate,
} from "@/lib/content/admin-reminders";

/**
 * Generic credential-rotation reminder banner. Drives the dashboard nudges for
 * the GitHub PAT and the mydara Google auth token (and any future reminder of
 * the same shape).
 */
export function ReminderBanner({
  reminder,
  title,
  rotateLocation,
  icon,
}: {
  reminder: GithubPatReminder;
  /** Short mono heading, e.g. "GitHub key rotation". */
  title: string;
  /** Where the user rotates it, woven into the overdue line, e.g. "GitHub". */
  rotateLocation: string;
  icon?: ReactNode;
}) {
  const { lastRotatedIso, intervalDays, label } = reminder;
  const overdue = isOverdue(lastRotatedIso, intervalDays);
  const daysLeft = daysUntilDue(lastRotatedIso, intervalDays);
  const next = nextDueDate(lastRotatedIso, intervalDays);
  const unset = !lastRotatedIso;

  const border = unset
    ? "border-[#E2B93B]/30 bg-[#E2B93B]/[0.06]"
    : overdue
      ? "border-red-500/40 bg-red-500/[0.06]"
      : daysLeft !== null && daysLeft <= 2
        ? "border-[#E2B93B]/35 bg-[#E2B93B]/[0.04]"
        : "border-white/[0.08] bg-white/[0.02]";

  const status = unset
    ? "No rotation logged yet — set a baseline date or mark rotated today."
    : overdue
      ? `Overdue — rotate ${label} in ${rotateLocation}, then log it here.`
      : daysLeft === 0
        ? "Due today."
        : `Next rotation due in ${daysLeft} day(s).`;

  return (
    <div className={`mb-8 p-4 border ${border} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 text-[#E2B93B]/70 mt-0.5">{icon ?? <KeyRound size={18} />}</span>
        <div className="min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#E2B93B]/80">{title}</p>
          <p className="text-sm text-white/75 font-['Instrument_Sans'] mt-1">{status}</p>
          {next && !overdue && !unset ? (
            <p className="text-[11px] text-white/35 font-['Instrument_Sans'] mt-1">
              Target date: {formatReminderDateValue(next)} · every {intervalDays} days
            </p>
          ) : (
            <p className="text-[11px] text-white/35 font-['Instrument_Sans'] mt-1">
              Reminder interval: every {intervalDays} days · {label}
            </p>
          )}
        </div>
      </div>
      <Link
        href="/admin/security"
        className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.1em] hover:bg-white transition-colors"
      >
        MANAGE REMINDER
      </Link>
    </div>
  );
}

/** Preset for the GitHub PAT rotation reminder. */
export function GithubPatReminderBanner({ reminder }: { reminder: GithubPatReminder }) {
  return <ReminderBanner reminder={reminder} title="GitHub key rotation" rotateLocation="GitHub" />;
}
