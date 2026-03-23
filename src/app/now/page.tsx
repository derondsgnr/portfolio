import { getNow } from "@/lib/content/now";
import NowClient from "./now-client";

export const dynamic = "force-dynamic";

export default async function NowPage() {
  const initial = await getNow();
  const hasPin = !!process.env.NOW_ADMIN_PIN;
  return <NowClient initial={initial} hasAdminPin={hasPin} />;
}
