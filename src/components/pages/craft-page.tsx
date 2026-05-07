"use client";

import { SynthesisCraftPage } from "../v2/pages/synthesis-pages";
import type { PageCopy } from "@/lib/content/copy";
import type { CraftDocument, CraftItem } from "@/lib/content/craft-model";
import type { Exploration } from "@/lib/content/explorations";
import type { MediaConfig } from "@/lib/content/media";

export function CraftPage({
  copy,
  craftDocument,
  craftListItems = [],
  explorations = [],
  media,
}: {
  copy?: PageCopy;
  craftDocument: CraftDocument;
  craftListItems?: CraftItem[];
  explorations?: Exploration[];
  media?: MediaConfig;
}) {
  return (
    <SynthesisCraftPage
      copy={copy}
      craftDocument={craftDocument}
      craftListItems={craftListItems}
      explorations={explorations}
      media={media}
    />
  );
}
