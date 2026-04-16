import type { CSSProperties } from "react";
import type { CameraPresetId } from "@/types/presentation-studio";

/** 3D-style framing for device / hero layers (CSS transform on mockup wrapper) */
export const CAMERA_PRESETS: Record<
  CameraPresetId,
  { label: string; style: CSSProperties }
> = {
  "hero-tilt": {
    label: "Hero tilt",
    style: {
      transform: "perspective(1400px) rotateY(-14deg) rotateX(10deg) translateZ(0)",
      transformOrigin: "60% 60%",
    },
  },
  "float-right": {
    label: "Float right",
    style: {
      transform: "perspective(1200px) rotateY(-10deg) rotateX(4deg) translate3d(4%, 0, 0)",
      transformOrigin: "center center",
    },
  },
  flat: {
    label: "Flat",
    style: { transform: "none", transformOrigin: "center center" },
  },
  "dutch-low": {
    label: "Dutch angle",
    style: {
      transform: "perspective(1000px) rotateZ(-4deg) rotateX(8deg) translateY(2%)",
      transformOrigin: "50% 70%",
    },
  },
};
