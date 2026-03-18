"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type SaveStatus = "idle" | "saving" | "ok" | "error";

export interface SaveButtonProps {
  status: SaveStatus;
  label?: string;
  className?: string;
}

const statusStyles: Record<SaveStatus, string> = {
  idle: "bg-[#E2B93B] text-[#0A0A0A] hover:bg-white",
  saving: "bg-[#E2B93B]/70 text-[#0A0A0A] cursor-wait",
  ok: "bg-white text-[#0A0A0A]",
  error: "bg-red-500/20 border border-red-500/40 text-red-400",
};

const statusLabels: Record<SaveStatus, string> = {
  idle: "SAVE",
  saving: "SAVING...",
  ok: "SAVED ✓",
  error: "ERROR — RETRY",
};

export function SaveButton({
  status,
  label = "SAVE",
  className = "",
}: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={status === "saving"}
      className={cn(
        "px-8 py-3 font-['Anton'] text-sm tracking-[0.12em] transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        statusStyles[status],
        className
      )}
    >
      {status === "saving"
        ? statusLabels.saving
        : status === "ok"
          ? statusLabels.ok
          : status === "error"
            ? statusLabels.error
            : label}
    </button>
  );
}
