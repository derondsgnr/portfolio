import type { CaseStudy, Slide } from "@/types/case-study";
import { isPlaceholderRemoteImage } from "./placeholder-remote-image";

/**
 * When a slug exists both in `/src/data/case-studies` and `content/case-studies.json`,
 * we treat the **repo (registry) study as canonical for narrative**: acts, slides,
 * meta.summary, headlines, outcomes, links from code deployments.
 *
 * Persisted JSON still wins for operational fields (`status`, `featured`, `pinned`) and any
 * non-placeholder asset URLs (covers, mocks, posters, flows) keyed by slide `id`, so Admin
 * imagery overlays code placeholders while copy ships from `/src/data/case-studies`.
 */

function prefersPersistedAssetUrl(preferred?: string, fallback?: string): string | undefined {
  const p = preferred?.trim();
  if (p && !isPlaceholderRemoteImage(p)) return p;
  const f = fallback?.trim();
  if (f) return f;
  return undefined;
}

function slidesById(study: CaseStudy): Map<string, Slide> {
  const m = new Map<string, Slide>();
  for (const act of study.acts) {
    for (const sl of act.slides) {
      m.set(sl.id, sl);
    }
  }
  return m;
}

function mergeSlideAssets(registrySlide: Slide, persistedSlide: Slide | undefined): Slide {
  if (!persistedSlide || registrySlide.type !== persistedSlide.type) {
    return registrySlide;
  }

  switch (registrySlide.type) {
    case "cover": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "cover" }>;
      const hero = prefersPersistedAssetUrl(p.heroImage, r.heroImage);
      return hero !== undefined ? { ...r, heroImage: hero } : r;
    }
    case "single-mockup": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "single-mockup" }>;
      const image = prefersPersistedAssetUrl(p.image, r.image) ?? r.image;
      return { ...r, image };
    }
    case "comparison": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "comparison" }>;
      const beforeImg =
        prefersPersistedAssetUrl(p.before?.image, r.before.image) ?? r.before.image;
      const afterImg =
        prefersPersistedAssetUrl(p.after?.image, r.after.image) ?? r.after.image;
      return {
        ...r,
        before: { ...r.before, image: beforeImg },
        after: { ...r.after, image: afterImg },
      };
    }
    case "insight": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "insight" }>;
      const image = prefersPersistedAssetUrl(p.image, r.image);
      return image !== undefined ? { ...r, image } : r;
    }
    case "metric": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "metric" }>;
      const image = prefersPersistedAssetUrl(p.image, r.image);
      return image !== undefined ? { ...r, image } : r;
    }
    case "embed": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "embed" }>;
      const fallbackImage =
        prefersPersistedAssetUrl(p.fallbackImage, r.fallbackImage) ?? r.fallbackImage;
      return { ...r, fallbackImage };
    }
    case "video": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "video" }>;
      const posterImage =
        prefersPersistedAssetUrl(p.posterImage, r.posterImage) ?? r.posterImage;
      return { ...r, posterImage };
    }
    case "flow": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "flow" }>;
      const screens = r.screens.map((s, i) => {
        const peer = p.screens[i];
        const image = prefersPersistedAssetUrl(peer?.image, s.image) ?? s.image;
        return { ...s, image };
      });
      return { ...r, screens };
    }
    case "mockup-gallery": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "mockup-gallery" }>;
      const mockups = r.mockups.map((m, i) => {
        const peer = p.mockups[i];
        const image = prefersPersistedAssetUrl(peer?.image, m.image) ?? m.image;
        return { ...m, image };
      });
      return { ...r, mockups };
    }
    case "process": {
      const r = registrySlide;
      const p = persistedSlide as Extract<Slide, { type: "process" }>;
      const artifacts = r.artifacts.map((a, i) => {
        const peer = p.artifacts[i];
        const image = prefersPersistedAssetUrl(peer?.image, a.image) ?? a.image;
        return { ...a, image };
      });
      return { ...r, artifacts };
    }
    default:
      return registrySlide;
  }
}

export function mergePersistedAssetsOntoRegistryStudy(
  registry: CaseStudy,
  persisted: CaseStudy
): CaseStudy {
  const perSlides = slidesById(persisted);
  const cover =
    prefersPersistedAssetUrl(persisted.meta?.cover, registry.meta.cover) ?? registry.meta.cover;

  const acts = registry.acts.map((regAct) => ({
    title: regAct.title,
    slides: regAct.slides.map((slide) =>
      mergeSlideAssets(slide, perSlides.get(slide.id))
    ),
  }));

  const liveDemoUrl =
    typeof persisted.liveDemoUrl === "string" && persisted.liveDemoUrl.trim()
      ? persisted.liveDemoUrl.trim()
      : registry.liveDemoUrl;

  return {
    ...registry,
    status: persisted.status ?? registry.status,
    featured: persisted.featured ?? registry.featured ?? false,
    pinned: persisted.pinned ?? registry.pinned ?? false,
    template: registry.template,
    liveDemoUrl,
    outcome: registry.outcome,
    meta: {
      ...registry.meta,
      cover,
    },
    acts,
  };
}
