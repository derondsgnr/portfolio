"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export interface PageHeaderProps {
  index: number;
  title: string;
  description: string;
  lastSaved?: string | null;
  className?: string;
}

export function PageHeader({
  index,
  title,
  description,
  lastSaved,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={cn("mb-10 pb-8 border-b border-white/[0.06]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-[11px] tracking-[0.2em] text-white/20 font-['Instrument_Sans']">
              {String(index).padStart(2, "0")}
            </span>
            <h1 className="font-['Anton'] text-3xl tracking-[0.06em] uppercase text-white">
              {title}
            </h1>
          </div>
          <p className="text-sm text-white/40 font-['Instrument_Sans'] mt-1.5 max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
        {lastSaved && (
          <div className="shrink-0 text-right">
            <span className="text-[10px] tracking-[0.12em] text-white/20 font-['Instrument_Sans'] uppercase">
              Last saved
            </span>
            <p className="text-[11px] text-white/40 font-['Instrument_Sans'] mt-0.5">
              {lastSaved}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
