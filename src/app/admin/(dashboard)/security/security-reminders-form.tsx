"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { saveAdminReminders } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, FormField, PageHeader } from "@/components/admin/admin-primitives";
import type { AdminRemindersConfig, GithubPatReminder } from "@/lib/content/admin-reminders";
import {
  clampIntervalDays,
  daysUntilDue,
  formatReminderDate,
  formatReminderDateValue,
  fromDateInputValue,
  isOverdue,
  nextDueDate,
  toDateInputValue,
  todayReminderIso,
} from "@/lib/content/admin-reminders";
import { getAdminErrorMessage } from "@/lib/admin/feedback";

/** Keys of AdminRemindersConfig that point at a GithubPatReminder. */
type ReminderKey = "githubPat" | "mydaraGoogleAuth";

type ReminderMeta = {
  key: ReminderKey;
  title: string;
  description: ReactNode;
};

const REMINDERS: ReminderMeta[] = [
  {
    key: "githubPat",
    title: "GitHub PAT",
    description: (
      <>
        Used for admin saves via <code className="text-white/50">GITHUB_TOKEN</code>. Rotate in GitHub → Settings →
        Developer settings → Personal access tokens, then update env on Vercel and locally.
      </>
    ),
  },
  {
    key: "mydaraGoogleAuth",
    title: "Google auth token (mydara)",
    description: (
      <>
        Google OAuth / API credential for the <span className="text-white/55">mydara</span> project. Rotate in Google
        Cloud Console → APIs &amp; Services → Credentials, then update mydara&apos;s env. No secret is stored here —
        just the date you last rotated.
      </>
    ),
  },
];

export function SecurityRemindersForm({ initial }: { initial: AdminRemindersConfig }) {
  const { pushHistory } = useAdmin();
  const [config, setConfig] = useState<AdminRemindersConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function persist(nextConfig: AdminRemindersConfig) {
    setSaving(true);
    setNotice(null);
    const res = await saveAdminReminders(nextConfig, "Update security rotation reminders");
    setSaving(false);
    if (res.ok) {
      setConfig(nextConfig);
      pushHistory("security", "Security", "Logged security reminder update", nextConfig);
      setNotice({ kind: "success", text: "Saved to repo (content/admin-reminders.json)." });
    } else {
      setNotice({ kind: "error", text: getAdminErrorMessage(res.error) });
    }
  }

  function updateReminder(key: ReminderKey, patch: Partial<GithubPatReminder>) {
    setConfig((c) => ({ ...c, [key]: { ...c[key], ...patch } }));
  }

  return (
    <div className="space-y-8 max-w-xl">
      <PageHeader
        index={32}
        title="Security reminders"
        description="Track when you last rotated credentials. No secrets are stored here — only dates and intervals."
      />

      {notice ? (
        <p
          className={`text-sm font-['Instrument_Sans'] px-4 py-2 ${
            notice.kind === "error"
              ? "text-red-300 border border-red-500/30 bg-red-500/10"
              : "text-[#E2B93B]/90 border border-[#E2B93B]/25 bg-[#E2B93B]/5"
          }`}
        >
          {notice.text}
        </p>
      ) : null}

      {REMINDERS.map(({ key, title, description }) => {
        const reminder = config[key];
        const next = nextDueDate(reminder.lastRotatedIso, reminder.intervalDays);
        const overdue = isOverdue(reminder.lastRotatedIso, reminder.intervalDays);
        const daysLeft = daysUntilDue(reminder.lastRotatedIso, reminder.intervalDays);
        const lastRotatedDate = formatReminderDate(reminder.lastRotatedIso);

        return (
          <div key={key} className="border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#E2B93B]/80">{title}</p>
              <p className="text-xs text-white/40 font-['Instrument_Sans'] mt-1 leading-relaxed">{description}</p>
            </div>

            <div className="rounded border border-white/[0.06] p-3 bg-[#0A0A0A]/60 space-y-1">
              <p className="text-[11px] text-white/50 font-['Instrument_Sans']">
                {lastRotatedDate ? `Last logged rotation date: ${lastRotatedDate}` : "No date logged yet."}
              </p>
              {next && !overdue && reminder.lastRotatedIso ? (
                <p className="text-[11px] text-white/35 font-['Instrument_Sans']">
                  Next due: {formatReminderDateValue(next)}
                  {daysLeft !== null ? ` (${daysLeft} day(s) left)` : ""}
                </p>
              ) : null}
              {overdue && reminder.lastRotatedIso ? (
                <p className="text-[11px] text-red-400/80 font-['Instrument_Sans']">Currently overdue — rotate and log below.</p>
              ) : null}
            </div>

            <FormField label="Reminder interval (days)">
              <input
                type="number"
                min={1}
                max={90}
                className={adminCx.input}
                value={reminder.intervalDays}
                onChange={(e) => updateReminder(key, { intervalDays: clampIntervalDays(Number(e.target.value), 7) })}
              />
            </FormField>

            <FormField label="Last rotated date (optional — set manually if you already rotated)">
              <input
                type="date"
                className={adminCx.input}
                value={toDateInputValue(reminder.lastRotatedIso)}
                onChange={(e) => updateReminder(key, { lastRotatedIso: fromDateInputValue(e.target.value) })}
              />
            </FormField>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  persist({
                    ...config,
                    [key]: { ...config[key], lastRotatedIso: todayReminderIso() },
                  })
                }
                className="px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.1em] hover:bg-white transition-colors disabled:opacity-40"
              >
                MARK ROTATED TODAY
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => persist(config)}
                className="px-4 py-2.5 border border-white/[0.12] text-[11px] font-['Instrument_Sans'] uppercase tracking-wider text-white/60 hover:border-white/25 disabled:opacity-40"
              >
                Save settings
              </button>
            </div>
          </div>
        );
      })}

      <Link href="/admin" className="text-[11px] font-['Instrument_Sans'] tracking-wider text-white/35 hover:text-white/60 uppercase">
        ← Control room
      </Link>
    </div>
  );
}
