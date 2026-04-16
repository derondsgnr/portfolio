"use client";

import type { CSSProperties } from "react";
import type { DeckSlide, SceneScreenRect, StudioFormat } from "@/types/presentation-studio";
import type { ScenePresetDef } from "./scene-presets";
import { GRADING_PRESETS } from "./grading-presets";

function SafeImg({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}

function mergeScreen(
  base: SceneScreenRect,
  override?: Partial<SceneScreenRect> | null,
): SceneScreenRect {
  if (!override) return base;
  return {
    x: override.x ?? base.x,
    y: override.y ?? base.y,
    w: override.w ?? base.w,
    h: override.h ?? base.h,
    radiusRw: override.radiusRw ?? base.radiusRw,
  };
}

/**
 * Scales a calibrated scene (intrinsic pixels) to fit the export artboard, then maps the UI screenshot into the screen rect.
 */
export function CompositeScene({
  format,
  preset,
  slide,
}: {
  format: StudioFormat;
  preset: ScenePresetDef;
  slide: DeckSlide;
}) {
  const grade = GRADING_PRESETS[slide.gradingPresetId];
  const baseUrl = slide.sceneBaseUrlOverride?.trim() || preset.baseImageUrl;
  const screen = mergeScreen(preset.screen, slide.screenRectOverride);

  const { intrinsicW, intrinsicH } = preset;
  const scale = Math.min(format.w / intrinsicW, format.h / intrinsicH);

  const rw = screen.radiusRw ?? 0.04;
  const radiusPx = rw * screen.w * intrinsicW;

  return (
    <div
      className="relative overflow-hidden bg-[#0A0A0A]"
      style={{
        width: format.w,
        height: format.h,
        filter: grade.compFilter && grade.compFilter !== "none" ? grade.compFilter : undefined,
      }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: intrinsicW,
          height: intrinsicH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="relative" style={{ width: intrinsicW, height: intrinsicH }}>
          <SafeImg
            src={baseUrl}
            alt=""
            className="block select-none"
            style={{
              width: intrinsicW,
              height: intrinsicH,
              objectFit: "cover",
              filter: grade.plateFilter === "none" ? undefined : grade.plateFilter,
            }}
          />
          <div
            className="absolute overflow-hidden bg-[#0a0a0a]"
            style={{
              left: `${screen.x * 100}%`,
              top: `${screen.y * 100}%`,
              width: `${screen.w * 100}%`,
              height: `${screen.h * 100}%`,
              borderRadius: radiusPx,
              transform: preset.screenTransform,
              transformOrigin: "center center",
            }}
          >
            {slide.screenshotUrl ? (
              <SafeImg
                src={slide.screenshotUrl}
                alt=""
                className="w-full h-full object-cover object-top"
                style={
                  slide.sceneScreenInnerTransform?.trim()
                    ? { transform: slide.sceneScreenInnerTransform }
                    : undefined
                }
              />
            ) : (
              <div className="w-full h-full min-h-[40px] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-white/30 p-2 text-center bg-[#111]">
                Screenshot URL
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
