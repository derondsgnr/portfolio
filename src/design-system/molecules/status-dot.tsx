"use client";

import * as React from "react";
import { cn } from "@/components/ui/utils";

export type HealthStatus = "healthy" | "warning" | "empty";

const statusColors: Record<HealthStatus, string> = {
  healthy: "bg-[#22c55e]",
  warning: "bg-[#E2B93B]",
  empty: "bg-white/20",
};

export interface StatusDotProps {
  status: HealthStatus;
  className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full shrink-0",
        statusColors[status],
        className
      )}
    />
  );
}
