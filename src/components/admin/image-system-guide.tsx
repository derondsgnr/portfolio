"use client";

import { useMemo, useState } from "react";
import { Check, Crop, Image as ImageIcon, Info, Maximize2 } from "lucide-react";
import {
  IMAGE_ROLE_SPECS,
  getImageRoleSpec,
  type ImageAspectSpec,
  type ImageRoleId,
  type ImageRoleSpec,
} from "@/lib/admin/image-system";

type ImageFit = "cover" | "contain";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ratioToAspect(ratio: string): string {
  return ratio === "natural" ? "4 / 3" : ratio;
}

function fitForSpec(spec: ImageRoleSpec): ImageFit {
  if (spec.defaultFit === "contain") return "contain";
  return "cover";
}

export function ImageRatioHint({
  role,
  aspectIds,
  className,
}: {
  role: ImageRoleId;
  aspectIds?: string[];
  className?: string;
}) {
  const spec = getImageRoleSpec(role);
  const aspects = aspectIds
    ? spec.aspects.filter((aspect) => aspectIds.includes(aspect.id))
    : spec.aspects;

  return (
    <div className={cx("space-y-2", className)}>
      <p className="text-[9px] uppercase tracking-[0.16em] text-white/30 font-['Instrument_Sans']">
        Proportions this field can use
      </p>
      <div className="flex flex-wrap gap-1.5">
        {aspects.map((aspect) => (
          <span
            key={aspect.id}
            title={`${aspect.label}: ${aspect.size}. ${aspect.usage}`}
            className={cx(
              "inline-flex items-center gap-1 border px-2 py-1 text-[9px] uppercase tracking-[0.11em] font-['Instrument_Sans']",
              aspect.required
                ? "border-[#E2B93B]/35 bg-[#E2B93B]/10 text-[#E2B93B]/85"
                : "border-white/[0.08] bg-white/[0.025] text-white/45"
            )}
          >
            <span>{aspect.label}</span>
            <span className="text-white/25">{aspect.ratio}</span>
            <span className="hidden text-white/20 sm:inline">{aspect.size}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RatioPreview({
  aspect,
  imageUrl,
  fit,
  compact = false,
}: {
  aspect: ImageAspectSpec;
  imageUrl?: string;
  fit: ImageFit;
  compact?: boolean;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const aspectRatio = ratioToAspect(aspect.ratio);
  const objectFit = aspect.ratio === "natural" ? "contain" : fit;
  const canPreview = Boolean(imageUrl && failedUrl !== imageUrl);

  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden border border-white/[0.08] bg-white/[0.025]"
        style={{ aspectRatio }}
      >
        {canPreview ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full"
            style={{ objectFit, objectPosition: "center" }}
            onError={() => setFailedUrl(imageUrl ?? null)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon size={compact ? 14 : 18} className="text-white/15" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-[20%] border border-[#E2B93B]/30" />
        <div className="pointer-events-none absolute left-2 top-2 bg-[#0A0A0A]/75 px-1.5 py-1 text-[8px] tracking-[0.14em] text-[#E2B93B]">
          {aspect.ratio.toUpperCase()}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/55 font-['Instrument_Sans']">
            {aspect.label}
          </p>
          {aspect.required ? (
            <span className="border border-[#E2B93B]/25 bg-[#E2B93B]/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[#E2B93B]/75">
              Required
            </span>
          ) : null}
        </div>
        {!compact ? (
          <p className="mt-1 text-[10px] leading-relaxed text-white/35 font-['Instrument_Sans']">
            {aspect.size} · {aspect.usage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ImageFieldGuide({
  role,
  imageUrl,
  compact = false,
  className,
}: {
  role: ImageRoleId;
  imageUrl?: string;
  compact?: boolean;
  className?: string;
}) {
  const spec = getImageRoleSpec(role);
  const previewAspects = compact ? spec.aspects.slice(0, 3) : spec.aspects;
  const fit = fitForSpec(spec);

  return (
    <div className={cx("border border-white/[0.07] bg-white/[0.02] p-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Crop size={13} className="text-[#E2B93B]/70" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#E2B93B]/75 font-['Instrument_Sans']">
              {spec.label}
            </p>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
            {compact ? spec.master : spec.summary}
          </p>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-white/35 font-['Instrument_Sans']">
              Safe zone: {spec.safeZone}
            </p>
          ) : null}
          {compact ? <ImageRatioHint role={role} className="mt-3" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="border border-white/[0.08] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white/35">
            {spec.behavior}
          </span>
          <span className="border border-white/[0.08] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white/35">
            {spec.defaultFit}
          </span>
        </div>
      </div>
      <div className={cx("mt-4 grid gap-3", compact ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4")}>
        {previewAspects.map((aspect) => (
          <RatioPreview key={aspect.id} aspect={aspect} imageUrl={imageUrl} fit={fit} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function RoleSpecPanel({
  spec,
  imageUrl,
}: {
  spec: ImageRoleSpec;
  imageUrl: string;
}) {
  const fit = fitForSpec(spec);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <section className="border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#E2B93B]/70 font-['Instrument_Sans']">
              {spec.shortLabel}
            </p>
            <h2 className="mt-2 font-['Anton'] text-3xl uppercase tracking-[0.04em] text-white">
              {spec.label}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="border border-white/[0.10] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/40">
              {spec.behavior}
            </span>
            <span className="border border-white/[0.10] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/40">
              Fit: {spec.defaultFit}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 font-['Instrument_Sans']">
          {spec.summary}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-white/[0.06] bg-[#0A0A0A] p-4">
            <div className="flex items-center gap-2">
              <Maximize2 size={13} className="text-[#E2B93B]/65" />
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Master Upload</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
              {spec.master}
            </p>
          </div>
          <div className="border border-white/[0.06] bg-[#0A0A0A] p-4">
            <div className="flex items-center gap-2">
              <Info size={13} className="text-[#E2B93B]/65" />
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Safe Zone</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
              {spec.safeZone}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Crop Preview</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {spec.aspects.map((aspect) => (
              <RatioPreview key={aspect.id} aspect={aspect} imageUrl={imageUrl} fit={fit} />
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Used In</p>
          <div className="mt-3 space-y-2">
            {spec.usedIn.map((item) => (
              <div key={item} className="flex gap-2 text-xs text-white/55 font-['Instrument_Sans']">
                <Check size={12} className="mt-0.5 shrink-0 text-[#E2B93B]/60" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">Designer Checklist</p>
          <div className="mt-3 space-y-2">
            {spec.designerChecklist.map((item) => (
              <div key={item} className="flex gap-2 text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#E2B93B]/60" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#E2B93B]/20 bg-[#E2B93B]/[0.035] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#E2B93B]/70">Upload Notes</p>
          <div className="mt-3 space-y-2">
            {spec.uploadNotes.map((item) => (
              <p key={item} className="text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
                {item}
              </p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export function ImageSystemGuide() {
  const [selectedRole, setSelectedRole] = useState<ImageRoleId>("project-cover");
  const [previewUrl, setPreviewUrl] = useState("");
  const selectedSpec = useMemo(() => getImageRoleSpec(selectedRole), [selectedRole]);

  return (
    <div className="space-y-8">
      <section className="border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#E2B93B]/70 font-['Instrument_Sans']">
              Image Operations
            </p>
            <h1 className="mt-2 font-['Anton'] text-4xl uppercase tracking-[0.04em] text-white">
              Image System
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 font-['Instrument_Sans']">
              Pick the role before designing or uploading. Each role tells you the proportions, safe zone, crop behavior, and where the asset appears.
            </p>
          </div>
          <div className="w-full max-w-md">
            <label className="block text-[10px] uppercase tracking-[0.16em] text-white/35">
              Preview an image URL
            </label>
            <input
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="mt-2 w-full border border-white/[0.10] bg-[#0A0A0A] px-3 py-2 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#E2B93B]/45"
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {IMAGE_ROLE_SPECS.map((spec) => (
          <button
            key={spec.id}
            type="button"
            onClick={() => setSelectedRole(spec.id)}
            className={cx(
              "border p-4 text-left transition-colors",
              selectedRole === spec.id
                ? "border-[#E2B93B]/45 bg-[#E2B93B]/[0.055]"
                : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.14]"
            )}
          >
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#E2B93B]/55">
              {spec.behavior}
            </p>
            <p className="mt-2 text-sm text-white/80 font-['Instrument_Sans']">{spec.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/35 font-['Instrument_Sans']">
              {spec.aspects.map((aspect) => aspect.ratio).join(" · ")}
            </p>
          </button>
        ))}
      </div>

      <RoleSpecPanel spec={selectedSpec} imageUrl={previewUrl} />
    </div>
  );
}
