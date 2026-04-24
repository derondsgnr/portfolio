"use client";

import { getAdminSaveMessage, type AdminSaveStatus } from "@/lib/admin/feedback";

export function AdminSaveFeedback({
  status,
  error,
  savingMessage,
  successMessage,
}: {
  status: AdminSaveStatus;
  error?: string | null;
  savingMessage?: string;
  successMessage?: string;
}) {
  const message = getAdminSaveMessage({ status, error, savingMessage, successMessage });

  if (!message) return null;

  const tone =
    status === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : status === "ok"
        ? "border-[#E2B93B]/25 bg-[#E2B93B]/5 text-[#E2B93B]/90"
        : "border-white/[0.08] bg-white/[0.03] text-white/60";

  return (
    <p className={`font-['Instrument_Sans'] text-sm border px-4 py-2 ${tone}`}>
      {message}
    </p>
  );
}
