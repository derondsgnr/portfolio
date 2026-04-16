"use client";

import type { CSSProperties } from "react";
import { DeviceMockup } from "@/components/v2/case-study/device-mockup";
import type { DeckSlide, StudioFormat } from "@/types/presentation-studio";
import { CompositeScene } from "./composite-scene";
import { CAMERA_PRESETS } from "./camera-presets";
import { GRADING_PRESETS } from "./grading-presets";
import { getScenePresetById } from "./scene-presets";

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

function layoutMode(format: StudioFormat): "tall" | "square" | "portrait" {
  const r = format.w / format.h;
  if (r < 0.65) return "tall";
  if (r > 0.92) return "square";
  return "portrait";
}

/** Sizes scale from artboard width so PNG export matches preview */
function px(format: StudioFormat, ratio: number): number {
  return Math.max(10, Math.round(format.w * ratio));
}

const FALLBACK_PLATE =
  "linear-gradient(145deg, #0a0a0a 0%, #0f0f0f 40%, #1a1208 100%)";

/** Full-bleed photoreal scene + typography overlay (primary path). */
function CinematicComposite({
  slide,
  format,
}: {
  slide: DeckSlide;
  format: StudioFormat;
}) {
  const preset = getScenePresetById(slide.scenePresetId);
  if (!preset) {
    return (
      <div
        className="flex items-center justify-center bg-[#111] text-white/40 font-mono text-sm p-6"
        style={{ width: format.w, height: format.h }}
      >
        Select a scene preset (hands / desk / laptop).
      </div>
    );
  }

  return (
    <div
      className="relative text-white overflow-hidden"
      style={{ width: format.w, height: format.h }}
    >
      <CompositeScene format={format} preset={preset} slide={slide} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/88 pointer-events-none z-[1]" />
      <div className="absolute z-[2] inset-0 flex flex-col justify-between p-[7%]">
        <div className="max-w-[88%]">
          <span
            className="font-['Anton'] uppercase text-[#E2B93B] leading-[0.95] tracking-[0.04em] block"
            style={{
              fontSize: px(format, 0.052),
              textShadow: "0 2px 40px rgba(0,0,0,0.85)",
            }}
          >
            {slide.headline}
          </span>
          {slide.subline ? (
            <p
              className="mt-3 font-['Instrument_Sans'] text-white/80 leading-snug max-w-xl"
              style={{
                fontSize: px(format, 0.02),
                textShadow: "0 1px 12px rgba(0,0,0,0.9)",
              }}
            >
              {slide.subline}
            </p>
          ) : null}
          {slide.cta ? (
            <span
              className="mt-4 inline-flex font-mono uppercase tracking-[0.18em] text-[#E2B93B]/95 border border-[#E2B93B]/45 px-3 py-1.5 w-fit bg-black/35"
              style={{ fontSize: px(format, 0.011) }}
            >
              {slide.cta}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** CSS device frame path (legacy / quick tests). */
function CinematicPlateCss({
  slide,
  format,
}: {
  slide: DeckSlide;
  format: StudioFormat;
}) {
  const mode = layoutMode(format);
  const cam = CAMERA_PRESETS[slide.cameraPresetId];
  const grade = GRADING_PRESETS[slide.gradingPresetId];

  const plate = slide.environmentPlateUrl ? (
    <div
      className="absolute inset-0"
      style={{ filter: grade.plateFilter === "none" ? undefined : grade.plateFilter }}
    >
      <SafeImg src={slide.environmentPlateUrl} alt="" className="w-full h-full object-cover" />
    </div>
  ) : (
    <div className="absolute inset-0 bg-[#0A0A0A]" style={{ background: FALLBACK_PLATE }} />
  );

  const textBlock = (
    <div
      className={`flex flex-col z-10 ${mode === "tall" ? "p-[8%] pb-0 w-full" : "p-[7%] max-w-[55%]"}`}
    >
      <span
        className="font-['Anton'] uppercase text-[#E2B93B] leading-[0.95] tracking-[0.04em]"
        style={{
          fontSize: px(format, 0.055),
          textShadow: "0 2px 40px rgba(0,0,0,0.8)",
        }}
      >
        {slide.headline}
      </span>
      {slide.subline ? (
        <p
          className="mt-3 font-['Instrument_Sans'] text-white/75 leading-snug max-w-xl"
          style={{
            fontSize: px(format, 0.022),
            textShadow: "0 1px 8px rgba(0,0,0,0.9)",
          }}
        >
          {slide.subline}
        </p>
      ) : null}
      {slide.cta ? (
        <span
          className="mt-4 inline-flex font-mono uppercase tracking-[0.18em] text-[#E2B93B]/90 border border-[#E2B93B]/40 px-3 py-1.5 w-fit bg-black/20"
          style={{ fontSize: px(format, 0.012) }}
        >
          {slide.cta}
        </span>
      ) : null}
    </div>
  );

  const mockup = (
    <div
      className={`z-10 flex items-end justify-center ${mode === "tall" ? "w-full flex-1 pb-[4%]" : "items-center justify-end pr-[4%] flex-1"}`}
      style={cam.style}
    >
      <div className="w-[min(42%,520px)] max-h-[78%]">
        <DeviceMockup device={slide.device === "none" ? "phone" : slide.device}>
          {slide.screenshotUrl ? (
            <SafeImg src={slide.screenshotUrl} alt="" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full min-h-[200px] bg-[#111] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-white/25 p-4 text-center">
              Screenshot URL
            </div>
          )}
        </DeviceMockup>
      </div>
    </div>
  );

  return (
    <div
      className="relative flex flex-col text-white overflow-hidden"
      style={{
        width: format.w,
        height: format.h,
        filter: grade.compFilter && grade.compFilter !== "none" ? grade.compFilter : undefined,
      }}
    >
      {plate}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />
      {slide.handOverlayUrl ? (
        <div className="absolute inset-0 z-[5] pointer-events-none flex items-end justify-center pb-[2%]">
          <SafeImg
            src={slide.handOverlayUrl}
            alt=""
            className="max-h-[88%] w-auto object-contain object-bottom opacity-[0.98]"
            style={{ filter: grade.compFilter && grade.compFilter !== "none" ? grade.compFilter : undefined }}
          />
        </div>
      ) : null}
      <div
        className={`relative flex flex-1 min-h-0 ${mode === "tall" ? "flex-col" : "flex-row items-center"}`}
      >
        {mode === "tall" ? (
          <>
            {textBlock}
            {mockup}
          </>
        ) : (
          <>
            {textBlock}
            {mockup}
          </>
        )}
      </div>
    </div>
  );
}

function CinematicPlate({ slide, format }: { slide: DeckSlide; format: StudioFormat }) {
  if (slide.mockupSource === "composite-scene") {
    return <CinematicComposite slide={slide} format={format} />;
  }
  return <CinematicPlateCss slide={slide} format={format} />;
}

function SpotlightComposite({ slide, format }: { slide: DeckSlide; format: StudioFormat }) {
  const preset = getScenePresetById(slide.scenePresetId);
  if (!preset) {
    return (
      <div
        className="flex items-center justify-center bg-[#111] text-white/40 font-mono text-sm p-6"
        style={{ width: format.w, height: format.h }}
      >
        Select a scene preset.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden text-white" style={{ width: format.w, height: format.h }}>
      <CompositeScene format={format} preset={preset} slide={slide} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-[1]" />
      <div className="absolute z-[2] left-0 right-0 top-[8%] px-[8%] text-center">
        <h1
          className="font-['Anton'] uppercase text-[#F0F0F0] tracking-[0.06em] leading-tight"
          style={{ fontSize: px(format, 0.04) }}
        >
          {slide.headline}
        </h1>
        {slide.subline ? (
          <p
            className="mt-3 font-['Instrument_Sans'] text-white/65 max-w-2xl mx-auto"
            style={{ fontSize: px(format, 0.017) }}
          >
            {slide.subline}
          </p>
        ) : null}
      </div>
      {slide.cta ? (
        <div
          className="absolute z-[2] bottom-[6%] left-0 right-0 text-center font-mono uppercase tracking-[0.2em] text-[#E2B93B]"
          style={{ fontSize: px(format, 0.012) }}
        >
          {slide.cta}
        </div>
      ) : null}
    </div>
  );
}

function SpotlightDeviceCss({ slide, format }: { slide: DeckSlide; format: StudioFormat }) {
  const mode = layoutMode(format);
  const cam = CAMERA_PRESETS[slide.cameraPresetId];
  const grade = GRADING_PRESETS[slide.gradingPresetId];

  return (
    <div
      className="relative flex flex-col items-center justify-between text-white overflow-hidden"
      style={{
        width: format.w,
        height: format.h,
        background: "#0A0A0A",
        backgroundImage: slide.environmentPlateUrl
          ? undefined
          : "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(226,185,59,0.18) 0%, transparent 55%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0,0,0,0.9) 0%, #0A0A0A 45%)",
        filter: grade.compFilter && grade.compFilter !== "none" ? grade.compFilter : undefined,
      }}
    >
      {slide.environmentPlateUrl ? (
        <div
          className="absolute inset-0 opacity-40"
          style={{ filter: grade.plateFilter === "none" ? undefined : grade.plateFilter }}
        >
          <SafeImg src={slide.environmentPlateUrl} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

      <div
        className={`relative z-10 flex flex-col items-center ${mode === "tall" ? "pt-[10%] px-[8%]" : "pt-[7%] px-[10%]"} text-center`}
      >
        <h1
          className="font-['Anton'] uppercase text-[#F0F0F0] tracking-[0.06em] leading-tight"
          style={{ fontSize: px(format, 0.042) }}
        >
          {slide.headline}
        </h1>
        {slide.subline ? (
          <p
            className="mt-3 font-['Instrument_Sans'] text-white/55 max-w-lg"
            style={{ fontSize: px(format, 0.018) }}
          >
            {slide.subline}
          </p>
        ) : null}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-[6%]" style={cam.style}>
        <div className="w-[min(72%,640px)]">
          <DeviceMockup device={slide.device === "none" ? "phone" : slide.device}>
            {slide.screenshotUrl ? (
              <SafeImg src={slide.screenshotUrl} alt="" className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full min-h-[220px] bg-[#111] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-white/25">
                Screenshot
              </div>
            )}
          </DeviceMockup>
        </div>
      </div>

      {slide.cta ? (
        <div
          className="relative z-10 pb-[6%] font-mono uppercase tracking-[0.2em] text-[#E2B93B]"
          style={{ fontSize: px(format, 0.013) }}
        >
          {slide.cta}
        </div>
      ) : (
        <div className="pb-[4%]" />
      )}
    </div>
  );
}

function SpotlightDevice({ slide, format }: { slide: DeckSlide; format: StudioFormat }) {
  if (slide.mockupSource === "composite-scene") {
    return <SpotlightComposite slide={slide} format={format} />;
  }
  return <SpotlightDeviceCss slide={slide} format={format} />;
}

function TypographyPoster({
  slide,
  format,
}: {
  slide: DeckSlide;
  format: StudioFormat;
}) {
  const mode = layoutMode(format);
  const grade = GRADING_PRESETS[slide.gradingPresetId];

  return (
    <div
      className="relative flex flex-col justify-between text-white overflow-hidden"
      style={{
        width: format.w,
        height: format.h,
        background: "#0A0A0A",
        filter: grade.compFilter && grade.compFilter !== "none" ? grade.compFilter : undefined,
      }}
    >
      {slide.environmentPlateUrl ? (
        <div className="absolute inset-0 opacity-25">
          <SafeImg src={slide.environmentPlateUrl} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-transparent to-[#111]" />

      <div
        className={`relative z-10 flex flex-1 flex-col ${mode === "tall" ? "p-[10%] justify-center" : "p-[8%] justify-center"}`}
      >
        <p
          className="font-mono uppercase tracking-[0.2em] text-[#E2B93B]/70 mb-4"
          style={{ fontSize: px(format, 0.011) }}
        >
          {slide.cta}
        </p>
        <h2
          className="font-['Anton'] uppercase text-[#F0F0F0] leading-[0.92] tracking-[0.02em]"
          style={{ fontSize: px(format, 0.078) }}
        >
          {slide.headline}
        </h2>
        {slide.subline ? (
          <p
            className="mt-6 font-['Instrument_Sans'] text-white/50 leading-relaxed max-w-2xl"
            style={{ fontSize: px(format, 0.024) }}
          >
            {slide.subline}
          </p>
        ) : null}
      </div>

      {slide.screenshotUrl ? (
        <div className="relative z-10 px-[8%] pb-[8%] max-h-[38%]">
          <div className="border border-white/[0.08] bg-black/30 overflow-hidden rounded-lg">
            <SafeImg src={slide.screenshotUrl} alt="" className="w-full h-full object-cover object-top max-h-[320px]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PresentationSlide({
  slide,
  format,
}: {
  slide: DeckSlide;
  format: StudioFormat;
}) {
  switch (slide.templateId) {
    case "cinematic-plate":
      return <CinematicPlate slide={slide} format={format} />;
    case "spotlight-device":
      return <SpotlightDevice slide={slide} format={format} />;
    case "typography-poster":
      return <TypographyPoster slide={slide} format={format} />;
    default:
      return <CinematicPlate slide={slide} format={format} />;
  }
}
