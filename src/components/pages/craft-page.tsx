"use client";

import { SynthesisCraftPage } from "../v2/pages/synthesis-pages";
import type { PageCopy } from "@/lib/content/copy";
import type { CraftDocument, CraftItem } from "@/lib/content/craft-model";
import type { MediaConfig } from "@/lib/content/media";

export function CraftPage({
  copy,
  craftDocument,
  craftListItems = [],
  media,
}: {
  copy?: PageCopy;
  craftDocument: CraftDocument;
  craftListItems?: CraftItem[];
  media?: MediaConfig;
}) {
  return (
    <SynthesisCraftPage
      copy={copy}
      craftDocument={craftDocument}
      craftListItems={craftListItems}
      media={media}
    />
  );
}
