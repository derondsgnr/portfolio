"use client";

/** Wait for <img> descendants to finish loading (best-effort for raster export). */
export function waitForImages(root: HTMLElement | null): Promise<void> {
  if (!root) return Promise.resolve();
  const imgs = [...root.querySelectorAll("img")];
  return Promise.all(
    imgs.map(
      (img) =>
        (img as HTMLImageElement).complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            }),
    ),
  ).then(() => undefined);
}

export async function waitForFontsAndImages(root: HTMLElement | null): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }
  await waitForImages(root);
}
