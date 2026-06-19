import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getServices, type ServiceItem, type ServiceMediaRef } from "@/lib/content/services";
import { getMediaLibrary } from "@/lib/content/media-library";
import { isPlayableVideoUrl } from "@/lib/media-url";
import { ServicesList } from "./services-list";

export const dynamic = "force-dynamic";

function normalizeMedia(raw: unknown): ServiceMediaRef[] {
  if (!Array.isArray(raw)) return [];
  const out: ServiceMediaRef[] = [];
  for (const m of raw) {
    const item = (m && typeof m === "object" ? m : {}) as Record<string, unknown>;
    const url = typeof item.url === "string" ? item.url.trim() : "";
    if (!url) continue;
    const declared = item.type === "video" ? "video" : item.type === "image" ? "image" : undefined;
    const type: "image" | "video" = declared ?? (isPlayableVideoUrl(url) ? "video" : "image");
    const label = typeof item.label === "string" && item.label.trim() ? item.label.trim() : undefined;
    out.push({ url, type, label });
  }
  return out;
}

export default async function AdminServicesPage() {
  const [initial, library] = await Promise.all([
    getContentWithGitHubOverlay(
      "content/services.json",
      () => getServices({ includeDrafts: true, includeArchived: true }),
      (local, parsed) => {
        if (!Array.isArray(parsed)) return local;
        return parsed.map((p: unknown, i: number) => {
          const s = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
          const name = String(s.name ?? "");
          return {
            id: typeof s.id === "string" && s.id.trim() ? s.id.trim() : `service-${i + 1}`,
            name,
            gives: Array.isArray(s.gives) ? s.gives.map((g) => String(g ?? "").trim()).filter(Boolean) : [],
            scope: String(s.scope ?? ""),
            media: normalizeMedia(s.media),
            status: (s.status as ServiceItem["status"]) ?? "published",
            featured: Boolean(s.featured),
            pinned: Boolean(s.pinned),
          } satisfies ServiceItem;
        }) as ServiceItem[];
      }
    ),
    getMediaLibrary(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Services</h1>
      <p className="text-white/50 font-mono text-sm mb-2">
        Manage the homepage Services section. Edit each service&apos;s name, &quot;what you get&quot;
        bullets, and scope line.
      </p>
      <p className="text-white/35 font-mono text-xs mb-8">
        Attach media from your existing case study & craft uploads — {library.length} item
        {library.length === 1 ? "" : "s"} available. Nothing needs re-uploading.
      </p>
      <ServicesList initial={initial} library={library} />
    </div>
  );
}
