import type { Metadata } from "next";
import { getNow } from "@/lib/content/now";
import NowClient from "./now-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/now" },
};

export default async function NowPage() {
  const initial = await getNow();
  const hasPin = !!process.env.NOW_ADMIN_PIN;
  return (
    <>
      <h1 className="sr-only">Now — What I&apos;m Working On</h1>
      <NowClient initial={initial} hasAdminPin={hasPin} />
    </>
  );
}
