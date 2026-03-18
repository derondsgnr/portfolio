/**
 * Shared class strings for form elements.
 * Use when you need raw classes instead of components.
 */

export const formCx = {
  input:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors placeholder:text-white/20 font-['Instrument_Sans']",
  textarea:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors placeholder:text-white/20 resize-y font-['Instrument_Sans']",
  select:
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#E2B93B]/50 transition-colors font-['Instrument_Sans'] cursor-pointer",
  label:
    "block text-[10px] tracking-[0.18em] text-white/40 uppercase mb-2 font-['Instrument_Sans']",
  legend:
    "text-[11px] tracking-[0.2em] text-[#E2B93B] uppercase font-['Instrument_Sans'] font-medium",
} as const;
