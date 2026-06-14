import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content/projects";
import { getPageCopy } from "@/lib/content/copy";
import { getLandingContent } from "@/lib/content/landing";
import { getPageConfig } from "@/lib/content/pages";
import { isPathHidden } from "@/lib/content/nav";
import { WorkPage } from "@/components/pages/work-page";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
};

export default async function Page() {
  if (await isPathHidden("/work")) notFound();
  const [projects, copy, landing, pageConfig] = await Promise.all([
    getProjects(),
    getPageCopy("work"),
    getLandingContent(),
    getPageConfig("work"),
  ]);
  return (
    <>
      <h1 className="sr-only">Work — Selected Projects</h1>
      <WorkPage
        projects={projects}
        copy={copy}
        pageConfig={pageConfig}
        landing={landing}
      />
    </>
  );
}
