import type { GradingPresetId } from "@/types/presentation-studio";

/** Color / contrast energy applied to plates + sometimes global comp */
export const GRADING_PRESETS: Record<
  GradingPresetId,
  { label: string; plateFilter: string; compFilter?: string }
> = {
  "cinematic-rich": {
    label: "Cinematic",
    plateFilter: "saturate(1.12) contrast(1.1) brightness(1.03)",
    compFilter: "saturate(1.02)",
  },
  noir: {
    label: "Noir",
    plateFilter: "saturate(0.88) contrast(1.14) brightness(0.94)",
    compFilter: "saturate(0.95)",
  },
  vibrant: {
    label: "Vibrant",
    plateFilter: "saturate(1.28) contrast(1.06) brightness(1.02)",
    compFilter: "saturate(1.05)",
  },
  neutral: {
    label: "Neutral",
    plateFilter: "none",
    compFilter: "none",
  },
};
