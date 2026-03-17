import { getPageCopy } from "@/lib/content/copy";
import { getCraftItems } from "@/lib/content/craft";
import { getExplorations } from "@/lib/content/explorations";
import { getMedia } from "@/lib/content/media";
import { CraftPage } from "@/components/pages/craft-page";

export default async function Page() {
  const [copy, craftItems, explorations, media] = await Promise.all([
    getPageCopy("craft"),
    getCraftItems(),
    getExplorations(),
    getMedia(),
  ]);
  return (
    <CraftPage
      copy={copy}
      craftItems={craftItems}
      explorations={explorations}
      media={media}
    />
  );
}
