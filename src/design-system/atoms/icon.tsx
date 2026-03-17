"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/components/ui/utils";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function Icon({ icon: IconComponent, size = "md", className, ...props }: IconProps) {
  return (
    <IconComponent
      className={cn("inline-block text-current shrink-0", sizeMap[size], className)}
      aria-hidden
      {...props}
    />
  );
}
