"use client";

import dynamic from "next/dynamic";
import { SynthesisAboutPage } from "../v2/pages/synthesis-pages";

const PageBuilder = dynamic(() => import("../v2/page-builder").then((m) => ({ default: m.PageBuilder })), {
  ssr: true,
});
import type { Project } from "@/lib/content/projects";
import type { PageCopy } from "@/lib/content/copy";
import type { LandingContent } from "@/lib/content/landing";
import type { PageConfig } from "@/lib/content/pages";

export function AboutPage({
  copy,
  pageConfig,
  landing,
  projects,
}: {
  copy?: PageCopy;
  pageConfig: PageConfig;
  landing: LandingContent;
  projects?: Project[];
}) {
  if (pageConfig.sections.length > 0) {
    return (
      <PageBuilder
        pageConfig={pageConfig}
        projects={projects ?? []}
        landing={landing}
        pageCopy={copy}
      />
    );
  }
  return <SynthesisAboutPage copy={copy} />;
}
