import { getNow } from "@/lib/content/now";
import NowClient from "./now-client";

export const dynamic = "force-dynamic";

export default async function NowPage() {
  const initial = await getNow();
  return <NowClient initial={initial} />;
}
