"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type FormFieldVariant = "default" | "admin";

const labelStyles: Record<FormFieldVariant, string> = {
  default: "block text-sm font-medium text-foreground mb-2",
  admin:
    "block text-[10px] tracking-[0.18em] text-white/40 uppercase mb-2 font-['Instrument_Sans']",
};

const hintStyles: Record<FormFieldVariant, string> = {
  default: "mt-1.5 text-sm text-muted-foreground",
  admin: "mt-1.5 text-[10px] text-white/25 font-['Instrument_Sans']",
};

export interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  variant?: FormFieldVariant;
}

export function FormField({
  label,
  children,
  hint,
  className = "",
  variant = "admin",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className={labelStyles[variant]}>{label}</label>
      {children}
      {hint && <p className={hintStyles[variant]}>{hint}</p>}
    </div>
  );
}
