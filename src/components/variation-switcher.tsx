import { motion } from "motion/react";

interface VariationSwitcherProps {
  sectionName: string;
  options: string[];
  current: number;
  onChange: (index: number) => void;
}

export function VariationSwitcher({
  sectionName,
  options,
  current,
  onChange,
}: VariationSwitcherProps) {
  return (
    <div className="sticky top-[56px] z-[60] bg-[#0a0a0a] border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center gap-6 overflow-x-auto">
      <span
        className="text-[#e2b93b] text-[0.65rem] uppercase tracking-[0.3em] shrink-0"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {sectionName}
      </span>
      <div className="flex items-center gap-1">
        {options.map((option, i) => (
          <button
            key={option}
            onClick={() => onChange(i)}
            className={`relative px-4 py-1.5 text-[0.75rem] uppercase tracking-[0.1em] transition-colors duration-300 shrink-0 ${
              current === i
                ? "text-[#0a0a0a]"
                : "text-white/40 hover:text-white/70"
            }`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {current === i && (
              <motion.div
                layoutId={`switcher-${sectionName}`}
                className="absolute inset-0 bg-[#e2b93b] rounded-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}