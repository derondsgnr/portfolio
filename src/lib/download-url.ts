/**
 * Normalize "share" links into direct-download links so a pasted Google Drive
 * or Dropbox URL actually downloads the file instead of opening a viewer.
 * No-op for already-direct links (Cloudinary, a plain .pdf, etc.).
 */
export function toDownloadableUrl(url?: string | null): string {
  const u = url?.trim();
  if (!u) return "";

  // Google Drive: .../file/d/<ID>/view, open?id=<ID>, uc?id=<ID> → direct download
  const drive = u.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/
  );
  if (drive) return `https://drive.google.com/uc?export=download&id=${drive[1]}`;

  // Dropbox: force the download param
  if (u.includes("dropbox.com")) {
    if (/[?&]dl=0\b/.test(u)) return u.replace(/([?&])dl=0\b/, "$1dl=1");
    if (!/[?&]dl=1\b/.test(u)) return `${u}${u.includes("?") ? "&" : "?"}dl=1`;
  }

  return u;
}
