"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type InputVariant = "default" | "admin";

const variantStyles: Record<InputVariant, string> = {
  default:
    "bg-input-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring",
  admin:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors placeholder:text-white/20 font-['Instrument_Sans']",
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

export function Input({ className, variant = "default", ...props }: InputProps) {
  const base =
    "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <input
      data-slot="input"
      className={cn(base, variantStyles[variant], className)}
      {...props}
    />
  );
}
