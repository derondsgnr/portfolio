/**
 * Browser upload to Cloudinary using an unsigned upload preset.
 * Configure in the dashboard: Settings → Upload → Upload presets (unsigned).
 */

export type CloudinaryUploadResult = {
  secure_url: string;
  resource_type: "image" | "video" | "raw" | string;
  width?: number;
  height?: number;
  /** Present for some video uploads when eager thumbnail is enabled */
  thumbnail_url?: string;
};

export function isCloudinaryUploadConfigured(): boolean {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  return Boolean(cloud && String(cloud).trim() !== "" && preset && String(preset).trim() !== "");
}

export async function uploadFileToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) {
    throw new Error("Cloudinary is not configured (missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or preset).");
  }

  const name = file.name.toLowerCase();
  const isVideo = file.type.startsWith("video/");
  const isLottie = name.endsWith(".json") || name.endsWith(".lottie");
  const isPdf = name.endsWith(".pdf") || file.type === "application/pdf";
  // Lottie JSON and PDFs are delivered as raw files (so a CV downloads cleanly).
  const isRaw = isLottie || isPdf;
  const endpoint = isVideo
    ? `https://api.cloudinary.com/v1_1/${cloud}/video/upload`
    : isRaw
    ? `https://api.cloudinary.com/v1_1/${cloud}/raw/upload`
    : `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", preset);

  const res = await fetch(endpoint, { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok) {
    const msg =
      (typeof data.error === "object" && data.error?.message) ||
      (typeof data.message === "string" && data.message) ||
      `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  const secure_url = data.secure_url;
  if (typeof secure_url !== "string" || !secure_url) {
    throw new Error("Cloudinary returned no secure_url.");
  }

  return {
    secure_url,
    resource_type: typeof data.resource_type === "string" ? data.resource_type : "image",
    width: typeof data.width === "number" ? data.width : undefined,
    height: typeof data.height === "number" ? data.height : undefined,
    thumbnail_url: typeof data.thumbnail_url === "string" ? data.thumbnail_url : undefined,
  };
}
