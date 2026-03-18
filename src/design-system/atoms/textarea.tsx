"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type TextareaVariant = "default" | "admin";

const variantStyles: Record<TextareaVariant, string> = {
  default:
    "bg-input-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring",
  admin:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors placeholder:text-white/20 resize-y font-['Instrument_Sans']",
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
}

export function Textarea({
  className,
  variant = "default",
  ...props
}: TextareaProps) {
  const base =
    "flex w-full min-w-0 rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[3px] focus-visible:ring-ring/50";
  return (
    <textarea
      data-slot="textarea"
      className={cn(base, variantStyles[variant], className)}
      {...props}
    />
  );
}
