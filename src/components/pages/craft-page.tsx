"use client";

import { SynthesisCraftPage } from "../v2/pages/synthesis-pages";
import type { PageCopy } from "@/lib/content/copy";
import type { CraftItem } from "@/lib/content/craft";
import type { Exploration } from "@/lib/content/explorations";
import type { MediaConfig } from "@/lib/content/media";

export function CraftPage({
  copy,
  craftItems = [],
  explorations = [],
  media,
}: {
  copy?: PageCopy;
  craftItems?: CraftItem[];
  explorations?: Exploration[];
  media?: MediaConfig;
}) {
  return (
    <SynthesisCraftPage
      copy={copy}
      craftItems={craftItems}
      explorations={explorations}
      media={media}
    />
  );
}
