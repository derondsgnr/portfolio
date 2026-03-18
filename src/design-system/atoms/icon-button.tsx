"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  default:
    "border border-white/20 text-white/60 hover:text-white hover:border-white/40",
  ghost: "border-transparent text-white/40 hover:text-white/70",
  accent:
    "border border-[#E2B93B]/40 text-[#E2B93B]/80 hover:text-[#E2B93B] hover:border-[#E2B93B]/60",
} as const;

const sizeStyles = {
  sm: "w-8 h-8 rounded-full [&_svg]:size-3.5",
  md: "w-10 h-10 rounded-full [&_svg]:size-4",
  lg: "w-12 h-12 rounded-full [&_svg]:size-5",
} as const;

export function IconButton({
  className,
  variant = "default",
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E2B93B]/30 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
