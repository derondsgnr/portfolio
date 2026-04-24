"use client";

import type { ReactNode } from "react";

export function AdminNotice({
  kind,
  children,
}: {
  kind: "info" | "success" | "error";
  children: ReactNode;
}) {
  const tone =
    kind === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : kind === "success"
        ? "border-[#E2B93B]/25 bg-[#E2B93B]/5 text-[#E2B93B]/90"
        : "border-white/[0.08] bg-white/[0.03] text-white/60";

  return (
    <div className={`border px-4 py-2 font-['Instrument_Sans'] text-sm ${tone}`}>
      {children}
    </div>
  );
}
