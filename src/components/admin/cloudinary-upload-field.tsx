"use client";

import { useId, useRef, useState } from "react";
import { isCloudinaryUploadConfigured, uploadFileToCloudinary, type CloudinaryUploadResult } from "@/lib/admin/cloudinary-upload";

type Props = {
  onUploaded: (result: CloudinaryUploadResult) => void;
  busyNote?: string;
};

/** Local file → Cloudinary → callback with secure_url (+ dimensions for images). Requires NEXT_PUBLIC Cloudinary env. */
export function CloudinaryUploadField({ onUploaded, busyNote = "Uploading…" }: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !isCloudinaryUploadConfigured()) return;
    setBusy(true);
    setError(null);
    try {
      const result = await uploadFileToCloudinary(file);
      onUploaded(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  if (!isCloudinaryUploadConfigured()) {
    return (
      <p className="font-mono text-[10px] text-white/45 leading-relaxed mt-2">
        To upload files from here, add{" "}
        <code className="text-[#E2B93B]/80">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
        <code className="text-[#E2B93B]/80">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> (unsigned preset) to your env.
        Until then, paste a hosted image or video URL in the fields below.
      </p>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept="image/*,video/*"
        className="sr-only"
        onChange={handleFile}
        disabled={busy}
        aria-label="Upload image or video file"
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="px-4 py-1.5 border border-[#E2B93B]/35 font-mono text-[10px] uppercase tracking-[0.12em] text-[#E2B93B] hover:bg-[#E2B93B]/10 transition-colors disabled:opacity-40"
      >
        {busy ? busyNote : "Upload file"}
      </button>
      {error ? <span className="font-mono text-[10px] text-red-400">{error}</span> : null}
    </div>
  );
}
