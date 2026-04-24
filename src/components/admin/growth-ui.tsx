"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/[0.06]">
      <p className="text-[9px] tracking-[0.2em] text-white/25 font-['Instrument_Sans'] uppercase">{label}</p>
      <p className="font-['Anton'] text-3xl tracking-[0.03em] text-white mt-2">{value}</p>
      <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">{hint}</p>
    </div>
  );
}

type StatusTone = "neutral" | "good" | "warn" | "danger" | "muted";

const STATUS_CX: Record<StatusTone, string> = {
  neutral: "bg-[#E2B93B]/10 text-[#E2B93B]/75 border-[#E2B93B]/20",
  good: "bg-green-500/10 text-green-400/75 border-green-500/20",
  warn: "bg-amber-500/10 text-amber-400/75 border-amber-500/20",
  danger: "bg-red-500/10 text-red-300/80 border-red-500/20",
  muted: "bg-white/[0.04] text-white/40 border-white/[0.08]",
};

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`px-2 py-0.5 text-[8px] tracking-[0.14em] uppercase border font-['Instrument_Sans'] ${STATUS_CX[tone]}`}
    >
      {label}
    </span>
  );
}

export function QueueCard({
  title,
  meta,
  status,
  tone = "neutral",
}: {
  title: string;
  meta: string;
  status: string;
  tone?: StatusTone;
}) {
  return (
    <div className="p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-white/80 font-['Instrument_Sans']">{title}</p>
          <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">{meta}</p>
        </div>
        <StatusPill label={status} tone={tone} />
      </div>
    </div>
  );
}

export function PanelLink({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      href={to}
      className="group p-4 border border-white/[0.06] bg-white/[0.02] hover:border-[#E2B93B]/25 hover:bg-white/[0.04] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-white/80 group-hover:text-white font-['Instrument_Sans']">{title}</p>
          <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1 leading-relaxed">{description}</p>
        </div>
        <ArrowUpRight size={12} className="text-white/15 group-hover:text-[#E2B93B]/55 transition-colors" />
      </div>
    </Link>
  );
}
