"use client";

import Image from "next/image";
import { getToolLogoUrl } from "@/lib/tool-logos";

interface ToolBadgeProps {
  tool: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function ToolBadge({ tool, size = 20, showLabel = false, className = "" }: ToolBadgeProps) {
  const logoUrl = getToolLogoUrl(tool, size);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title={tool}>
      {logoUrl && (
        <span className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <Image src={logoUrl} alt="" width={size} height={size} unoptimized className="object-contain" />
        </span>
      )}
      {showLabel && <span>{tool}</span>}
    </span>
  );
}

/** Inline list of tool badges (logo + name) for compact display */
export function ToolBadges({ tools, size = 16, className = "" }: { tools: string[]; size?: number; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {tools.map((tool) => (
        <ToolBadge key={tool} tool={tool} size={size} showLabel />
      ))}
    </span>
  );
}
