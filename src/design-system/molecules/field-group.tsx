"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

const legendStyles =
  "text-[11px] tracking-[0.2em] text-[#E2B93B] uppercase font-['Instrument_Sans'] font-medium";

export interface FieldGroupProps {
  legend: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldGroup({
  legend,
  children,
  className = "",
}: FieldGroupProps) {
  return (
    <fieldset className={cn("space-y-5", className)}>
      <legend className="flex items-center gap-3 mb-6 w-full">
        <span className={legendStyles}>{legend}</span>
        <span className="flex-1 h-px bg-white/[0.06]" />
      </legend>
      {children}
    </fieldset>
  );
}
