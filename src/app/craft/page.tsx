import type { Metadata } from "next";
import { getPageCopy } from "@/lib/content/copy";
import { flattenedSortedCraftItems, getCraftDocument } from "@/lib/content/craft";
import { getExplorations } from "@/lib/content/explorations";
import { getMedia } from "@/lib/content/media";
import { CraftPage } from "@/components/pages/craft-page";

export const metadata: Metadata = {
  alternates: { canonical: "/craft" },
};

export default async function Page() {
  const [copy, craftDocument, explorations, media] = await Promise.all([
    getPageCopy("craft"),
    getCraftDocument(),
    getExplorations(),
    getMedia(),
  ]);
  const craftListItems = flattenedSortedCraftItems(craftDocument);
  return (
    <>
      <h1 className="sr-only">Craft — Visual Explorations</h1>
      <CraftPage
        copy={copy}
        craftDocument={craftDocument}
        craftListItems={craftListItems}
        explorations={explorations}
        media={media}
      />
    </>
  );
}
