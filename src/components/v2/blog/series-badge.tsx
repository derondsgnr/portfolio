"use client";

interface SeriesBadgeProps {
  seriesTitle: string;
  position: number;
  total: number;
}

export function SeriesBadge({ seriesTitle, position, total }: SeriesBadgeProps) {
  return (
    <span
      className="text-[8px] tracking-[0.12em] text-[#B98ADF] block mb-1 pl-2 border-l-2 border-[#904FD3]/50"
      style={{ fontFamily: "monospace" }}
    >
      PART {position} OF {total} · {seriesTitle.toUpperCase()}
    </span>
  );
}
