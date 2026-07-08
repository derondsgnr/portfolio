"use client";

import { useRouter } from "next/navigation";
import { useAdmin } from "./admin-context";
import { getAdminSaveMessage, type AdminSaveStatus } from "@/lib/admin/feedback";

export function AdminSaveFeedback({
  status,
  error,
  savingMessage,
  successMessage,
  undoSection,
  undoTarget,
}: {
  status: AdminSaveStatus;
  error?: string | null;
  savingMessage?: string;
  successMessage?: string;
  undoSection?: string;
  undoTarget?: string;
}) {
  const router = useRouter();
  const { history, revertTo } = useAdmin();
  const message = getAdminSaveMessage({ status, error, savingMessage, successMessage });

  if (!message) return null;

  const matchingEntries =
    status === "ok" && undoSection
      ? history.filter((entry) => entry.section === undoSection && entry.target === undoTarget)
      : [];
  const undoEntry = matchingEntries[1];

  const tone =
    status === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : status === "ok"
        ? "border-[#ECFF95]/25 bg-[#ECFF95]/5 text-[#ECFF95]/90"
        : "border-white/[0.08] bg-white/[0.03] text-white/60";

  return (
    <div className={`flex flex-col gap-3 border px-4 py-3 font-['Instrument_Sans'] text-sm sm:flex-row sm:items-center sm:justify-between ${tone}`}>
      <p>{message}</p>
      {undoEntry ? (
        <button
          type="button"
          onClick={() => revertTo(undoEntry, router.push)}
          className="self-start border border-current/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] opacity-80 transition-opacity hover:opacity-100 sm:self-auto"
        >
          Revert previous
        </button>
      ) : null}
    </div>
  );
}
