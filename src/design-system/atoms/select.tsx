"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type SelectVariant = "default" | "admin";

const variantStyles: Record<SelectVariant, string> = {
  default:
    "bg-input-background border-input text-foreground focus-visible:border-ring",
  admin:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors font-['Instrument_Sans'] cursor-pointer",
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
}

export function Select({
  className,
  variant = "default",
  children,
  ...props
}: SelectProps) {
  const base =
    "flex w-full min-w-0 rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <select
      data-slot="select"
      className={cn(base, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </select>
  );
}
