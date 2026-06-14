import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/projects";
import { getPageCopy } from "@/lib/content/copy";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { getGlobal } from "@/lib/content/global";
import { isPathHidden } from "@/lib/content/nav";
import { AboutPage } from "@/components/pages/about-page";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
};

export default async function Page() {
  if (await isPathHidden("/about")) notFound();
  const [projects, copy, landing, pageConfig, global] = await Promise.all([
    getProjects(),
    getPageCopy("about"),
    getLandingContent(),
    getPageConfig("about"),
    getGlobal(),
  ]);
  return (
    <>
      <h1 className="sr-only">About — Deron, Product Designer & Builder</h1>
      <AboutPage
        copy={copy}
        pageConfig={pageConfig}
        landing={landing}
        projects={projects}
        profileImage={global.profileImage}
      />
    </>
  );
}
